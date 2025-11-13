package org.camphub.be_camphub.dto.request.return_req;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import org.camphub.be_camphub.dto.request.MediaResourceRequest;
import org.camphub.be_camphub.enums.ReasonReturnType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReturnReqCreationRequest {
    @NotNull
    UUID bookingId;

    @NotNull
    ReasonReturnType reason;

    String note;

    List<MediaResourceRequest> evidenceUrls;
}
