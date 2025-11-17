package org.camphub.be_camphub.dto.response.extension_req;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExtensionReqResponse {
    UUID id;

    UUID bookingId;

    UUID lesseeId;

    UUID lessorId;

    String itemName;
    String lesseeName; // tên đầy đủ của người thuê
    String lessorName; // tên đầy đủ của người cho thuê

    String oldEndDate;

    String requestedNewEndDate;

    double additionalFee;

    String status;

    String note;

    String createdAt;
}
