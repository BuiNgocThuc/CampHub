import { createMap, createMapper, forMember, mapFrom } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";
import { Review } from "../types";
import { ReviewResponse } from "../dto/response";
import { ReviewCreationRequest } from "../dto/request";

// ------------------------
// Mapper
// ------------------------
export const reviewMapper = createMapper({
    strategyInitializer: pojos(),
});

// ------------------------
// Metadata
// ------------------------
PojosMetadataMap.create<Review>("Review", {
    id: String,
    bookingId: String,
    reviewerId: String,
    reviewedId: String,
    itemName: String,
    reviewerName: String,
    reviewerAvatar: String,
    rating: Number,
    comment: String,
    mediaUrls: Array,
    createdAt: String,
});
PojosMetadataMap.create<ReviewResponse>("ReviewResponse", {
    id: String,
    bookingId: String,
    reviewerId: String,
    reviewedId: String,
    itemName: String,
    reviewerName: String,
    reviewerAvatar: String,
    rating: Number,
    comment: String,
    mediaUrls: Array,
    createdAt: String,
});
PojosMetadataMap.create<ReviewCreationRequest>("ReviewCreationRequest", {
    bookingId: String,
    reviewerId: String,
    reviewedId: String,
    rating: Number,
    content: String,
    mediaUrls: Array,
});

// ------------------------
// Mapping: DTO response → Model
// ------------------------
createMap<ReviewResponse, Review>(
    reviewMapper,
    "ReviewResponse",
    "Review"
);

// ------------------------
// Mapping: Model → Creation Request DTO
// ------------------------
createMap<Review, ReviewCreationRequest>(
    reviewMapper,
    "Review",
    "ReviewCreationRequest",
    // map content từ comment
    forMember(d => d.content, mapFrom(s => s.comment))
);

// ------------------------
// Export API
// ------------------------
export const reviewMap = {
    fromResponse: (response: ReviewResponse): Review =>
        reviewMapper.map<ReviewResponse, Review>(
            response,
            "ReviewResponse",
            "Review"
        ),
    toCreationRequest: (model: Review): ReviewCreationRequest =>
        reviewMapper.map<Review, ReviewCreationRequest>(
            model,
            "Review",
            "ReviewCreationRequest"
        ),
};
