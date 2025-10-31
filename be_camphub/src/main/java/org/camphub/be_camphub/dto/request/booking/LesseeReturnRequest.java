package org.camphub.be_camphub.dto.request.booking;

import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.NotNull;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LesseeReturnRequest {
    @NotNull
    UUID bookingId;

    String note;

    List<String> mediaUrls; // link ảnh/video đã upload lên Cloudinary
}
