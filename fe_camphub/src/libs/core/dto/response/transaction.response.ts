import { TransactionStatus, TransactionType } from "@/libs/core/constants";

export interface TransactionResponse {
    id: string;
    fromAccountId: string;
    toAccountId: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    createdAt: string;

    senderName: string;
    receiverName: string;
}


export interface TransactionDetailResponse {
    transactionId: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    createdAt: string;

    // Booking info
    bookingId: string;
    itemId: string;        // item liên quan
    itemName: string;    // tên item
    lesseeId: string;      // người thuê
    lessorId: string;      // chủ thuê

    lesseeName: string;
    lessorName: string;
}