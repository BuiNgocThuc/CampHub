package org.camphub.be_camphub.enums;

public enum ItemStatus {
    PENDING_APPROVAL, // default status when user CREATE OR UPDATE an item.
    AVAILABLE, // APPROVED
    REJECTED, // when admin reject the item.
    RENTED_PENDING_CONFIRM, // when lessee waiting for lessor confirm the rental while blocking others
    RENTED, // when item is rented out
    RETURN_PENDING_CHECK, // when lessee has returned the item but waiting for lessor to check
    BANNED, // when admin ban the item due to violation
    DELETED, // soft delete when owner want to remove the item.
    MISSING, // having any dispute
}
