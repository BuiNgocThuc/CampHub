import { createMap, createMapper } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { Transaction, TransactionBooking } from "../types";
import { TransactionResponse, TransactionDetailResponse } from "../dto/response";

// ------------------------
// Mapper
// ------------------------
export const transactionMapper = createMapper({
    strategyInitializer: pojos(),
});

// ------------------------
// Metadata
// ------------------------
PojosMetadataMap.create<Transaction>("Transaction", {
    id: String,
    fromAccountId: String,
    toAccountId: String,
    amount: Number,
    type: String,
    status: String,
    createdAt: String,
    senderName: String,
    receiverName: String,
});
PojosMetadataMap.create<TransactionResponse>("TransactionResponse", {
    id: String,
    fromAccountId: String,
    toAccountId: String,
    amount: Number,
    type: String,
    status: String,
    createdAt: String,
    senderName: String,
    receiverName: String,
});
PojosMetadataMap.create<TransactionBooking>("TransactionBooking", {
    transactionId: String,
    amount: Number,
    type: String,
    status: String,
    createdAt: String,

    bookingId: String,
    itemId: String,
    itemName: String,
    lesseeId: String,
    lessorId: String,

    lesseeName: String,
    lessorName: String,
});
PojosMetadataMap.create<TransactionDetailResponse>("TransactionDetailResponse", {
    transactionId: String,
    amount: Number,
    type: String,
    status: String,
    createdAt: String,

    bookingId: String,
    itemId: String,
    itemName: String,
    lesseeId: String,
    lessorId: String,

    lesseeName: String,
    lessorName: String,
});

// ------------------------
// Mapping: DTO response → Model
// ------------------------
createMap<TransactionResponse, Transaction>(
    transactionMapper,
    "TransactionResponse",
    "Transaction"
);

createMap<TransactionDetailResponse, TransactionBooking>(
    transactionMapper,
    "TransactionDetailResponse",
    "TransactionBooking"
);

// ------------------------
// Export API
// ------------------------
export const transactionMap = {
    fromResponse: (response: TransactionResponse): Transaction =>
        transactionMapper.map<TransactionResponse, Transaction>(
            response,
            "TransactionResponse",
            "Transaction"
        ),
    fromDetailResponse: (response: TransactionDetailResponse): TransactionBooking =>
        transactionMapper.map<TransactionDetailResponse, TransactionBooking>(
            response,
            "TransactionDetailResponse",
            "TransactionBooking"
        ),
};
