// booking.mapper.ts
import { createMapper, createMap, forMember, mapFrom } from '@automapper/core';
import { pojos, PojosMetadataMap } from '@automapper/pojos';

import { Booking } from '../types';
import { BookingResponse } from '../dto/response';
import {
    BookingCreationRequest,
    BookingItemRequest,
    LesseeReturnRequest
} from '../dto/request';

export const bookingMapper = createMapper({
    strategyInitializer: pojos(),
});

// -----------------------------------------
// Metadata (simple, không cần khai field)
// -----------------------------------------
PojosMetadataMap.create<Booking>('Booking', {});
PojosMetadataMap.create<BookingResponse>('BookingResponse', {});
PojosMetadataMap.create<BookingCreationRequest>('BookingCreationRequest', {});
PojosMetadataMap.create<BookingItemRequest>('BookingItemRequest', {});
PojosMetadataMap.create<LesseeReturnRequest>('LesseeReturnRequest', {});

// =====================================================
// 1) Mapping: ResponseDTO → Model
// =====================================================
createMap<BookingResponse, Booking>(
    bookingMapper,
    'BookingResponse',
    'Booking'
);

// =====================================================
// 2) Mapping: Model → BookingCreationRequest
// FE không quyết định logic nhiều item — BE đã quyết định
// =====================================================
createMap<Booking, BookingCreationRequest>(
    bookingMapper,
    'Booking',
    'BookingCreationRequest',

    forMember(
        (d) => d.items,
        mapFrom((s) => [
            {
                cartItemId: s.itemId,
                lessorId: s.lessorId,
                startDate: s.startDate,
                endDate: s.endDate,
                quantity: s.quantity,
                pricePerDay: s.pricePerDay,
                depositAmount: s.depositAmount,
                note: s.note ?? ''
            } as BookingItemRequest
        ])
    )
);

// =====================================================
// 3) Mapping: Model → LesseeReturnRequest (Trả đồ)
// =====================================================
createMap<Booking, LesseeReturnRequest>(
    bookingMapper,
    'Booking',
    'LesseeReturnRequest',

    forMember((d) => d.bookingId, mapFrom((s) => s.id)),
    forMember((d) => d.note, mapFrom((s) => s.note ?? '')),
    forMember((d) => d.mediaUrls, mapFrom(() => [])) // FE sẽ override nếu có file upload
);

// (Optional) Model → ResponseDTO nếu UI muốn đồng bộ data
createMap<Booking, BookingResponse>(
    bookingMapper,
    'Booking',
    'BookingResponse'
);

// =====================================================
// =============== bookingMap API đơn giản ===============
// =====================================================
export const bookingMap = {
    /** ResponseDTO -> Model */
    fromResponse(dto: BookingResponse): Booking {
        return bookingMapper.map(dto, 'Booking', 'BookingResponse');
    },

    /** Model -> BookingCreationRequest */
    toCreationRequest(model: Booking): BookingCreationRequest {
        return bookingMapper.map(model, 'BookingCreationRequest', 'Booking');
    },

    /** Model -> LesseeReturnRequest */
    toLesseeReturn(model: Booking): LesseeReturnRequest {
        return bookingMapper.map(model, 'LesseeReturnRequest', 'Booking');
    },

    /** Model -> ResponseDTO (optional) */
    toResponse(model: Booking): BookingResponse {
        return bookingMapper.map(model, 'BookingResponse', 'Booking');
    }
};
