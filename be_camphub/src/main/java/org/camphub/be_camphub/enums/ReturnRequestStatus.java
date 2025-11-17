package org.camphub.be_camphub.enums;

public enum ReturnRequestStatus {
    PENDING, // waiting for lessor confirmation
    PROCESSING, // waiting for admin review
    APPROVED, // admin accepted the reason (refund issued)
    REJECTED, // admin rejected the reason
    AUTO_REFUNDED, // system auto-refund after 72h
    RESOLVED, // final state after admin review and refund done
    CLOSED_BY_DISPUTE // final state when a dispute is opened
}
