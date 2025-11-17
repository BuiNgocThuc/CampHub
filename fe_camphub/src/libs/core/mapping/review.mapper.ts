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
PojosMetadataMap.create<Review>("Review", {});
PojosMetadataMap.create<ReviewResponse>("ReviewResponse", {});
PojosMetadataMap.create<ReviewCreationRequest>("ReviewCreationRequest", {});

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
