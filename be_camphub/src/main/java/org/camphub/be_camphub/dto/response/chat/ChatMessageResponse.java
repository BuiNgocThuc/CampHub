package org.camphub.be_camphub.dto.response.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ChatMessageResponse {
    String id;
    String chatCode;
    UUID senderId;
    UUID receiverId;
    String content;
    Instant timestamp;
    Boolean isRead;
}
