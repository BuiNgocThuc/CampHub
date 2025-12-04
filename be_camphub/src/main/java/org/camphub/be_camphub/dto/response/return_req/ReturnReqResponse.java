package org.camphub.be_camphub.dto.response.return_req;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.response.MediaResourceResponse;

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

    String itemName; // Tên đồ thuê
    String lessorName; // tên đầy đủ của người cho thuê
    String lesseeName; // tên đầy đủ của người thuê

    String reason;
    List<MediaResourceResponse> evidenceUrls;
    String status;
    String note;
    String adminNote;
    String createdAt;
    String resolvedAt;
    String lessorConfirmedAt;
    String adminReviewedAt;
    String refundedAt;
}
