package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.ItemStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "items")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Item {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "owner_id", nullable = false)
    UUID ownerId;

    @Column(name = "category_id")
    UUID categoryId;

    @Column(nullable = false)
    String name;

    @Column(columnDefinition = "text")
    String description;

    @Column(name = "price_per_day")
    Double pricePerDay;

    @Column(name = "quantity")
    Integer quantity;

    @Column(name = "deposit_amount")
    Double depositAmount;

    @ElementCollection
    @CollectionTable(name = "item_media_urls", joinColumns = @JoinColumn(name = "item_id"))
    List<MediaResource> mediaUrls;

    @Column(name = "rejection_reason", columnDefinition = "text")
    String rejectionReason;

    @Enumerated(EnumType.STRING)
    ItemStatus status = ItemStatus.AVAILABLE;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now();

    @LastModifiedDate
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
