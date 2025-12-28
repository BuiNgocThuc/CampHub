import { api } from "@/libs/configuration";
import { DamageType } from "../core/types";
import { ApiResponse, DamageTypeResponse } from "../core/dto/response";
import { DamageTypeCreationRequest, DamageTypeUpdateRequest, DamageTypePatchRequest } from "../core/dto/request";
import { damageTypeMap } from "../core/mapping";
import { log } from "console";

// -------------------- CREATE --------------------
export const createDamageType = async (damageType: DamageType): Promise<DamageType> => {
    const request: DamageTypeCreationRequest = damageTypeMap.toCreationRequest(damageType);
    try {
        const response = await api.post<ApiResponse<DamageTypeResponse>>("/damage-types", request);
        return damageTypeMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- UPDATE (PUT) --------------------
export const updateDamageType = async (damageType: DamageType): Promise<DamageType> => {
    const request: DamageTypeUpdateRequest = damageTypeMap.toUpdateRequest(damageType);
    try {
        const response = await api.put<ApiResponse<DamageTypeResponse>>(`/damage-types/${damageType.id}`, request);
        return damageTypeMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- PATCH --------------------
export const patchDamageType = async (damageType: DamageType): Promise<DamageType> => {
    const request: DamageTypePatchRequest = damageTypeMap.toPatchRequest(damageType);
    try {
        const response = await api.patch<ApiResponse<DamageTypeResponse>>(`/damage-types/${damageType.id}`, request);
        return damageTypeMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- DELETE --------------------
export const deleteDamageType = async (id: string): Promise<void> => {
    try {
        const response = await api.delete<ApiResponse<void>>(`/damage-types/${id}`);
        return response.data.result;
    } catch (error) {
        throw error;
    }
};

// -------------------- GET BY ID --------------------
export const getDamageTypeById = async (id: string): Promise<DamageType> => {
    try {
        const response = await api.get<ApiResponse<DamageTypeResponse>>(`/damage-types/${id}`);
        return damageTypeMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- GET ALL --------------------
export const getAllDamageTypes = async (): Promise<DamageType[]> => {
    try {
        const response = await api.get<ApiResponse<DamageTypeResponse[]>>(`/damage-types`);
        console.log(response);
        
        return response.data.result.map(damageTypeMap.fromResponse);
    } catch (error) {
        throw error;
    }
};
