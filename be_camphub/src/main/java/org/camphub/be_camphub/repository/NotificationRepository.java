package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {
    List<Notification> findAllByReceiverIdOrderByCreatedAtDesc(UUID receiverId);

    Integer countByReceiverIdAndIsReadFalse(UUID receiverId);

    List<Notification> findByReceiverIdOrIsBroadcastTrueOrderByCreatedAtDesc(UUID receiverId);

    @Query(
            "SELECT COUNT(n) FROM Notification n WHERE (n.receiverId = :receiverId OR n.isBroadcast = true) AND n.isRead = false")
    Integer countUnreadByReceiverIdOrBroadcast(UUID receiverId);
}
