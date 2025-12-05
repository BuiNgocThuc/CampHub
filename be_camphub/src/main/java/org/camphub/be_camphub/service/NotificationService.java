package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.notification.NotificationResponse;

public interface NotificationService {
    NotificationResponse create(NotificationCreationRequest request);

    List<NotificationResponse> getAllByReceiver(UUID receiverId);

    NotificationResponse markAsRead(UUID id);

    void delete(UUID id);

    /**
     * Gửi thông báo cho tất cả admin trong hệ thống
     * @param request NotificationCreationRequest (receiverId sẽ bị bỏ qua, sẽ gửi cho tất cả admin)
     * @return Danh sách các notification đã tạo
     */
    List<NotificationResponse> notifyAllAdmins(NotificationCreationRequest request);
}
