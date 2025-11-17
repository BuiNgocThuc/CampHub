package org.camphub.be_camphub.dto.request.dispute;

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
public class DisputeCreationRequest {
    @NotNull
    UUID bookingId;

    @NotNull
    UUID damageTypeId; // Loại hư hỏng, để tính % bồi thường

    String note;

    List<MediaResourceRequest> evidenceUrls; // Ảnh/video làm bằng chứng
}
