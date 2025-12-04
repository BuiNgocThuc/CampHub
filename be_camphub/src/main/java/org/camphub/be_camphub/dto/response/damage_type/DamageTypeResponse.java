package org.camphub.be_camphub.dto.response.damage_type;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DamageTypeResponse {
    UUID id;
    String name;
    String description;
    Double compensationRate;
}
