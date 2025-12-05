package org.camphub.be_camphub.dto.request.notification;

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
public class NotificationCreationRequest {
    UUID receiverId;
    UUID senderId;
    NotificationType type;
    String title;
    String content;
    ReferenceType referenceType;
    UUID referenceId;
    Boolean isBroadcast;
}
