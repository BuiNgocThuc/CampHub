import { MediaResource } from "../../types";

export interface AdminReviewDisputeRequest {
    disputeId: string;   // UUID
    isApproved: boolean; // true = đồng ý bồi thường
    adminNote?: string;
}
export interface DisputeCreationRequest {
    bookingId: string;      // UUID
    damageTypeId: string;   // UUID
    note?: string;
    evidenceUrls: MediaResource[];
}
