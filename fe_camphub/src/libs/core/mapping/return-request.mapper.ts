// return-request.mapper.ts
import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { ReturnRequest } from "../types";
import {
    ReturnReqCreationRequest,
    AdminDecisionRequest,
    LesseeSubmitReturnRequest,
    LessorConfirmReturnRequest
} from "../dto/request";
import { ReturnReqResponse } from "../dto/response";

// ------------------------
// 1. Tạo mapper
// ------------------------
export const returnRequestMapper = createMapper({
    strategyInitializer: pojos(),
});

// ------------------------
// 2. Metadata
// ------------------------
PojosMetadataMap.create<ReturnRequest>("ReturnRequest", {
    id: String,
    bookingId: String,
    lesseeId: String,
    lessorId: String,

    itemName: String,
    lesseeName: String,
    lessorName: String,

    reason: String,
    evidenceUrls: Array,
    status: String,
    note: String,
    adminNote: String,
    createdAt: String,
    resolvedAt: String,
    lessorConfirmAt: String,
    adminReviewedAt: String,
    refundedAt: String,
});
PojosMetadataMap.create<ReturnReqResponse>("ReturnReqResponse", {
    id: String,
    bookingId: String,
    lesseeId: String,
    lessorId: String,

    itemName: String,
    lesseeName: String,
    lessorName: String,

    reason: String,
    evidenceUrls: Array,
    status: String,
    note: String,
    adminNote: String,
    createdAt: String,
    resolvedAt: String,
    lessorConfirmAt: String,
    adminReviewedAt: String,
    refundedAt: String,
});
PojosMetadataMap.create<ReturnReqCreationRequest>("ReturnReqCreationRequest", {
    bookingId: String,
    reason: String,
    note: String,
    evidenceUrls: Array,
});
PojosMetadataMap.create<AdminDecisionRequest>("AdminDecisionRequest", {
    returnRequestId: String,
    isApproved: Boolean,
    adminNote: String,
});
PojosMetadataMap.create<LesseeSubmitReturnRequest>("LesseeSubmitReturnRequest", {
    returnRequestId: String,
    note: String,
    packingMediaUrls: Array,
});
PojosMetadataMap.create<LessorConfirmReturnRequest>("LessorConfirmReturnRequest", {
    bookingId: String,
});

// ------------------------
// 3. Mapping DTO response → Model
// ------------------------
createMap<ReturnReqResponse, ReturnRequest>(
    returnRequestMapper,
    "ReturnReqResponse",
    "ReturnRequest"
);

// ------------------------
// 4. Mapping Model → Creation Request DTO
// ------------------------
createMap<ReturnRequest, ReturnReqCreationRequest>(
    returnRequestMapper,
    "ReturnRequest",
    "ReturnReqCreationRequest",
);

// ------------------------
// 5. Mapping Model → Patch / Update Requests (Admin, Lessee, Lessor)
// ------------------------
createMap<ReturnRequest, AdminDecisionRequest>(
    returnRequestMapper,
    "ReturnRequest",
    "AdminDecisionRequest",
    // map adminNote mặc định nếu null
);

createMap<ReturnRequest, LesseeSubmitReturnRequest>(
    returnRequestMapper,
    "ReturnRequest",
    "LesseeSubmitReturnRequest",
    forMember(d => d.packingMediaUrls, mapFrom(s => s.evidenceUrls || []))
);

createMap<ReturnRequest, LessorConfirmReturnRequest>(
    returnRequestMapper,
    "ReturnRequest",
    "LessorConfirmReturnRequest",
    forMember(d => d.bookingId, mapFrom(s => s.bookingId))
);

// ------------------------
// 6. Export API
// ------------------------
export const returnRequestMap = {
    fromResponse: (response: ReturnReqResponse): ReturnRequest =>
        returnRequestMapper.map<ReturnReqResponse, ReturnRequest>(
            response,
            "ReturnReqResponse",
            "ReturnRequest"
        ),
    toCreationRequest: (model: ReturnRequest): ReturnReqCreationRequest =>
        returnRequestMapper.map<ReturnRequest, ReturnReqCreationRequest>(
            model,
            "ReturnRequest",
            "ReturnReqCreationRequest"
        ),
    toAdminDecisionRequest: (model: ReturnRequest): AdminDecisionRequest =>
        returnRequestMapper.map<ReturnRequest, AdminDecisionRequest>(
            model,
            "ReturnRequest",
            "AdminDecisionRequest"
        ),
    toLesseeSubmitRequest: (model: ReturnRequest): LesseeSubmitReturnRequest =>
        returnRequestMapper.map<ReturnRequest, LesseeSubmitReturnRequest>(
            model,
            "ReturnRequest",
            "LesseeSubmitReturnRequest"
        ),
    toLessorConfirmRequest: (model: ReturnRequest): LessorConfirmReturnRequest =>
        returnRequestMapper.map<ReturnRequest, LessorConfirmReturnRequest>(
            model,
            "ReturnRequest",
            "LessorConfirmReturnRequest"
        ),
};
