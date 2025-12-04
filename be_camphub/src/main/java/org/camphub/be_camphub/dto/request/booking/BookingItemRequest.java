package org.camphub.be_camphub.dto.request.booking;

import java.time.LocalDate;
import java.util.UUID;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BookingItemRequest {
    UUID cartItemId;
    LocalDate startDate;
    LocalDate endDate;
    Integer rentalDays;
    Integer quantity;
    Double pricePerDay;
    Double depositAmount;
    String note;
}
