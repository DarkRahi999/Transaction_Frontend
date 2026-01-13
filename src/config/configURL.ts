import { BASE_URL } from "./const";

// W<Comment>---------={ Backend Api End Point }=----------</Comment>
const API = `${BASE_URL}/api`;

export const API_URLS = {
  transaction: {
    getTransactions: () => `${API}/transactions`,
    getTransaction: (id: number) => `${API}/transactions/${id}`,
    getPaginatedTransactions: (page: number, limit: number) => `${API}/transactions/paginated?page=${page}&limit=${limit}`,
    addTransaction: () => `${API}/transactions`,
    updateTransaction: (id: number) => `${API}/transactions/${id}`,
    deleteTransaction: (id: number) => `${API}/transactions/${id}`,
  },
  // App level summary reports
  summary: {
    getCurrentMonth: () => `${API}/monthly-summary`,
    getCurrentYearly: () => `${API}/yearly-summary`,
  }
};