package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.NotificationType;
import org.camphub.be_camphub.enums.ReferenceType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "notifications")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue
    UUID id;

    @Column(name = "receiver_id", nullable = false)
    UUID receiverId;

    @Column(name = "sender_id")
    UUID senderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    NotificationType type;

    @Column
    String title;

    @Column(columnDefinition = "TEXT")
    String content;

    @Enumerated(EnumType.STRING)
    @Column(name = "reference_type")
    ReferenceType referenceType;

    @Column(name = "reference_id")
    UUID referenceId;

    @Builder.Default
    @Column(name = "is_read")
    Boolean isRead = false;

    @Builder.Default
    @Column(name = "is_broadcast")
    Boolean isBroadcast = false;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "read_at")
    LocalDateTime readAt;
}
