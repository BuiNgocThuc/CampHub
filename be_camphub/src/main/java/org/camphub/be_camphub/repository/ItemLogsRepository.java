package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.ItemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemLogsRepository extends JpaRepository<ItemLog, UUID> {
    List<ItemLog> findAllByOrderByCreatedAtDesc();

    List<ItemLog> findAllByItemIdOrderByCreatedAtDesc(UUID itemId);

    List<ItemLog> findAllByAccountIdOrderByCreatedAtDesc(UUID accountId);
}
