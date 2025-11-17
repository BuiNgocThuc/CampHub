package org.camphub.be_camphub.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.transaction.TransactionDetailResponse;
import org.camphub.be_camphub.dto.response.transaction.TransactionResponse;
import org.camphub.be_camphub.service.TransactionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class TransactionController {
    TransactionService transactionService;

    // Get all transactions
    @GetMapping
    public ApiResponse<List<TransactionResponse>> getAllTransactions() {
        return ApiResponse.<List<TransactionResponse>>builder()
                .message("Get all transactions successfully")
                .result(transactionService.getAllTransactions())
                .build();
    }

//    Get transaction by id
    @GetMapping("/{transactionId}")
    public ApiResponse<TransactionResponse> getTransactionById(@PathVariable("transactionId") UUID transactionId) {
        return ApiResponse.<TransactionResponse>builder()
                .message("Get transaction by id successfully")
                .result(transactionService.getTransactionById(transactionId))
                .build();
    }

    // View details
    @GetMapping("/{transactionId}/details")
    public ApiResponse<List<TransactionDetailResponse>> getTransactionDetailByTxId(
            @PathVariable UUID transactionId
    ) {
        List<TransactionDetailResponse> result =
                transactionService.getTransactionBookingsByTransactionId(transactionId);

        return ApiResponse.<List<TransactionDetailResponse>>builder()
                .message("Get transaction details successfully")
                .result(result)
                .build();
    }

    // find transactions by booking id
    @GetMapping("/booking/{bookingId}")
    public ApiResponse<List<TransactionResponse>> getTransactionsByBookingId(
            @PathVariable UUID bookingId
    ) {
        return ApiResponse.<List<TransactionResponse>>builder()
                .message("Get transactions by booking id successfully")
                .result(transactionService.getTransactionsByBookingId(bookingId))
                .build();
    }

}
