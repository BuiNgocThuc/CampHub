package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import jakarta.transaction.Transactional;

import org.camphub.be_camphub.dto.request.dispute.AdminReviewDisputeRequest;
import org.camphub.be_camphub.dto.request.dispute.DisputeCreationRequest;
import org.camphub.be_camphub.dto.response.dispute.DisputeResponse;
import org.camphub.be_camphub.entity.*;
import org.camphub.be_camphub.enums.*;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.DisputeMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.DisputeService;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DisputeServiceImpl implements DisputeService {
    DisputeRepository disputeRepository;
    BookingRepository bookingRepository;
    DamageTypeRepository damageTypeRepository;
    ItemRepository itemRepository;
    ItemLogsRepository itemLogRepository;
    ReturnRequestRepository returnRequestRepository;
    DisputeMapper disputeMapper;
    AccountRepository accountRepository;
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;

    @Override
    @Transactional
    public DisputeResponse createDispute(UUID lessorId, DisputeCreationRequest request) {

        // 1. Load booking
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLessorId().equals(lessorId))
            throw new AppException(ErrorCode.UNAUTHORIZED);


        // 3. Đóng các ReturnRequest đang mở (PENDING / WAITING ...)
        closeOpenReturnRequest(booking);

        // 4. Cập nhật booking
        booking.setStatus(BookingStatus.DISPUTE_PENDING_REVIEW);
        bookingRepository.save(booking);

        // 5. Tạo dispute bằng mapper (chuẩn nhất)
        Dispute dispute = disputeMapper.creationRequestToEntity(request);
        dispute.setId(UUID.randomUUID());
        dispute.setReporterId(lessorId);
        dispute.setDefenderId(booking.getLesseeId());
        dispute.setBookingId(booking.getId());

        disputeRepository.save(dispute);

        // 6. Ban item tạm thời
        itemRepository.findById(booking.getItemId()).ifPresent(item -> {
            item.setStatus(ItemStatus.BANNED);
            itemRepository.save(item);
        });

        // 7. Build response
        return enrichDisputeResponse(dispute);
    }


    @Override
    @Transactional
    public DisputeResponse adminReviewDispute(UUID adminId, AdminReviewDisputeRequest request) {
        // 1. Load dispute + booking
        Dispute dispute = disputeRepository
                .findById(request.getDisputeId())
                .orElseThrow(() -> new AppException(ErrorCode.DISPUTE_NOT_FOUND));

        Booking booking = bookingRepository
                .findById(dispute.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        // 2. Fill admin metadata
        dispute.setAdminId(adminId);
        dispute.setAdminNote(request.getAdminNote());
        dispute.setResolvedAt(LocalDateTime.now());
        dispute.setStatus(DisputeStatus.RESOLVED);

        // 3. Load accounts
        Account system = accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));

        Account lessor = accountRepository
                .findById(dispute.getReporterId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Account lessee = accountRepository
                .findById(booking.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        DamageType damageType = damageTypeRepository
                .findById(dispute.getDamageTypeId())
                .orElseThrow(() -> new AppException(ErrorCode.DAMAGE_TYPE_NOT_FOUND));

        // 4. Compute compensation amount (based on deposit * damageRate)
        double deposit = Optional.ofNullable(booking.getDepositAmount()).orElse(0.0);
        double rate = Optional.ofNullable(damageType)
                .map(DamageType::getCompensationRate)
                .orElse(0.0);
        double compAmount = Math.round(deposit * rate * 100.0) / 100.0;

        if (Boolean.TRUE.equals(request.getIsApproved())) {
            // Admin CHẤP NHẬN khiếu nại -> chuyển tiền bồi thường cho lessor
            dispute.setAdminDecision(DisputeDecision.APPROVED);
            dispute.setCompensationAmount(compAmount);

            // Kiểm tra số dư hệ thống
            if (system.getCoinBalance() < compAmount) {
                throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
            }

            // Thực hiện chuyển tiền (system -> lessor)
            system.setCoinBalance(system.getCoinBalance() - compAmount);
            lessor.setCoinBalance(lessor.getCoinBalance() + compAmount);

            accountRepository.saveAll(List.of(system, lessor));

            // Ghi transaction: compensation payout
            Transaction compTx = Transaction.builder()
                    .fromAccountId(system.getId())
                    .toAccountId(lessor.getId())
                    .amount(compAmount)
                    .type(TransactionType.COMPENSATION_PAYOUT)
                    .status(TransactionStatus.SUCCESS)
                    .createdAt(LocalDateTime.now())
                    .build();
            transactionRepository.save(compTx);

            // Link transaction -> booking
            transactionBookingRepository.save(TransactionBooking.builder()
                    
                    .transactionId(compTx.getId())
                    .bookingId(booking.getId())
                    .build());

            // Update booking status (đánh dấu dispute đã được bồi thường)
            booking.setStatus(BookingStatus.COMPENSATION_COMPLETED);
            bookingRepository.save(booking);

            //  Giảm trust_score của khách thuê (lessee)
            double penalty;
            if (rate < 0.1) penalty = 2.0;
            else if (rate < 0.3) penalty = 5.0;
            else penalty = 10.0;

            double newTrust = Math.max(0, lessee.getTrustScore() - penalty);
            lessee.setTrustScore((int) newTrust);
            accountRepository.save(lessee);

            // Khóa sản phẩm
            if (rate >= 0.3) {
                Item item = itemRepository
                        .findById(booking.getItemId())
                        .orElseThrow(() -> new AppException(ErrorCode.ITEM_NOT_FOUND));

                item.setStatus(ItemStatus.BANNED);
                itemRepository.save(item);
            }

        } else {
            // Admin TỪ CHỐI khiếu nại -> không chuyển tiền bồi thường
            dispute.setAdminDecision(DisputeDecision.REJECTED);
            dispute.setCompensationAmount(0.0);

            booking.setStatus(BookingStatus.RETURN_REFUND_PROCESSING);
            bookingRepository.save(booking);
        }

        disputeRepository.save(dispute);
        return enrichDisputeResponse(dispute);
    }

    @Override
    public List<DisputeResponse> getPendingDisputes() {
        return disputeRepository.findByStatus(DisputeStatus.PENDING_REVIEW).stream()
                .map(this::enrichDisputeResponse)
                .toList();
    }

    private void closeOpenReturnRequest(Booking booking) {
        List<ReturnRequestStatus> activeStatuses = List.of(
                ReturnRequestStatus.PENDING,
                ReturnRequestStatus.PROCESSING
        );

        returnRequestRepository.findFirstByBookingIdAndStatusIn(booking.getId(), activeStatuses)
                .ifPresent(rr -> {
                    rr.setStatus(ReturnRequestStatus.CLOSED_BY_DISPUTE);
                    rr.setResolvedAt(LocalDateTime.now());
                    returnRequestRepository.save(rr);
                });
    }

    private DisputeResponse enrichDisputeResponse(Dispute dispute) {
        DisputeResponse response = disputeMapper.entityToResponse(dispute);
        accountRepository.findById(dispute.getReporterId())
                .ifPresent(acc -> response.setReporterName(acc.getLastname() + " " + acc.getFirstname()));

        accountRepository.findById(dispute.getDefenderId())
                .ifPresent(acc -> response.setDefenderName(acc.getLastname() + " " + acc.getFirstname()));

        if (dispute.getAdminId() != null) {
            accountRepository.findById(dispute.getAdminId())
                    .ifPresent(acc -> response.setAdminName(acc.getLastname() + " " + acc.getFirstname()));
        }

        if (dispute.getDamageTypeId() != null) {
            damageTypeRepository.findById(dispute.getDamageTypeId())
                    .ifPresent(dt -> {
                        response.setDamageTypeName(dt.getName());
                        response.setCompensationRate(dt.getCompensationRate());
                    });
        }

        return response;
    }

}
