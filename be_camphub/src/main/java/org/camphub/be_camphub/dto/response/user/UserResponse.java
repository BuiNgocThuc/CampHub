package org.camphub.be_camphub.dto.response.user;

import org.camphub.be_camphub.enums.UserType;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    Long id;

    String lastname;

    String firstname;

    String phone_number;

    String email;

    String ID_number;

    String avatar;

    int trust_score;

    double CampHub_coin;

    String userType;

    UserType status;
}
