package org.camphub.be_camphub.enums;

public enum NotificationType {
    // Booking notifications
    BOOKING_CREATED, // Có khách đặt thuê
    BOOKING_APPROVED, // Chủ thuê đồng ý thuê
    BOOKING_REJECTED, // Chủ thuê từ chối thuê
    BOOKING_CANCELLED, // Có khách hủy thuê
    BOOKING_RETURNED, // Khách đã trả đồ

    // Payment notifications
    RENTAL_PAYMENT_SUCCESS, // Thanh toán tiền thuê thành công
    DEPOSIT_REFUNDED, // Hoàn cọc thành công

    // Return request notifications
    RETURN_REQUEST_CREATED, // Khách tạo yêu cầu trả hàng/hoàn tiền
    RETURN_REQUEST_APPROVED, // Yêu cầu trả hàng được chấp nhận
    RETURN_REQUEST_REJECTED, // Yêu cầu trả hàng bị từ chối

    // Extension request notifications
    EXTENSION_REQUEST_CREATED, // Có yêu cầu gia hạn thuê
    EXTENSION_REQUEST_APPROVED, // Yêu cầu gia hạn được chấp nhận
    EXTENSION_REQUEST_REJECTED, // Yêu cầu gia hạn bị từ chối

    // Review notifications
    REVIEW_SUBMITTED, // Có khách đánh giá

    // Dispute notifications
    DAMAGE_REPORTED, // Có báo hư hỏng
    DISPUTE_RESOLVED_ACCEPTED, // Khiếu nại được chấp nhận (gửi cho lessee + lessor)
    DISPUTE_RESOLVED_REJECTED, // Khiếu nại bị từ chối (gửi cho lessee + lessor)

    // Item notifications (gửi cho chủ đồ)
    ITEM_APPROVED, // Sản phẩm đã được duyệt
    ITEM_REJECTED, // Sản phẩm bị từ chối
    ITEM_BANNED, // Sản phẩm bị khóa
    ITEM_UNBANNED, // Sản phẩm được mở khóa

    // Admin notifications (broadcast - gửi cho tất cả admin)
    ITEM_PENDING_APPROVAL, // Có sản phẩm mới cần phê duyệt
    DISPUTE_CREATED, // Có đơn khiếu nại cần giải quyết
    RETURN_REQUEST_PENDING // Có yêu cầu trả hàng/hoàn tiền cần xem xét
}
