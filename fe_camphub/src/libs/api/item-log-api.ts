import { ApiResponse, ItemLogsResponse } from "../core/dto/response";
import { api } from '../configuration';

// Lấy tất cả logs
export const getAllItemLogs = async (): Promise<ApiResponse<ItemLogsResponse[]>> => {
    try {
        const response = await api.get<ApiResponse<ItemLogsResponse[]>>("/item-logs");
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Lấy logs theo itemId
export const getItemLogsByItemId = async (itemId: string): Promise<ApiResponse<ItemLogsResponse[]>> => {
    try {
        const response = await api.get<ApiResponse<ItemLogsResponse[]>>(`/item_logs/item/${itemId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Lấy logs theo accountId
export const getItemLogsByAccountId = async (accountId: string): Promise<ApiResponse<ItemLogsResponse[]>> => {
    try {
        const response = await api.get<ApiResponse<ItemLogsResponse[]>>(`/item_logs/account/${accountId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};