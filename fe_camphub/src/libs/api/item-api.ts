// item-api.ts
import { api } from "@/libs/configuration";
import { ApiResponse, ItemResponse } from "../core/dto/response";
import { Item } from "../core/types";
import { mapItem } from "../core/mapping/item.mapper";

// Create item (owner)
export const createItem = async (
    item: Item
): Promise<Item> => {
    const request = mapItem.toCreateDto(item);
    try {
        const response = await api.post<ApiResponse<ItemResponse>>(
            "/items",
            request
        );
        
        return mapItem.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Get item by ID
export const getItemById = async (id: string): Promise<Item> => {
    const response = await api.get<ApiResponse<ItemResponse>>(`/items/${id}`);
    console.log(response.data.result);
    const ress = mapItem.fromResponse(response.data.result);
    console.log(ress);
    return mapItem.fromResponse(response.data.result);
};

// Get all items with optional filters
export const getAllItems = async (
    status?: string,
    categoryId?: string
): Promise<Item[]> => {
    try {
        const params: Record<string, any> = {};
        if (status) params.status = status;
        if (categoryId) params.categoryId = categoryId;

        const response = await api.get<ApiResponse<ItemResponse[]>>("/items", { params });
        return response.data.result.map(mapItem.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Update item (owner)
export const updateItem = async (
    item: Item
): Promise<Item> => {
    try {
        const request = mapItem.toUpdateDto(item);
        const response = await api.put<ApiResponse<ItemResponse>>(`/items/${item.id}`, request);
        return mapItem.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Patch item (owner)
export const patchItem = async (
    item: Partial<Item>
): Promise<Item> => {
    try {
        const request = mapItem.toPatchDto(item);
        const response = await api.patch<ApiResponse<ItemResponse>>(`/items/${item.id}`, request);
        return mapItem.fromResponse(response.data.result);
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
export const approveItem = async (id: string, isApproved: boolean): Promise<Item> => {
    const response = await api.put<ApiResponse<ItemResponse>>(
        `/items/${id}/approve`,
        null,
        { params: { isApproved } }
    );
    return mapItem.fromResponse(response.data.result);
};

export const lockItem = async (id: string, isLocked: boolean): Promise<Item> => {
    const response = await api.put<ApiResponse<ItemResponse>>(
        `/items/${id}/lock`,
        null,
        { params: { isLocked } }
    );
    return mapItem.fromResponse(response.data.result);
};

// Lấy danh sách item của user hiện tại
export const getMyItems = async (
    status?: string
): Promise<Item[]> => {
    const response = await api.get<ApiResponse<ItemResponse[]>>("/items/my", {
        params: { status },
    });
    return response.data.result.map(mapItem.fromResponse);
};
