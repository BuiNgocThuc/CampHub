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
PojosMetadataMap.create<CartItem>('CartItem', {});
PojosMetadataMap.create<CartItemResponse>('CartItemResponse', {});
PojosMetadataMap.create<CartItemCreationRequest>('CartItemCreationRequest', {});
PojosMetadataMap.create<CartItemPatchRequest>('CartItemPatchRequest', {});
PojosMetadataMap.create<CartItemUpdateRequest>('CartItemUpdateRequest', {});
PojosMetadataMap.create<CartItemDeleteRequest>('CartItemDeleteRequest', {});


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
        return cartItemMapper.map(dto, 'CartItem', 'CartItemResponse');
    },

    /** Model → CreationRequest */
    toCreationRequest(model: CartItem): CartItemCreationRequest {
        return cartItemMapper.map(model, 'CartItemCreationRequest', 'CartItem');
    },

    /** Model → UpdateRequest */
    toUpdateRequest(model: CartItem): CartItemUpdateRequest {
        return cartItemMapper.map(model, 'CartItemUpdateRequest', 'CartItem');
    },

    /** Model → PatchRequest */
    toPatchRequest(model: Partial<CartItem>): CartItemPatchRequest {
        return cartItemMapper.map(model, 'CartItemPatchRequest', 'CartItem');
    },

    /** List IDs → DeleteRequest */
    toDeleteRequest(ids: string[]): CartItemDeleteRequest {
        return { cartItemIds: ids };
    }
};
