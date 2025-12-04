package org.camphub.be_camphub.service.impl;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.notification.NotificationCreationRequest;
import org.camphub.be_camphub.dto.request.review.ReviewCreationRequest;
import org.camphub.be_camphub.dto.response.review.ReviewResponse;
import org.camphub.be_camphub.entity.Account;
import org.camphub.be_camphub.entity.Item;
import org.camphub.be_camphub.entity.Review;
import org.camphub.be_camphub.enums.NotificationType;
import org.camphub.be_camphub.enums.ReferenceType;
import org.camphub.be_camphub.mapper.ReviewMapper;
import org.camphub.be_camphub.repository.AccountRepository;
import org.camphub.be_camphub.repository.ItemRepository;
import org.camphub.be_camphub.repository.ReviewRepository;
import org.camphub.be_camphub.service.NotificationService;
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
    NotificationService notificationService;

    @Override
    public ReviewResponse createReview(ReviewCreationRequest request) {
        Review review = reviewMapper.toEntity(request);
        Review saved = reviewRepository.save(review);

        // thông báo cho người được review có review mới
        notificationService.create(NotificationCreationRequest.builder()
                .receiverId(request.getReviewedId())
                .senderId(request.getReviewerId())
                .type(NotificationType.REVIEW_SUBMITTED)
                .title("Bạn có đánh giá mới")
                .content("Bạn vừa nhận một đánh giá mới về đơn thuê hoặc sản phẩm.")
                .referenceType(ReferenceType.REVIEW)
                .referenceId(saved.getId())
                .build());

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
        return reviews.stream().map(this::enrichReviewResponse).toList();
    }

    private ReviewResponse enrichReviewResponse(Review review) {
        ReviewResponse response = reviewMapper.toResponse(review);

        // Load reviewer (1 query duy nhất)
        Account reviewer = accountRepository.findById(review.getReviewerId()).orElse(null);
        if (reviewer != null) {
            response.setReviewerName(reviewer.getLastname() + " " + reviewer.getFirstname());
            response.setReviewerAvatar(reviewer.getAvatar());
        } else {
            response.setReviewerName("Unknown Reviewer");
            response.setReviewerAvatar(null);
        }

        // Load item (1 query duy nhất)
        Item item = itemRepository.findById(review.getItemId()).orElse(null);
        response.setItemName(item != null ? item.getName() : "Unknown Item");

        return response;
    }
}
