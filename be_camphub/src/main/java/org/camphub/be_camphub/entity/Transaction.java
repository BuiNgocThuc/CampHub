package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.TransactionStatus;
import org.camphub.be_camphub.enums.TransactionType;
import org.springframework.data.annotation.CreatedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "transactions")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "from_account_id")
    UUID fromAccountId;

    @Column(name = "to_account_id")
    UUID toAccountId;

    Double amount;

    @Enumerated(EnumType.STRING)
    TransactionType type;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    TransactionStatus status = TransactionStatus.SUCCESS;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt = LocalDateTime.now();
}
