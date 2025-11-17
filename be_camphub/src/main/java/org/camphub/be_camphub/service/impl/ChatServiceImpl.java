package org.camphub.be_camphub.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.request.chat.ChatMessageRequest;
import org.camphub.be_camphub.dto.response.chat.ChatMessageResponse;
import org.camphub.be_camphub.entity.ChatMessage;
import org.camphub.be_camphub.entity.ChatRoom;
import org.camphub.be_camphub.mapper.ChatMessageMapper;
import org.camphub.be_camphub.repository.ChatMessageRepository;
import org.camphub.be_camphub.repository.ChatRoomRepository;
import org.camphub.be_camphub.service.ChatService;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ChatServiceImpl implements ChatService {
    ChatMessageRepository chatMessageRepository;
    ChatRoomRepository chatRoomRepository;

    ChatMessageMapper chatMessageMapper;

    @Override
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        String chatCode = getOrCreateChatCode(request.getSenderId(), request.getReceiverId());

        ChatMessage message = chatMessageMapper.toEntity(request);

        chatMessageRepository.save(message);

        ChatRoom room = chatRoomRepository.findByChatCode(chatCode).get();
        room.setLastMessage(request.getContent());
        room.setLastTimestamp(message.getTimestamp());
        if(room.getUnreadMessageCounts() == null) {
            room.setUnreadMessageCounts(new HashMap<>());
        }
        room.getUnreadMessageCounts().merge(request.getReceiverId().toString(), 1, Integer::sum);
        chatRoomRepository.save(room);

        return chatMessageMapper.toResponse(message);
    }

    @Override
    public List<ChatMessage> getMessages(String chatCode) {
        return chatMessageRepository.findByChatCodeOrderByTimestampAsc(chatCode);
    }

    // Tìm hoặc tạo chat code
    private String getOrCreateChatCode(UUID user1, UUID user2) {
        List<UUID> participantIds = List.of(user1, user2);
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByParticipantIdsIn(participantIds);

        if (existingRoom.isPresent()) {
            return existingRoom.get().getChatCode();
        }

        String chatCode = generateChatCode(user1.toString(), user2.toString());
        ChatRoom room = ChatRoom.builder()
                .chatCode(chatCode)
                .participantIds(participantIds)
                .unreadMessageCounts(Map.of(user1.toString(), 0, user2.toString(), 0))
                .build();
        chatRoomRepository.save(room);

        return chatCode;
    }

    private String generateChatCode(String a, String b) {
        return a.compareTo(b) < 0 ? a + "_" + b : b + "_" + a; // example: "user1_user2"
    }
}
