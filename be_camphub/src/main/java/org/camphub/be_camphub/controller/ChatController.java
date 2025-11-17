package org.camphub.be_camphub.controller;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.camphub.be_camphub.dto.request.chat.ChatMessageRequest;
import org.camphub.be_camphub.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ChatController {
    ChatService chatService;
    SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageRequest request) {
        log.info("Received message from {} to {}", request.getSenderId(), request.getReceiverId());
        // Xử lý tin nhắn và lưu vào cơ sở dữ liệu
        var response = chatService.sendMessage(request);
        log.info("Message saved: {}", response.getContent());

        // Gửi tin nhắn đến người nhận qua WebSocket
        simpMessagingTemplate.convertAndSendToUser(
                response.getReceiverId().toString(),
                "/queue/messages",
                response
        );

        log.info("Message sent to: {}", response.getId());
    }
}
