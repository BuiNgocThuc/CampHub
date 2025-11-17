package org.camphub.be_camphub.repository;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.entity.TransactionBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionBookingRepository extends JpaRepository<TransactionBooking, UUID> {
    // Lấy tất cả TransactionBooking theo bookingId
    List<TransactionBooking> findByBookingId(UUID bookingId);

    // Lấy tất cả TransactionBooking theo transactionId
    List<TransactionBooking> findByTransactionId(UUID transactionId);
}
