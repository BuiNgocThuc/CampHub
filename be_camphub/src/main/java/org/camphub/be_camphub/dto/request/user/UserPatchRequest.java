package org.camphub.be_camphub.dto.request.user;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserPatchRequest {
    String lastname;

    String firstname;

    String phone_number;

    String email;

    String ID_number;

    String avatar;
}
