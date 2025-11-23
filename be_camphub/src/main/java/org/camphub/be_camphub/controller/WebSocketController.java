package org.camphub.be_camphub.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.camphub.be_camphub.dto.request.chat.ChatMessageRequest;
import org.camphub.be_camphub.dto.response.chat.ChatMessageResponse;
import org.camphub.be_camphub.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class WebSocketController {
    ChatService chatService;
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest request, Principal principal) {
        log.info("[Controller] Received message from {} to {}", request.getSenderId(), request.getReceiverId());

        UUID authUserId = UUID.fromString(principal.getName());

        if (!authUserId.equals(request.getSenderId())) {
            log.warn("SenderId does not match authenticated user: {} != {}", request.getSenderId(), authUserId);
            throw new IllegalArgumentException("SenderId không hợp lệ");
        }

        log.info("Received message from {} to {}", request.getSenderId(), request.getReceiverId());
        ChatMessageResponse response = chatService.sendMessage(request);

        log.info("Message saved: {}", response.getContent());

        // Gửi tin nhắn đến người nhận qua WebSocket
        simpMessagingTemplate.convertAndSend(
                "/topic/chat." + response.getChatCode(),
                response
        );

        simpMessagingTemplate.convertAndSend(
                "/topic/chat.global",
                response
        );

        log.info("Message sent to: {}", response.getId());
    }

}
