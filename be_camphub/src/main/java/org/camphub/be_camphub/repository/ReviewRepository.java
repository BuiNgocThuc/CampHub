package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByReviewedId(UUID reviewedId);

    List<Review> findByBookingId(UUID bookingId);

    List<Review> findAllByItemIdOrderByCreatedAtDesc(UUID itemId);

    boolean existsByBookingIdAndReviewerId(UUID bookingId, UUID reviewerId);
}
