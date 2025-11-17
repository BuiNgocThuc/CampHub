package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.notification.NotificationResponse;
import org.camphub.be_camphub.entity.Notification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface NotificationMapper {
    @Mapping(target = "isRead", expression = "java(false)")
    Notification toEntity(NotificationCreationRequest request);

    NotificationResponse toResponse(Notification entity);
}
