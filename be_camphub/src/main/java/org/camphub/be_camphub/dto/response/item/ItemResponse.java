package org.camphub.be_camphub.dto.response.item;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ItemResponse {
    UUID id;
    String ownerName;
    String categoryName;
    String name;
    String description;
    BigDecimal price;
    BigDecimal depositAmount;
    String status;
    List<String> imageUrls;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
}
