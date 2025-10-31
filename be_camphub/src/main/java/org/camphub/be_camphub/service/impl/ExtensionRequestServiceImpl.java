package org.camphub.be_camphub.service.impl;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.extension_req.ExtensionReqCreationRequest;
import org.camphub.be_camphub.dto.request.extension_req.ExtensionResponseRequest;
import org.camphub.be_camphub.dto.response.extension_req.ExtensionReqResponse;
import org.camphub.be_camphub.entity.*;
import org.camphub.be_camphub.enums.BookingStatus;
import org.camphub.be_camphub.enums.ExtensionStatus;
import org.camphub.be_camphub.enums.TransactionStatus;
import org.camphub.be_camphub.enums.TransactionType;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.ExtensionRequestMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.ExtensionRequestService;
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
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;

    ExtensionRequestMapper extensionRequestMapper;

    @Override
    @Transactional
    public ExtensionReqResponse createExtensionRequest(UUID lesseeId, ExtensionReqCreationRequest request) {
        Booking booking = bookingRepository
                .findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        if (!booking.getLesseeId().equals(lesseeId)) throw new AppException(ErrorCode.UNAUTHORIZED);
        if (booking.getStatus() != BookingStatus.IN_USE) throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);

        // prevent multiple pending requests for the same booking
        boolean anyPending = extensionRequestRepository.findAll().stream()
                .anyMatch(er -> er.getBookingId().equals(booking.getId()) && er.getStatus() == ExtensionStatus.PENDING);
        if (anyPending) throw new AppException(ErrorCode.EXTENSION_ALREADY_PENDING);

        // compute requested new end date
        LocalDate oldEnd = booking.getEndDate();
        LocalDate requestedNewEnd = oldEnd.plusDays(request.getAdditionalDays());

        long additionalDays = ChronoUnit.DAYS.between(oldEnd, requestedNewEnd);
        if (additionalDays <= 0) throw new AppException(ErrorCode.INVALID_EXTENSION_DATE);

        double additionalFee = booking.getPricePerDay() * booking.getQuantity() * additionalDays;

        ExtensionRequest req = ExtensionRequest.builder()
                .bookingId(booking.getId())
                .lesseeId(lesseeId)
                .lessorId(booking.getLessorId())
                .oldEndDate(oldEnd)
                .requestedNewEndDate(requestedNewEnd)
                .additionalFee(additionalFee)
                .status(ExtensionStatus.PENDING)
                .note(request.getNote())
                .build();

        ExtensionRequest saved = extensionRequestRepository.save(req);

        return extensionRequestMapper.entityToResponse(saved);
    }

    @Override
    @Transactional
    public ExtensionReqResponse approveExtensionRequest(UUID lessorId, ExtensionResponseRequest request) {
        ExtensionRequest ext = extensionRequestRepository
                .findById(request.getRequestId())
                .orElseThrow(() -> new AppException(ErrorCode.EXTENSION_NOT_FOUND));

        if (!ext.getLessorId().equals(lessorId)) throw new AppException(ErrorCode.UNAUTHORIZED);
        if (ext.getStatus() != ExtensionStatus.PENDING) throw new AppException(ErrorCode.INVALID_EXTENSION_STATUS);

        Booking booking = bookingRepository
                .findById(ext.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));

        Account lessee = accountRepository
                .findById(ext.getLesseeId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        Account systemWallet = accountRepository
                .findSystemWallet()
                .orElseThrow(() -> new AppException(ErrorCode.SYSTEM_WALLET_NOT_FOUND));

        if (lessee.getCoinBalance() < ext.getAdditionalFee()) throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);

        // transfer coins from lessee -> system
        lessee.setCoinBalance(lessee.getCoinBalance() - ext.getAdditionalFee());
        systemWallet.setCoinBalance(systemWallet.getCoinBalance() + ext.getAdditionalFee());
        accountRepository.saveAll(List.of(lessee, systemWallet));

        // record transaction
        Transaction tx = Transaction.builder()
                .fromAccountId(lessee.getId())
                .toAccountId(systemWallet.getId())
                .amount(ext.getAdditionalFee())
                .type(TransactionType.EXTENSION_PAYMENT)
                .status(TransactionStatus.SUCCESS)
                .build();
        Transaction savedTx = transactionRepository.save(tx);

        // link transaction -> booking
        transactionBookingRepository.save(TransactionBooking.builder()
                .transactionId(savedTx.getId())
                .bookingId(booking.getId())
                .build());

        // update booking end date
        booking.setEndDate(ext.getRequestedNewEndDate());
        bookingRepository.save(booking);

        ext.setStatus(ExtensionStatus.APPROVED);
        ext.setNote(request.getNote());
        extensionRequestRepository.save(ext);

        return extensionRequestMapper.entityToResponse(ext);
    }

    @Override
    @Transactional
    public ExtensionReqResponse rejectExtensionRequest(UUID lessorId, ExtensionResponseRequest request) {
        ExtensionRequest ext = extensionRequestRepository
                .findById(request.getRequestId())
                .orElseThrow(() -> new AppException(ErrorCode.EXTENSION_NOT_FOUND));

        if (!ext.getLessorId().equals(lessorId)) throw new AppException(ErrorCode.UNAUTHORIZED);
        if (ext.getStatus() != ExtensionStatus.PENDING) throw new AppException(ErrorCode.INVALID_EXTENSION_STATUS);

        ext.setStatus(ExtensionStatus.REJECTED);
        ext.setNote(request.getNote());
        extensionRequestRepository.save(ext);

        return extensionRequestMapper.entityToResponse(ext);
    }

    @Override
    public ExtensionReqResponse cancelExtensionRequest(UUID lesseeId, UUID requestId) {
        ExtensionRequest ext = extensionRequestRepository
                .findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.EXTENSION_NOT_FOUND));

        if (!ext.getLesseeId().equals(lesseeId)) throw new AppException(ErrorCode.UNAUTHORIZED);
        if (ext.getStatus() != ExtensionStatus.PENDING) throw new AppException(ErrorCode.INVALID_EXTENSION_STATUS);

        ext.setStatus(ExtensionStatus.CANCELLED);
        extensionRequestRepository.save(ext);

        return extensionRequestMapper.entityToResponse(ext);
    }

    @Override
    @Scheduled(cron = "0 0 * * * *") // every hour
    @Transactional
    public void autoExpirePendingRequests() {
        LocalDateTime threshold = LocalDateTime.now().minusHours(48);
        List<ExtensionRequest> pending =
                extensionRequestRepository.findByStatusAndCreatedAtBefore(ExtensionStatus.PENDING, threshold);
        if (pending == null || pending.isEmpty()) return;
        pending.forEach(r -> r.setStatus(ExtensionStatus.EXPIRED));
        extensionRequestRepository.saveAll(pending);
    }
}
