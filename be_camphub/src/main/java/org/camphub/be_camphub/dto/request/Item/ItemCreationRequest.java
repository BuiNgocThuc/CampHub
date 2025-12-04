package org.camphub.be_camphub.dto.request.Item;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.MediaResourceRequest;

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
    Integer quantity;
    BigDecimal depositAmount;
    List<MediaResourceRequest> mediaUrls;
}
