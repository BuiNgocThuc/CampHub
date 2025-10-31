package org.camphub.be_camphub.dto.response.dispute;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.enums.DisputeDecision;
import org.camphub.be_camphub.enums.DisputeStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DisputeResponse {
    UUID id;
    UUID bookingId;
    UUID reporterId;
    UUID defenderId;
    String description;
    List<String> evidenceUrls;
    String damageTypeName;
    Double compensationRate;
    DisputeStatus status;
    DisputeDecision adminDecision;
    Double compensationAmount;
    String adminNote;
    UUID adminId;
    LocalDateTime createdAt;
    LocalDateTime resolvedAt;
}
