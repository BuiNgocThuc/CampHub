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
    RETURN, // khi khách trả hàng (upload ảnh/video)
    CHECK_RETURN, // khi chủ kiểm tra hàng trả
    DISPUTE, // khiếu nại
    RESOLVE_DISPUTE,
    UNRETURNED,
}
