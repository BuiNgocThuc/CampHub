import { ExtensionStatus } from "../constants";

export interface ExtensionRequest {
    id: string;
    bookingId: string;
    lesseeId: string;
    lessorId: string;
    itemName: string;
    lesseeName: string; // fullname của người thuê
    lessorName: string; // fullname của người cho thuê
    oldEndDate: string;              // LocalDate → string
    requestedNewEndDate: string;     // LocalDate → string
    additionalFee: number;
    status: ExtensionStatus;
    note?: string;
    createdAt: string;
}
