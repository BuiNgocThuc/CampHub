package org.camphub.be_camphub.service;

import org.camphub.be_camphub.dto.request.chat.ChatMessageRequest;
import org.camphub.be_camphub.dto.response.chat.ChatMessageResponse;
import org.camphub.be_camphub.dto.response.chat.ChatRoomResponse;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    ChatMessageResponse sendMessage(ChatMessageRequest request);
    List<ChatMessageResponse> getMessages(String chatCode);
    List<ChatRoomResponse> getRoomsByUserId(UUID userId);
}
