package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.transaction.Transactional;

import lombok.extern.slf4j.Slf4j;
import org.camphub.be_camphub.dto.request.dispute.AdminReviewDisputeRequest;
import org.camphub.be_camphub.dto.request.dispute.DisputeCreationRequest;
import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.dispute.DisputeResponse;
import org.camphub.be_camphub.entity.*;
import org.camphub.be_camphub.enums.*;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.DisputeMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.DisputeService;
import org.camphub.be_camphub.service.NotificationService;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DisputeServiceImpl implements DisputeService {
    DisputeRepository disputeRepository;
    BookingRepository bookingRepository;
    DamageTypeRepository damageTypeRepository;
    ItemRepository itemRepository;
    ReturnRequestRepository returnRequestRepository;
    DisputeMapper disputeMapper;
    AccountRepository accountRepository;
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;
    NotificationService notificationService;

    @Override
    @Transactional
    public DisputeResponse createDispute(UUID lessorId, DisputeCreationRequest request) {

        // Load booking
        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLessorId().equals(lessorId)) throw new AppException(ErrorCode.UNAUTHORIZED);

        // Đóng các ReturnRequest đang mở (PENDING / WAITING ...)
        freezeReturnRequestIfAny(booking);

        // Cập nhật booking
        booking.setStatus(BookingStatus.DISPUTE_PENDING_REVIEW);
        bookingRepository.save(booking);

        Dispute dispute = disputeMapper.creationRequestToEntity(request);
        dispute.setReporterId(lessorId);
        dispute.setDefenderId(booking.getLesseeId());
        dispute.setBookingId(booking.getId());
        dispute.setStatus(DisputeStatus.PENDING_REVIEW);

        disputeRepository.save(dispute);

        // thông báo đến tất cả admin có khiếu nại mới cần xử lý
        notificationService.notifyAllAdmins(NotificationCreationRequest.builder()
                .senderId(lessorId)
                .type(NotificationType.DISPUTE_CREATED)
                .title("Khiếu nại mới cần xử lý")
                .content("Có khiếu nại mới cho đơn " + booking.getId())
                .referenceType(ReferenceType.BOOKING)
                .referenceId(booking.getId())
                .build());

        // Build response
        return enrichDisputeResponse(dispute);
    }

    @Override
    @Transactional
    public DisputeResponse adminReviewDispute(UUID adminId, AdminReviewDisputeRequest request) {
        Dispute dispute = disputeRepository
                .findById(request.getDisputeId())
                .orElseThrow(() -> new AppException(ErrorCode.DISPUTE_NOT_FOUND));

        Booking booking = bookingRepository
                .findById(dispute.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        // Setup thông tin Admin xử lý
        dispute.setAdminId(adminId);
        dispute.setAdminNote(request.getAdminNote());
        dispute.setResolvedAt(LocalDateTime.now());
        dispute.setStatus(DisputeStatus.RESOLVED);

        // Tính toán tổng tiền đang nằm ở ví hệ thống (System Wallet)
        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;
        double totalRentalFee = booking.getPricePerDay() * booking.getQuantity() * days;
        double totalDeposit = Optional.ofNullable(booking.getDepositAmount()).orElse(0.0) * booking.getQuantity();

        // Tính tiền Phạt (Compensation) từ Cọc
        DamageType damageType = damageTypeRepository.findById(dispute.getDamageTypeId()).orElse(null);
        double rate = (damageType != null) ? damageType.getCompensationRate() : 0.0;
        double compensationAmount = 0.0;

        if (Boolean.TRUE.equals(request.getIsApproved())) {
            // Admin chấp nhận khiếu nại -> Có phạt
            compensationAmount = Math.round(totalDeposit * rate * 100.0) / 100.0;
            dispute.setAdminDecision(DisputeDecision.APPROVED);
        } else {
            // Admin từ chối -> Không phạt
            dispute.setAdminDecision(DisputeDecision.REJECTED);
        }
        dispute.setCompensationAmount(compensationAmount);


        // Tìm cả những cái đang bị CLOSED_BY_DISPUTE
        Optional<ReturnRequest> returnReqOpt = returnRequestRepository
                .findFirstByBookingIdAndStatusIn(booking.getId(),
                        List.of(ReturnRequestStatus.CLOSED_BY_DISPUTE));

        double lessorReceived = 0.0;
        double lesseeReceived = 0.0;

        // tiền phạt (lấy từ cọc đưa cho chủ)
        lessorReceived += compensationAmount;

        // tiền cọc dư (trả về khách)
        double remainingDeposit = Math.max(0, totalDeposit - compensationAmount);
        lesseeReceived += remainingDeposit;

        // tiền thuê (phân nhánh)
        if (returnReqOpt.isPresent()) {
            // nếu có return request (chồng chéo return request + dispute)
            lesseeReceived += totalRentalFee;

            // Mở lại Return Request để Admin duyệt tiếp về mặt "Lý do" (Trust Score)
            ReturnRequest rr = returnReqOpt.get();
            rr.setStatus(ReturnRequestStatus.PROCESSING);
            rr.setAdminNote("Dispute đã xong (Đã chia tiền). Vui lòng duyệt lý do trả hàng.");
            returnRequestRepository.save(rr);

        } else {
            // không có return request (chỉ có dispute)
            lessorReceived += totalRentalFee;
        }

        // Load accounts
        Account system = accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));

        Account lessor = accountRepository
                .findById(dispute.getReporterId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Account lessee = accountRepository
                .findById(booking.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));


        if (system.getCoinBalance() < (lessorReceived + lesseeReceived)) {
            // Log error critical, nhưng vẫn save dispute state
            log.error("System wallet error ID: {}", booking.getId());
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);

        } else {
            // Trừ ví hệ thống
            system.setCoinBalance(system.getCoinBalance() - (lessorReceived + lesseeReceived));

            // Cộng ví Chủ
            if (lessorReceived > 0) {
                lessor.setCoinBalance(lessor.getCoinBalance() + lessorReceived);
                createTransaction(system.getId(), lessor.getId(), lessorReceived, TransactionType.COMPENSATION_PAYOUT, booking.getId());
            }

            // Cộng ví Khách
            if (lesseeReceived > 0) {
                lessee.setCoinBalance(lessee.getCoinBalance() + lesseeReceived);
                createTransaction(system.getId(), lessee.getId(), lesseeReceived, TransactionType.REFUND_FULL, booking.getId());
            }

            accountRepository.saveAll(List.of(system, lessor, lessee));
        }

        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);

        disputeRepository.save(dispute);

        sendDisputeResolutionNotifications(
                adminId,
                dispute,
                booking,
                request.getIsApproved(),
                compensationAmount
        );

        return enrichDisputeResponse(dispute);
    }

    @Override
    public List<DisputeResponse> getPendingDisputes() {
        return disputeRepository.findByStatus(DisputeStatus.PENDING_REVIEW).stream()
                .map(this::enrichDisputeResponse)
                .toList();
    }

    @Override
    public List<DisputeResponse> getAllDisputes() {
        return disputeRepository.findAll().stream()
                .map(this::enrichDisputeResponse)
                .toList();
    }

    @Override
    public DisputeResponse getDisputeById(UUID disputeId) {
        return disputeRepository
                .findById(disputeId)
                .map(this::enrichDisputeResponse)
                .orElseThrow(() -> new AppException(ErrorCode.DISPUTE_NOT_FOUND));
    }

    @Override
    public List<DisputeResponse> getDisputesByReporterId(UUID reporterId) {
        return disputeRepository.findByReporterIdOrderByCreatedAtDesc(reporterId).stream()
                .map(this::enrichDisputeResponse)
                .toList();
    }

    private void freezeReturnRequestIfAny(Booking booking) {
        // Tìm xem có request nào đang chạy không để đóng băng
        returnRequestRepository
                .findFirstByBookingIdAndStatusIn(booking.getId(), List.of(ReturnRequestStatus.PENDING, ReturnRequestStatus.PROCESSING))
                .ifPresent(rr -> {
                    rr.setStatus(ReturnRequestStatus.CLOSED_BY_DISPUTE); // Đánh dấu tạm khóa
                    returnRequestRepository.save(rr);
                });
    }

    private void createTransaction(UUID from, UUID to, double amount, TransactionType type, UUID bookingId) {
        Transaction tx = Transaction.builder()
                .fromAccountId(from).toAccountId(to).amount(amount).type(type)
                .status(TransactionStatus.SUCCESS).createdAt(LocalDateTime.now()).build();
        transactionRepository.save(tx);
        transactionBookingRepository.save(TransactionBooking.builder().transactionId(tx.getId()).bookingId(bookingId).build());
    }

    private void sendDisputeResolutionNotifications(UUID adminId, Dispute dispute, Booking booking, Boolean isApproved, double compensationAmount) {
        String bookingIdStr = booking.getId().toString();

        // 1. Cấu hình nội dung cho trường hợp CHẤP THUẬN (Lessor thắng)
        if (Boolean.TRUE.equals(isApproved)) {
            // ---> Gửi cho Chủ (Lessor)
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(dispute.getReporterId()) // Chủ
                    .senderId(adminId)
                    .type(NotificationType.DISPUTE_RESOLVED_ACCEPTED)
                    .title("Khiếu nại được chấp thuận")
                    .content(String.format("Khiếu nại đơn hàng %s đã được chấp thuận. Bạn nhận được %.0f VND tiền bồi thường.", bookingIdStr, compensationAmount))
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());

            // ---> Gửi cho Khách (Lessee)
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(dispute.getDefenderId()) // Khách
                    .senderId(adminId)
                    .type(NotificationType.DISPUTE_RESOLVED_ACCEPTED)
                    .title("Quyết định xử lý khiếu nại")
                    .content(String.format("Admin đã chấp thuận khiếu nại của chủ xe đơn hàng %s. Bạn bị trừ %.0f VND tiền cọc.", bookingIdStr, compensationAmount))
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());
        }
        // 2. Cấu hình nội dung cho trường hợp TỪ CHỐI (Lessor thua)
        else {
            // ---> Gửi cho Chủ (Lessor)
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(dispute.getReporterId()) // Chủ
                    .senderId(adminId)
                    .type(NotificationType.DISPUTE_RESOLVED_REJECTED)
                    .title("Khiếu nại bị từ chối")
                    .content(String.format("Khiếu nại đơn hàng %s đã bị từ chối do không đủ cơ sở.", bookingIdStr))
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());

            // ---> Gửi cho Khách (Lessee)
            notificationService.create(NotificationCreationRequest.builder()
                    .receiverId(dispute.getDefenderId()) // Khách
                    .senderId(adminId)
                    .type(NotificationType.DISPUTE_RESOLVED_REJECTED)
                    .title("Khiếu nại đã được giải quyết")
                    .content(String.format("Khiếu nại từ chủ xe đối với đơn hàng %s đã bị bác bỏ. Bạn không phải chịu trách nhiệm.", bookingIdStr))
                    .referenceType(ReferenceType.BOOKING)
                    .referenceId(booking.getId())
                    .build());
        }
    }

    private DisputeResponse enrichDisputeResponse(Dispute dispute) {
        DisputeResponse response = disputeMapper.entityToResponse(dispute);
        accountRepository
                .findById(dispute.getReporterId())
                .ifPresent(acc -> response.setReporterName(acc.getLastname() + " " + acc.getFirstname()));

        accountRepository
                .findById(dispute.getDefenderId())
                .ifPresent(acc -> response.setDefenderName(acc.getLastname() + " " + acc.getFirstname()));

        if (dispute.getAdminId() != null) {
            accountRepository
                    .findById(dispute.getAdminId())
                    .ifPresent(acc -> response.setAdminName(acc.getLastname() + " " + acc.getFirstname()));
        }

        if (dispute.getDamageTypeId() != null) {
            damageTypeRepository.findById(dispute.getDamageTypeId()).ifPresent(dt -> {
                response.setDamageTypeName(dt.getName());
                response.setCompensationRate(dt.getCompensationRate());
            });
        }

        return response;
    }
}
