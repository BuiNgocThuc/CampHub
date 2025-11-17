import { TransactionStatus, TransactionType } from "../constants";

export interface Transaction {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;

  senderName: string;
  receiverName: string;
}
