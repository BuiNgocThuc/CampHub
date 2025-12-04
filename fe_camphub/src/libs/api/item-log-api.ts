import { ApiResponse, ItemLogsResponse } from "../core/dto/response";
import { api } from '../configuration';
import { ItemLog } from "../core/types";
import { itemLogMap } from "../core/mapping/item-log.mapper";

// Lấy tất cả logs
export const getAllItemLogs = async (): Promise<ItemLog[]> => {
    try {
        const response = await api.get<ApiResponse<ItemLogsResponse[]>>("/item-logs");
        return response.data.result.map(itemLogMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Lấy logs theo itemId
export const getItemLogsByItemId = async (itemId: string): Promise<ItemLog[]> => {
    try {
        const response = await api.get<ApiResponse<ItemLogsResponse[]>>(`/item_logs/item/${itemId}`);
        return response.data.result.map(itemLogMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Lấy logs theo accountId
export const getItemLogsByAccountId = async (accountId: string): Promise<ItemLog[]> => {
    try {
        const response = await api.get<ApiResponse<ItemLogsResponse[]>>(`/item_logs/account/${accountId}`);
        return response.data.result.map(itemLogMap.fromResponse);
    } catch (error) {
        throw error;
    }
};