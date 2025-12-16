package org.camphub.be_camphub.entity;

import java.time.Instant;

import jakarta.persistence.Id;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Document(collection = "chat_messages")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ChatMessage {
    @Id
    String id;

    String chatCode;
    String senderId;
    String receiverId;
    String content;
    Instant timestamp;
    Boolean isRead;
}
