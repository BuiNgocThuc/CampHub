import { ExtensionStatus } from "../constants";

export interface ExtensionRequest {
    id: string;                    // UUID
    bookingId: string;
    lesseeId: string;
    lessorId: string;
    oldEndDate?: string | null;    // có thể null nếu chưa có endDate trước đó
    requestedNewEndDate: string;
    additionalFee: number;
    status: ExtensionStatus;
    note?: string | null;
    createdAt: string;
    updatedAt: string;
}
