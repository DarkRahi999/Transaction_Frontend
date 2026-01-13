import { API_URLS } from "@/config/configURL";
import { 
  TransactionRes, 
  TransactionSummary, 
  DailySummary, 
  MonthlySummary, 
  YearlySummary, 
  WeeklySummary, 
  TotalSummaryReport,
  PaginatedResponse
} from "@/interface/transaction";
import axios, { AxiosResponse } from "axios";

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

// Service functions
export async function getTransactions(): Promise<TransactionRes[]> {
  try {
    const response = await axios.get<unknown, AxiosResponse<TransactionRes[]>>(
      API_URLS.transaction.getTransactions()
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to fetch transactions"
    );
  }
}

export async function getPaginatedTransactions(page: number = 1, limit: number = 10): Promise<PaginatedResponse<TransactionRes>> {
  try {
    const response = await axios.get<unknown, AxiosResponse<PaginatedResponse<TransactionRes>>>(
      API_URLS.transaction.getPaginatedTransactions(page, limit)
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to fetch paginated transactions"
    );
  }
}

export async function getTransaction(id: number): Promise<TransactionRes> {
  try {
    const response = await axios.get<unknown, AxiosResponse<TransactionRes>>(
      API_URLS.transaction.getTransaction(id)
    );
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to fetch transaction"
    );
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
    
    const response = await axios.post<unknown, AxiosResponse<TransactionRes>>(
      API_URLS.transaction.addTransaction(),
      validatedData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new Error(firstError.message);
    }
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to add transaction"
    );
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
    
    const response = await axios.patch<unknown, AxiosResponse<TransactionRes>>(
      API_URLS.transaction.updateTransaction(id),
      validatedData
    );
    return response.data;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      throw new Error(firstError.message);
    }
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to update transaction"
    );
  }
}

export async function deleteTransaction(id: number): Promise<void> {
  try {
    await axios.delete<unknown>(API_URLS.transaction.deleteTransaction(id));
  } catch (error: unknown) {
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to delete transaction"
    );
  }
}

// App level summary reports
export async function getMonthlySummary(): Promise<any> {
  try {
    const response = await axios.get(API_URLS.summary.getCurrentMonth());
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to fetch monthly summary"
    );
  }
}

export async function getYearlySummary(): Promise<any> {
  try {
    const response = await axios.get(API_URLS.summary.getCurrentYearly());
    return response.data;
  } catch (error: unknown) {
    throw new Error(
      axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : "Failed to fetch yearly summary"
    );
  }
}
