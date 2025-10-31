package org.camphub.be_camphub.dto.request.Item;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ItemCreationRequest {
    String name;
    String description;
    UUID categoryId;
    BigDecimal pricePerDay;
    BigDecimal depositAmount;
}
