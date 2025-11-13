package org.camphub.be_camphub.dto.response.account;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AccountResponse {
    String username;

    String password;

    String firstname;

    String lastname;

    String email;

    String phoneNumber;

    String idNumber;

    String avatar;
}
