export interface ExtensionReqCreationRequest {
    bookingId: string;
    additionalDays: number;
    note?: string;
}

export interface ExtensionResponseRequest { // chủ thuê phản hồi yêu cầu gia hạn
    requestId: string;
    note?: string;
}