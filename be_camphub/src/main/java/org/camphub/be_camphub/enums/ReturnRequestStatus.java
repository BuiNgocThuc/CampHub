package org.camphub.be_camphub.enums;

public enum ReturnRequestStatus {
    PROCESSING, // waiting for admin review
    APPROVED, // admin accepted the reason (refund issued)
    REJECTED, // admin rejected the reason
    AUTO_REFUNDED, // system auto-refund after 72h
    RESOLVED // final state after admin review and refund done
}
