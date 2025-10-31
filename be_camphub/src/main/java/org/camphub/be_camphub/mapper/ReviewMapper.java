package org.camphub.be_camphub.mapper;

import java.util.List;

import org.camphub.be_camphub.dto.request.review.ReviewCreationRequest;
import org.camphub.be_camphub.dto.response.review.ReviewResponse;
import org.camphub.be_camphub.entity.Review;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    Review toEntity(ReviewCreationRequest request);

    ReviewResponse toResponse(Review entity);

    List<ReviewResponse> toResponseList(List<Review> entities);
}
