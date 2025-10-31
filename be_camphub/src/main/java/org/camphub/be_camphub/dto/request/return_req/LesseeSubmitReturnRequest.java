package org.camphub.be_camphub.dto.request.return_req;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LesseeSubmitReturnRequest {
    @NotNull
    UUID returnRequestId;

    String note;
    List<String> packingMediaUrls;
}
