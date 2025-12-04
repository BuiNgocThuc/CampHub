package org.camphub.be_camphub.dto.response.review;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.response.MediaResourceResponse;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReviewResponse {
    UUID id;
    UUID bookingId;
    UUID reviewerId;
    UUID reviewedId;

    String reviewerName;
    String reviewerAvatar;
    String itemName;

    Integer rating;
    String comment;
    List<MediaResourceResponse> mediaUrls;
    String createdAt;
}
