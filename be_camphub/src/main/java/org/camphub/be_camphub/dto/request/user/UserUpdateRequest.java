package org.camphub.be_camphub.dto.request.user;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserUpdateRequest {
    String lastname;

    String firstname;

    String phone_number;

    String email;

    String ID_number;

    String avatar;
}
