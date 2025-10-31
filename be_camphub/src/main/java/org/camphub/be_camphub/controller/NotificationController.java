package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.notification.NotificationResponse;
import org.camphub.be_camphub.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationController {
    NotificationService notificationService;

    @PostMapping
    ApiResponse<NotificationResponse> createNotification(@RequestBody NotificationCreationRequest request) {
        return ApiResponse.<NotificationResponse>builder()
                .message("Create notification successfully")
                .result(notificationService.create(request))
                .build();
    }

    @GetMapping("/receiver/{receiverId}")
    ApiResponse<List<NotificationResponse>> getAllByReceiver(@PathVariable UUID receiverId) {
        return ApiResponse.<List<NotificationResponse>>builder()
                .message("Get all notifications successfully")
                .result(notificationService.getAllByReceiver(receiverId))
                .build();
    }

    @PatchMapping("/{id}/read")
    ApiResponse<NotificationResponse> markAsRead(@PathVariable UUID id) {
        return ApiResponse.<NotificationResponse>builder()
                .message("Mark notification as read successfully")
                .result(notificationService.markAsRead(id))
                .build();
    }

    @DeleteMapping("/{id}")
    ApiResponse<Void> deleteNotification(@PathVariable UUID id) {
        notificationService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Delete notification successfully")
                .build();
    }
}
