// src/libs/mappers/item.mapper.ts
import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";

import { Item } from "../types";
import {
    ItemCreationRequest,
    ItemPatchRequest,
    ItemUpdateRequest,
} from "../dto/request/item.request";
import { ItemResponse } from "../dto/response/item.response";

export const itemMapper = createMapper({
    strategyInitializer: pojos(),
});

const defineMetadata = () => {
    // Item model
    PojosMetadataMap.create<Item>("Item", {
        id: String,
        ownerId: String,
        categoryId: String,
        ownerName: String,
        categoryName: String,
        name: String,
        description: String,
        price: Number,
        quantity: Number,
        depositAmount: Number,
        status: String,
        mediaUrls: Array,
    });

    // DTOs
    PojosMetadataMap.create<ItemResponse>("ItemResponse", {
        id: String,
        ownerId: String,
        categoryId: String,
        ownerName: String,
        categoryName: String,
        name: String,
        description: String,
        price: Number,
        quantity: Number,
        depositAmount: Number,
        status: String,
        mediaUrls: Array,
    });

    PojosMetadataMap.create<ItemCreationRequest>("ItemCreationRequest", {
        name: String,
        ownerId: String,
        categoryId: String,
        description: String,
        pricePerDay: Number,
        quantity: Number,
        depositAmount: Number,
        mediaUrls: Array,
    });

    PojosMetadataMap.create<ItemUpdateRequest>("ItemUpdateRequest", {
        name: String,
        categoryId: String,
        description: String,
        pricePerDay: Number,
        depositAmount: Number,
        quantity: Number,
        mediaUrls: Array,
    });

    PojosMetadataMap.create<ItemPatchRequest>("ItemPatchRequest", {
        name: String,
        categoryId: String,
        description: String,
        pricePerDay: Number,
        quantity: Number,
        depositAmount: Number,
        mediaUrls: Array,
    });
};

defineMetadata();

// =============================
// Mapping: ItemResponse → Item (gần giống nhau → map tự động)
// =============================
createMap<ItemResponse, Item>(
    itemMapper,
    "ItemResponse",
    "Item"
    // Không cần forMember vì các field giống hệt
);

// =============================
// Mapping: Item → CreationRequest (price → pricePerDay)
// =============================
createMap<Item, ItemCreationRequest>(
    itemMapper,
    "Item",
    "ItemCreationRequest",
    forMember(
        (d) => d.pricePerDay,
        mapFrom((s) => s.price)
    ),
    forMember(
        (d) => d.ownerId,
        mapFrom((s) => s.ownerId)
    ),
    forMember(
        (d) => d.categoryId,
        mapFrom((s) => s.categoryId)
    )
);

// =============================
// Mapping: Item → UpdateRequest
// =============================
createMap<Item, ItemUpdateRequest>(
    itemMapper,
    "Item",
    "ItemUpdateRequest",
    forMember(
        (d) => d.pricePerDay,
        mapFrom((s) => s.price)
    )
);

// =============================
// Mapping: Item → PatchRequest (chỉ map những field có giá trị)
// =============================
createMap<Item, ItemPatchRequest>(
    itemMapper,
    "Item",
    "ItemPatchRequest",
    forMember(
        (d) => d.pricePerDay,
        mapFrom((s) => s.price)
    ),
    // Các field khác sẽ tự động map nếu có giá trị, null/undefined sẽ bị bỏ
);

// =============================
// Export API tiện dụng
// =============================
export const mapItem = {
    fromResponse: (dto: ItemResponse): Item =>
        itemMapper.map<ItemResponse, Item>(dto, "ItemResponse", "Item"),

    toCreateDto: (item: Item): ItemCreationRequest =>
        itemMapper.map<Item, ItemCreationRequest>(item, "Item", "ItemCreationRequest"),

    toUpdateDto: (item: Item): ItemUpdateRequest =>
        itemMapper.map<Item, ItemUpdateRequest>(item, "Item", "ItemUpdateRequest"),

    toPatchDto: (item: Partial<Item>): ItemPatchRequest =>
        itemMapper.map<Item, ItemPatchRequest>(
            item as Item,
            "Item",
            "ItemPatchRequest"
        ),
};