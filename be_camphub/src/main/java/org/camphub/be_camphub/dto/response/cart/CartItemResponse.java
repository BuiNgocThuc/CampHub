package org.camphub.be_camphub.dto.response.cart;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    UUID id;
    UUID cartId;
    UUID itemId;

    // Item details
    String itemName;
    // image URL of the item
    String itemImage;

    BigDecimal depositAmount;

    Integer quantity;
    Integer rentalDays;
    BigDecimal price;
    BigDecimal subtotal;

    Boolean isAvailable; // if quantity are available
}
