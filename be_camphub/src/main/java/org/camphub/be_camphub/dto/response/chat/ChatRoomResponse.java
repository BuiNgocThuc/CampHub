package org.camphub.be_camphub.dto.response.chat;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = lombok.AccessLevel.PRIVATE)
public class ChatRoomResponse {
    String id;
    String chatCode;
    List<UUID> participantIds;
    String lastMessage;
    Instant lastTimestamp;
    Map<String, Integer> unreadMessageCounts;

    String receiverUsername;
    String avatarUrl;
}
