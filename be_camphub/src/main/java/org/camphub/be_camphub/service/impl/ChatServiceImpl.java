package org.camphub.be_camphub.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.camphub.be_camphub.dto.request.chat.ChatMessageRequest;
import org.camphub.be_camphub.dto.response.chat.ChatMessageResponse;
import org.camphub.be_camphub.dto.response.chat.ChatRoomResponse;
import org.camphub.be_camphub.entity.Account;
import org.camphub.be_camphub.entity.ChatMessage;
import org.camphub.be_camphub.entity.ChatRoom;
import org.camphub.be_camphub.exception.AppException;
import org.camphub.be_camphub.exception.ErrorCode;
import org.camphub.be_camphub.mapper.ChatMessageMapper;
import org.camphub.be_camphub.mapper.ChatRoomMapper;
import org.camphub.be_camphub.repository.AccountRepository;
import org.camphub.be_camphub.repository.ChatMessageRepository;
import org.camphub.be_camphub.repository.ChatRoomRepository;
import org.camphub.be_camphub.service.ChatService;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ChatServiceImpl implements ChatService {
    ChatMessageRepository chatMessageRepository;
    ChatRoomRepository chatRoomRepository;

    ChatMessageMapper chatMessageMapper;
    ChatRoomMapper chatRoomMapper;

    AccountRepository accountRepository;

    @Override
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        String chatCode = getOrCreateChatCode(request.getSenderId(), request.getReceiverId());

        log.info("[Service] Using chatCode: {}", chatCode);
        ChatMessage message = chatMessageMapper.toEntity(request, chatCode);

        chatMessageRepository.save(message);

        ChatRoom room = chatRoomRepository.findByChatCode(chatCode)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        room.setLastMessage(request.getContent());
        room.setLastTimestamp(message.getTimestamp());

        if(room.getUnreadMessageCounts() == null) {
            room.setUnreadMessageCounts(new HashMap<>());
        }
        String receiverKey = request.getReceiverId().toString();
        room.getUnreadMessageCounts().merge(receiverKey, 1, Integer::sum);

        chatRoomRepository.save(room);

        return chatMessageMapper.toResponse(message);
    }

    @Override
    public List<ChatMessageResponse> getMessages(String chatCode) {
        List<ChatMessage> messages = chatMessageRepository.findByChatCodeOrderByTimestampAsc(chatCode);
        return messages.stream()
                .map(chatMessageMapper::toResponse)
                .toList();
    }

    @Override
    public List<ChatRoomResponse> getRoomsByUserId(UUID userId) {
        List<ChatRoom>  rooms = chatRoomRepository.findByParticipantIdsContaining(userId)
                .stream()
                .sorted(Comparator.comparing(ChatRoom::getLastTimestamp).reversed())
                .toList();

        // mapping username and avatarUrl
        return rooms.stream()
                .map(room -> {
                    UUID receiverId = room.getParticipantIds().stream()
                            .filter(id -> !id.equals(userId))
                            .findFirst()
                            .orElse(null);

                    String receiverUsername = null;
                    String avatarUrl = null;

                    if (receiverId != null) {
                        Account accountOpt = accountRepository.findById(receiverId).
                                orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                        receiverUsername = accountOpt.getUsername();
                        avatarUrl = accountOpt.getAvatar();
                    }

                    return chatRoomMapper.toChatRoomResponse(room, receiverUsername, avatarUrl);
                })
                .toList();
    }

    // Tìm hoặc tạo chat code
    private String getOrCreateChatCode(UUID user1, UUID user2) {
        List<UUID> participantIds = List.of(user1, user2);
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByParticipantIdsContainsAll(participantIds);

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
