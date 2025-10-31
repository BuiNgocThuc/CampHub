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
}
