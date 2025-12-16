package org.camphub.be_camphub.entity;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import jakarta.persistence.Id;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Document(collection = "chat_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ChatRoom {
    @Id
    String id;

    String chatCode;
    List<String> participantIds;
    String lastMessage;
    Instant lastTimestamp;
    Map<String, Integer> unreadMessageCounts;
}
