package org.camphub.be_camphub.repository;

import org.camphub.be_camphub.entity.ItemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface MediaRepository extends JpaRepository<ItemLog, UUID> {
    @Query(value = """
        SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END 
        FROM (
            -- 1. Check trong lịch sử thuê/trả (Item Logs)
            SELECT m.file_hash 
            FROM item_log_media m 
            JOIN item_logs l ON m.item_log_id = l.id 
            WHERE l.item_id = :itemId AND m.file_hash = :hash
            
            UNION ALL
            
            -- 2. Check trong lịch sử yêu cầu trả hàng (Return Requests)
            SELECT m.file_hash 
            FROM return_request_evidences m
            JOIN return_requests r ON m.return_request_id = r.id
            JOIN bookings b ON r.booking_id = b.id
            WHERE b.item_id = :itemId AND m.file_hash = :hash
            
            UNION ALL
            
            -- 3. Check trong lịch sử khiếu nại (Disputes)
            SELECT m.file_hash 
            FROM dispute_media m
            JOIN disputes d ON m.dispute_id = d.id
            JOIN bookings b ON d.booking_id = b.id
            WHERE b.item_id = :itemId AND m.file_hash = :hash
            
        ) AS combined_check
    """, nativeQuery = true)
    boolean existsByFileHashAndItemId(@Param("hash") String hash, @Param("itemId") UUID itemId);
}
