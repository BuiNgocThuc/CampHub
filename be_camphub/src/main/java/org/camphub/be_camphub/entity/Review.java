package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "return_requests")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "booking_id", nullable = false)
    UUID bookingId;

    @Column(name = "reviewer_id", nullable = false)
    UUID reviewerId;

    @Column(name = "reviewed_id", nullable = false)
    UUID reviewedId; // chủ thuê hoặc người thuê

    @Column(name = "item_id", nullable = false)
    UUID itemId;

    int rating; // 1-5 sao

    @Column(columnDefinition = "text")
    String comment;

    @ElementCollection
    @CollectionTable(name = "review_media_urls", joinColumns = @JoinColumn(name = "review_id"))
    @Column(name = "media_url")
    List<MediaResource> mediaUrls;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now();

    @LastModifiedDate
    @Column(name = "updated_at")
    LocalDateTime updatedAt = LocalDateTime.now();
}
