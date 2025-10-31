package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.Booking;
import org.camphub.be_camphub.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findAllByLesseeIdOrderByCreatedAtDesc(UUID lessorId);

    List<Booking> findAllByLessorIdOrderByCreatedAtDesc(UUID lessorId);

    List<Booking> findAllByStatusOrderByCreatedAt(UUID lessorId, String status);

    List<Booking> findByStatus(BookingStatus status);
}
