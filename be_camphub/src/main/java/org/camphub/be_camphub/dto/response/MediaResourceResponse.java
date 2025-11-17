package org.camphub.be_camphub.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.enums.MediaType;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaResourceResponse {
    String url;
    String type; // IMAGE hoặc VIDEO
}
