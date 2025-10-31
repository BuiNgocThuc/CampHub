package org.camphub.be_camphub.dto.response.return_req;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.enums.ReasonReturnType;
import org.camphub.be_camphub.enums.ReturnRequestStatus;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnReqResponse {
    UUID id;
    UUID bookingId;
    UUID lesseeId;
    UUID lessorId;
    ReasonReturnType reason;
    List<String> evidenceUrls;
    ReturnRequestStatus status;
    String note;
    String adminNote;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    LocalDateTime resolvedAt;
}
