package org.camphub.be_camphub.service.impl;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.review.ReviewCreationRequest;
import org.camphub.be_camphub.dto.response.review.ReviewResponse;
import org.camphub.be_camphub.entity.Item;
import org.camphub.be_camphub.entity.Review;
import org.camphub.be_camphub.mapper.ReviewMapper;
import org.camphub.be_camphub.repository.AccountRepository;
import org.camphub.be_camphub.repository.ItemRepository;
import org.camphub.be_camphub.repository.ReviewRepository;
import org.camphub.be_camphub.service.ReviewService;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class ReviewServiceImpl implements ReviewService {
    ReviewRepository reviewRepository;
    AccountRepository accountRepository;
    ItemRepository itemRepository;
    ReviewMapper reviewMapper;

    @Override
    public ReviewResponse createReview(ReviewCreationRequest request) {
        Review review = reviewMapper.toEntity(request);
        Review saved = reviewRepository.save(review);
        return reviewMapper.toResponse(saved);
    }

    @Override
    public List<ReviewResponse> getReviewsByReviewed(UUID reviewedId) {
        return reviewRepository.findByReviewedId(reviewedId).stream()
                .map(this::enrichReviewResponse)
                .toList();
    }

    @Override
    public List<ReviewResponse> getReviewsByBooking(UUID bookingId) {
        return reviewRepository.findByBookingId(bookingId).stream()
                .map(this::enrichReviewResponse)
                .toList();
    }

    @Override
    public List<ReviewResponse> getReviewsByItemId(UUID itemId) {
        List<Review> reviews = reviewRepository.findAllByItemIdOrderByCreatedAtDesc(itemId);
        return reviews.stream()
                .map(this::enrichReviewResponse)
                .toList();
    }

    private ReviewResponse enrichReviewResponse(Review review) {
        ReviewResponse response = reviewMapper.toResponse(review);
        // load reviewerName
        String reviewerName = accountRepository.findById(review.getReviewerId())
                .map(account -> account.getLastname() + " " + account.getFirstname())
                .orElse("Unknown Reviewer");
        response.setReviewerName(reviewerName);

        // load itemName
        String itemName = itemRepository.findById(review.getItemId())
                .map(Item::getName)
                .orElse("Unknown Item");
        response.setItemName(itemName);

        return response;
    }
}
