// libs/mappers/booking.mapper.ts
import { createMapper, createMap, forMember, mapFrom } from "@automapper/core";
import { pojos, PojosMetadataMap } from "@automapper/pojos";

import { Booking } from "../types";
import { BookingResponse } from "../dto/response";
import {
    BookingCreationRequest,
    BookingItemRequest,
    LesseeReturnRequest,
} from "../dto/request";

export const bookingMapper = createMapper({
    strategyInitializer: pojos(),
});

PojosMetadataMap.create<Booking>("Booking", {
    id: String,
    lesseeId: String,
    lessorId: String,
    itemId: String,
    itemName: String,
    lessorName: String,
    lesseeName: String,
    quantity: Number,
    pricePerDay: Number,
    depositAmount: Number,
    totalAmount: Number,
    startDate: String,
    endDate: String,
    note: String,
    status: String,
    createdAt: String,
    hasReviewed: Boolean,
});

PojosMetadataMap.create<BookingResponse>("BookingResponse", {
    id: String,
    lesseeId: String,
    lessorId: String,
    itemId: String,
    itemName: String,
    lessorName: String,
    lesseeName: String,
    quantity: Number,
    pricePerDay: Number,
    depositAmount: Number,
    totalAmount: Number,
    startDate: String,
    endDate: String,
    note: String,
    status: String,
    createdAt: String,
    hasReviewed: Boolean,
});

PojosMetadataMap.create<BookingCreationRequest>("BookingCreationRequest", {
    items: Array,
});

PojosMetadataMap.create<BookingItemRequest>("BookingItemRequest", {
    cartItemId: String,
    startDate: String,
    endDate: String,
    quantity: Number,
    pricePerDay: Number,
    depositAmount: Number,
    note: String,
});

PojosMetadataMap.create<LesseeReturnRequest>("LesseeReturnRequest", {
    bookingId: String,
    note: String,
    mediaUrls: Array,
});

// Mapping chính
createMap<BookingResponse, Booking>(bookingMapper, "BookingResponse", "Booking");

createMap<Booking, BookingCreationRequest>(
    bookingMapper,
    "Booking",
    "BookingCreationRequest",
    forMember(
        (d) => d.items,
        mapFrom((s) => [
            {
                cartItemId: s.itemId,
                startDate: s.startDate,
                endDate: s.endDate,
                quantity: s.quantity,
                pricePerDay: s.pricePerDay,
                depositAmount: s.depositAmount,
                note: s.note ?? "",
            } as BookingItemRequest,
        ])
    )
);

createMap<Booking, LesseeReturnRequest>(
    bookingMapper,
    "Booking",
    "LesseeReturnRequest",
    forMember((d) => d.bookingId, mapFrom((s) => s.id)),
    forMember((d) => d.note, mapFrom((s) => s.note ?? "")),
    forMember((d) => d.mediaUrls, mapFrom(() => []))
);

createMap<Booking, BookingResponse>(bookingMapper, "Booking", "BookingResponse");

// Export mapper helper
export const bookingMap = {
    fromResponse: (dto: BookingResponse): Booking =>
        bookingMapper.map<BookingResponse, Booking>(dto, "BookingResponse", "Booking"),

    toCreationRequest: (model: Booking): BookingCreationRequest =>
        bookingMapper.map<Booking, BookingCreationRequest>(model, "Booking", "BookingCreationRequest"),

    toLesseeReturn: (model: Booking): LesseeReturnRequest =>
        bookingMapper.map<Booking, LesseeReturnRequest>(model, "Booking", "LesseeReturnRequest"),

    toResponse: (model: Booking): BookingResponse =>
        bookingMapper.map<Booking, BookingResponse>(model, "Booking", "BookingResponse"),
};