package org.camphub.be_camphub.enums;

public enum ItemStatus {
    PENDING_APPROVAL, // default status when user CREATE OR UPDATE an item.
    AVAILABLE, // APPROVED
    REJECTED,
    RENTED_PENDING_CONFIRM, // when lessee waiting for lessor confirm the rental while blocking others
    RENTED,
    RETURN_PENDING_CHECK, // when lessee has returned the item but waiting for lessor to check
    BANNED,
    DELETED, // soft delete when owner want to remove the item.
    MISSING,
}
