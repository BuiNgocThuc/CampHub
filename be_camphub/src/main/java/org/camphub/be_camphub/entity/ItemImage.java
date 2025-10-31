package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "item_images")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ItemImage {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "item_id", nullable = false)
    UUID itemId;

    @Column(name = "image_url")
    String imageUrl;

    String description;

    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now();
}
