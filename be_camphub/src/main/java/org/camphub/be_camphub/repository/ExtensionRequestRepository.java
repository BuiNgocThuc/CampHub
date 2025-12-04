package org.camphub.be_camphub.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.ExtensionRequest;
import org.camphub.be_camphub.enums.ExtensionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtensionRequestRepository extends JpaRepository<ExtensionRequest, UUID> {
    List<ExtensionRequest> findByStatusAndCreatedAtBefore(ExtensionStatus status, LocalDateTime createdAt);

    boolean existsByBookingIdAndStatus(UUID bookingId, ExtensionStatus status);

    @Query(
            """
	SELECT er FROM ExtensionRequest er
	WHERE (:status IS NULL OR er.status = :status)
	AND (:bookingId IS NULL OR er.bookingId = :bookingId)
	AND (:lesseeId IS NULL OR er.lesseeId = :lesseeId)
	AND (:lessorId IS NULL OR er.lessorId = :lessorId)
	ORDER BY er.createdAt DESC
	""")
    List<ExtensionRequest> findAllFiltered(
            @Param("status") String status,
            @Param("bookingId") UUID bookingId,
            @Param("lesseeId") UUID lesseeId,
            @Param("lessorId") UUID lessorId);
}
