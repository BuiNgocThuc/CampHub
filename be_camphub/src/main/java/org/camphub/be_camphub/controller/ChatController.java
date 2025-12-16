package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.chat.ChatMessageResponse;
import org.camphub.be_camphub.dto.response.chat.ChatRoomResponse;
import org.camphub.be_camphub.service.ChatService;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
@RequestMapping("/chat")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ChatController {
    ChatService chatService;

    @GetMapping("/messages/{chatCode}")
    public ApiResponse<List<ChatMessageResponse>> getMessages(@PathVariable String chatCode) {
        return ApiResponse.<List<ChatMessageResponse>>builder()
                .result(chatService.getMessages(chatCode))
                .message("Messages retrieved successfully")
                .build();
    }

    @GetMapping("/chat-rooms")
    public ApiResponse<List<ChatRoomResponse>> getChatRooms(@RequestParam UUID userId) {
        log.info("Retrieved chat rooms for user {} before accessing service layer", userId);
        List<ChatRoomResponse> rooms = chatService.getRoomsByUserId(userId.toString());
        log.info("Retrieved {} chat rooms for user {}", rooms.size(), userId);
        return ApiResponse.<List<ChatRoomResponse>>builder()
                .result(rooms)
                .message("Chat rooms retrieved successfully")
                .build();
    }
}
