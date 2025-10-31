package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.review.ReviewCreationRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.review.ReviewResponse;
import org.camphub.be_camphub.service.ReviewService;
import org.springframework.web.bind.annotation.*;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ReviewController {
    ReviewService reviewService;

    @PostMapping
    ApiResponse<ReviewResponse> createReview(@RequestBody ReviewCreationRequest request) {
        // Implementation goes here
        return ApiResponse.<ReviewResponse>builder()
                .message("Create review successfully")
                .result(reviewService.createReview(request))
                .build();
    }

    @GetMapping("/by-reviewed/{reviewedId}")
    ApiResponse<java.util.List<ReviewResponse>> getReviewsByReviewed(@PathVariable java.util.UUID reviewedId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .message("Get reviews by reviewed successfully")
                .result(reviewService.getReviewsByReviewed(reviewedId))
                .build();
    }

    @GetMapping("/by-booking/{bookingId}")
    public ApiResponse<List<ReviewResponse>> getReviewsByBooking(@PathVariable("bookingId") UUID bookingId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .message("Get reviews by booking successfully")
                .result(reviewService.getReviewsByBooking(bookingId))
                .build();
    }

    @GetMapping("/item/{itemId}")
    public ApiResponse<List<ReviewResponse>> getReviewsByItemId(@PathVariable("itemId") UUID itemId) {
        return ApiResponse.<List<ReviewResponse>>builder()
                .message("Get reviews by item successfully")
                .result(reviewService.getReviewsByItemId(itemId))
                .build();
    }
}
