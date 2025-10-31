package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.booking.BookingCreationRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.booking.BookingResponse;
import org.camphub.be_camphub.service.BookingService;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
@FieldDefaults(level = lombok.AccessLevel.PRIVATE, makeFinal = true)
public class BookingController {
    BookingService bookingService;

    @PostMapping("/checkout")
    ApiResponse<List<BookingResponse>> checkout(
            @RequestHeader("X-Account-Id") UUID lesseeId, @RequestBody BookingCreationRequest request) {
        List<BookingResponse> list = bookingService.rentSelectedCartItems(lesseeId, request);
        return ApiResponse.<List<BookingResponse>>builder().result(list).build();
    }

    /**
     * Owner accept/reject
     */
    @PutMapping("/{bookingId}/owner-response")
    ApiResponse<BookingResponse> ownerResponse(
            @RequestHeader("X-Account-Id") UUID lessorId,
            @PathVariable UUID bookingId,
            @RequestParam boolean accept,
            @RequestParam(required = false) String deliveryNote) {
        BookingResponse resp = bookingService.ownerRespondBooking(lessorId, bookingId, accept, deliveryNote);
        return ApiResponse.<BookingResponse>builder().result(resp).build();
    }

    @PutMapping("/{bookingId}/confirm-received")
    ApiResponse<BookingResponse> confirmReceived(
            @RequestHeader("X-Account-Id") UUID lesseeId, @PathVariable UUID bookingId) {
        BookingResponse resp = bookingService.lesseeConfirmReceived(lesseeId, bookingId);
        return ApiResponse.<BookingResponse>builder().result(resp).build();
    }

    @GetMapping("/lessee/{lesseeId}")
    ApiResponse<java.util.List<BookingResponse>> getBookingsByLessee(@PathVariable UUID lesseeId) {
        return ApiResponse.<java.util.List<BookingResponse>>builder()
                .result(bookingService.getBookingsByLessee(lesseeId))
                .build();
    }

    @GetMapping("/lessor/{lessorId}")
    ApiResponse<java.util.List<BookingResponse>> getBookingsByLessor(@PathVariable UUID lessorId) {
        return ApiResponse.<java.util.List<BookingResponse>>builder()
                .result(bookingService.getBookingsByLessor(lessorId))
                .build();
    }
}
