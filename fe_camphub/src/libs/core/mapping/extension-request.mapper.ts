// src/libs/mappers/extension-request.mapper.ts
import { createMapper, createMap } from "@automapper/core";
import { PojosMetadataMap, pojos } from "@automapper/pojos";

import { ExtensionRequest } from "../types";
import { ExtensionReqResponse } from "../dto/response";
import {
    ExtensionReqCreationRequest,
    ExtensionResponseRequest
} from "../dto/request";

// ===============================
// Mapper init
// ===============================
export const extensionRequestMapper = createMapper({
    strategyInitializer: pojos(),
});

// ===============================
// Metadata declarations
// ===============================
PojosMetadataMap.create<ExtensionRequest>("ExtensionRequest", {});
PojosMetadataMap.create<ExtensionReqResponse>("ExtensionReqResponse", {});
PojosMetadataMap.create<ExtensionReqCreationRequest>("ExtensionReqCreationRequest", {});
PojosMetadataMap.create<ExtensionResponseRequest>("ExtensionResponseRequest", {});

// ===============================
// Mapping: DTO Response → Model
// ===============================
createMap<ExtensionReqResponse, ExtensionRequest>(
    extensionRequestMapper,
    "ExtensionReqResponse",
    "ExtensionRequest"
);

// ===============================
// Mapping: Model → CreationRequest DTO
// ===============================
createMap<ExtensionRequest, ExtensionReqCreationRequest>(
    extensionRequestMapper,
    "ExtensionRequest",
    "ExtensionReqCreationRequest"
);

// ===============================
// Mapping: Model → ResponseRequest DTO
// (lessor phản hồi gia hạn)
// ===============================
createMap<ExtensionRequest, ExtensionResponseRequest>(
    extensionRequestMapper,
    "ExtensionRequest",
    "ExtensionResponseRequest"
);

// ===============================
// Export API
// ===============================
export const extensionRequestMap = {
    fromResponse: (response: ExtensionReqResponse): ExtensionRequest =>
        extensionRequestMapper.map<ExtensionReqResponse, ExtensionRequest>(
            response,
            "ExtensionReqResponse",
            "ExtensionRequest"
        ),

    toCreationRequest: (model: ExtensionRequest): ExtensionReqCreationRequest =>
        extensionRequestMapper.map<ExtensionRequest, ExtensionReqCreationRequest>(
            model,
            "ExtensionRequest",
            "ExtensionReqCreationRequest"
        ),

    toResponseRequest: (model: ExtensionRequest): ExtensionResponseRequest =>
        extensionRequestMapper.map<ExtensionRequest, ExtensionResponseRequest>(
            model,
            "ExtensionRequest",
            "ExtensionResponseRequest"
        ),
};
