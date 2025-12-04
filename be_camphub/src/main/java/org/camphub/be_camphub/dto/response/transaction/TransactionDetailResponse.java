package org.camphub.be_camphub.dto.response.transaction;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TransactionDetailResponse {
    UUID transactionId;
    Double amount;
    String type;
    String status;
    String createdAt;

    // Booking info
    UUID bookingId;
    UUID itemId; // item liên quan
    String itemName; // tên item
    UUID lesseeId; // người thuê
    String lesseeName; // tên người thuê
    UUID lessorId; // chủ thuê
    String lessorName; // tên chủ thuê
}
