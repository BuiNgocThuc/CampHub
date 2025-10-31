package org.camphub.be_camphub.dto.request.cart;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemUpdateRequest {
    Integer quantity;
    Integer rentalDays;
}
