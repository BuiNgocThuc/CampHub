// extensionReqApi.ts
import { api } from "@/libs/configuration";
import {
    ExtensionReqCreationRequest,
    ExtensionResponseRequest,
} from "../core/dto/request";
import { ApiResponse, ExtensionReqResponse } from "../core/dto/response";
import { ExtensionRequest } from "../core/types";
import { extensionRequestMap } from "../core/mapping/extension-request.mapper";

// Create extension request (lessee)
export const createExtensionRequest = async (
    request: ExtensionReqCreationRequest
): Promise<ExtensionRequest> => {
    try {
        const response = await api.post<ApiResponse<ExtensionReqResponse>>(
            "/extension-requests",
            request
        );
        return extensionRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Approve extension request (lessor)
export const approveExtensionRequest = async (
    request: ExtensionResponseRequest
): Promise<ExtensionRequest> => {
    try {
        const response = await api.post<ApiResponse<ExtensionReqResponse>>(
            "/extension-requests/approve",
            request
        );
        return extensionRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Reject extension request (lessor)
export const rejectExtensionRequest = async (
    request: ExtensionResponseRequest
): Promise<ExtensionRequest> => {
    try {
        const response = await api.post<ApiResponse<ExtensionReqResponse>>(
            "/extension-requests/reject",
            request
        );
        return extensionRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Cancel extension request (lessee)
export const cancelExtensionRequest = async (
    requestId: string
): Promise<ExtensionRequest> => {
    try {
        const response = await api.post<ApiResponse<ExtensionReqResponse>>(
            `/extension-requests/${requestId}/cancel`
        );
        return extensionRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};


// Get all extension requests (admin)
export const getAllExtensionRequests = async (params?: {
    status?: string;
    bookingId?: string;
    lesseeId?: string;
    lessorId?: string;
}): Promise<ExtensionRequest[]> => {
    const response = await api.get<ApiResponse<ExtensionReqResponse[]>>(
        "/extension-requests",
        { params }
    );
    return response.data.result.map(extensionRequestMap.fromResponse);
};

// Get extension request by id
export const getExtensionRequestById = async (
    requestId: string
): Promise<ExtensionRequest> => {
    const response = await api.get<ApiResponse<ExtensionReqResponse>>(
        `/extension-requests/${requestId}`
    );
    return extensionRequestMap.fromResponse(response.data.result);
};