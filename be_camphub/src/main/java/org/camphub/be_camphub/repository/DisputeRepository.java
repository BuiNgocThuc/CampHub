package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.camphub.be_camphub.entity.Dispute;
import org.camphub.be_camphub.enums.DisputeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisputeRepository extends JpaRepository<Dispute, UUID> {
    Optional<Dispute> findByBookingId(UUID bookingId);

    List<Dispute> findByReporterId(UUID reporterId);

    List<Dispute> findByStatus(DisputeStatus status);

    boolean existsByDamageTypeId(UUID damageTypeId);
}
