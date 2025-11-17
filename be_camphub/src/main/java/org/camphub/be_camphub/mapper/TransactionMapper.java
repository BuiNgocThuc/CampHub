package org.camphub.be_camphub.mapper;

import org.camphub.be_camphub.dto.response.transaction.TransactionDetailResponse;
import org.camphub.be_camphub.dto.response.transaction.TransactionResponse;
import org.camphub.be_camphub.entity.Booking;
import org.camphub.be_camphub.entity.Item;
import org.camphub.be_camphub.entity.Transaction;
import org.camphub.be_camphub.entity.TransactionBooking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    @Mapping(target = "senderName", ignore = true) // sẽ set trong service
    @Mapping(target = "receiverName", ignore = true) // sẽ set trong service
    TransactionResponse entityToResponse(Transaction transaction);

    @Mapping(target = "transactionId", source = "transaction.id")
    @Mapping(target = "amount", source = "transaction.amount")
    @Mapping(target = "type", source = "transaction.type")
    @Mapping(target = "status", source = "transaction.status")
    @Mapping(target = "createdAt", source = "transaction.createdAt")
    @Mapping(target = "bookingId", source = "booking.id")
    @Mapping(target = "itemId", source = "item.id")
    @Mapping(target = "itemName", source = "item.name")
    @Mapping(target = "lesseeId", source = "booking.lesseeId")
    @Mapping(target = "lessorId", source = "booking.lessorId")
    @Mapping(target = "lesseeName", ignore = true) // sẽ set trong service
    @Mapping(target = "lessorName", ignore = true) // sẽ set trong service
    TransactionDetailResponse toTransactionDetailResponse(Transaction transaction, TransactionBooking transactionBooking, Booking booking, Item item);
}
