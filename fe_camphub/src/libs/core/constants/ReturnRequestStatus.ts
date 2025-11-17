export enum ReturnRequestStatus {
    PENDING = "PENDING", // waiting for admin review
    APPROVED = "APPROVED", // admin accepted the reason (refund issued)
    REJECTED = "REJECTED", // admin rejected the reason
}