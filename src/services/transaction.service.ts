import { API_URLS } from "@/config/configURL";
import axios, { AxiosResponse } from "axios";
import { TransactionRes } from "@/interface/book";

// Zod schemas for validation
import { z } from "zod";

// Define enums for transaction types and categories
const TransactionTypeEnum = z.enum(["income", "expense"]);
const TransactionCategoryEnum = z.enum([
  "salary", "food", "transport", "entertainment", 
  "utilities", "healthcare", "shopping", "other"
]);

// Zod schema for transaction
export const transactionSchema = z.object({
  id: z.number().optional(),
  amount: z.number().positive("Amount must be positive"),
  type: TransactionTypeEnum,
  category: TransactionCategoryEnum,
  description: z.string().max(191, "Description must be at most 191 characters").optional(),
  transactionDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  balance: z.number().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Type inference from Zod schema
export type TransactionFormData = z.infer<typeof transactionSchema>;
export type TransactionType = z.infer<typeof TransactionTypeEnum>;
export type TransactionCategory = z.infer<typeof TransactionCategoryEnum>;

// Response interfaces
export interface TransactionSummary {
  totalIncome: number;
  totalExpense: number;
  currentBalance: number;
  netBalance: number;
}

export interface MonthlySummary {
  month: string;
  year: number;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}

// Service functions
export async function getTransactions(): Promise<TransactionRes[]> {
  try {
    const response = await axios.get<any, AxiosResponse<TransactionRes[]>>(
      API_URLS.transaction.getTransactions()
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch transactions");
  }
}

export async function getTransaction(id: number): Promise<TransactionRes> {
  try {
    const response = await axios.get<any, AxiosResponse<TransactionRes>>(
      API_URLS.transaction.getTransaction(id)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch transaction");
  }
}

export async function addTransaction(data: TransactionFormData): Promise<TransactionRes> {
  try {
    // Validate data with Zod
    const validatedData = transactionSchema.omit({ 
      id: true, 
      balance: true, 
      createdAt: true, 
      updatedAt: true 
    }).parse(data);
    
    const response = await axios.post<any, AxiosResponse<TransactionRes>>(
      API_URLS.transaction.addTransaction(),
      validatedData
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new Error(firstError.message);
    }
    throw new Error(error.response?.data?.message || "Failed to add transaction");
  }
}

export async function updateTransaction(id: number, data: Partial<TransactionFormData>): Promise<TransactionRes> {
  try {
    // Validate data with Zod
    const validatedData = transactionSchema.partial().omit({ 
      id: true, 
      balance: true, 
      createdAt: true, 
      updatedAt: true 
    }).parse(data);
    
    const response = await axios.patch<any, AxiosResponse<TransactionRes>>(
      API_URLS.transaction.updateTransaction(id),
      validatedData
    );
    return response.data;
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new Error(firstError.message);
    }
    throw new Error(error.response?.data?.message || "Failed to update transaction");
  }
}

export async function deleteTransaction(id: number): Promise<void> {
  try {
    await axios.delete(API_URLS.transaction.deleteTransaction(id));
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to delete transaction");
  }
}

export async function getTransactionSummary(): Promise<TransactionSummary> {
  try {
    const response = await axios.get<any, AxiosResponse<TransactionSummary>>(
      API_URLS.transaction.getSummary()
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch summary");
  }
}

export async function getDailySummary(date: string): Promise<any> {
  try {
    const response = await axios.get(
      API_URLS.transaction.getDailySummary(date)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to fetch daily summary");
  }
}

export async function getMonthlySummary(): Promise<MonthlySummary[]> {
  try {
    // Since there's no dedicated backend endpoint, we'll group transactions by month
    const transactions = await getTransactions();
    
    // Check if we have transactions
    if (!transactions || transactions.length === 0) {
      return [];
    }
    
    // Group transactions by month/year
    const monthlyData: Record<string, { income: number; expense: number; year: number; month: string }> = {};
    
    transactions.forEach(transaction => {
      // Validate transaction date
      const date = new Date(transaction.transactionDate);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date for transaction:', transaction);
        return;
      }
      
      const monthYearKey = `${date.getFullYear()}-${date.getMonth()}`;
      const monthName = date.toLocaleString('default', { month: 'long' });
      const year = date.getFullYear();
      
      if (!monthlyData[monthYearKey]) {
        monthlyData[monthYearKey] = { income: 0, expense: 0, year, month: monthName };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthYearKey].income += transaction.amount;
      } else {
        monthlyData[monthYearKey].expense += transaction.amount;
      }
    });
    
    // Convert to array and calculate net balance
    const result: MonthlySummary[] = Object.values(monthlyData).map(item => ({
      month: item.month,
      year: item.year,
      totalIncome: parseFloat(item.income.toFixed(2)),
      totalExpense: parseFloat(item.expense.toFixed(2)),
      netBalance: parseFloat((item.income - item.expense).toFixed(2))
    })).sort((a, b) => {
      // Sort by year first (descending), then by month
      if (b.year !== a.year) {
        return b.year - a.year;
      }
      
      // For the same year, sort by month (descending - recent months first)
      // We'll use the month names to get proper ordering
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const monthIndexA = months.indexOf(a.month);
      const monthIndexB = months.indexOf(b.month);
      
      return monthIndexB - monthIndexA; // Descending order
    });
    
    return result;
  } catch (error: any) {
    console.error('Error in getMonthlySummary:', error);
    throw new Error(error.response?.data?.message || "Failed to fetch monthly summary");
  }
}