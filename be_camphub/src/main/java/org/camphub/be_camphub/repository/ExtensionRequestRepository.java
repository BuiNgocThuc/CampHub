package org.camphub.be_camphub.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.ExtensionRequest;
import org.camphub.be_camphub.enums.ExtensionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExtensionRequestRepository extends JpaRepository<ExtensionRequest, UUID> {
    List<ExtensionRequest> findByStatusAndCreatedAtBefore(ExtensionStatus status, LocalDateTime createdAt);
}
