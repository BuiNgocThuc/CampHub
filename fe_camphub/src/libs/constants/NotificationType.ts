export enum NotificationType {
    BOOKING_CREATED = "BOOKING_CREATED", // Có khách đặt thuê
    BOOKING_CANCELLED = "BOOKING_CANCELLED", // Có khách hủy thuê
    BOOKING_RETURNED = "BOOKING_RETURNED", // Khách đã trả đồ
    REVIEW_SUBMITTED = "REVIEW_SUBMITTED", // Có khách đánh giá
    DEPOSIT_REFUNDED = "DEPOSIT_REFUNDED", // Hoàn cọc thành công
    DAMAGE_REPORTED = "DAMAGE_REPORTED" // Có báo hư hỏng
}