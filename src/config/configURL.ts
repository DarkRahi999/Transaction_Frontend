import { BASE_URL } from "./const";

// W<Comment>---------={ Backend Api End Point }=----------</Comment>
const API = `${BASE_URL}/api`;

export const API_URLS = {
  transaction: {
    getTransactions: () => `${API}/transactions`,
    getPaginatedTransactions: (page: number, limit: number) => `${API}/transactions/paginated?page=${page}&limit=${limit}`,
    getTransaction: (id: number) => `${API}/transactions/${id}`,
    addTransaction: () => `${API}/transactions`,
    updateTransaction: (id: number) => `${API}/transactions/${id}`,
    deleteTransaction: (id: number) => `${API}/transactions/${id}`,
    getSummary: () => `${API}/transactions/summary`,
    getDailySummary: (date: string) => `${API}/transactions/daily-summary?date=${date}`,
    getMonthlySummary: (year: number, month: number) => `${API}/transactions/monthly-summary?year=${year}&month=${month}`,
    getYearlySummary: (year: number) => `${API}/transactions/yearly-summary?year=${year}`,
  },
  // App level summary reports
  summary: {
    getTotal: () => `${API}/summary-report`,
    getWeekly: (startDate: string) => `${API}/weekly-summary?startDate=${startDate}`,
    getMonthly: (year: number, month: number) => `${API}/monthly-summary?year=${year}&month=${month}`,
    getCurrentMonth: () => `${API}/current-month-summary`,
    getPaginatedMonthly: (page: number, limit: number) => `${API}/paginated-monthly-summaries?page=${page}&limit=${limit}`,
    getPaginatedYearly: (page: number, limit: number) => `${API}/paginated-yearly-summaries?page=${page}&limit=${limit}`,
    getYearly: (year: number) => `${API}/yearly-summary?year=${year}`,
  }
};