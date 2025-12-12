"use client";

import { motion } from "motion/react";
import { fadeUpAnimation } from "@/lib/utils";
import { useEffect, useState } from "react";
import useAsyncAction from "@/hook/useAsyncAction";
import { getPaginatedMonthlySummaries, getPaginatedYearlySummaries, getTotalSummaryReport } from "@/services/transaction.service";
import { MonthlySummary, YearlySummary } from "@/interface/transaction";
import Link from "next/link";
import { Plus, Minus, Eye } from "lucide-react";

export default function Home() {
  const fnLoadTotalSummary = useAsyncAction(getTotalSummaryReport);
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [yearlySummaries, setYearlySummaries] = useState<YearlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [yearlyLoading, setYearlyLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNext: false,
    hasPrevious: false
  });
  
  const [yearlyPagination, setYearlyPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    hasNext: false,
    hasPrevious: false
  });

  const fetchMonthlySummaries = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await getPaginatedMonthlySummaries(page, 5);
      setMonthlySummaries(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalRecords: response.totalRecords,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious
      });
    } catch (error) {
      console.error("Error fetching monthly summaries:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchYearlySummaries = async (page: number = 1) => {
    setYearlyLoading(true);
    try {
      const response = await getPaginatedYearlySummaries(page, 5);
      setYearlySummaries(response.data);
      setYearlyPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalRecords: response.totalRecords,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious
      });
    } catch (error) {
      console.error("Error fetching yearly summaries:", error);
    } finally {
      setYearlyLoading(false);
    }
  };

  useEffect(() => {
    fnLoadTotalSummary.action();
    fetchMonthlySummaries(1);
    fetchYearlySummaries(1);
  }, [fnLoadTotalSummary]);
  
  const handlePageChange = (page: number) => {
    fetchMonthlySummaries(page);
  };
  
  const handleYearlyPageChange = (page: number) => {
    fetchYearlySummaries(page);
  };
  
  return (
    <div className="min-h-screen bg-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          className="text-center pt-8 pb-12"
          {...fadeUpAnimation(30, 0.5, 0.3)}
        >
          {/* Header */}
          <div className="text-center pt-4 pb-8">
            <h1 className="text-3xl font-bold text-gray-800">Daily Expense Tracker</h1>
            <p className="text-gray-600 mt-2">Track your income and expenses effortlessly</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-700">Total Income</h3>
              <p className="text-3xl font-bold text-green-500 mt-2">
                ৳{fnLoadTotalSummary.data?.totalIncome?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-700">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-500 mt-2">
                ৳{fnLoadTotalSummary.data?.totalExpense?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-700">Current Balance</h3>
              <p className={`text-3xl font-bold mt-2 ${fnLoadTotalSummary.data?.netBalance ? (fnLoadTotalSummary.data?.netBalance >= 0 ? 'text-green-500' : 'text-red-500') : 'text-gray-500'}`}>
                ৳{fnLoadTotalSummary.data?.netBalance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {/* Mini Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link href="/expense-tracker/create?type=income" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center">
                <div className="bg-green-100 p-1 rounded-full mr-4">
                  <Plus className="text-green-600 font-bold text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Add Income</h3>
              </div>
            </Link>

            <Link href="/expense-tracker/create?type=expense" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center">
                <div className="bg-red-100 p-1 rounded-full mr-4">
                  <Minus className="text-red-600 font-bold text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Add Expense</h3>
              </div>
            </Link>

            <Link href="/expense-tracker" className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-center">
                <div className="bg-blue-100 p-1 rounded-full mr-4">
                  <Eye className="text-blue-600 font-bold text-xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">View Transactions</h3>
              </div>
            </Link>
          </div>

          {/* Monthly Summary Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary (Last 12 Months)</h2>
            {loading ? (
              <p className="text-gray-500 text-center py-4">Loading...</p>
            ) : monthlySummaries.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Month</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Income</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Expenses</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Net</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlySummaries.map((summary, index) => (
                        <tr key={`${summary.month}-${summary.year}-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {summary.month} {summary.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            ৳{summary.totalIncome?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            ৳{summary.totalExpense?.toFixed(2) || '0.00'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ৳{summary.netBalance?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => handlePageChange(number)}
                          className={`px-3 py-1 rounded-md mx-1 ${
                            pagination.currentPage === number
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">No monthly data available</p>
            )}
          </div>
          
          {/* Yearly Summary Section */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Yearly Summary (Last 4 Years)</h2>
            {yearlyLoading ? (
              <p className="text-gray-500 text-center py-4">Loading...</p>
            ) : yearlySummaries.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Year</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Income</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Expenses</th>
                        <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider"> _Net</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {yearlySummaries.map((summary, index) => (
                        <tr key={`${summary.year}-${index}`}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {summary.year}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                            ৳{summary.totalIncome?.toFixed(2) || '0.00'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                            ৳{summary.totalExpense?.toFixed(2) || '0.00'}
                          </td>
                          <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ৳{summary.netBalance?.toFixed(2) || '0.00'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                {yearlyPagination.totalPages > 1 && (
                  <div className="flex justify-center mt-4">
                    <nav className="inline-flex rounded-md shadow">
                      {Array.from({ length: yearlyPagination.totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => handleYearlyPageChange(number)}
                          className={`px-3 py-1 rounded-md mx-1 ${
                            yearlyPagination.currentPage === number
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {number}
                        </button>
                      ))}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">No yearly data available</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}