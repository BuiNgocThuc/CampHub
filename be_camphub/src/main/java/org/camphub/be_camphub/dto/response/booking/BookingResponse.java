package org.camphub.be_camphub.dto.response.booking;

import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingResponse {
    UUID id;
    UUID lesseeId;
    UUID lessorId;
    UUID itemId;

    String itemName;
    String lessorName; // tên đầy đủ của người cho thuê
    String lesseeName; // tên đầy đủ của người thuê

    Integer quantity;
    Double pricePerDay;
    Double depositAmount;
    Double totalAmount;
    String startDate;
    String endDate;
    String note;
    String status;
    String createdAt;
    Boolean hasReviewed;
}
