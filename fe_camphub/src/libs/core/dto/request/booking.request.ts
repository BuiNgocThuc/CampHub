import { MediaResource } from "../../types";

export interface BookingCreationRequest {
    items: BookingItemRequest[];
}

export interface BookingItemRequest {
    cartItemId: string;  // UUID
    startDate: string;   // yyyy-MM-dd
    endDate: string;     // yyyy-MM-dd
    quantity: number;
    pricePerDay: number;
    depositAmount: number;
    note: string;
}

export interface LesseeReturnRequest {
    bookingId: string;      // UUID
    note?: string;
    mediaUrls: MediaResource[];    // Cloudinary URLs
}

export interface OwnerConfirmationRequest {
    bookingId: string;      // UUID
    isAccept: boolean;
    deliveryNote?: string;
    packagingMediaUrls?: MediaResource[]; // Cloudinary URLs
}

