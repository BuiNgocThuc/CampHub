package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.DisputeDecision;
import org.camphub.be_camphub.enums.DisputeStatus;
import org.springframework.data.annotation.CreatedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "disputes")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Dispute {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "booking_id", nullable = false)
    UUID bookingId;

    @Column(name = "reporter_id")
    UUID reporterId; // lessor

    @Column(name = "defender_id")
    UUID defenderId; // lessee

    @Column(name = "admin_id")
    UUID adminId;

    @Column(columnDefinition = "text")
    String description;

    @ElementCollection
    @CollectionTable(name = "dispute_media", joinColumns = @JoinColumn(name = "dispute_id"))
    List<MediaResource> evidences;

    @Column(name = "damage_type_id")
    UUID damageTypeId;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    DisputeStatus status = DisputeStatus.PENDING_REVIEW;

    @Enumerated(EnumType.STRING)
    DisputeDecision adminDecision;

    @Column(name = "compensation_amount")
    Double compensationAmount;

    @Column(name = "admin_note", length = 500)
    String adminNote;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @Column(name = "resolved_at")
    LocalDateTime resolvedAt;
}
