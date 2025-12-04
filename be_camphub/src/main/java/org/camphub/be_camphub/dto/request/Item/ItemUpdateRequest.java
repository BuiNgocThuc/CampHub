package org.camphub.be_camphub.dto.request.Item;

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
public class ItemUpdateRequest {
    UUID categoryId;
    String name;
    String description;
    Double pricePerDay;
    Integer quantity;
    Double depositAmount;
    List<MediaResourceRequest> mediaUrls;
}
