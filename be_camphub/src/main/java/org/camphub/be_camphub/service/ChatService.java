package org.camphub.be_camphub.service;

import org.camphub.be_camphub.dto.request.chat.ChatMessageRequest;
import org.camphub.be_camphub.dto.response.chat.ChatMessageResponse;
import org.camphub.be_camphub.entity.ChatMessage;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    ChatMessageResponse sendMessage(ChatMessageRequest request);
    List<ChatMessage> getMessages(String chatCode);
}
