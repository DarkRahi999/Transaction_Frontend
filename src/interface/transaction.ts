export interface TransactionRes {
  id: number;
  amount: number;
  type: string;
  category: string;
  description: string;
  transactionDate: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
}