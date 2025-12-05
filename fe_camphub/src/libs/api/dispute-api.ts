// dispute-api.ts
import { api } from "@/libs/configuration";
import { Dispute } from "../core/types";
import { ApiResponse, DisputeResponse } from "../core/dto/response";
import { disputeMap } from "../core/mapping";
import { DisputeCreationRequest, AdminReviewDisputeRequest } from "../core/dto/request";

// -------------------- CREATE DISPUTE --------------------
export const createDispute = async (request: DisputeCreationRequest): Promise<Dispute> => {
    try {
        const response = await api.post<ApiResponse<DisputeResponse>>(
            "/disputes/create",
            request
        );
        // ResponseDTO → Model
        return disputeMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- ADMIN REVIEW DISPUTE --------------------
export const adminReviewDispute = async (
    request: AdminReviewDisputeRequest
): Promise<Dispute> => {
    try {
        const response = await api.post<ApiResponse<DisputeResponse>>(
            "/disputes/admin-review",
            request
        );
        return disputeMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// -------------------- GET PENDING DISPUTES --------------------
export const getPendingDisputes = async (): Promise<Dispute[]> => {
    try {
        const response = await api.get<ApiResponse<DisputeResponse[]>>("/disputes/pending");
        return response.data.result.map(disputeMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

export const getDisputeById = async (disputeId: string): Promise<Dispute> => {
    const response = await api.get<ApiResponse<DisputeResponse>>(`/disputes/${disputeId}`);
    return disputeMap.fromResponse(response.data.result);
};

// get all disputes
export const getAllDisputes = async (): Promise<Dispute[]> => {
    const response = await api.get<ApiResponse<DisputeResponse[]>>("/disputes");
    return response.data.result.map(disputeMap.fromResponse);
};