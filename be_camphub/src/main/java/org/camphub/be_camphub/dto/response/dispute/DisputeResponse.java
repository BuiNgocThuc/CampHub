package org.camphub.be_camphub.dto.response.dispute;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.response.MediaResourceResponse;
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
    UUID adminId;

    String reporterName; // tên người báo cáo
    String defenderName; // tên người bị báo cáo
    String adminName;    // tên quản trị viên xử lý

    String description;
    List<MediaResourceResponse> evidenceUrls;
    String damageTypeName;
    String damageTypeId;
    Double compensationRate;
    String status;
    String adminDecision;
    Double compensationAmount;
    String adminNote;

    String createdAt;
    String resolvedAt;
}
