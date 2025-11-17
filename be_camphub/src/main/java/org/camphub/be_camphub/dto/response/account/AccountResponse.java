package org.camphub.be_camphub.dto.response.account;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponse {
    String id;
    String username;
    String firstname;
    String lastname;
    String email;
    String phoneNumber;
    String idNumber;
    String avatar;

    Double trustScore;
    Double coinBalance;

    String userType;
    String status;

    String createdAt;
    String updatedAt;
}
