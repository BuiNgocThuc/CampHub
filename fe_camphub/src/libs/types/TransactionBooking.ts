export interface TransactionBooking {
  id: string;              // UUID
  transactionId: string;   // liên kết Transaction
  bookingId: string;       // liên kết Booking
  createdAt: string;       // ISO datetime
}
