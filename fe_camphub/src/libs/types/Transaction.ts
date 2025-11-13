import { TransactionStatus, TransactionType } from "../constants";

export interface Transaction {
  id: string;                       // UUID
  fromAccountId: string;    // tài khoản gửi
  toAccountId: string;      // tài khoản nhận
  amount: number;                   // số tiền
  type: TransactionType;            // DEPOSIT, REFUND, PAYMENT, ...
  status: TransactionStatus;        // PENDING, COMPLETED, FAILED
  createdAt: string;                // ISO datetime
}
