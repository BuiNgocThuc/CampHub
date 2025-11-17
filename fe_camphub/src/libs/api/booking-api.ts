import { api } from "@/libs/configuration";
import { Booking } from "../core/types";
import { BookingResponse, ApiResponse } from "../core/dto/response";
import { BookingCreationRequest, LesseeReturnRequest, OwnerConfirmationRequest } from "../core/dto/request";
import { bookingMap } from "../core/mapping";
import { emitWarning } from "process";

// ==========================
// Checkout (rent selected cart items)
// ==========================
export const checkout = async (request: BookingCreationRequest): Promise<Booking[]> => {
    try {
        const response = await api.post<ApiResponse<BookingResponse[]>>(
            "/bookings/checkout",
            request
        );

        return response.data.result.map(bookingMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// ==========================
// Owner responds to booking request
// ==========================
export const ownerResponse = async (
    request: OwnerConfirmationRequest
): Promise<Booking> => {
    try {
        const response = await api.put<ApiResponse<BookingResponse>>(
            `/bookings/${request.bookingId}/owner-response`,
            request
        );
        return bookingMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// ==========================
// Lessee confirms item received
// ==========================
export const confirmReceived = async (bookingId: string): Promise<Booking> => {
    try {
        const response = await api.put<ApiResponse<BookingResponse>>(
            `/bookings/${bookingId}/confirm-received`
        );

        return bookingMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// ==========================
// Lessee returns item
// ==========================
export const returnItem = async (request: LesseeReturnRequest): Promise<Booking> => {
    try {
        const response = await api.put<ApiResponse<BookingResponse>>(
            `/bookings/${request.bookingId}/return`,
            request
        );

        return bookingMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// ==========================
// Lessor confirms returned item
// ==========================
export const lessorConfirmReturn = async (bookingId: string): Promise<Booking> => {
    try {
        const response = await api.put<ApiResponse<BookingResponse>>(
            `/bookings/${bookingId}/lessor-confirm-return`
        );

        return bookingMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// ==========================
// Process refund (admin/lessor)
// ==========================
export const processRefund = async (bookingId: string): Promise<void> => {
    try {
        await api.post<ApiResponse<void>>(`/booking/${bookingId}/process-refund`);
    } catch (error) {
        throw error;
    }
};

// ==========================
// Get bookings by lessee
// ==========================
export const getBookingsByLessee = async (lesseeId: string): Promise<Booking[]> => {
    try {
        const response = await api.get<ApiResponse<BookingResponse[]>>(
            `/booking/lessee/${lesseeId}`
        );

        return response.data.result.map(bookingMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// ==========================
// Get bookings by lessor
// ==========================
export const getBookingsByLessor = async (lessorId: string): Promise<Booking[]> => {
    try {
        const response = await api.get<ApiResponse<BookingResponse[]>>(
            `/booking/lessor/${lessorId}`
        );

        return response.data.result.map(bookingMap.fromResponse);
    } catch (error) {
        throw error;
    }
};
