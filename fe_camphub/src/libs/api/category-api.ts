import { api } from "@/libs/configuration";
import { Category } from "../core/types";
import { ApiResponse, CategoryResponse } from "../core/dto/response";
import { CategoryCreationRequest, CategoryUpdateRequest, CategoryPatchRequest } from "../core/dto/request";
import { categoryMap } from "../core/mapping";
import { log } from "console";

// -------------------- CREATE --------------------
export const createCategory = async (category: Category): Promise<Category> => {
    const request: CategoryCreationRequest = categoryMap.toCreationRequest(category);
    try {
        const response = await api.post<ApiResponse<CategoryResponse>>("/categories", request);
        return categoryMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- UPDATE (PUT) --------------------
export const updateCategory = async (category: Category): Promise<Category> => {
    const request: CategoryUpdateRequest = categoryMap.toUpdateRequest(category);
    try {
        const response = await api.put<ApiResponse<CategoryResponse>>(`/categories/${category.id}`, request);
        return categoryMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- PATCH --------------------
export const patchCategory = async (category: Category): Promise<Category> => {
    const request: CategoryPatchRequest = categoryMap.toPatchRequest(category);
    try {
        const response = await api.patch<ApiResponse<CategoryResponse>>(`/categories/${category.id}`, request);
        return categoryMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- DELETE --------------------
export const deleteCategory = async (id: string): Promise<void> => {
    try {
        const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
        return response.data.result;
    } catch (error) {
        throw error;
    }
};

// -------------------- GET BY ID --------------------
export const getCategoryById = async (id: string): Promise<Category> => {
    try {
        const response = await api.get<ApiResponse<CategoryResponse>>(`/categories/${id}`);
        return categoryMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- GET ALL --------------------
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const response = await api.get<ApiResponse<CategoryResponse[]>>(`/categories`);
        console.log(response.data.result);
        const res = response.data.result.map(categoryMap.fromResponse);
        console.log(res);
        
        return response.data.result.map(categoryMap.fromResponse);
    } catch (error) {
        throw error;
    }
};
