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
PojosMetadataMap.create<Transaction>("Transaction", {});
PojosMetadataMap.create<TransactionResponse>("TransactionResponse", {});
PojosMetadataMap.create<TransactionBooking>("TransactionBooking", {});
PojosMetadataMap.create<TransactionDetailResponse>("TransactionDetailResponse", {});

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
