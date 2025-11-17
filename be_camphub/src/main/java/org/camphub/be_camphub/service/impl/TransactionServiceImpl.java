package org.camphub.be_camphub.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.response.transaction.TransactionDetailResponse;
import org.camphub.be_camphub.dto.response.transaction.TransactionResponse;
import org.camphub.be_camphub.entity.Booking;
import org.camphub.be_camphub.entity.Item;
import org.camphub.be_camphub.entity.Transaction;
import org.camphub.be_camphub.entity.TransactionBooking;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.TransactionMapper;
import org.camphub.be_camphub.repository.*;
import org.camphub.be_camphub.service.TransactionService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TransactionServiceImpl implements TransactionService {
    TransactionRepository transactionRepository;
    TransactionBookingRepository transactionBookingRepository;
    TransactionMapper transactionMapper;

    BookingRepository bookingRepository;
    ItemRepository itemRepository;
    AccountRepository accountRepository;

    @Override
    public TransactionResponse getTransactionById(UUID transactionId) {
        Transaction tx = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new AppException(ErrorCode.TRANSACTION_NOT_FOUND));
        return transactionMapper.entityToResponse(tx);
    }

    @Override
    public List<TransactionResponse> getTransactionsByAccount(UUID accountId) {
        List<Transaction> transactions =
                transactionRepository.findByFromAccountIdOrToAccountId(accountId, accountId)
                        .stream().distinct().toList();

        return transactions.stream()
                .map(this::enrichTransactionResponse)
                .toList();
    }

    @Override
    public List<TransactionDetailResponse> getTransactionBookingsByTransactionId(UUID transactionId) {
        List<TransactionBooking> txBookings = transactionBookingRepository.findByTransactionId(transactionId);
        return mapTransactionBookingsToDetail(txBookings);
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        List<Transaction> transactions = transactionRepository.findAll();
        return transactions.stream()
                .map(transactionMapper::entityToResponse)
                .toList();
    }

    @Override
    public List<TransactionResponse> getTransactionsByBookingId(UUID bookingId) {
        List<TransactionBooking> txBookings = transactionBookingRepository.findByBookingId(bookingId);
        if (txBookings.isEmpty()) return List.of();

        Map<UUID, Transaction> txMap = loadTransactions(txBookings);

        return txBookings.stream()
                .map(TransactionBooking::getTransactionId)
                .distinct()
                .map(txMap::get)
                .filter(Objects::nonNull)
                .map(transactionMapper::entityToResponse)
                .toList();
    }

    private List<TransactionDetailResponse> mapTransactionBookingsToDetail(List<TransactionBooking> txBookings) {
        if (txBookings.isEmpty()) return List.of();

        // Load batched Transactions
        Map<UUID, Transaction> txMap = loadTransactions(txBookings);

        // Load batched Bookings
        List<UUID> bookingIds = txBookings.stream()
                .map(TransactionBooking::getBookingId)
                .distinct()
                .toList();
        Map<UUID, Booking> bookingMap = bookingRepository.findAllById(bookingIds).stream()
                .collect(Collectors.toMap(Booking::getId, b -> b));

        // Load batched Items
        List<UUID> itemIds = bookingMap.values().stream()
                .map(Booking::getItemId)
                .distinct()
                .toList();
        Map<UUID, Item> itemMap = itemRepository.findAllById(itemIds).stream()
                .collect(Collectors.toMap(Item::getId, i -> i));

        return txBookings.stream().map(tb -> {
            Transaction tx = txMap.get(tb.getTransactionId());
            if (tx == null) throw new AppException(ErrorCode.TRANSACTION_NOT_FOUND);

            Booking booking = bookingMap.get(tb.getBookingId());
            if (booking == null) throw new AppException(ErrorCode.BOOKING_NOT_FOUND);

            Item item = itemMap.get(booking.getItemId());
            if (item == null) throw new AppException(ErrorCode.ITEM_NOT_FOUND);

            TransactionDetailResponse response = transactionMapper.toTransactionDetailResponse(tx, tb, booking, item);
            return enrichTransactionDetailResponse(response);
        }).toList();
    }

    private Map<UUID, Transaction> loadTransactions(List<TransactionBooking> txBookings) {
        if (txBookings.isEmpty()) return Map.of();

        List<UUID> txIds = txBookings.stream()
                .map(TransactionBooking::getTransactionId)
                .distinct()
                .toList();

        return transactionRepository.findAllById(txIds).stream()
                .collect(Collectors.toMap(Transaction::getId, t -> t));
    }

    private String getAccountName(UUID accountId) {
        return accountRepository.findById(accountId)
                .map(acc -> acc.getLastname() + " " +  acc.getFirstname())
                .orElse("Unknown Account");
    }

    private TransactionResponse enrichTransactionResponse(Transaction transaction) {
        TransactionResponse response = transactionMapper.entityToResponse(transaction);
        // load senderName
        String senderName = getAccountName(response.getFromAccountId());
        response.setSenderName(senderName);

        // load receiverName
        String receiverName = getAccountName(response.getToAccountId());
        response.setReceiverName(receiverName);

        return response;
    }

    private TransactionDetailResponse enrichTransactionDetailResponse(TransactionDetailResponse response) {
        // load lesseeName
        String lesseeName = getAccountName(response.getLesseeId());
        response.setLesseeName(lesseeName);

        // load lessorName
        String lessorName = getAccountName(response.getLessorId());
        response.setLessorName(lessorName);

        return response;
    }
}
