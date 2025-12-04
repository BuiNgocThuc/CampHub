// returnRequestApi.ts
import { api } from "@/libs/configuration";
import { ApiResponse, ReturnReqResponse } from "../core/dto/response";
import {
    ReturnReqCreationRequest,
    LesseeSubmitReturnRequest,
    LessorConfirmReturnRequest,
    AdminDecisionRequest,
} from "../core/dto/request";
import { ReturnRequest } from "../core/types";
import { returnRequestMap } from "../core/mapping/return-request.mapper";

// Lessee tạo yêu cầu trả hàng
export const createReturnRequest = async (
    request: ReturnReqCreationRequest
): Promise<ReturnRequest> => {
    try {
        const response = await api.post<ApiResponse<ReturnReqResponse>>("/return-requests/create", request);
        return returnRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Lessee submit return (gửi bằng chứng + xác nhận gửi hàng)
export const lesseeSubmitReturn = async (
    request: LesseeSubmitReturnRequest
): Promise<ReturnRequest> => {
    try {
        const response = await api.post<ApiResponse<ReturnReqResponse>>("/return-requests/lessee/submit-return", request);
        return returnRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Lessor confirm returned item
export const lessorConfirmReturnForReturnRequest = async (
    request: LessorConfirmReturnRequest
): Promise<ReturnRequest> => {
    try {
        const response = await api.post<ApiResponse<ReturnReqResponse>>("/return-requests/lessor/confirm", request);
        return returnRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Admin phê duyệt hoặc từ chối hoàn tiền
export const adminDecisionOnReturnRequest = async (
    request: AdminDecisionRequest
): Promise<ReturnRequest> => {
    try {
        const response = await api.post<ApiResponse<ReturnReqResponse>>("/return-requests/admin/decision", request);
        return returnRequestMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Lấy danh sách pending return requests (admin)
export const getPendingReturnRequests = async (): Promise<ReturnRequest[]> => {
    try {
        const response = await api.get<ApiResponse<ReturnReqResponse[]>>("/return-requests/pending");
        return response.data.result.map(returnRequestMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

export const getReturnRequestById = async (requestId: string): Promise<ReturnRequest> => {
    const response = await api.get<ApiResponse<ReturnReqResponse>>(`/return-requests/${requestId}`);
    return returnRequestMap.fromResponse(response.data.result);
}