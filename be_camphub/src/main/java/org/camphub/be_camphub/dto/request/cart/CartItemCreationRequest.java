package org.camphub.be_camphub.dto.request.cart;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemCreationRequest {
    UUID itemId;
    Integer quantity;
    Integer rentalDays;
    BigDecimal price;
}
