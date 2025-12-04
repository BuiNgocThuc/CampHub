    export enum BookingStatus {
        PENDING_CONFIRM = "PENDING_CONFIRM", // Chờ chủ đồ xác nhận
        PAID_REJECTED = "PAID_REJECTED", // chủ đồ từ chối đơn
        WAITING_DELIVERY = "WAITING_DELIVERY", // chờ giao hàng
        IN_USE = "IN_USE", // đang thuê
        DUE_FOR_RETURN = "DUE_FOR_RETURN", // đến hạn trả
        RETURNED_PENDING_CHECK = "RETURNED_PENDING_CHECK", // đang giao trả
        RETURN_REFUND_REQUESTED = "RETURN_REFUND_REQUESTED", // đang trả hàng/hoàn tiền
        RETURN_REFUND_PROCESSING = "RETURN_REFUND_PROCESSING", // đã nhận hàng trả - chờ admin xử lý
        WAITING_REFUND = "WAITING_REFUND", // chử hoàn tiền
        COMPLETED = "COMPLETED", // hoàn thành
        DISPUTE_PENDING_REVIEW = "DISPUTE_PENDING_REVIEW", // có khiếu nại từ chủ thuê
        COMPENSATION_COMPLETED = "COMPENSATION_COMPLETED", // đã bồi thường
        LATE_RETURN = "LATE_RETURN", // đơn hàng trễ hạn trả
        OVERDUE = "OVERDUE", // đơn hàng quá hạn trả
        DAMAGED_ITEM = "DAMAGED_ITEM", // đồ bị hỏng
        FORFEITED = "FORFEITED", // đồ bị mất
    }