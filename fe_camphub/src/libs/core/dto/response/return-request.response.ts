import { ReasonReturnType, ReturnRequestStatus } from "@/libs/core/constants";
import { MediaResource } from "../../types";

export interface ReturnReqResponse {
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
