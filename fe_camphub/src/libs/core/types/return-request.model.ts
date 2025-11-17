import { ReasonReturnType, ReturnRequestStatus } from "../constants";
import { MediaResource } from "./media-resource.model";

export interface ReturnRequest {
    id: string;
    bookingId: string;
    lesseeId: string;
    lessorId: string;

    itemName: string;
    lesseeName: string;
    lessorName: string;

    reason: ReasonReturnType;
    evidenceUrls: MediaResource[];
    status: ReturnRequestStatus;
    note?: string;
    adminNote?: string;
    createdAt: string;
    resolvedAt?: string;
    lessorConfirmAt?: string;
    adminReviewedAt?: string;
    refundedAt?: string;
}
