package org.camphub.be_camphub.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.camphub.be_camphub.entity.ReturnRequest;
import org.camphub.be_camphub.enums.ReturnRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, UUID> {
    List<ReturnRequest> findByStatus(ReturnRequestStatus status);

    List<ReturnRequest> findByStatusAndCreatedAtBefore(ReturnRequestStatus status, LocalDateTime threshold);

    Optional<ReturnRequest> findByBookingId(UUID bookingId);

    Optional<ReturnRequest> findFirstByBookingIdAndStatusIn(UUID bookingId, List<ReturnRequestStatus> statuses);
}
