package org.camphub.be_camphub.service.impl;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import org.camphub.be_camphub.Utils.MediaUtils;
import org.camphub.be_camphub.dto.request.booking.BookingCreationRequest;
import org.camphub.be_camphub.dto.request.booking.BookingItemRequest;
import org.camphub.be_camphub.dto.request.booking.LesseeReturnRequest;
import org.camphub.be_camphub.dto.request.booking.OwnerConfirmationRequest;
import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.booking.BookingResponse;
import org.camphub.be_camphub.entity.*;
import org.camphub.be_camphub.enums.*;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.BookingMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.BookingService;
import org.camphub.be_camphub.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class BookingServiceImpl implements BookingService {
    BookingRepository bookingRepository;
    AccountRepository accountRepository;
    ItemRepository itemRepository;
    CartItemRepository cartItemRepository;
    CartRepository cartRepository;
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;
    ItemLogsRepository itemLogRepository;
    ReviewRepository reviewRepository;

    BookingMapper bookingMapper;
    MediaUtils mediaUtils;
    NotificationService notificationService;

    @Override
    @Transactional
    public List<BookingResponse> rentSelectedCartItems(UUID lesseeId, BookingCreationRequest request) {
        if (request == null || request.getItems() == null || request.getItems().isEmpty()) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }

        // collect all selected cart item ids
        List<UUID> cartItemIds = request.getItems().stream()
                .map(BookingItemRequest::getCartItemId)
                .filter(Objects::nonNull)
                .toList();

        // load all cart items
        List<CartItem> cartItems = cartItemRepository.findAllByIdIn(cartItemIds);
        if (cartItems.size() != cartItemIds.size()) {
            throw new AppException(ErrorCode.CART_ITEM_NOT_FOUND);
        }

        // verify ownership
        for (CartItem ci : cartItems) {
            Cart cart = cartRepository
                    .findById(ci.getCartId())
                    .orElseThrow(() -> new AppException(ErrorCode.CART_NOT_FOUND));
            if (!cart.getAccountId().equals(lesseeId)) {
                throw new AppException(ErrorCode.CART_ITEM_NOT_BELONG_TO_USER);
            }
        }

        // map cart items
        Map<UUID, CartItem> cartMap = cartItems.stream().collect(Collectors.toMap(CartItem::getId, c -> c));

        // load all items
        List<UUID> itemIds = cartItems.stream().map(CartItem::getItemId).toList();
        List<Item> items = itemRepository.findAllById(itemIds);
        Map<UUID, Item> itemMap = items.stream().collect((Collectors.toMap(Item::getId, i -> i)));

        // Validate item statuses and calculate total amount
        BigDecimal totalAmount = BigDecimal.ZERO;
        BigDecimal totalDeposit = BigDecimal.ZERO;

        for (BookingItemRequest biReq : request.getItems()) {
            CartItem cartItem = cartMap.get(biReq.getCartItemId());
            Item item = itemMap.get(cartItem.getItemId());
            if (item == null) {
                throw new AppException(ErrorCode.ITEM_NOT_FOUND);
            }

            if (item.getStatus() == ItemStatus.RENTED
                    || item.getStatus() == ItemStatus.BANNED
                    || item.getStatus() == ItemStatus.DELETED) {
                throw new AppException(ErrorCode.ITEM_NOT_AVAILABLE);
            }

            // compute rental days
            long days = ChronoUnit.DAYS.between(biReq.getStartDate(), biReq.getEndDate());
            if (days <= 0) throw new AppException(ErrorCode.INVALID_RENTAL_DATES);

            int quantity = Optional.ofNullable(biReq.getQuantity()).orElse(cartItem.getQuantity());
            double pricePerDay = Optional.ofNullable(biReq.getPricePerDay())
                    .orElse(cartItem.getPrice().doubleValue());
            double depositAmount = Optional.ofNullable(biReq.getDepositAmount()).orElse(0.0);

            BigDecimal subtotal = BigDecimal.valueOf(pricePerDay)
                    .multiply(BigDecimal.valueOf(quantity))
                    .multiply(BigDecimal.valueOf(days));

            // Deposit amount cần nhân với quantity (mỗi sản phẩm cần cọc)
            BigDecimal depositTotal = BigDecimal.valueOf(depositAmount).multiply(BigDecimal.valueOf(quantity));

            totalAmount = totalAmount.add(subtotal);
            totalDeposit = totalDeposit.add(depositTotal);
        }

        // calculate required amount to pay
        BigDecimal required = totalAmount.add(totalDeposit);

        // check lessee's coin balance
        Account lessee =
                accountRepository.findById(lesseeId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        log.info("Lessee {} balance: {}, required: {}", lesseeId, lessee.getCoinBalance(), required);
        if (BigDecimal.valueOf(lessee.getCoinBalance()).compareTo(required) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        // transfer coins from lessee to system wallet
        Account systemWallet = getSystemWallet();
        lessee.setCoinBalance(lessee.getCoinBalance() - required.doubleValue());
        systemWallet.setCoinBalance(systemWallet.getCoinBalance() + required.doubleValue());
        accountRepository.saveAll(Arrays.asList(lessee, systemWallet));

        // record transaction
        Transaction tx = Transaction.builder()
                .fromAccountId(lessee.getId())
                .toAccountId(systemWallet.getId())
                .amount(required.doubleValue())
                .type(TransactionType.RENTAL_PAYMENT)
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);

        // create bookings one by one for each cart item
        List<BookingResponse> responses = new ArrayList<>();
        for (BookingItemRequest biReq : request.getItems()) {
            CartItem cartItem = cartMap.get(biReq.getCartItemId());
            Item item = itemMap.get(cartItem.getItemId());

            Booking booking = Booking.builder()
                    .lesseeId(lesseeId)
                    .lessorId(item.getOwnerId())
                    .itemId(item.getId())
                    .quantity(biReq.getQuantity())
                    .startDate(biReq.getStartDate())
                    .endDate(biReq.getEndDate())
                    .pricePerDay(biReq.getPricePerDay())
                    .depositAmount(biReq.getDepositAmount())
                    .note(biReq.getNote())
                    .status(BookingStatus.PENDING_CONFIRM)
                    .createdAt(LocalDateTime.now())
                    .build();

            // Subtract the quantity if the product is still available

            // update status for item
            if (item.getQuantity() - booking.getQuantity() > 0) {
                item.setQuantity(item.getQuantity() - booking.getQuantity());
            } else {
                item.setStatus(ItemStatus.RENTED_PENDING_CONFIRM);
            }
            itemRepository.save(item);

            // item log
            ItemLog log = ItemLog.builder()
                    .itemId(item.getId())
                    .accountId(lesseeId)
                    .action(ItemActionType.RENT)
                    .note("Booking created from cart item: " + cartItem.getId())
                    .build();
            itemLogRepository.save(log);

            bookingRepository.save(booking);
            BookingResponse bookingResponse = enrichBookingResponse(booking);
            responses.add(bookingResponse);

            // thông báo cho chủ đồ (lessor) có đơn thuê mới
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(item.getOwnerId())
                    .senderId(lesseeId)
                    .type(NotificationType.BOOKING_CREATED)
                    .title("Bạn có đơn thuê mới")
                    .content("Khách thuê vừa đặt \"" + item.getName() + "\".")
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());
        }

        // link transaction to all bookings
        List<TransactionBooking> txBookings = responses.stream()
                .map(resp -> TransactionBooking.builder()
                        .transactionId(tx.getId())
                        .bookingId(resp.getId())
                        .createdAt(LocalDateTime.now())
                        .build())
                .toList();

        transactionBookingRepository.saveAll(txBookings);

        // remove selected cart items
        cartItemRepository.deleteAllById(cartItemIds);

        return responses;
    }

    /**
     * Owner accept/reject:
     * - if reject: refund full required amount for that booking (rental+deposit)
     * from system -> lessee,
     * set booking.status = PAID_REJECTED, item.status = BANNED, decrease lessor
     * trustScore
     * - if accept: booking.status = WAITING_DELIVERY, record delivery log; update
     * item.status = RENTED
     */
    @Override
    @Transactional
    public BookingResponse ownerRespondBooking(UUID lessorId, OwnerConfirmationRequest request) {
        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLessorId().equals(lessorId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Item item = itemRepository
                .findById(booking.getItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        // reject booking
        if (!request.getIsAccepted()) {
            // refund rental + deposit for this booking
            BigDecimal days =
                    BigDecimal.valueOf(ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1);
            BigDecimal rental_prices = BigDecimal.valueOf(booking.getPricePerDay())
                    .multiply(BigDecimal.valueOf(booking.getQuantity()))
                    .multiply(days);
            // Deposit amount cần nhân với quantity (mỗi sản phẩm cần cọc)
            BigDecimal deposit =
                    BigDecimal.valueOf(booking.getDepositAmount()).multiply(BigDecimal.valueOf(booking.getQuantity()));
            BigDecimal refundTotal = rental_prices.add(deposit);

            Account systemWallet = getSystemWallet();
            Account lessee = accountRepository
                    .findById(booking.getLesseeId())
                    .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));

            // transfer back
            systemWallet.setCoinBalance(systemWallet.getCoinBalance() - refundTotal.doubleValue());
            lessee.setCoinBalance(lessee.getCoinBalance() + refundTotal.doubleValue());
            accountRepository.saveAll(Arrays.asList(systemWallet, lessee));

            // transaction
            Transaction tx = Transaction.builder()
                    .fromAccountId(systemWallet.getId())
                    .toAccountId(lessee.getId())
                    .amount(refundTotal.doubleValue())
                    .type(TransactionType.REFUND_FULL)
                    .status(TransactionStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();
            transactionRepository.save(tx);

            transactionBookingRepository.save(TransactionBooking.builder()
                    .transactionId(tx.getId())
                    .bookingId(booking.getId())
                    .createdAt(LocalDateTime.now())
                    .build());

            // update booking and item
            booking.setStatus(BookingStatus.PAID_REJECTED);
            bookingRepository.save(booking);

            item.setStatus(ItemStatus.BANNED);
            itemRepository.save(item);

            // decrease lessor trust score
            Account lessor =
                    accountRepository.findById(lessorId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            lessor.setTrustScore(Math.max(0, lessor.getTrustScore() - 10)); // decrease 10 points
            accountRepository.save(lessor);

            // log
            itemLogRepository.save(ItemLog.builder()
                    .itemId(item.getId())
                    .accountId(lessorId)
                    .action(ItemActionType.REJECT_RENTAL)
                    .note("Owner rejected booking: " + request.getBookingId())
                    .createdAt(LocalDateTime.now())
                    .build());

            // thông báo cho khách thuê khi đơn bị từ chối
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(booking.getLesseeId())
                    .senderId(lessorId)
                    .type(NotificationType.BOOKING_CANCELLED)
                    .title("Đơn thuê đã bị từ chối")
                    .content("Chủ đồ đã từ chối đơn thuê cho sản phẩm \"" + item.getName() + "\".")
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());

            return enrichBookingResponse(booking);
        } else {
            // accept booking
            booking.setStatus(BookingStatus.WAITING_DELIVERY);
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepository.save(booking);

            // update item status to RENTED
            item.setStatus(ItemStatus.RENTED);
            itemRepository.save(item);

            // log deliver info (deliveryNote may be null)
            itemLogRepository.save(ItemLog.builder()
                    .itemId(item.getId())
                    .accountId(lessorId)
                    .action(ItemActionType.APPROVE_RENTAL)
                    .previousStatus(ItemStatus.AVAILABLE)
                    .currentStatus(ItemStatus.RENTED)
                    .note(Optional.ofNullable(request.getDeliveryNote())
                            .orElse("Owner accepted booking and will deliver"))
                    .evidenceUrls(mediaUtils.fromRequest(request.getPackagingMediaUrls()))
                    .createdAt(LocalDateTime.now())
                    .build());

            // thông báo cho khách thuê khi đơn được chấp nhận
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(booking.getLesseeId())
                    .senderId(lessorId)
                    .type(NotificationType.BOOKING_APPROVED)
                    .title("Đơn thuê đã được chấp nhận")
                    .content("Chủ đồ đã chấp nhận đơn thuê cho sản phẩm \"" + item.getName() + "\".")
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());
        }

        return enrichBookingResponse(booking);
    }

    // Lessee confirm received -> set IN_USE, add rent log.
    @Override
    public BookingResponse lesseeConfirmReceived(UUID lesseeId, UUID bookingId) {
        Booking booking =
                bookingRepository.findById(bookingId).orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLesseeId().equals(lesseeId)) throw new AppException(ErrorCode.UNAUTHORIZED);

        // set status IN_USE
        booking.setStatus(BookingStatus.IN_USE);
        booking.setUpdatedAt(LocalDateTime.now());
        bookingRepository.save(booking);

        // log rent action
        itemLogRepository.save(ItemLog.builder()
                .itemId(booking.getItemId())
                .accountId(lesseeId)
                .action(ItemActionType.RENT)
                .note("Lessee confirmed received booking: " + bookingId)
                .createdAt(LocalDateTime.now())
                .build());

        return enrichBookingResponse(booking);
    }

    @Override
    public List<BookingResponse> getBookingsByLessee(UUID lesseeId) {
        return bookingRepository.findAllByLesseeIdOrderByCreatedAtDesc(lesseeId).stream()
                .map(this::enrichBookingResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getBookingsByLessor(UUID lessorId) {
        return bookingRepository.findAllByLessorIdOrderByCreatedAtDesc(lessorId).stream()
                .map(this::enrichBookingResponse)
                .toList();
    }

    @Override
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::enrichBookingResponse)
                .toList();
    }

    // lessee return item --> set RETURNED_PENDING_CHECK, add return log, update
    // item status
    @Override
    @Transactional
    public BookingResponse lesseeReturnItem(UUID lesseeId, LesseeReturnRequest request) {
        log.info("Lessee {} is returning booking {}", lesseeId, request.getBookingId());

        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLesseeId().equals(lesseeId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (booking.getStatus() != BookingStatus.DUE_FOR_RETURN) {
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
        }

        // update booking status to RETURNED_PENDING_CHECK
        booking.setStatus(BookingStatus.RETURNED_PENDING_CHECK);

        List<MediaResource> evidenceUrls = mediaUtils.fromRequest(request.getMediaUrls());
        // save ItemLog
        ItemLog itemLog = ItemLog.builder()
                .itemId(booking.getItemId())
                .accountId(lesseeId)
                .action(ItemActionType.RETURN)
                .previousStatus(ItemStatus.RENTED)
                .currentStatus(ItemStatus.RETURN_PENDING_CHECK)
                .note(request.getNote())
                .evidenceUrls(evidenceUrls)
                .createdAt(LocalDateTime.now())
                .build();

        log.info("ItemLog for return: {}", itemLog);

        Item item = itemRepository
                .findById(booking.getItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        item.setStatus(ItemStatus.RETURN_PENDING_CHECK);

        bookingRepository.save(booking);
        itemLogRepository.save(itemLog);
        itemRepository.save(item);

        // gửi thông báo cho chủ thuê về việc người thuê đã trả đồ
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(booking.getLessorId())
                .senderId(lesseeId)
                .type(NotificationType.BOOKING_RETURNED)
                .title("Khách thuê đã trả đồ")
                .content("Khách đã trả \"" + item.getName() + "\" và chờ chủ đồ kiểm tra.")
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        return enrichBookingResponse(booking);
    }

    @Override
    public BookingResponse lessorConfirmReturn(UUID lessorId, UUID bookingId) {
        Booking booking =
                bookingRepository.findById(bookingId).orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLessorId().equals(lessorId)) throw new AppException(ErrorCode.BOOKING_NOT_BELONG_TO_USER);

        if (booking.getStatus() != BookingStatus.RETURNED_PENDING_CHECK)
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);

        // set booking status to WAITING_REFUND
        booking.setStatus(BookingStatus.WAITING_REFUND);
        bookingRepository.save(booking);

        // record item log
        itemLogRepository.save(ItemLog.builder()
                .itemId(booking.getItemId())
                .accountId(lessorId)
                .action(ItemActionType.CHECK_RETURN)
                .previousStatus(ItemStatus.RETURN_PENDING_CHECK)
                .currentStatus(ItemStatus.AVAILABLE)
                .note("Lessor confirmed return for booking: " + bookingId)
                .build());

        // update Item status = AVAILABLE
        Item item = itemRepository
                .findById(booking.getItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

        item.setStatus(ItemStatus.AVAILABLE);
        itemRepository.save(item);

        return enrichBookingResponse(booking);
    }

    @Override
    @Transactional
    public void processRefundAndReturn(UUID bookingId) {
        Booking booking =
                bookingRepository.findById(bookingId).orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (booking.getStatus() != BookingStatus.WAITING_REFUND) {
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
        }

        // tính số ngày trễ
        LocalDateTime now = LocalDateTime.now();
        LocalDate endDate = booking.getEndDate();
        long daysLate = ChronoUnit.DAYS.between(endDate.atStartOfDay(), now);

        Account system = accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));
        Account lessor = accountRepository
                .findById(booking.getLessorId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Account lessee = accountRepository
                .findById(booking.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;
        double rentalFee = booking.getPricePerDay() * booking.getQuantity() * days;
        // Deposit amount cần nhân với quantity (mỗi sản phẩm cần cọc)
        double deposit = booking.getDepositAmount() * booking.getQuantity();
        double refundDeposit = deposit;

        // Xử lý trễ hạn
        if (daysLate > 0 && daysLate < 4) {
            double penaltyRate =
                    switch ((int) daysLate) {
                        case 1 -> 0.10; // 10% for 1 day late
                        case 2 -> 0.25; // 25% for 2 days late
                        case 3 -> 0.50; // 50% for 3 days late
                        default -> 0.0;
                    };
            double penalty = deposit * penaltyRate;
            refundDeposit = deposit - penalty;

            log.info(
                    " Booking {} trả trễ {} ngày → trừ {} coin ({}%)",
                    bookingId, daysLate, penalty, (int) (penaltyRate * 100));
        } else if (daysLate >= 4) {
            handleUnreturnedBooking(booking);
            log.warn("Booking {} trả sau hơn 3 ngày — sẽ không hoàn cọc (đã xử lý ở forfeited flow)", bookingId);
            return;
        }

        // system -> lessor (pay rental fee)
        lessor.setCoinBalance(lessor.getCoinBalance() + rentalFee);
        system.setCoinBalance(system.getCoinBalance() - rentalFee);

        // system -> lessee (refund deposit)
        lessee.setCoinBalance(lessee.getCoinBalance() + refundDeposit);
        system.setCoinBalance(system.getCoinBalance() - refundDeposit);

        // update accounts after transactions
        accountRepository.saveAll(List.of(system, lessor, lessee));

        // record transactions
        Transaction rentalPayoutTx = transactionRepository.save(Transaction.builder()
                .fromAccountId(system.getId())
                .toAccountId(lessor.getId())
                .amount(rentalFee)
                .type(TransactionType.RENTAL_PAYOUT)
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build());

        Transaction refundDepositTx = transactionRepository.save(Transaction.builder()
                .fromAccountId(system.getId())
                .toAccountId(lessee.getId())
                .amount(deposit)
                .type(TransactionType.REFUND_DEPOSIT)
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build());

        // record transaction-booking links
        transactionBookingRepository.save(TransactionBooking.builder()
                .bookingId(booking.getId())
                .transactionId(rentalPayoutTx.getId())
                .createdAt(LocalDateTime.now())
                .build());

        transactionBookingRepository.save(TransactionBooking.builder()
                .transactionId(refundDepositTx.getId())
                .bookingId(booking.getId())
                .createdAt(LocalDateTime.now())
                .build());

        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
    }

    @Override
    @Transactional
    @Scheduled(fixedRate = 3600000)
    public void checkAndUpdateLateReturns() {
        LocalDateTime now = LocalDateTime.now();
        LocalDate today = LocalDate.now();

        List<Booking> toUpdate = new ArrayList<>();

        // Đến hạn trả đồ -> DUE_FOR_RETURN
        List<Booking> inUseBookings = bookingRepository.findByStatus(BookingStatus.IN_USE);
        for (Booking booking : inUseBookings) {
            String itemName = itemRepository
                    .findById(booking.getItemId())
                    .map(Item::getName)
                    .orElse("sản phẩm");
            if (booking.getEndDate().isAfter(today)) {
                booking.setStatus(BookingStatus.DUE_FOR_RETURN);
                booking.setUpdatedAt(now);
                log.info("Booking {} chuyển sang DUE_FOR_RETURN", booking.getId());
                toUpdate.add(booking);
            }

            // thông báo cho người thuê về việc sắp đến hạn trả đồ
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(booking.getLesseeId())
                    .senderId(booking.getLessorId())
                    .type(NotificationType.BOOKING_CREATED) // reuse booking notification category
                    .title("Sắp đến hạn trả đồ")
                    .content("Đơn thuê \"" + itemName + "\" sắp đến hạn trả. Vui lòng chuẩn bị gửi trả.")
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());
        }

        // Sau 24h kể từ DUE_FOR_RETURN -> LATE_RETURN
        List<Booking> dueBookings = bookingRepository.findByStatus(BookingStatus.DUE_FOR_RETURN);
        for (Booking booking : dueBookings) {
            String itemName = itemRepository
                    .findById(booking.getItemId())
                    .map(Item::getName)
                    .orElse("sản phẩm");
            Duration sinceDue = Duration.between(booking.getUpdatedAt(), now);
            if (sinceDue.toHours() >= 24) {
                booking.setStatus(BookingStatus.LATE_RETURN);
                booking.setUpdatedAt(now);
                log.info("Booking {} chuyển sang LATE_RETURN", booking.getId());
                toUpdate.add(booking);
            }

            // thông báo cho người thuê về việc đã trễ hạn trả đồ
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(booking.getLesseeId())
                    .senderId(booking.getLessorId())
                    .type(NotificationType.BOOKING_CREATED) // reuse booking notification category
                    .title("Đã trễ hạn trả đồ")
                    .content("Đơn thuê \"" + itemName + "\" đã trễ hạn trả. Vui lòng trả sớm để tránh phạt.")
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());
        }

        // Sau 72h kể từ LATE_RETURN -> OVERDUE
        List<Booking> lateBookings = bookingRepository.findByStatus(BookingStatus.LATE_RETURN);
        for (Booking booking : lateBookings) {
            Duration sinceLate = Duration.between(booking.getUpdatedAt(), now);
            if (sinceLate.toHours() >= 72) {
                booking.setStatus(BookingStatus.OVERDUE);
                booking.setUpdatedAt(now);
                log.info("Booking {} chuyển sang OVERDUE", booking.getId());
                toUpdate.add(booking);
            }
        }

        if (!toUpdate.isEmpty()) {
            bookingRepository.saveAll(toUpdate);
            log.info("Đã cập nhật {} booking", toUpdate.size());
        }
    }

    // =====Private Methods=====

    private Account getSystemWallet() {
        return accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));
    }

    // xử lý trường hợp người thuê không trả đồ sau 3 ngày trễ
    private void handleUnreturnedBooking(Booking booking) {
        LocalDateTime now = LocalDateTime.now();
        // Cập nhật trạng thái Booking và Item
        booking.setStatus(BookingStatus.FORFEITED);
        booking.setUpdatedAt(now);

        Item item = itemRepository
                .findById(booking.getItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        item.setStatus(ItemStatus.MISSING);

        // Tính toán số tiền cần chuyển cho chủ thuê
        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;
        double rentalFee = booking.getPricePerDay() * booking.getQuantity() * days;
        // Deposit amount cần nhân với quantity (mỗi sản phẩm cần cọc)
        double deposit = booking.getDepositAmount() * booking.getQuantity();
        double totalAmount = rentalFee + deposit;

        Account lessee = accountRepository
                .findById(booking.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Account lessor = accountRepository
                .findById(booking.getLessorId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Account system = getSystemWallet();

        if (system.getCoinBalance() < totalAmount) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        // Thực hiện chuyển tiền
        system.setCoinBalance(system.getCoinBalance() - totalAmount);
        lessor.setCoinBalance(lessor.getCoinBalance() + totalAmount);

        Transaction compTx = Transaction.builder()
                .fromAccountId(system.getId())
                .toAccountId(lessor.getId())
                .amount(totalAmount)
                .type(TransactionType.COMPENSATION_PAYOUT)
                .status(TransactionStatus.SUCCESS)
                .createdAt(now)
                .build();
        transactionRepository.save(compTx);

        transactionBookingRepository.save(TransactionBooking.builder()
                .transactionId(compTx.getId())
                .bookingId(booking.getId())
                .createdAt(now)
                .build());

        // ghi Item_Log
        itemLogRepository.save(ItemLog.builder()
                .itemId(booking.getItemId())
                .accountId(booking.getLesseeId())
                .action(ItemActionType.UNRETURNED)
                .previousStatus(ItemStatus.RENTED)
                .currentStatus(ItemStatus.MISSING)
                .note("Lessee failed to return item for booking: " + booking.getId())
                .createdAt(now)
                .build());

        // Trừ trust score và khóa tài khoản người thuê
        lessee.setTrustScore(Math.max(0, lessee.getTrustScore() - 50));
        lessee.setStatus(UserStatus.BANNED);

        // 9️Lưu toàn bộ thay đổi
        bookingRepository.save(booking);
        itemRepository.save(item);
        accountRepository.save(system);
        accountRepository.save(lessor);
        accountRepository.save(lessee);
    }

    private BookingResponse enrichBookingResponse(Booking booking) {
        BookingResponse response = bookingMapper.entityToResponse(booking);

        // load item
        Item item = itemRepository
                .findById(booking.getItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        response.setItemName(item.getName());

        // load lessor
        Account lessor = accountRepository
                .findById(booking.getLessorId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        response.setLessorName(lessor.getLastname() + " " + lessor.getFirstname());

        // load lessee
        Account lessee = accountRepository
                .findById(booking.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        response.setLesseeName(lessee.getLastname() + " " + lessee.getFirstname());

        // flag đã review chưa (mỗi booking 1 review của lessee)
        boolean hasReviewed = reviewRepository.existsByBookingIdAndReviewerId(booking.getId(), booking.getLesseeId());
        response.setHasReviewed(hasReviewed);
        return response;
    }
}
