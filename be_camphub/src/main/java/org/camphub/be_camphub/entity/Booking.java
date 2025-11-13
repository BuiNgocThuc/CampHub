package org.camphub.be_camphub.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.BookingStatus;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "bookings")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "lessee_id", nullable = false)
    UUID lesseeId;

    @Column(name = "lessor_id", nullable = false)
    UUID lessorId;

    @Column(name = "item_id", nullable = false)
    UUID itemId;

    @Column(nullable = false)
    Integer quantity = 1;

    @Column(name = "price_per_day")
    Double pricePerDay;

    @Column(name = "deposit_amount")
    Double depositAmount;

    @Column(name = "start_date")
    LocalDate startDate;

    @Column(name = "end_date")
    LocalDate endDate;

    @Column(length = 500)
    String note;

    @Enumerated(EnumType.STRING)
    BookingStatus status = BookingStatus.PENDING_CONFIRM;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @LastModifiedBy
    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
