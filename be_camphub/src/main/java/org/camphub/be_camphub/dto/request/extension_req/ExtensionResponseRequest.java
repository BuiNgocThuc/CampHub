package org.camphub.be_camphub.dto.request.extension_req;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ExtensionResponseRequest { // aimed for lessor approving or rejecting extension request
    @NotNull
    UUID requestId;

    String note;
}
