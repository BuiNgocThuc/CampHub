package org.camphub.be_camphub.dto.response.item;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.response.MediaResourceResponse;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ItemResponse {
    UUID id;
    String ownerId; // ID chủ sở hữu vật phẩm
    UUID categoryId; // ID danh mục vật phẩm
    String ownerName; // Tên chủ sở hữu vật phẩm
    String categoryName; // Tên danh mục vật phẩm

    String name;
    String description;
    BigDecimal price;
    Integer quantity;
    BigDecimal  depositAmount;
    String status;
    List<MediaResourceResponse> mediaUrls;
}
