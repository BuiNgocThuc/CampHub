package org.camphub.be_camphub.dto.request.user;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserCreationRequest {
    String username;

    String password;

    String lastname;

    String firstname;

    String phone_number;

    String email;

    String ID_number;

    String avatar;

    String userType;
}
