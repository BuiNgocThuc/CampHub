package org.camphub.be_camphub.dto.request.account;

import java.time.LocalDateTime;

import org.camphub.be_camphub.enums.UserStatus;
import org.camphub.be_camphub.enums.UserType;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AccountPatchRequest {
    String password;

    String firstname;

    String lastname;

    String email;

    String phoneNumber;

    String idNumber;

    String avatar;

    Integer trustScore = 100;

    Double coinBalance = 0.0;

    UserType userType;

    UserStatus status;

    LocalDateTime createdAt = LocalDateTime.now();

    LocalDateTime updatedAt;

    LocalDateTime deletedAt;
}
