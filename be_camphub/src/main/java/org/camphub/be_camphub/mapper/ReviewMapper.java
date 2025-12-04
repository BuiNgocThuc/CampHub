package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.review.ReviewCreationRequest;
import org.camphub.be_camphub.dto.response.review.ReviewResponse;
import org.camphub.be_camphub.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ReviewMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "comment", source = "content")
    Review toEntity(ReviewCreationRequest request);

    @Mapping(target = "reviewerName", ignore = true) // sẽ set trong service
    @Mapping(target = "itemName", ignore = true) // sẽ set trong service
    @Mapping(target = "reviewerAvatar", ignore = true) // sẽ set trong service
    ReviewResponse toResponse(Review entity);
}
