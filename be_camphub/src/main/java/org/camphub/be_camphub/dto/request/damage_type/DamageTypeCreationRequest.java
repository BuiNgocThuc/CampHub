package org.camphub.be_camphub.dto.request.damage_type;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DamageTypeCreationRequest {
    String name;
    String description;
    Double compensationRate;
}
