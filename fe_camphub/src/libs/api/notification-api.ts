import { api } from "../configuration";
import { NotificationCreationRequest } from "../core/dto/request";
import { Notification } from "../core/types";
import { ApiResponse, NotificationResponse } from "../core/dto/response";
import { notificationMap } from "../core/mapping/notification.mapper";

export const createNotification = async (
    model: Notification
): Promise<Notification> => {
    const request: NotificationCreationRequest = notificationMap.toCreationRequest(model);
    try {
        const response = await api.post<ApiResponse<NotificationResponse>>(
            "/notifications",
            request
        );
        return notificationMap.fromResponse(response.data.result);

    } catch (error) {
        throw error;
    }
}

// Lấy tất cả notification theo receiverId
export const getNotificationsByReceiver = async (
    receiverId: string
): Promise<Notification[]> => {
    try {
        const response = await api.get<ApiResponse<NotificationResponse[]>>(`/notifications/receiver/${receiverId}`);
        return response.data.result.map(notificationMap.fromResponse);
    } catch (error) {
        throw error;
    }
};

// Đánh dấu notification đã đọc
export const markNotificationAsRead = async (
    id: string
): Promise<Notification> => {
    try {
        const response = await api.patch<ApiResponse<NotificationResponse>>(`/notifications/${id}/read`);
        return notificationMap.fromResponse(response.data.result);
    } catch (error) {
        throw error;
    }
};

// Xóa notification
export const deleteNotification = async (id: string): Promise<ApiResponse<void>> => {
    try {
        const response = await api.delete<ApiResponse<void>>(`/notifications/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};