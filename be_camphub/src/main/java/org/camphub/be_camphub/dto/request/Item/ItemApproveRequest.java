package org.camphub.be_camphub.dto.request.Item;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ItemApproveRequest {
    boolean approved;
    String rejectionReason;
}
