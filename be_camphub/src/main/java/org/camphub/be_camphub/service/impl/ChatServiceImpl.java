package org.camphub.be_camphub.service.impl;

import java.util.*;

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

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ChatServiceImpl implements ChatService {

    // Mongo Repositories (Đã sửa Entity dùng String ID)
    ChatMessageRepository chatMessageRepository;
    ChatRoomRepository chatRoomRepository;

    // Mappers
    ChatMessageMapper chatMessageMapper;
    ChatRoomMapper chatRoomMapper;

    // Postgres Repository (Vẫn dùng UUID)
    AccountRepository accountRepository;

    @Override
    public ChatMessageResponse sendMessage(ChatMessageRequest request) {
        // 1. Chuyển đổi UUID từ Request sang String để lưu vào MongoDB
        String senderIdStr = request.getSenderId().toString();
        String receiverIdStr = request.getReceiverId().toString();

        // 2. Tìm hoặc tạo ChatCode (Dùng String)
        String chatCode = getOrCreateChatCode(senderIdStr, receiverIdStr);
        log.info("[Service] Sending message in room: {}", chatCode);

        // 3. Map Entity và ép kiểu ID sang String
        // (Lưu ý: Nếu mapper chưa config, phải set thủ công để đảm bảo)
        ChatMessage message = chatMessageMapper.toEntity(request, chatCode);
        message.setSenderId(senderIdStr);
        message.setReceiverId(receiverIdStr);

        chatMessageRepository.save(message);

        // 4. Cập nhật thông tin phòng chat (Last message, Unread count)
        ChatRoom room = chatRoomRepository
                .findByChatCode(chatCode)
                .orElseThrow(() -> new AppException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        room.setLastMessage(request.getContent());
        room.setLastTimestamp(message.getTimestamp());

        if (room.getUnreadMessageCounts() == null) {
            room.setUnreadMessageCounts(new HashMap<>());
        }

        // Tăng số tin nhắn chưa đọc cho người nhận (Key là String)
        room.getUnreadMessageCounts().merge(receiverIdStr, 1, Integer::sum);

        chatRoomRepository.save(room);

        return chatMessageMapper.toResponse(message);
    }

    @Override
    public List<ChatMessageResponse> getMessages(String chatCode) {
        // ChatCode là String nên query trực tiếp
        List<ChatMessage> messages = chatMessageRepository.findByChatCodeOrderByTimestampAsc(chatCode);
        return messages.stream().map(chatMessageMapper::toResponse).toList();
    }

    @Override
    public List<ChatRoomResponse> getRoomsByUserId(String userId) {
        // 1. Input đã là String -> Query trực tiếp MongoDB
        // Tìm tất cả phòng mà userId này tham gia
        List<ChatRoom> rooms = chatRoomRepository.findByParticipantIdsContaining(userId).stream()
                .sorted(Comparator.comparing(ChatRoom::getLastTimestamp).reversed())
                .toList();

        // 2. Mapping thông tin User (Username, Avatar) từ PostgreSQL
        return rooms.stream()
                .map(room -> {
                    // Tìm ID của người "kia" trong danh sách tham gia
                    String receiverIdStr = room.getParticipantIds().stream()
                            .filter(id -> !id.equals(userId)) // So sánh String
                            .findFirst()
                            .orElse(null);

                    String receiverUsername = "Unknown";
                    String avatarUrl = null;

                    if (receiverIdStr != null) {
                        try {
                            // CHUYỂN ĐỔI QUAN TRỌNG: String (Mongo) -> UUID (Postgres)
                            UUID receiverUUID = UUID.fromString(receiverIdStr);

                            Account accountOpt = accountRepository
                                    .findById(receiverUUID)
                                    .orElse(null); // Nếu không tìm thấy user thì để null/mặc định

                            if (accountOpt != null) {
                                receiverUsername = accountOpt.getUsername();
                                avatarUrl = accountOpt.getAvatar();
                            }
                        } catch (IllegalArgumentException e) {
                            log.error("Invalid UUID string found in MongoDB: {}", receiverIdStr);
                        }
                    }

                    return chatRoomMapper.toChatRoomResponse(room, receiverUsername, avatarUrl);
                })
                .toList();
    }

    // --- HELPER METHODS ---

    private String getOrCreateChatCode(String user1Id, String user2Id) {
        List<String> participantIds = List.of(user1Id, user2Id);

        // Query MongoDB với List<String>
        Optional<ChatRoom> existingRoom = chatRoomRepository.findByParticipantIdsContainsAll(participantIds);

        if (existingRoom.isPresent()) {
            return existingRoom.get().getChatCode();
        }

        // Nếu chưa có, tạo mới
        String chatCode = generateChatCode(user1Id, user2Id);

        ChatRoom room = ChatRoom.builder()
                .chatCode(chatCode)
                .participantIds(participantIds)
                .unreadMessageCounts(Map.of(user1Id, 0, user2Id, 0))
                .build();
        chatRoomRepository.save(room);

        return chatCode;
    }

    // Logic tạo code dựa trên so sánh chuỗi String (Lexicographical comparison)
    // Đảm bảo "A" vs "B" luôn ra "A_B" dù input theo thứ tự nào
    private String generateChatCode(String a, String b) {
        return a.compareTo(b) < 0 ? a + "_" + b : b + "_" + a;
    }
}
