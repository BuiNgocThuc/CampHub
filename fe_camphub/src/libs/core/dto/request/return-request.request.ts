import { ReasonReturnType } from "../../constants";
import { MediaResource } from "../../types";

export interface AdminDecisionRequest {
    returnRequestId: string;
    isApproved: boolean;
    adminNote?: string;
}
export interface LesseeSubmitReturnRequest {
    returnRequestId: string;
    note?: string;
    packingMediaUrls: MediaResource[];
}

export interface LessorConfirmReturnRequest {
    bookingId: string;
}

export interface ReturnReqCreationRequest {
    bookingId: string;
    reason: ReasonReturnType;
    note?: string;
    evidenceUrls: MediaResource[];
}