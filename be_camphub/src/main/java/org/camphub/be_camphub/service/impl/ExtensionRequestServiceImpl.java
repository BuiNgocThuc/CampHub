package org.camphub.be_camphub.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.extension_req.ExtensionReqCreationRequest;
import org.camphub.be_camphub.dto.request.extension_req.ExtensionResponseRequest;
import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.extension_req.ExtensionReqResponse;
import org.camphub.be_camphub.entity.*;
import org.camphub.be_camphub.enums.BookingStatus;
import org.camphub.be_camphub.enums.ExtensionStatus;
import org.camphub.be_camphub.enums.NotificationType;
import org.camphub.be_camphub.enums.ReferenceType;
import org.camphub.be_camphub.enums.TransactionStatus;
import org.camphub.be_camphub.enums.TransactionType;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.ExtensionRequestMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.ExtensionRequestService;
import org.camphub.be_camphub.service.NotificationService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExtensionRequestServiceImpl implements ExtensionRequestService {

    ExtensionRequestRepository extensionRequestRepository;
    BookingRepository bookingRepository;
    AccountRepository accountRepository;
    ItemRepository itemRepository;
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;
    ExtensionRequestMapper mapper;
    NotificationService notificationService;

    @Override
    @Transactional
    public ExtensionReqResponse createExtensionRequest(UUID lesseeId, ExtensionReqCreationRequest request) {
        Booking booking = getBookingOrThrow(request.getBookingId());

        // Validate permission & status
        if (!booking.getLesseeId().equals(lesseeId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
        if (booking.getStatus() != BookingStatus.IN_USE) {
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
        }
        if (extensionRequestRepository.existsByBookingIdAndStatus(booking.getId(), ExtensionStatus.PENDING)) {
            throw new AppException(ErrorCode.EXTENSION_ALREADY_PENDING);
        }

        LocalDate newEndDate = booking.getEndDate().plusDays(request.getAdditionalDays());
        if (!newEndDate.isAfter(booking.getEndDate())) {
            throw new AppException(ErrorCode.INVALID_EXTENSION_DATE);
        }

        double additionalFee = booking.getPricePerDay() * booking.getQuantity() * request.getAdditionalDays();

        ExtensionRequest entity = ExtensionRequest.builder()
                .bookingId(booking.getId())
                .lesseeId(lesseeId)
                .lessorId(booking.getLessorId())
                .oldEndDate(booking.getEndDate())
                .requestedNewEndDate(newEndDate)
                .additionalFee(additionalFee)
                .status(ExtensionStatus.PENDING)
                .note(request.getNote())
                .createdAt(LocalDateTime.now())
                .build();

        ExtensionRequest saved = extensionRequestRepository.save(entity);

        // thông báo cho Lessor về yêu cầu gia hạn
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(booking.getLessorId())
                .senderId(lesseeId)
                .type(NotificationType.EXTENSION_REQUEST_CREATED)
                .title("Yêu cầu gia hạn đơn thuê")
                .content("Khách thuê yêu cầu gia hạn đơn " + booking.getId() + " thêm " + request.getAdditionalDays()
                        + " ngày.")
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        return toEnrichedResponse(saved);
    }

    @Override
    @Transactional
    public ExtensionReqResponse approveExtensionRequest(UUID lessorId, ExtensionResponseRequest request) {
        ExtensionRequest ext = getPendingExtensionOrThrow(request.getRequestId());
        if (!ext.getLessorId().equals(lessorId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        Booking booking = getBookingOrThrow(ext.getBookingId());
        Account lessee = getAccountOrThrow(ext.getLesseeId());
        Account systemWallet = accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));

        if (lessee.getCoinBalance() < ext.getAdditionalFee()) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        // Deduct & transfer
        lessee.setCoinBalance(lessee.getCoinBalance() - ext.getAdditionalFee());
        systemWallet.setCoinBalance(systemWallet.getCoinBalance() + ext.getAdditionalFee());
        accountRepository.saveAll(List.of(lessee, systemWallet));

        // Create transaction
        Transaction tx = Transaction.builder()
                .fromAccountId(lessee.getId())
                .toAccountId(systemWallet.getId())
                .amount(ext.getAdditionalFee())
                .type(TransactionType.EXTENSION_PAYMENT)
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build();
        Transaction savedTx = transactionRepository.save(tx);

        transactionBookingRepository.save(TransactionBooking.builder()
                .transactionId(savedTx.getId())
                .bookingId(booking.getId())
                .createdAt(LocalDateTime.now())
                .build());

        // Update booking & request
        booking.setEndDate(ext.getRequestedNewEndDate());
        bookingRepository.save(booking);

        ext.setStatus(ExtensionStatus.APPROVED);
        ext.setNote(request.getNote());
        extensionRequestRepository.save(ext);

        // thông báo cho Lessee về việc yêu cầu gia hạn đã được chấp nhận
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(lessee.getId())
                .senderId(lessorId)
                .type(NotificationType.EXTENSION_REQUEST_APPROVED)
                .title("Yêu cầu gia hạn đã được chấp nhận")
                .content("Chủ đồ đã chấp nhận gia hạn đơn " + booking.getId() + ". Phí gia hạn: "
                        + ext.getAdditionalFee() + " coin.")
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        return toEnrichedResponse(ext);
    }

    @Override
    @Transactional
    public ExtensionReqResponse rejectExtensionRequest(UUID lessorId, ExtensionResponseRequest request) {
        ExtensionRequest ext = getPendingExtensionOrThrow(request.getRequestId());
        if (!ext.getLessorId().equals(lessorId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        ext.setStatus(ExtensionStatus.REJECTED);
        ext.setNote(request.getNote());
        extensionRequestRepository.save(ext);

        // thông báo cho Lessee về việc yêu cầu gia hạn đã bị từ chối
        Booking booking = getBookingOrThrow(ext.getBookingId());
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(ext.getLesseeId())
                .senderId(lessorId)
                .type(NotificationType.EXTENSION_REQUEST_REJECTED)
                .title("Yêu cầu gia hạn đã bị từ chối")
                .content("Chủ đồ đã từ chối gia hạn đơn " + booking.getId()
                        + (request.getNote() != null ? ". Lý do: " + request.getNote() : "."))
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        return toEnrichedResponse(ext);
    }

    @Override
    @Transactional
    public ExtensionReqResponse cancelExtensionRequest(UUID lesseeId, UUID requestId) {
        ExtensionRequest ext = getPendingExtensionOrThrow(requestId);
        if (!ext.getLesseeId().equals(lesseeId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        ext.setStatus(ExtensionStatus.CANCELLED);
        extensionRequestRepository.save(ext);

        return toEnrichedResponse(ext);
    }

    @Override
    @Scheduled(cron = "0 0 * * * *") // Mỗi giờ
    @Transactional
    public void autoExpirePendingRequests() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(48);
        List<ExtensionRequest> expired =
                extensionRequestRepository.findByStatusAndCreatedAtBefore(ExtensionStatus.PENDING, threshold);

        if (expired.isEmpty()) return;

        expired.forEach(req -> req.setStatus(ExtensionStatus.EXPIRED));
        extensionRequestRepository.saveAllAndFlush(expired);
    }

    @Override
    public List<ExtensionReqResponse> getAllExtensionRequestsFiltered(
            String status, UUID bookingId, UUID lesseeId, UUID lessorId) {

        return extensionRequestRepository.findAllFiltered(status, bookingId, lesseeId, lessorId).stream()
                .map(this::toEnrichedResponse)
                .toList();
    }

    @Override
    public ExtensionReqResponse getExtensionRequestById(UUID requestId) {
        ExtensionRequest ext = extensionRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.EXTENSION_NOT_FOUND));
        return toEnrichedResponse(ext);
    }

    private ExtensionReqResponse toEnrichedResponse(ExtensionRequest ext) {
        ExtensionReqResponse res = mapper.entityToResponse(ext);

        Booking booking = getBookingOrThrow(ext.getBookingId());
        Item item = getItemOrThrow(booking.getItemId());
        Account lessee = getAccountOrThrow(ext.getLesseeId());
        Account lessor = getAccountOrThrow(booking.getLessorId());

        res.setItemName(item.getName());
        res.setLesseeName(lessee.getFirstname() + " " + lessee.getLastname());
        res.setLessorName(lessor.getFirstname() + " " + lessor.getLastname());

        return res;
    }

    private ExtensionRequest getPendingExtensionOrThrow(UUID id) {
        ExtensionRequest ext = extensionRequestRepository
                .findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EXTENSION_NOT_FOUND));
        if (ext.getStatus() != ExtensionStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_EXTENSION_STATUS);
        }
        return ext;
    }

    private Booking getBookingOrThrow(UUID id) {
        return bookingRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
    }

    private Account getAccountOrThrow(UUID id) {
        return accountRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
    }

    private Item getItemOrThrow(UUID id) {
        return itemRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));
    }
}
