package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.camphub.be_camphub.Utils.MediaUtils;
import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.request.return_req.AdminDecisionRequest;
import org.camphub.be_camphub.dto.request.return_req.LesseeSubmitReturnRequest;
import org.camphub.be_camphub.dto.request.return_req.LessorConfirmReturnRequest;
import org.camphub.be_camphub.dto.request.return_req.ReturnReqCreationRequest;
import org.camphub.be_camphub.dto.response.return_req.ReturnReqResponse;
import org.camphub.be_camphub.entity.*;
import org.camphub.be_camphub.enums.*;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.ReturnRequestMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.NotificationService;
import org.camphub.be_camphub.service.ReturnRequestService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ReturnRequestServiceImpl implements ReturnRequestService {
    ReturnRequestRepository returnRequestRepository;
    BookingRepository bookingRepository;
    AccountRepository accountRepository;
    ItemRepository itemRepository;
    ItemLogsRepository itemLogRepository;
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;

    ReturnRequestMapper returnRequestMapper;
    MediaUtils mediaUtils;
    NotificationService notificationService;

    // 1. Lessee tạo yêu cầu trả hàng / hoàn tiền
    @Override
    @Transactional
    public ReturnReqResponse createReturnRequest(UUID lesseeId, ReturnReqCreationRequest request) {

        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLesseeId().equals(lesseeId)) throw new AppException(ErrorCode.UNAUTHORIZED);

        if (booking.getStatus() != BookingStatus.WAITING_DELIVERY)
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);

        ReturnRequest rr = returnRequestMapper.creationRequestToEntity(request);
        rr.setLesseeId(lesseeId);
        rr.setLessorId(booking.getLessorId());
        rr.setStatus(ReturnRequestStatus.PENDING);

        rr = returnRequestRepository.save(rr);

        booking.setStatus(BookingStatus.RETURN_REFUND_REQUESTED);
        bookingRepository.save(booking);

        // thông báo chủ thuê có yêu cầu hoàn trả
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(booking.getLessorId())
                .senderId(lesseeId)
                .type(NotificationType.BOOKING_RETURNED)
                .title("Yêu cầu hoàn trả/hoàn tiền mới")
                .content("Khách thuê đã tạo yêu cầu hoàn trả cho đơn " + booking.getId())
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        return enrichReturnRequestResponse(rr);
    }

    // 2. Lessee đăng minh chứng trả hàng (không đổi trạng thái)
    @Override
    @Transactional
    public ReturnReqResponse lesseeSubmitReturn(UUID lesseeId, LesseeSubmitReturnRequest request) {

        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        ReturnRequest rr = returnRequestRepository
                .findByBookingId(booking.getId())
                .orElseThrow(() -> new AppException(ErrorCode.RETURN_REQUEST_NOT_FOUND));

        if (!rr.getLesseeId().equals(lesseeId)) throw new AppException(ErrorCode.UNAUTHORIZED);

        if (rr.getStatus() != ReturnRequestStatus.PENDING)
            throw new AppException(ErrorCode.INVALID_RETURN_REQUEST_STATUS);

        if (booking.getStatus() != BookingStatus.RETURN_REFUND_REQUESTED)
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);

        // Chỉ log vào ItemLog
        itemLogRepository.save(ItemLog.builder()
                .itemId(booking.getItemId())
                .accountId(lesseeId)
                .action(ItemActionType.RETURN)
                .previousStatus(ItemStatus.RENTED)
                .currentStatus(ItemStatus.RETURN_PENDING_CHECK)
                .note(request.getNote())
                .evidenceUrls(mediaUtils.fromRequest(request.getPackingMediaUrls()))
                .build());

        // set item trạng thái đang chờ kiểm tra
        itemRepository.findById(booking.getItemId()).ifPresent(item -> {
            item.setStatus(ItemStatus.RETURN_PENDING_CHECK);
            itemRepository.save(item);
        });

        // thông báo chủ thuê có đơn hàng đang hoàn trả (đã gửi minh chứng)
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(booking.getLessorId())
                .senderId(lesseeId)
                .type(NotificationType.BOOKING_RETURNED)
                .title("Khách thuê đã gửi minh chứng trả hàng")
                .content("Khách thuê đã gửi minh chứng trả hàng cho đơn " + booking.getId())
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        return enrichReturnRequestResponse(rr);
    }

    // 3. Lessor xác nhận đã nhận được hàng
    @Override
    @Transactional
    public ReturnReqResponse lessorConfirmReturn(UUID lessorId, LessorConfirmReturnRequest request) {

        ReturnRequest rr = returnRequestRepository
                .findById(request.getReturnRequestId())
                .orElseThrow(() -> new AppException(ErrorCode.RETURN_REQUEST_NOT_FOUND));

        Booking booking = bookingRepository
                .findById(rr.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLessorId().equals(lessorId)) throw new AppException(ErrorCode.UNAUTHORIZED);

        if (booking.getStatus() != BookingStatus.RETURN_REFUND_REQUESTED)
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);

        // update statuses
        booking.setStatus(BookingStatus.RETURN_REFUND_PROCESSING);
        bookingRepository.save(booking);

        rr.setStatus(ReturnRequestStatus.PROCESSING); // chờ admin xử lý
        rr.setLessorConfirmedAt(LocalDateTime.now());
        returnRequestRepository.save(rr);

        // item về AVAILABLE
        itemRepository.findById(booking.getItemId()).ifPresent(item -> {
            item.setStatus(ItemStatus.AVAILABLE);
            itemRepository.save(item);
        });

        itemLogRepository.save(ItemLog.builder()
                .itemId(booking.getItemId())
                .accountId(lessorId)
                .action(ItemActionType.CHECK_RETURN)
                .previousStatus(ItemStatus.RETURN_PENDING_CHECK)
                .currentStatus(ItemStatus.AVAILABLE)
                .note("Lessor confirmed returned item")
                .build());

        // thông báo đến admin về yêu cầu hoàn tiền cần xử lý

        return enrichReturnRequestResponse(rr);
    }

    // 4. Admin quyết định chấp nhận hay từ chối lý do hoàn tiền - nhằm xử phạt chủ thuê và sản phẩm nếu cần
    @Override
    @Transactional
    public ReturnReqResponse adminDecision(UUID adminId, AdminDecisionRequest request) {

        ReturnRequest rr = returnRequestRepository
                .findById(request.getReturnRequestId())
                .orElseThrow(() -> new AppException(ErrorCode.RETURN_REQUEST_NOT_FOUND));

        Booking booking = bookingRepository
                .findById(rr.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (rr.getStatus() != ReturnRequestStatus.PROCESSING
                || booking.getStatus() != BookingStatus.RETURN_REFUND_PROCESSING) {
            throw new AppException(ErrorCode.INVALID_RETURN_REQUEST_STATUS);
        }

        // Refund amount = full rental price + deposit
        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;
        double rentalFee = booking.getPricePerDay() * booking.getQuantity() * days;
        // Deposit amount cần nhân với quantity (mỗi sản phẩm cần cọc)
        double deposit = Optional.ofNullable(booking.getDepositAmount()).orElse(0.0) * booking.getQuantity();

        double refundAmount = rentalFee + deposit;

        Account system = accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));
        Account lessee = accountRepository
                .findById(rr.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (system.getCoinBalance() < refundAmount) throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);

        // chuyển tiền
        system.setCoinBalance(system.getCoinBalance() - refundAmount);
        lessee.setCoinBalance(lessee.getCoinBalance() + refundAmount);
        accountRepository.saveAll(List.of(system, lessee));

        // lưu transaction
        Transaction tx = Transaction.builder()
                .fromAccountId(system.getId())
                .toAccountId(lessee.getId())
                .amount(refundAmount)
                .type(TransactionType.REFUND_FULL)
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);

        transactionBookingRepository.save(TransactionBooking.builder()
                .bookingId(booking.getId())
                .transactionId(tx.getId())
                .build());

        // update return request
        rr.setAdminNote(request.getAdminNote());
        rr.setAdminReviewedAt(LocalDateTime.now());
        rr.setRefundedAt(LocalDateTime.now());
        rr.setResolvedAt(LocalDateTime.now());

        // penalty logic
        if (request.getIsApproved()) {
            rr.setStatus(ReturnRequestStatus.APPROVED);

            if (rr.getReason() == ReasonReturnType.WRONG_DESCRIPTION
                    || rr.getReason() == ReasonReturnType.MISSING_PARTS) {

                // ban item
                itemRepository.findById(booking.getItemId()).ifPresent(item -> {
                    item.setStatus(ItemStatus.BANNED);
                    itemRepository.save(item);
                });

                // giảm trust score owner
                accountRepository.findById(rr.getLessorId()).ifPresent(lessor -> {
                    lessor.setTrustScore(Math.max(0, lessor.getTrustScore() - 10));
                    accountRepository.save(lessor);
                });
            }

        } else {
            rr.setStatus(ReturnRequestStatus.REJECTED);
        }

        booking.setStatus(BookingStatus.COMPLETED);

        bookingRepository.save(booking);
        returnRequestRepository.save(rr);

        // thông báo cho hai bên về kết quả xử lý hoàn tiền
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(rr.getLesseeId())
                .senderId(adminId)
                .type(NotificationType.DEPOSIT_REFUNDED)
                .title("Kết quả xử lý hoàn tiền")
                .content(
                        request.getIsApproved()
                                ? "Yêu cầu hoàn tiền của bạn đã được chấp nhận."
                                : "Yêu cầu hoàn tiền của bạn đã bị từ chối.")
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(rr.getLessorId())
                .senderId(adminId)
                .type(NotificationType.DEPOSIT_REFUNDED)
                .title("Kết quả xử lý hoàn tiền")
                .content(
                        request.getIsApproved()
                                ? "Yêu cầu hoàn tiền của đơn " + booking.getId() + " đã được chấp nhận."
                                : "Yêu cầu hoàn tiền của đơn " + booking.getId() + " đã bị từ chối.")
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        return enrichReturnRequestResponse(rr);
    }

    @Override
    public List<ReturnReqResponse> getPendingRequests() {
        return returnRequestRepository.findByStatus(ReturnRequestStatus.PENDING).stream()
                .map(this::enrichReturnRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReturnReqResponse> getAllReturnRequests() {
        log.info("Fetching all return requests from database");
        return returnRequestRepository.findAll().stream()
                .map(this::enrichReturnRequestResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Scheduled(cron = "0 0 * * * *") // every hour
    @Transactional
    public void autoRefundUnprocessedRequests() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(72);
        List<ReturnRequest> pending =
                returnRequestRepository.findByStatusAndCreatedAtBefore(ReturnRequestStatus.PROCESSING, threshold);
        for (ReturnRequest rr : pending) {
            // perform auto refund: mark APPROVED + do refund (full)
            try {
                AdminDecisionRequest adminReq = AdminDecisionRequest.builder()
                        .returnRequestId(rr.getId())
                        .isApproved(true)
                        .adminNote("Auto-approved refund after 72 hours of no admin action")
                        .build();
                adminDecision(UUID.fromString("00000000-0000-0000-0000-000000000000"), adminReq); // adminId dummy
                rr.setStatus(ReturnRequestStatus.AUTO_REFUNDED);
                returnRequestRepository.save(rr);
            } catch (Exception ex) {
                // log and continue
                // do not rethrow to avoid breaking the scheduled loop
            }
        }
    }

    ReturnReqResponse enrichReturnRequestResponse(ReturnRequest req) {
        log.info("Enriching return request response for request ID: {}", req.getId());
        ReturnReqResponse res = returnRequestMapper.entityToResponse(req);

        // Load booking
        Booking booking = bookingRepository
                .findById(req.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
        res.setBookingId(booking.getId());

        // Load item
        Item item = itemRepository
                .findById(booking.getItemId())
                .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
        res.setItemName(item.getName());

        // Load lessee name
        Account lessee = accountRepository
                .findById(req.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        res.setLesseeName(lessee.getLastname() + " " + lessee.getFirstname());

        // Load lessor name
        Account lessor = accountRepository
                .findById(req.getLessorId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        res.setLessorName(lessor.getLastname() + " " + lessor.getFirstname());
        return res;
    }
}
