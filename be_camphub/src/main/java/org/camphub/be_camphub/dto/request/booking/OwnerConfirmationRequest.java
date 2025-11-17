package org.camphub.be_camphub.dto.request.booking;

import lombok.*;
import lombok.experimental.FieldDefaults;
import org.camphub.be_camphub.dto.request.MediaResourceRequest;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OwnerConfirmationRequest {
    UUID bookingId;

    Boolean isAccepted;

    String deliveryNote;

    List<MediaResourceRequest> packagingMediaUrls;
}
