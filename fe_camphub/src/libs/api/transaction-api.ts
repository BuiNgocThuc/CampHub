// transactionApi.ts
import { api } from "@/libs/configuration";
import { ApiResponse, TransactionDetailResponse, TransactionResponse } from "../core/dto/response";
import { Transaction, TransactionBooking } from "../core/types";
import { transactionMap } from "../core/mapping/transaction.mapper";

// Lấy tất cả transaction
export const getAllTransactions = async (): Promise<Transaction[]> => {
    try {
        const response = await api.get<ApiResponse<TransactionResponse[]>>("/transactions");
        return response.data.result.map(transactionMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Lấy transaction theo id
export const getTransactionById = async (
    transactionId: string
): Promise<Transaction> => {
    try {
        const response = await api.get<ApiResponse<TransactionResponse>>(`/transactions/${transactionId}`);
        return transactionMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Lấy chi tiết transaction theo transactionId
export const getTransactionDetailsByTxId = async (
    transactionId: string
): Promise<TransactionBooking[]> => {
    try {
        const response = await api.get<ApiResponse<TransactionDetailResponse[]>>(
            `/transactions/${transactionId}/details`
        );
        return response.data.result.map(transactionMap.fromDetailResponse);
    } catch (error) {
        throw error;
    }
};

// Lấy transaction theo bookingId
export const getTransactionsByBookingId = async (
    bookingId: string
): Promise<Transaction[]> => {
    try {
        const response = await api.get<ApiResponse<TransactionResponse[]>>(`/transactions/booking/${bookingId}`);
        return response.data.result.map(transactionMap.fromResponse);
    } catch (error) {
        throw error;
    }
};
