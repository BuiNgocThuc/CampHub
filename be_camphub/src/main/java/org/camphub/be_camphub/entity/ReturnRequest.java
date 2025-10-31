package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.ReasonReturnType;
import org.camphub.be_camphub.enums.ReturnRequestStatus;
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
public class ReturnRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(nullable = false)
    UUID bookingId;

    @Column(nullable = false)
    UUID lesseeId;

    @Column(nullable = false)
    UUID lessorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ReasonReturnType reason;

    @ElementCollection
    @CollectionTable(name = "return_request_evidences", joinColumns = @JoinColumn(name = "return_request_id"))
    @Column(name = "evidence_urls")
    List<MediaResource> evidenceUrls;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    ReturnRequestStatus status;

    @Column(length = 500)
    String note;

    @Column(length = 500)
    String adminNote;

    @CreatedDate
    @Column(updatable = false)
    LocalDateTime createdAt;

    @LastModifiedDate
    LocalDateTime updatedAt;

    LocalDateTime resolvedAt;
}
