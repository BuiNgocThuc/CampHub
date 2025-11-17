package org.camphub.be_camphub.dto.request.booking;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.request.MediaResourceRequest;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LesseeReturnRequest {
    @NotNull
    UUID bookingId;

    String note;

    List<MediaResourceRequest> mediaUrls;
}
