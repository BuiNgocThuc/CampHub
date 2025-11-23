package org.camphub.be_camphub.dto.request.return_req;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AdminDecisionRequest {
    UUID returnRequestId;
    Boolean isApproved;
    String adminNote;
}
