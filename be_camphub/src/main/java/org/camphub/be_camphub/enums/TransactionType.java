package org.camphub.be_camphub.enums;

public enum TransactionType {
    RENTAL_PAYMENT,
    REFUND_FULL, // refund when booking is rejected by owner
    RENTAL_PAYOUT, // payout to owner when rental is completed
    REFUND_DEPOSIT, // refund deposit amount when item is returned
    EXTENSION_PAYMENT,
    COMPENSATION_PAYOUT
}
