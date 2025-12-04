import { api } from "@/libs/configuration";
import { CartItem } from "../core/types";
import {
    CartItemResponse,
    ApiResponse
} from "../core/dto/response";
import {
    CartItemCreationRequest,
    CartItemUpdateRequest,
    CartItemPatchRequest,
    CartItemDeleteRequest
} from "../core/dto/request";
import { cartItemMap } from "../core/mapping";

// Add item to cart
export const addItemToCart = async (request: CartItemCreationRequest): Promise<CartItem> => {
    try {
        const response = await api.post<ApiResponse<CartItemResponse>>("/cart/items", request);
        return cartItemMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Update cart item (PUT)
export const updateCartItem = async (request: CartItemUpdateRequest, cartItemId: string): Promise<CartItem> => {
    try {
        const response = await api.put<ApiResponse<CartItemResponse>>(
            `/cart/items/${cartItemId}`,
            request
        );
        return cartItemMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};


// Patch cart item (PATCH)
export const patchCartItem = async (request: CartItemPatchRequest, cartItemId: string): Promise<CartItem> => {
    try {
        const response = await api.patch<ApiResponse<CartItemResponse>>(
            `/cart/items/${cartItemId}`,
            request
        );
        return cartItemMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};


// Remove multiple cart items
export const removeMultipleCartItems = async (request: CartItemDeleteRequest): Promise<ApiResponse<void>> => {
    try {
        const response = await api.delete<ApiResponse<void>>("/cart/items", { data: request });
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Remove single cart item
export const removeCartItem = async (cartItemId: string): Promise<ApiResponse<void>> => {
    try {
        const response = await api.delete<ApiResponse<void>>(`/cart/items/${cartItemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Clear cart
export const clearCart = async (): Promise<ApiResponse<void>> => {
    try {
        const response = await api.delete<ApiResponse<void>>("/cart/clear");
        return response.data;
    } catch (error) {
        throw error;
    }
};


// Get all cart items
export const getCartItems = async (): Promise<CartItem[]> => {
    try {
        const response = await api.get<ApiResponse<CartItemResponse[]>>("/cart/items");
        return response.data.result.map(cartItemMap.fromResponse);
    } catch (error) {
        throw error;
    }
};


// get count of cart items
export const getCountOfCartItems = async (): Promise<number> => {
    try {
        const response = await api.get<ApiResponse<number>>("/cart/items/count");
        return response.data.result;
    } catch (error) {
        throw error;
    }
};

// Validate quantity for a cart item
export const validateQuantity = async (cartItemId: string, quantity: number): Promise<boolean> => {
    try {
        const response = await api.get<ApiResponse<boolean>>(
            `/cart/items/${cartItemId}/validate-quantity`,
            { params: { quantity } }
        );
        return response.data.result;
    } catch (error) {
        throw error;
    }
};
