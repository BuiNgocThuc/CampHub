export enum TransactionType {
    RENTAL_PAYMENT = "RENTAL_PAYMENT", // payment made by renter when booking is approved
    REFUND_FULL = "REFUND_FULL", // refund when booking is rejected by owner
    RENTAL_PAYOUT = "RENTAL_PAYOUT", // payout to owner when rental is completed
    REFUND_DEPOSIT = "REFUND_DEPOSIT", // refund deposit amount when item is returned
    EXTENSION_PAYMENT = "EXTENSION_PAYMENT", // fee for extending rental period
    COMPENSATION_PAYOUT = "COMPENSATION_PAYOUT" // compensation for damages
}