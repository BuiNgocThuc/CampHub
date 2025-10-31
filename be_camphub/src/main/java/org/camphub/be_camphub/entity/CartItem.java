package org.camphub.be_camphub.entity;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.*;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Table(name = "cart_items")
@FieldDefaults(level = AccessLevel.PRIVATE)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    UUID id;

    @Column(name = "cart_id", nullable = false)
    UUID cartId;

    @Column(name = "item_id", nullable = false)
    UUID itemId;

    Integer quantity = 1;

    @Column(name = "rental_days")
    Integer rentalDays = 1;

    @Column(nullable = false, precision = 10, scale = 2)
    Double price; // giá thuê của 1 sản phẩm / 1 ngày tại thời điểm thêm

    @Column(precision = 12, scale = 2)
    BigDecimal subtotal; // = price * quantity * rentalDays

    //        @PrePersist
    //        @PreUpdate
    //        private void calculateSubtotal() {
    //                if (price != null && quantity != null && rentalDays != null) {
    //                        this.subtotal = price
    //                                .multiply(BigDecimal.valueOf(quantity))
    //                                .multiply(BigDecimal.valueOf(rentalDays));
    //                }
    //        }
}
