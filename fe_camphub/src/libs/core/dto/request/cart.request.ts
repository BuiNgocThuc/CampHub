export interface CartItemCreationRequest {
    itemId: string;     // UUID
    quantity: number;
    rentalDays: number;
    price: number;      // BigDecimal → number
}

export interface CartItemDeleteRequest {
    cartItemIds: string[]; // UUID list
}

export interface CartItemPatchRequest {
    quantity?: number;
    rentalDays?: number;
}

export interface CartItemUpdateRequest {
    quantity: number;
    rentalDays: number;
}

