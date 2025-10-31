package org.camphub.be_camphub.dto.request.extension_req;

import java.util.UUID;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExtensionReqCreationRequest {
    @NotNull
    UUID bookingId;

    @NotNull
    @Min(1)
    Integer additionalDays; // số ngày muốn gia hạn: 1,2,3,...

    String note;
}
