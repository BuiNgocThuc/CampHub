package org.camphub.be_camphub.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Document(collection = "chat_rooms")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ChatRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    String chatCode;
    List<UUID> participantIds;
    String lastMessage;
    Instant lastTimestamp;
    Map<String, Integer> unreadMessageCounts;
}
