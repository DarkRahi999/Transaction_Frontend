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

export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  netBalance: number;
}

export interface DailySummary {
  date: string;
  totalIncome: number;
  totalExpense: number;
  net: number;
  transactions: Pick<TransactionRes, 'id' | 'amount' | 'type' | 'category' | 'description'>[];
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface YearlySummary {
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface WeeklySummary {
  period: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  transactionCount: number;
}

export interface TotalSummaryReport {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  netBalance: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
