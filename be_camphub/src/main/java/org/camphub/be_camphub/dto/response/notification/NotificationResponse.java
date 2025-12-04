package org.camphub.be_camphub.dto.response.notification;

import java.util.UUID;

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
    String type;
    String title;
    String content;
    String referenceType;
    UUID referenceId;
    boolean isRead;
    String createdAt;
}
