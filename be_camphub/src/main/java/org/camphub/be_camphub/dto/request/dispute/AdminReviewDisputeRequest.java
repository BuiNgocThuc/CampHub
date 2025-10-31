package org.camphub.be_camphub.dto.request.dispute;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminReviewDisputeRequest {
    @NotNull
    UUID disputeId;

    @NotNull
    Boolean isApproved; // true = đồng ý bồi thường, false = từ chối

    String adminNote;
}
