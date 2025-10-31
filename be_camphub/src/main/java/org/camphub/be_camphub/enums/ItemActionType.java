package org.camphub.be_camphub.enums;

public enum ItemActionType {
    CREATE,
    UPDATE,
    DELETE,
    APPROVE,
    REJECT,
    LOCK,
    UNLOCK,
    RENT,
    REJECT_RENTAL,
    APPROVE_RENTAL,
    DELIVER, // khi chủ giao hàng (upload ảnh/video)
    RETURN, // khi khách trả hàng (upload ảnh/video)
    CHECK_RETURN, // khi chủ kiểm tra hàng trả
    REFUND, // khi hệ thống hoàn cọc
    DAMAGE_REPORTED, // nếu phát hiện hư hỏng
    RETURN_REQUESTED, // khi khách yêu cầu trả hàng
    UNRETURNED,
}
