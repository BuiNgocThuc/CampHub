package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.review.ReviewCreationRequest;
import org.camphub.be_camphub.dto.response.review.ReviewResponse;

public interface ReviewService {
    ReviewResponse createReview(ReviewCreationRequest request);

    List<ReviewResponse> getReviewsByReviewed(UUID reviewedId);

    List<ReviewResponse> getReviewsByBooking(UUID bookingId);

    List<ReviewResponse> getReviewsByItemId(UUID itemId);
}
