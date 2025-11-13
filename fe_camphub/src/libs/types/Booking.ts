import { BookingStatus } from "../constants";

export interface Booking {
    id: string; // UUID

    lesseeId: string;   // người thuê
    lessorId: string;   // chủ cho thuê
    itemId: string;     // sản phẩm được thuê

    quantity: number;
    pricePerDay: number;
    depositAmount: number;

    startDate: string; // ISO date (yyyy-MM-dd)
    endDate: string;   // ISO date (yyyy-MM-dd)

    note?: string | null;

    status: BookingStatus;

    createdAt: string; // ISO datetime
    updatedAt: string;
}
