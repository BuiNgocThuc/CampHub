package org.camphub.be_camphub.dto.request.Item;

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
public class ItemUpdateRequest {
    UUID categoryId;
    String name;
    String description;
    Double pricePerDay;
    Double depositAmount;
    String conditionNote;
    List<MediaResourceRequest> mediaUrls;
}
