package org.camphub.be_camphub.enums;

public enum BookingStatus {
    PENDING_CONFIRM, // đợi chủ thuê xác nhận
    PAID_REJECTED, // đã thanh toán nhưng bị từ chối
    WAITING_DELIVERY, // chờ giao hàng
    IN_USE, // đang sử dụng
    DUE_FOR_RETURN, // đến hạn trả
    RETURNED_PENDING_CHECK, // đã trả, chờ kiểm tra
    RETURN_REFUND_REQUESTED, // đã trả, yêu cầu hoàn tiền
    RETURN_REFUND_PROCESSING, // chủ thuê đã xác nhận trả, chờ admin xử lý hoàn tiền
    WAITING_REFUND, // chờ hoàn tiền
    COMPLETED, // hoàn thành
    DISPUTE_PENDING_REVIEW, // khiếu nại, chờ xử lý
    COMPENSATION_COMPLETED, // bồi thường hoàn thành
    LATE_RETURN, // trả muộn
    OVERDUE, // quá hạn
    DAMAGED_ITEM, // hàng trả bị hư hỏng
    FORFEITED, // mất đồ
}
