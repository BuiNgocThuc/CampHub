package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.UserStatus;
import org.camphub.be_camphub.enums.UserType;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "accounts")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(unique = true, nullable = false, length = 100)
    String username;

    @Column(nullable = false)
    String password;

    @Column(nullable = false)
    String firstname;

    @Column(nullable = false)
    String lastname;

    @Column(unique = true)
    String email;

    @Column(name = "phone_number")
    String phoneNumber;

    @Column(name = "id_number")
    String idNumber;

    String avatar;

    @Column(name = "trust_score")
    Integer trustScore = 100;

    @Column(name = "coin_balance")
    Double coinBalance = 0.0;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    UserType userType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    UserStatus status;

    @CreatedDate
    @Column(name = "created_at")
    LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    LocalDateTime updatedAt;

    @Column(name = "deleted_at")
    LocalDateTime deletedAt;
}
