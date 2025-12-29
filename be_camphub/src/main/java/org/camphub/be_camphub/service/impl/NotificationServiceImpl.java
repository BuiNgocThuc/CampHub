package org.camphub.be_camphub.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.response.notification.NotificationResponse;
import org.camphub.be_camphub.entity.Notification;
import org.camphub.be_camphub.mapper.NotificationMapper;
import org.camphub.be_camphub.repository.NotificationRepository;
import org.camphub.be_camphub.service.NotificationService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(r -> r.getAuthority().equals("ROLE_ADMIN"));

        List<Notification> notifications;

        // 2. Phân loại Query
        if (isAdmin) {
            // Admin: Xem tin cá nhân + Tin hệ thống
            notifications = notificationRepository.findAllForAdmin(receiverId);
        } else {
            // User: Chỉ xem tin cá nhân
            notifications = notificationRepository.findAllByReceiverIdOrderByCreatedAtDesc(receiverId);
        }

        return notifications.stream()
                .map(notificationMapper::toResponse)
                .collect(Collectors.toList());
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
