package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.ItemActionType;
import org.camphub.be_camphub.enums.ItemStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "item_logs")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class ItemLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "item_id", nullable = false)
    UUID itemId;

    @Column(name = "account_id", nullable = false)
    UUID accountId; // ai là người thực hiện hành động (chủ, admin...)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ItemActionType action; //  CREATE, UPDATE, APPROVE, REJECT, ...

    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status")
    ItemStatus previousStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "current_status")
    ItemStatus currentStatus;

    @Column(length = 500)
    String note; // mô tả chi tiết thay đổi, ví dụ: "Item rented by user X for 3 days"

    @ElementCollection
    @CollectionTable(name = "item_log_media", joinColumns = @JoinColumn(name = "item_log_id"))
    List<MediaResource> evidenceUrls;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt;
}
