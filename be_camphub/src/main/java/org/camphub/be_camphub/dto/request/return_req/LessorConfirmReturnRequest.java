package org.camphub.be_camphub.dto.request.return_req;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LessorConfirmReturnRequest {
    @NotNull
    UUID returnRequestId;
}
