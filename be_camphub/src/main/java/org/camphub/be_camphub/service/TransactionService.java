package org.camphub.be_camphub.service;

import org.camphub.be_camphub.dto.response.transaction.TransactionDetailResponse;
import org.camphub.be_camphub.dto.response.transaction.TransactionResponse;

import java.util.List;
import java.util.UUID;

public interface TransactionService {
    TransactionResponse getTransactionById(UUID transactionId);

    List<TransactionResponse> getTransactionsByAccount(UUID accountId);

    List<TransactionDetailResponse> getTransactionBookingsByTransactionId(UUID transactionId);

    List<TransactionResponse> getAllTransactions();
    List<TransactionResponse> getTransactionsByBookingId(UUID bookingId);
}
