package org.camphub.be_camphub.exception;

import lombok.Setter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
public enum ErrorCode {
    UNCATEGORIZED_EXCEPTION(9999, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHORIZED(1000, "Unauthorized", HttpStatus.UNAUTHORIZED),
    INVALID_KEY(1001, "Invalid key", HttpStatus.BAD_REQUEST),
    FILE_UPLOAD_FAILED(1002, "File upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
    UNAUTHENTICATED(1003, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    INVALID_AMOUNT(1004, "Invalid amount", HttpStatus.BAD_REQUEST),
    USERNAME_EXISTED(1011, "Username already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(1012, "User not found", HttpStatus.NOT_FOUND),
    INVALID_PASSWORD(1013, "Your password is incorrect", HttpStatus.UNAUTHORIZED),
    EMAIL_EXISTED(1014, "Email already exists", HttpStatus.BAD_REQUEST),
    CART_ITEM_NOT_FOUND(2001, "Cart item not found", HttpStatus.NOT_FOUND),
    CART_NOT_FOUND(2002, "Cart not found", HttpStatus.NOT_FOUND),
    CART_ITEM_NOT_BELONG_TO_USER(2003, "Cart item does not belong to user", HttpStatus.FORBIDDEN),
    CATEGORY_NOT_FOUND(3001, "Category not found", HttpStatus.NOT_FOUND),
    ITEM_NOT_FOUND(4001, "Item not found", HttpStatus.NOT_FOUND),
    ITEM_BANNED_CANNOT_UPDATE(4002, "Invalid item status", HttpStatus.BAD_REQUEST),
    ITEM_CANNOT_DELETE(4003, "Cannot delete the unavailable item", HttpStatus.BAD_REQUEST),
    ITEM_NOT_AVAILABLE(4004, "Item is not available for rent", HttpStatus.BAD_REQUEST),
    SYSTEM_WALLET_NOT_FOUND(5001, "System wallet not found", HttpStatus.NOT_FOUND),
    INVALID_RENTAL_DATES(6001, "Invalid rental dates", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_BALANCE(6002, "Insufficient balance", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_FOUND(6003, "Booking not found", HttpStatus.NOT_FOUND),
    INVALID_BOOKING_STATUS(6004, "Invalid booking status", HttpStatus.BAD_REQUEST),
    BOOKING_NOT_BELONG_TO_USER(6005, "Booking does not belong to user", HttpStatus.FORBIDDEN),
    EXTENSION_ALREADY_PENDING(
            7001, "There is already a pending extension request for this booking", HttpStatus.BAD_REQUEST),
    INVALID_EXTENSION_DATE(7002, "Invalid extension date", HttpStatus.BAD_REQUEST),
    EXTENSION_NOT_FOUND(7003, "Extension request not found", HttpStatus.NOT_FOUND),
    INVALID_EXTENSION_STATUS(7004, "Invalid extension request status", HttpStatus.BAD_REQUEST),
    RETURN_REQUEST_NOT_FOUND(8001, "Return request not found", HttpStatus.NOT_FOUND),
    INVALID_RETURN_REQUEST_STATUS(8002, "Invalid return request status", HttpStatus.BAD_REQUEST),
    DAMAGE_TYPE_NOT_FOUND(9001, "Damage type not found", HttpStatus.NOT_FOUND),
    DISPUTE_NOT_FOUND(9002, "Dispute not found", HttpStatus.NOT_FOUND),
    DAMAGE_TYPE_NAME_EXISTED(9003, "Damage type name already exists", HttpStatus.BAD_REQUEST),
    TRANSACTION_NOT_FOUND(10001, "Transaction not found", HttpStatus.NOT_FOUND)
    ;

    int code;
    String message;
    HttpStatusCode httpStatusCode;

    public void setMessage(String message) {
        this.message = message;
    }
}
