package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.springframework.data.annotation.CreatedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "carts")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "account_id", nullable = false)
    UUID accountId;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now();
}
