package org.camphub.be_camphub.dto.request.cart;

import java.util.List;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartCreationRequest {
    UUID accountId;
    List<CartItemCreationRequest> items;
}
