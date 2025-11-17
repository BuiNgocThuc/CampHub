import { TransactionStatus, TransactionType } from "../constants";

export interface TransactionBooking {
  transactionId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;

  // Booking info
  bookingId: string;
  itemId: string;        // item liên quan
  itemName: string;    // tên item
  lesseeId: string;      // người thuê
  lessorId: string;      // chủ thuê

  lesseeName: string;
  lessorName: string;
}
