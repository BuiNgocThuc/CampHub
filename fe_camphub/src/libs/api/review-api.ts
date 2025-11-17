// reviewApi.ts
import { api } from "@/libs/configuration";
import { ApiResponse, ReviewResponse } from "../core/dto/response";
import { ReviewCreationRequest } from "../core/dto/request";
import { Review } from "../core/types";
import { reviewMap } from "../core/mapping/review.mapper";

// Tạo review
export const createReview = async (
    request: ReviewCreationRequest
): Promise<Review> => {
    try {
        const response = await api.post<ApiResponse<ReviewResponse>>("/reviews", request);
        return reviewMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Lấy danh sách review theo đối tượng được review
export const getReviewsByReviewed = async (
    reviewedId: string
): Promise<Review[]> => {
    try {
        const response = await api.get<ApiResponse<ReviewResponse[]>>(`/reviews/by-reviewed/${reviewedId}`);
        return response.data.result.map(reviewMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Lấy danh sách review theo booking
export const getReviewsByBooking = async (
    bookingId: string
): Promise<Review[]> => {
    try {
        const response = await api.get<ApiResponse<ReviewResponse[]>>(`/reviews/by-booking/${bookingId}`);
        return response.data.result.map(reviewMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Lấy danh sách review theo item
export const getReviewsByItemId = async (
    itemId: string
): Promise<Review[]> => {
    try {
        const response = await api.get<ApiResponse<ReviewResponse[]>>(`/reviews/item/${itemId}`);
        return response.data.result.map(reviewMap.fromResponse);
    } catch (error) {
        throw error;
    }
};
