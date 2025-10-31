package org.camphub.be_camphub.dto.response.extension_req;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.ExtensionStatus;

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

    LocalDate oldEndDate;

    LocalDate requestedNewEndDate;

    double additionalFee;

    @Enumerated(EnumType.STRING)
    ExtensionStatus status;

    String note;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
