package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.springframework.data.annotation.CreatedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "transaction_booking")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionBooking {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "transaction_id", nullable = false)
    UUID transactionId;

    @Column(name = "booking_id", nullable = false)
    UUID bookingId;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt;
}
