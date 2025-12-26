import { Notification } from "@/libs/core/types";
import { NotificationType, ReferenceType } from "@/libs/core/constants";

/**
 * Utility function to get the route for a notification based on its type and reference
 * @param notification - The notification object
 * @param isAdmin - Whether the user is an admin
 * @returns The route path to navigate to
 */
export function getNotificationRoute(
    notification: Notification,
    isAdmin: boolean = false
): string | null {
    const { type, referenceType, referenceId } = notification;

    // Admin notifications - go to admin pages
    if (isAdmin) {
        switch (type) {
            case NotificationType.ITEM_PENDING_APPROVAL:
                return `/admin/items?status=PENDING_APPROVAL${referenceId ? `&itemId=${referenceId}` : ""}`;

            case NotificationType.DISPUTE_CREATED:
                return `/admin/disputes${referenceId ? `?disputeId=${referenceId}` : ""}`;

            case NotificationType.RETURN_REQUEST_PENDING:
                return `/admin/return-requests${referenceId ? `?returnRequestId=${referenceId}` : ""}`;

            default:
                // For admin, also handle booking-related notifications
                if (referenceType === ReferenceType.BOOKING) {
                    return `/admin/bookings${referenceId ? `?bookingId=${referenceId}` : ""}`;
                }
                if (referenceType === ReferenceType.ITEM) {
                    return `/admin/items${referenceId ? `?itemId=${referenceId}` : ""}`;
                }
                break;
        }
    }

    // User/Profile notifications
    switch (referenceType) {
        case ReferenceType.BOOKING:
            // Booking-related notifications go to rental orders (lessor) or rental history (lessee)
            // Since we can't determine if user is lessor or lessee here, default to rental orders
            // The page itself will filter correctly based on user's role
            if (
                type === NotificationType.BOOKING_CREATED ||
                type === NotificationType.BOOKING_APPROVED ||
                type === NotificationType.BOOKING_REJECTED ||
                type === NotificationType.BOOKING_CANCELLED ||
                type === NotificationType.BOOKING_RETURNED ||
                type === NotificationType.RENTAL_PAYMENT_SUCCESS
            ) {
                return `/CampHub/profile?tab=rental-orders${referenceId ? `&bookingId=${referenceId}` : ""}`;
            }
            break;

        case ReferenceType.RETURN_REQUEST:
            if (
                type === NotificationType.RETURN_REQUEST_CREATED ||
                type === NotificationType.RETURN_REQUEST_APPROVED ||
                type === NotificationType.RETURN_REQUEST_REJECTED ||
                type === NotificationType.DEPOSIT_REFUNDED
            ) {
                return `/CampHub/profile?tab=rental-orders${referenceId ? `&returnRequestId=${referenceId}` : ""}`;
            }
            break;

        case ReferenceType.EXTENSION_REQUEST:
            if (
                type === NotificationType.EXTENSION_REQUEST_CREATED ||
                type === NotificationType.EXTENSION_REQUEST_APPROVED ||
                type === NotificationType.EXTENSION_REQUEST_REJECTED
            ) {
                return `/CampHub/profile?tab=rental-orders${referenceId ? `&extensionRequestId=${referenceId}` : ""}`;
            }
            break;

        case ReferenceType.DISPUTE:
            if (
                type === NotificationType.DAMAGE_REPORTED ||
                type === NotificationType.DISPUTE_RESOLVED_ACCEPTED ||
                type === NotificationType.DISPUTE_RESOLVED_REJECTED
            ) {
                return `/CampHub/profile?tab=my-disputes${referenceId ? `&disputeId=${referenceId}` : ""}`;
            }
            break;

        case ReferenceType.ITEM:
            if (
                type === NotificationType.ITEM_APPROVED ||
                type === NotificationType.ITEM_REJECTED ||
                type === NotificationType.ITEM_BANNED ||
                type === NotificationType.ITEM_UNBANNED
            ) {
                // For item notifications, navigate to the item detail page
                return referenceId ? `/CampHub/items/${referenceId}` : `/CampHub/profile?tab=my-items`;
            }
            if (type === NotificationType.REVIEW_SUBMITTED) {
                // Review notifications go to item detail page to see reviews
                return referenceId ? `/CampHub/items/${referenceId}?tab=reviews` : `/CampHub/profile?tab=my-items`;
            }
            break;

        case ReferenceType.REVIEW:
            if (type === NotificationType.REVIEW_SUBMITTED) {
                // If we have an item reference, go to item detail to see reviews
                // Otherwise, go to profile
                return referenceId ? `/CampHub/items/${referenceId}?tab=reviews` : `/CampHub/profile`;
            }
            break;

        case ReferenceType.TRANSACTION:
            // Transaction notifications can go to transaction history or profile
            return `/CampHub/profile?tab=transactions${referenceId ? `&transactionId=${referenceId}` : ""}`;

        default:
            // Default to profile page
            return `/CampHub/profile`;
    }

    // Fallback: navigate to profile page
    return `/CampHub/profile`;
}

