package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import jakarta.transaction.Transactional;

import org.camphub.be_camphub.Utils.MediaUtils;
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
import org.camphub.be_camphub.service.ReturnRequestService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ReturnRequestServiceImpl implements ReturnRequestService {
    ReturnRequestRepository returnRequestRepository;
    BookingRepository bookingRepository;
    AccountRepository accountRepository;
    ItemRepository itemRepository;
    ItemLogsRepository itemLogRepository;
    DisputeRepository disputeRepository;
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;

    ReturnRequestMapper returnRequestMapper;
    MediaUtils mediaUtils;

    @Override
    @Transactional
    public ReturnReqResponse createReturnRequest(UUID lesseeId, ReturnReqCreationRequest request) {
        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLesseeId().equals(lesseeId)) throw new AppException(ErrorCode.UNAUTHORIZED);

        if (booking.getStatus() != BookingStatus.WAITING_DELIVERY) {
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
        }

        ReturnRequest returnRequest = ReturnRequest.builder()
                .bookingId(booking.getId())
                .lesseeId(lesseeId)
                .lessorId(booking.getLessorId())
                .reason(request.getReason())
                .note(request.getNote())
                .evidenceUrls(
                request.getEvidenceUrls() == null ?
                        Collections.emptyList() :
                        request.getEvidenceUrls().stream()
                                .map(r -> MediaResource.builder()
                                        .url(r.getUrl())
                                        .type(r.getType())
                                        .build())
                                .toList()
        )
                .status(ReturnRequestStatus.PROCESSING)
                .build();

        returnRequest = returnRequestRepository.save(returnRequest);

        // update booking status
        booking.setStatus(BookingStatus.RETURN_REFUND_REQUESTED);
        bookingRepository.save(booking);

        // log action in ItemLog (customer requested return) — not packing media yet
        itemLogRepository.save(ItemLog.builder()
                .id(UUID.randomUUID())
                .itemId(booking.getItemId())
                .accountId(lesseeId)
                .action(ItemActionType.RETURN_REQUESTED)
                .previousStatus(null)
                .currentStatus(null)
                .note("Lessee requested return: " + returnRequest.getId())
                .build());

        return returnRequestMapper.entityToResponse(returnRequest);
    }

    // Lessee submits packing media & marks item returned
    @Override
    @Transactional
    public ReturnReqResponse lesseeSubmitReturn(UUID lesseeId, LesseeSubmitReturnRequest request) {
        ReturnRequest rr = returnRequestRepository
                .findById(request.getReturnRequestId())
                .orElseThrow(() -> new AppException(ErrorCode.RETURN_REQUEST_NOT_FOUND));

        Booking booking = bookingRepository
                .findById(rr.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!rr.getLesseeId().equals(lesseeId)) throw new AppException(ErrorCode.UNAUTHORIZED);
        if (rr.getStatus() != ReturnRequestStatus.PROCESSING)
            throw new AppException(ErrorCode.INVALID_RETURN_REQUEST_STATUS);
        if (booking.getStatus() != BookingStatus.RETURN_REFUND_REQUESTED)
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);

        // Save packing media into ItemLog (action RETURN)
        ItemLog packingLog = ItemLog.builder()
                .id(UUID.randomUUID())
                .itemId(booking.getItemId())
                .accountId(lesseeId)
                .action(ItemActionType.RETURN)
                .previousStatus(null)
                .currentStatus(ItemStatus.RETURN_PENDING_CHECK) // item status on db will be set below
                .note(Optional.ofNullable(request.getNote()).orElse("Lessee submitted return packing"))
                .evidenceUrls(request.getPackingMediaUrls().stream()
                        .map(url -> MediaResource.builder()
                                .url(url)
                                .type(mediaUtils.detectMediaType(url))
                                .build())
                        .toList())
                .createdAt(LocalDateTime.now())
                .build();

        itemLogRepository.save(packingLog);

        itemRepository.findById(booking.getItemId()).ifPresent(item -> {
            item.setStatus(ItemStatus.RETURN_PENDING_CHECK);
            itemRepository.save(item);
        });

        returnRequestRepository.save(rr);
        return returnRequestMapper.entityToResponse(rr);
    }

    // Lessor confirms receiving returned item
    @Override
    @Transactional
    public ReturnReqResponse lessorConfirmReturn(UUID lessorId, LessorConfirmReturnRequest request) {

        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        ReturnRequest rr = returnRequestRepository
                .findByBookingId(booking.getId())
                .orElseThrow(() -> new AppException(ErrorCode.RETURN_REQUEST_NOT_FOUND));

        if (!booking.getLessorId().equals(lessorId)) throw new AppException(ErrorCode.UNAUTHORIZED);

        if (booking.getStatus() != BookingStatus.RETURN_REFUND_REQUESTED)
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);

        // update return request & booking status
        booking.setStatus(BookingStatus.RETURN_REFUND_PROCESSING);
        bookingRepository.save(booking);
        rr.setStatus(ReturnRequestStatus.PROCESSING);
        returnRequestRepository.save(rr);

        // update item status to AVAILABLE
        itemRepository.findById(booking.getItemId()).ifPresent(item -> {
            item.setStatus(ItemStatus.AVAILABLE);
            itemRepository.save(item);
        });

        //  log
        itemLogRepository.save(ItemLog.builder()
                .id(UUID.randomUUID())
                .itemId(booking.getItemId())
                .accountId(lessorId)
                .action(ItemActionType.CHECK_RETURN)
                .previousStatus(ItemStatus.RETURN_PENDING_CHECK)
                .currentStatus(ItemStatus.AVAILABLE)
                .note("Lessor confirmed item returned in good condition")
                .createdAt(LocalDateTime.now())
                .build());

        return returnRequestMapper.entityToResponse(rr);
    }

    @Override
    @Transactional
    public ReturnReqResponse adminDecision(UUID adminId, AdminDecisionRequest request) {
        ReturnRequest rr = returnRequestRepository
                .findById(request.getReturnRequestId())
                .orElseThrow(() -> new AppException(ErrorCode.RETURN_REQUEST_NOT_FOUND));

        Booking booking = bookingRepository
                .findById(rr.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!(rr.getStatus() != ReturnRequestStatus.PROCESSING
                || booking.getStatus() != BookingStatus.RETURN_REFUND_PROCESSING)) {
            throw new AppException(ErrorCode.INVALID_RETURN_REQUEST_STATUS);
        }

        rr.setAdminNote(request.getAdminNote());
        rr.setResolvedAt(LocalDateTime.now());

        Account system = accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));
        Account lessee = accountRepository
                .findById(rr.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // calculate full rental fee + deposit
        long days = ChronoUnit.DAYS.between(booking.getStartDate(), booking.getEndDate()) + 1;
        double rentalFee = booking.getPricePerDay() * booking.getQuantity() * days;
        double deposit = Optional.ofNullable(booking.getDepositAmount()).orElse(0.0);

        double refundAmount = request.getRefundAmount() == null ? (rentalFee + deposit) : request.getRefundAmount();

        // ensure system wallet has enough (in prod you must ensure)
        if (system.getCoinBalance() < refundAmount) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        system.setCoinBalance(system.getCoinBalance() - refundAmount);
        lessee.setCoinBalance(lessee.getCoinBalance() + refundAmount);
        accountRepository.saveAll(Arrays.asList(system, lessee));

        // persist transaction
        Transaction tx = Transaction.builder()
                .id(UUID.randomUUID())
                .fromAccountId(system.getId())
                .toAccountId(lessee.getId())
                .amount(refundAmount)
                .type(TransactionType.REFUND_FULL)
                .status(TransactionStatus.SUCCESS)
                .createdAt(LocalDateTime.now())
                .build();
        transactionRepository.save(tx);

        transactionBookingRepository.save(TransactionBooking.builder()
                .id(UUID.randomUUID())
                .bookingId(booking.getId())
                .transactionId(tx.getId())
                .build());

        if (Boolean.TRUE.equals(request.getIsApproved())) {

            // update statuses
            rr.setStatus(ReturnRequestStatus.RESOLVED);
            booking.setStatus(BookingStatus.COMPLETED);

            // penalty logic if wrong description or missing parts
            if (rr.getReason() == ReasonReturnType.WRONG_DESCRIPTION
                    || rr.getReason() == ReasonReturnType.MISSING_PARTS) {
                // ban item or reduce trust score
                itemRepository.findById(booking.getItemId()).ifPresent(item -> {
                    item.setStatus(ItemStatus.BANNED);
                    itemRepository.save(item);
                });
                // reduce lessor trust (if field exists)
                accountRepository.findById(rr.getLessorId()).ifPresent(lessor -> {
                    lessor.setTrustScore(Math.max(0, lessor.getTrustScore() - 10));
                    accountRepository.save(lessor);
                });
            }

        } else {
            rr.setStatus(ReturnRequestStatus.REJECTED);
            booking.setStatus(BookingStatus.COMPLETED);
        }

        bookingRepository.save(booking);
        returnRequestRepository.save(rr);

        return returnRequestMapper.entityToResponse(rr);
    }

    @Override
    public List<ReturnReqResponse> getPendingRequests() {
        return returnRequestRepository.findByStatus(ReturnRequestStatus.PROCESSING).stream()
                .map(returnRequestMapper::entityToResponse)
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
}
