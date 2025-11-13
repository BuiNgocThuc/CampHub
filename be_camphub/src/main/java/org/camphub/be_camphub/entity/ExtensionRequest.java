package org.camphub.be_camphub.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.ExtensionStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "extension_requests")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExtensionRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    UUID bookingId;

    @Column(nullable = false)
    UUID lesseeId;

    @Column(nullable = false)
    UUID lessorId;

    LocalDate oldEndDate;

    @Column(name = "requested_new_end_date", nullable = false)
    LocalDate requestedNewEndDate;

    Double additionalFee;

    @Enumerated(EnumType.STRING)
    ExtensionStatus status;

    @Column(length = 500)
    String note;

    @CreatedDate
    LocalDateTime createdAt;

    @LastModifiedDate
    LocalDateTime updatedAt;
}
