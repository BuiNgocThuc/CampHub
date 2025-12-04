package org.camphub.be_camphub.dto.response.auth;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MyInfoResponse {
    UUID id;
    String username;
    String avatarUrl;
    Integer cartItemCount;
    Integer unreadNotifications;
}
