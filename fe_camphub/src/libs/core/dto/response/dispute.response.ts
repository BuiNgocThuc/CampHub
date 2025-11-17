import { DisputeDecision, DisputeStatus } from "@/libs/core/constants";
import { MediaResource } from "../../types";

export interface DisputeResponse {
    id: string;                 // UUID
    bookingId: string;          // UUID
    reporterId: string;         // UUID
    defenderId: string;         // UUID
    adminId: string | null;     // backend có thể null

    reporterName: string;      // fullname của người báo cáo
    defenderName: string;      // fullname của người bị báo cáo
    adminName: string | null;  // fullname của admin xử lý

    description: string;
    evidenceUrls: MediaResource[];
    damageTypeId: string;
    damageTypeName: string;
    compensationRate: number | null;
    status: DisputeStatus;
    adminDecision: DisputeDecision;
    compensationAmount: number | null;
    adminNote: string;

    createdAt: string;          // ISO datetime
    resolvedAt: string | null;  // ISO datetime
}
