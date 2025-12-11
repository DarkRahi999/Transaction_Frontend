import { BASE_URL } from "./const";

// W<Comment>---------={ Backend Api End Point }=----------</Comment>
const API = `${BASE_URL}/api`;

export const API_URLS = {
  transaction: {
    getTransactions: () => `${API}/transactions`,
    getTransaction: (id: number) => `${API}/transactions/${id}`,
    addTransaction: () => `${API}/transactions`,
    updateTransaction: (id: number) => `${API}/transactions/${id}`,
    deleteTransaction: (id: number) => `${API}/transactions/${id}`,
    getSummary: () => `${API}/transactions/summary`,
    getDailySummary: (date: string) => `${API}/transactions/daily-summary?date=${date}`,
  },
};