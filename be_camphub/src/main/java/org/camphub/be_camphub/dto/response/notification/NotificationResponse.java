package org.camphub.be_camphub.dto.response.notification;

import java.time.LocalDateTime;
import java.util.UUID;

import org.camphub.be_camphub.enums.NotificationType;
import org.camphub.be_camphub.enums.ReferenceType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationResponse {
    UUID id;
    UUID receiverId;
    UUID senderId;
    NotificationType type;
    String title;
    String content;
    ReferenceType referenceType;
    UUID referenceId;
    boolean isRead;
    LocalDateTime createdAt;
    LocalDateTime readAt;
}
