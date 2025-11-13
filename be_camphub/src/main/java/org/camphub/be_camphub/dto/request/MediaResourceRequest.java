package org.camphub.be_camphub.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.enums.MediaType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaResourceRequest {
    String url;
    MediaType type; // IMAGE hoặc VIDEO
}
