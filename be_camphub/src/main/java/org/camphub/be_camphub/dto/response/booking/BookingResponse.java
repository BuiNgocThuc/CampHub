package org.camphub.be_camphub.dto.response.booking;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.camphub.be_camphub.enums.BookingStatus;

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
    String lessorName;
    Integer quantity;
    Double pricePerDay;
    Double depositAmount;
    Double totalAmount;
    LocalDate startDate;
    LocalDate endDate;
    String note;
    BookingStatus status;
    LocalDateTime createdAt;
}
