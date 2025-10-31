package org.camphub.be_camphub.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import org.camphub.be_camphub.enums.UserType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "users")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @Column(unique = true, nullable = false)
    String username;

    String password;

    @Column(unique = true, nullable = false)
    String lastname;

    String firstname;

    String phone_number;

    String email;

    String ID_number;

    String avatar;

    int trust_score;

    double CampHub_coin;

    UserType userType;

    String status;

    LocalDateTime createdAt;

    LocalDateTime updatedAt;

    LocalDateTime deletedAt;
}
