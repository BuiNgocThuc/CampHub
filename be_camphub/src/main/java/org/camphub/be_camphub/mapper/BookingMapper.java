package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.request.booking.BookingItemRequest;
import org.camphub.be_camphub.dto.response.booking.BookingResponse;
import org.camphub.be_camphub.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "lesseeId", ignore = true) // sẽ set trong service
    @Mapping(target = "lessorId", ignore = true) // lấy từ CartItem
    @Mapping(target = "itemId", ignore = true) // lấy từ CartItem
    @Mapping(target = "status", constant = "PENDING_CONFIRM")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    @Mapping(target = "updatedAt", ignore = true)
    Booking creationRequestToEntity(BookingItemRequest request);

    @Mapping(target = "itemName", ignore = true)
    @Mapping(target = "lessorName", ignore = true)
    @Mapping(target = "lesseeName", ignore = true)
    @Mapping(target = "totalAmount", expression = "java(booking.getPricePerDay() * booking.getQuantity())")
    BookingResponse entityToResponse(Booking booking);
}
