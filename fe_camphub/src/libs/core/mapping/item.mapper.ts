// src/libs/mappers/item.mapper.ts
import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { PojosMetadataMap, pojos } from "@automapper/pojos";

import { Item } from "../types";
import { ItemResponse } from "../dto/response";
import { ItemCreationRequest, ItemPatchRequest, ItemUpdateRequest } from "../dto/request";

// ===============================
// Mapper init
// ===============================
export const itemMapper = createMapper({
    strategyInitializer: pojos(),
});

// ===============================
// Metadata declarations
// ===============================
PojosMetadataMap.create<Item>("Item", {});
PojosMetadataMap.create<ItemResponse>("ItemResponse", {});
PojosMetadataMap.create<ItemCreationRequest>("ItemCreationRequest", {});
PojosMetadataMap.create<ItemUpdateRequest>("ItemUpdateRequest", {});
PojosMetadataMap.create<ItemPatchRequest>("ItemPatchRequest", {});

// ===============================
// Mapping: DTO Response → Model
// ===============================
createMap<ItemResponse, Item>(
    itemMapper,
    "ItemResponse",
    "Item"
);

// ===============================
// Mapping: Model → CreationRequest DTO
// ===============================
createMap<Item, ItemCreationRequest>(
    itemMapper,
    "Item",
    "ItemCreationRequest",
    forMember(
        (dest) => dest.pricePerDay,
        mapFrom((src) => src.price)
    ),
);

// ===============================
// Mapping: Model → UpdateRequest DTO
// ===============================
createMap<Item, ItemUpdateRequest>(
    itemMapper,
    "Item",
    "ItemUpdateRequest",
    forMember(
        (dest) => dest.pricePerDay,
        mapFrom((src) => src.price)
    ),
);

// ===============================
// Mapping: Model → PatchRequest DTO
// ===============================
createMap<Item, ItemPatchRequest>(
    itemMapper,
    "Item",
    "ItemPatchRequest",
    forMember(
        (dest) => dest.pricePerDay,
        mapFrom((src) => src.price)
    ),
);

// ===============================
// Export API
// ===============================
export const itemMap = {
    fromResponse: (response: ItemResponse): Item =>
        itemMapper.map<ItemResponse, Item>(
            response,
            "ItemResponse",
            "Item"
        ),

    toCreationRequest: (model: Item): ItemCreationRequest =>
        itemMapper.map<Item, ItemCreationRequest>(
            model,
            "Item",
            "ItemCreationRequest"
        ),

    toUpdateRequest: (model: Item): ItemUpdateRequest =>
        itemMapper.map<Item, ItemUpdateRequest>(
            model,
            "Item",
            "ItemUpdateRequest"
        ),

    toPatchRequest: (model: Item): ItemPatchRequest =>
        itemMapper.map<Item, ItemPatchRequest>(
            model,
            "Item",
            "ItemPatchRequest"
        ),
};
