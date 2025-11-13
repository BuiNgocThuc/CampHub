import { ReasonReturnType, ReturnRequestStatus } from "../constants";
import { MediaResource } from "./MediaResource";

export interface ReturnRequest {
    id: string;
    bookingId: string;
    lesseeId: string;
    lessorId: string;
    reason: ReasonReturnType;       // lý do trả đồ
    evidenceUrls?: MediaResource[]; // minh chứng
    status: ReturnRequestStatus;
    note?: string | null;
    adminNote?: string | null;
    createdAt: string;
    updatedAt: string;
    resolvedAt?: string | null;
}
