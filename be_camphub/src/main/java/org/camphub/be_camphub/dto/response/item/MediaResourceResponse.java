package org.camphub.be_camphub.dto.response.item;

import org.camphub.be_camphub.enums.MediaType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaResourceResponse {
    String url;
    MediaType type; // e.g., "image", "video"
}
