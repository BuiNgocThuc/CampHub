// cart-item.mapper.ts
import { createMapper, createMap, forMember, mapFrom } from '@automapper/core';
import { pojos, PojosMetadataMap } from '@automapper/pojos';

import { CartItem } from '../types';
import {
    CartItemCreationRequest,
    CartItemPatchRequest,
    CartItemUpdateRequest,
    CartItemDeleteRequest
} from '../dto/request';
import { CartItemResponse } from '../dto/response';

// ========================================================
// Create mapper
// ========================================================
export const cartItemMapper = createMapper({
    strategyInitializer: pojos(),
});

// ========================================================
// Metadata (simple, all optional)
// ========================================================
PojosMetadataMap.create<CartItem>('CartItem', {
    id: String,
    cartId: String,
    itemId: String,

    itemName: String,
    itemImage: String,

    depositAmount: Number,
    isAvailable: Boolean,

    quantity: Number,
    rentalDays: Number,
    price: Number,
    subtotal: Number,
});

PojosMetadataMap.create<CartItemResponse>('CartItemResponse', {
    id: String,
    cartId: String,
    itemId: String,

    itemName: String,
    itemImage: String,

    depositAmount: Number,

    quantity: Number,
    rentalDays: Number,
    price: Number,
    subtotal: Number,

    isAvailable: Boolean,
});

PojosMetadataMap.create<CartItemCreationRequest>('CartItemCreationRequest', {
    itemId: String,
    quantity: Number,
    rentalDays: Number,
    price: Number,
});

PojosMetadataMap.create<CartItemPatchRequest>('CartItemPatchRequest', {
    quantity: Number,
    rentalDays: Number,
});

PojosMetadataMap.create<CartItemUpdateRequest>('CartItemUpdateRequest', {
    quantity: Number,
    rentalDays: Number,
});

PojosMetadataMap.create<CartItemDeleteRequest>('CartItemDeleteRequest', {
    cartItemIds: Array,
});


// ========================================================
// 1) ResponseDTO → Model
// ========================================================
createMap<CartItemResponse, CartItem>(
    cartItemMapper,
    'CartItemResponse',
    'CartItem'
);


// ========================================================
// 2) Model → CreationRequest
// FE không được gửi price/subtotal
// ========================================================
createMap<CartItem, CartItemCreationRequest>(
    cartItemMapper,
    'CartItem',
    'CartItemCreationRequest',
    forMember(d => d.itemId, mapFrom(s => s.itemId)),
    forMember(d => d.quantity, mapFrom(s => s.quantity)),
    forMember(d => d.rentalDays, mapFrom(s => s.rentalDays)),
    forMember(d => d.price, mapFrom(s => s.price)) // backend yêu cầu price → FE gửi price
);


// ========================================================
// 3) Model → PatchRequest (chỉ update partial)
// ========================================================
createMap<CartItem, CartItemPatchRequest>(
    cartItemMapper,
    'CartItem',
    'CartItemPatchRequest'
);


// ========================================================
// 4) Model → UpdateRequest (full fields cần update)
// ========================================================
createMap<CartItem, CartItemUpdateRequest>(
    cartItemMapper,
    'CartItem',
    'CartItemUpdateRequest'
);


// ========================================================
// cartItemMap API – easy to use
// ========================================================
export const cartItemMap = {
    /** ResponseDTO → Model */
    fromResponse(dto: CartItemResponse): CartItem {
        return cartItemMapper.map(dto, 'CartItemResponse', 'CartItem');
    },

    /** Model → CreationRequest */
    toCreationRequest(model: CartItem): CartItemCreationRequest {
        return cartItemMapper.map(model, 'CartItem', 'CartItemCreationRequest');
    },

    /** Model → UpdateRequest */
    toUpdateRequest(model: CartItem): CartItemUpdateRequest {
        return cartItemMapper.map(model, 'CartItem', 'CartItemUpdateRequest');
    },

    /** Model → PatchRequest */
    toPatchRequest(model: Partial<CartItem>): CartItemPatchRequest {
        return cartItemMapper.map(model as CartItem, 'CartItem', 'CartItemPatchRequest');
    },

    /** List IDs → DeleteRequest */
    toDeleteRequest(ids: string[]): CartItemDeleteRequest {
        return { cartItemIds: ids };
    }
};
