import { createMap, createMapper } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { DamageType } from "../types";
import { DamageTypeCreationRequest, DamageTypePatchRequest, DamageTypeUpdateRequest } from "../dto/request";
import { DamageTypeResponse } from "../dto/response";

export const damageTypeMapper = createMapper({
    strategyInitializer: pojos(),
});

PojosMetadataMap.create<DamageType>("DamageType", {});
PojosMetadataMap.create<DamageTypeCreationRequest>("DamageTypeCreationRequest", {});
PojosMetadataMap.create<DamageTypeUpdateRequest>("DamageTypeUpdateRequest", {});
PojosMetadataMap.create<DamageTypePatchRequest>("DamageTypePatchRequest", {});
PojosMetadataMap.create<DamageTypeResponse>("DamageTypeResponse", {});

// Mapping DTO response to Model
createMap<DamageTypeResponse, DamageType>(
    damageTypeMapper,
    "DamageTypeResponse",
    "DamageType"
);

// Mapping Model to Creation Request DTO
createMap<DamageType, DamageTypeCreationRequest>(
    damageTypeMapper,
    "DamageType",
    "DamageTypeCreationRequest"
);

// Mapping Model to Update Request DTO
createMap<DamageType, DamageTypeUpdateRequest>(
    damageTypeMapper,
    "DamageType",
    "DamageTypeUpdateRequest"
);

// Mapping Model to Patch Request DTO
createMap<DamageType, DamageTypePatchRequest>(
    damageTypeMapper,
    "DamageType",
    "DamageTypePatchRequest"
);

// export API
export const damageTypeMap = {
    fromResponse: (response: DamageTypeResponse): DamageType => damageTypeMapper.map<DamageTypeResponse, DamageType>(response, "DamageTypeResponse", "DamageType"),
    toCreationRequest: (model: DamageType): DamageTypeCreationRequest => damageTypeMapper.map<DamageType, DamageTypeCreationRequest>(model, "DamageType", "DamageTypeCreationRequest"),
    toUpdateRequest: (model: DamageType): DamageTypeUpdateRequest => damageTypeMapper.map<DamageType, DamageTypeUpdateRequest>(model, "DamageType", "DamageTypeUpdateRequest"),
    toPatchRequest: (model: DamageType): DamageTypePatchRequest => damageTypeMapper.map<DamageType, DamageTypePatchRequest>(model, "DamageType", "DamageTypePatchRequest"),
};