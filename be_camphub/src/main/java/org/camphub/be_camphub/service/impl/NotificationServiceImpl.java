package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.notification.NotificationResponse;
import org.camphub.be_camphub.entity.Notification;
import org.camphub.be_camphub.mapper.NotificationMapper;
import org.camphub.be_camphub.repository.NotificationRepository;
import org.camphub.be_camphub.service.NotificationService;
import org.springframework.stereotype.Service;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NotificationServiceImpl implements NotificationService {
    NotificationRepository notificationRepository;
    NotificationMapper notificationMapper;

    @Override
    public NotificationResponse create(NotificationCreationRequest request) {
        Notification notification = notificationMapper.toEntity(request);
        notification.setCreatedAt(LocalDateTime.now());
        notification.setIsRead(false);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Override
    public List<NotificationResponse> getAllByReceiver(UUID receiverId) {
        return notificationRepository.findByReceiverIdOrIsBroadcastTrueOrderByCreatedAtDesc(receiverId).stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    public NotificationResponse markAsRead(UUID id) {
        Notification notification =
                notificationRepository.findById(id).orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Override
    public void delete(UUID id) {
        notificationRepository.deleteById(id);
    }

    @Override
    public List<NotificationResponse> notifyAllAdmins(NotificationCreationRequest request) {
        // Tạo một broadcast notification thay vì tạo nhiều notifications riêng lẻ
        NotificationCreationRequest broadcastRequest = NotificationCreationRequest.builder()
                .receiverId(null) // receiverId = null cho broadcast
                .senderId(request.getSenderId())
                .type(request.getType())
                .title(request.getTitle())
                .content(request.getContent())
                .referenceType(request.getReferenceType())
                .referenceId(request.getReferenceId())
                .isBroadcast(true)
                .build();
        NotificationResponse response = create(broadcastRequest);
        return List.of(response);
    }
}
