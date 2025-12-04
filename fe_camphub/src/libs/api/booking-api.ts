import { api } from "@/libs/configuration";
import { Booking } from "../core/types";
import { BookingResponse, ApiResponse } from "../core/dto/response";
import { BookingCreationRequest, LesseeReturnRequest, OwnerConfirmationRequest } from "../core/dto/request";
import { bookingMap } from "../core/mapping";


// Thanh toán - người thuê chọn sản phẩm từ giỏ hàng - mỗi sản phẩm tạo một booking
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


// Chủ sở hữu mỗi sản phẩm sẽ phản hồi cho từng booking
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


// khách thuê xác nhận đã nhận hàng => chuyển thành IN_USE
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


// Khách thuê trả hàng
export const returnItem = async (request: LesseeReturnRequest): Promise<Booking> => {
    try {
        const response = await api.put<ApiResponse<BookingResponse>>(
            `/bookings/return`,
            request
        );

        return bookingMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Chủ thuê xác nhận đã nhận hàng trả lại
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


// quá trình hoàn tiền
export const processRefund = async (bookingId: string): Promise<void> => {
    try {
        await api.post<ApiResponse<void>>(`/bookings/${bookingId}/process-refund`);
    } catch (error) {
        throw error;
    }
};


// Danh sách lịch sử thuê (mình là khách thuê)
export const getBookingsByLessee = async (): Promise<Booking[]> => {
    try {
        const response = await api.get<ApiResponse<BookingResponse[]>>(
            `/bookings/lessee`
        );

        return response.data.result.map(bookingMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Dấnh sách lịch sử cho thuê (mình là chủ sở hữu)
export const getBookingsByLessor = async (): Promise<Booking[]> => {
    try {
        const response = await api.get<ApiResponse<BookingResponse[]>>(
            `/bookings/lessor`
        );

        return response.data.result.map(bookingMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// lấy tất cả booking 
export const getAllBookings = async (): Promise<Booking[]> => {
    try {
        const response = await api.get<ApiResponse<BookingResponse[]>>(
            `/bookings`
        );
        return response.data.result.map(bookingMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// lấy chi tiết booking theo id
export const getBookingById = async (bookingId: string): Promise<Booking> => {
    try {
        const response = await api.get<ApiResponse<BookingResponse>>(
            `/bookings/${bookingId}`
        );

        return bookingMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }   
};

// tự động kiểm tra hạn trả đồ và cập nhật trạng thái 
