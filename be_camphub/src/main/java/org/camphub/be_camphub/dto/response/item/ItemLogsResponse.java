package org.camphub.be_camphub.dto.response.item;

import java.util.List;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ItemLogsResponse {
    UUID id;
    UUID itemId;
    String account; // Tên người thực hiện hành động
    String action;
    String previousStatus;
    String currentStatus;
    String note;
    List<MediaResourceResponse> media;
    String createdAt;
}
