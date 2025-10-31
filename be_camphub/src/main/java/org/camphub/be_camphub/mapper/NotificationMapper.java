package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.notification.NotificationResponse;
import org.camphub.be_camphub.entity.Notification;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    Notification toEntity(NotificationCreationRequest request);

    NotificationResponse toResponse(Notification entity);
}
