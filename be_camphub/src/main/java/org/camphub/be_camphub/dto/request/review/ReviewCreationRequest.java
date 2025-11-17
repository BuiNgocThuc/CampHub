package org.camphub.be_camphub.dto.request.review;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.MediaResourceRequest;
import org.camphub.be_camphub.entity.MediaResource;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewCreationRequest {
    UUID bookingId;
    UUID reviewerId;
    UUID reviewedId; // đối tượng được đánh giá
    UUID itemId;
    Integer rating;
    String content;
    List<MediaResourceRequest> mediaUrls;
}
