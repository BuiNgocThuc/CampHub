package org.camphub.be_camphub.dto.request.Item;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.request.MediaResourceRequest;

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
    List<MediaResourceRequest> mediaUrls;
}
