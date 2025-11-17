package org.camphub.be_camphub.controller;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.booking.BookingCreationRequest;
import org.camphub.be_camphub.dto.request.booking.LesseeReturnRequest;
import org.camphub.be_camphub.dto.request.booking.OwnerConfirmationRequest;
import org.camphub.be_camphub.dto.response.ApiResponse;
import org.camphub.be_camphub.dto.response.booking.BookingResponse;
import org.camphub.be_camphub.service.BookingService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
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
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody BookingCreationRequest request) {
        UUID lesseeId = UUID.fromString(jwt.getClaim("userId"));
        List<BookingResponse> list = bookingService.rentSelectedCartItems(lesseeId, request);
        return ApiResponse.<List<BookingResponse>>builder()
                .message("Checkout successfully")
                .result(list)
                .build();
    }

    @PutMapping("/{bookingId}/owner-response")
    ApiResponse<BookingResponse> ownerResponse(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody OwnerConfirmationRequest request) {
        UUID lessorId = UUID.fromString(jwt.getClaim("userId"));
        BookingResponse resp = bookingService.ownerRespondBooking(lessorId, request);
        return ApiResponse.<BookingResponse>builder()
                .message("Owner response processed")
                .result(resp)
                .build();
    }

    @PutMapping("/{bookingId}/confirm-received")
    ApiResponse<BookingResponse> confirmReceived(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID bookingId) {
        UUID lesseeId = UUID.fromString(jwt.getClaim("userId"));
        BookingResponse resp = bookingService.lesseeConfirmReceived(lesseeId, bookingId);
        return ApiResponse.<BookingResponse>builder()
                .message("Confirmed received successfully")
                .result(resp)
                .build();
    }

    @PutMapping("/{bookingId}/return")
    ApiResponse<BookingResponse> returnItem(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody LesseeReturnRequest request) {
        UUID lesseeId = UUID.fromString(jwt.getClaim("userId"));
        BookingResponse resp = bookingService.lesseeReturnItem(lesseeId, request);
        return ApiResponse.<BookingResponse>builder()
                .message("Return request submitted successfully")
                .result(resp)
                .build();
    }

    @PutMapping("/{bookingId}/lessor-confirm-return")
    ApiResponse<BookingResponse> lessorConfirmReturn(
            @AuthenticationPrincipal Jwt jwt,
            @PathVariable UUID bookingId) {
        UUID lessorId = UUID.fromString(jwt.getClaim("userId"));
        BookingResponse resp = bookingService.lessorConfirmReturn(lessorId, bookingId);
        return ApiResponse.<BookingResponse>builder()
                .message("Lessor confirmed return successfully")
                .result(resp)
                .build();
    }

    @PostMapping("/{bookingId}/process-refund")
    ApiResponse<Void> processRefund(@PathVariable UUID bookingId) {
        bookingService.processRefundAndReturn(bookingId);
        return ApiResponse.<Void>builder()
                .message("Refund/return processed successfully")
                .build();
    }

    @GetMapping("/lessee/{lesseeId}")
    ApiResponse<List<BookingResponse>> getBookingsByLessee(@PathVariable UUID lesseeId) {
        return ApiResponse.<List<BookingResponse>>builder()
                .message("Get bookings by lessee")
                .result(bookingService.getBookingsByLessee(lesseeId))
                .build();
    }

    @GetMapping("/lessor/{lessorId}")
    ApiResponse<List<BookingResponse>> getBookingsByLessor(@PathVariable UUID lessorId) {
        return ApiResponse.<List<BookingResponse>>builder()
                .message("Get bookings by lessor")
                .result(bookingService.getBookingsByLessor(lessorId))
                .build();
    }
}

