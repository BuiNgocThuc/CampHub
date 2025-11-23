package org.camphub.be_camphub.service;

import java.util.List;
import java.util.UUID;

import org.camphub.be_camphub.dto.request.booking.BookingCreationRequest;
import org.camphub.be_camphub.dto.request.booking.LesseeReturnRequest;
import org.camphub.be_camphub.dto.request.booking.OwnerConfirmationRequest;
import org.camphub.be_camphub.dto.response.booking.BookingResponse;

public interface BookingService {
    /**
     * Checkout: tạo booking cho các cartItem được chọn, trừ coin, chuyển coin vào system wallet,
     * cập nhật trạng thái item (tạm) và xóa cart items.
     * Trả về list BookingResponse (mỗi booking tương ứng 1 item).
     */
    List<BookingResponse> rentSelectedCartItems(UUID lesseeId, BookingCreationRequest request);
    /**
     * Chủ (lessor) xác nhận (accept=true) hoặc từ chối (accept=false) 1 booking.
     * Nếu từ chối: refund deposit & rental (to lessee), set item BANNED và trừ trust score lessor.
     * Nếu chấp nhận: set WAITING_DELIVERY, lưu delivery log, set item status RENTED (hoặc RENTED_PENDING).
     */
    BookingResponse ownerRespondBooking(UUID lessorId, OwnerConfirmationRequest request);
    /**
     * Khách xác nhận đã nhận hàng (hoặc auto sau 24h) -> set IN_USE, ghi log RENT.
     */
    BookingResponse lesseeConfirmReceived(UUID lesseeId, UUID bookingId);

    List<BookingResponse> getBookingsByLessee(UUID lesseeId);

    List<BookingResponse> getBookingsByLessor(UUID lessorId);
    List<BookingResponse> getAllBookings();

    /*
     * Khách trả hàng
     */
    BookingResponse lesseeReturnItem(UUID lesseeId, LesseeReturnRequest request);

    BookingResponse lessorConfirmReturn(UUID lessorId, UUID bookingId);

    void processRefundAndReturn(UUID bookingId);

    //        chạy mỗi giờ để cập nhật trạng thái trả hàng trễ.
    void checkAndUpdateLateReturns();
}
