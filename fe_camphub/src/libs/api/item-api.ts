// itemApi.ts
import { api } from "@/libs/configuration";
import {
    ItemCreationRequest,
    ItemUpdateRequest,
    ItemPatchRequest,
} from "../core/dto/request";
import { ApiResponse, ItemResponse } from "../core/dto/response";

// Create item (owner)
export const createItem = async (
    request: ItemCreationRequest
): Promise<ApiResponse<ItemResponse>> => {
    try {
        const response = await api.post<ApiResponse<ItemResponse>>(
            "/items",
            request
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get item by ID
export const getItemById = async (id: string): Promise<ApiResponse<ItemResponse>> => {
    try {
        const response = await api.get<ApiResponse<ItemResponse>>(`/items/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Get all items with optional filters
export const getAllItems = async (
    status?: string,
    categoryId?: string
): Promise<ApiResponse<ItemResponse[]>> => {
    try {
        const params: Record<string, any> = {};
        if (status) params.status = status;
        if (categoryId) params.categoryId = categoryId;

        const response = await api.get<ApiResponse<ItemResponse[]>>("/items", { params });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Update item (owner)
export const updateItem = async (
    id: string,
    request: ItemUpdateRequest
): Promise<ApiResponse<ItemResponse>> => {
    try {
        const response = await api.put<ApiResponse<ItemResponse>>(`/items/${id}`, request);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Patch item (owner)
export const patchItem = async (
    id: string,
    request: ItemPatchRequest
): Promise<ApiResponse<ItemResponse>> => {
    try {
        const response = await api.patch<ApiResponse<ItemResponse>>(`/items/${id}`, request);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Delete item (owner)
export const deleteItem = async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await api.delete<ApiResponse<void>>(`/items/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Admin approve/reject item
export const approveItem = async (
    id: string,
    isApproved: boolean
): Promise<ApiResponse<ItemResponse>> => {
    try {
        const response = await api.put<ApiResponse<ItemResponse>>(
            `/items/${id}/approve`,
            null,
            { params: { isApproved } }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Admin lock/unlock item
export const lockItem = async (
    id: string,
    isLocked: boolean
): Promise<ApiResponse<ItemResponse>> => {
    try {
        const response = await api.put<ApiResponse<ItemResponse>>(
            `/items/${id}/lock`,
            null,
            { params: { isLocked } }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};
