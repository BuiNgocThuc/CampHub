import { BookingStatus } from "../../constants";


export interface BookingResponse {
    id: string;
    lesseeId: string;
    lessorId: string;
    itemId: string;

    itemName: string;
    lessorName: string;
    lesseeName: string;

    quantity: number;
    pricePerDay: number;
    depositAmount: number;
    totalAmount: number;

    startDate: string;       // yyyy-MM-dd
    endDate: string;         // yyyy-MM-dd
    
    note: string;
    status: BookingStatus;
    createdAt: string;       // ISO datetime
    hasReviewed: boolean;
}
