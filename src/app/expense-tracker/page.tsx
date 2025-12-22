"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPaginatedTransactions, getMonthlySummaryByTransaction, deleteTransaction } from '@/services/transaction.service';
import { TransactionRes, MonthlySummary } from '@/interface/transaction';
import { Eye, Minus, Plus } from 'lucide-react';

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<TransactionRes[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary>({ totalIncome: 0, totalExpense: 0, netBalance: 0, month: '', year: 0, transactionCount: 0 });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0
  });

  // Fetch current month summary
  const fetchCurrentMonthSummary = async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // JavaScript months are 0-indexed
      const data = await getMonthlySummaryByTransaction(year, month);
      setMonthlySummary(data);
    } catch (error) {
      console.error('Error fetching current month summary:', error);
    }
  };

  // Fetch paginated transactions
  const fetchTransactions = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await getPaginatedTransactions(page, 10);
      setTransactions(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalRecords: response.totalRecords
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete transaction
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        // Refresh the transaction list
        fetchTransactions(pagination.currentPage);
        // Also refresh the monthly summary
        fetchCurrentMonthSummary();
      } catch (error) {
        console.error('Error deleting transaction:', error);
        alert('Failed to delete transaction');
      }
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  useEffect(() => {
    fetchCurrentMonthSummary();
    fetchTransactions(1);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800">Daily Expense Tracker</h1>
          <p className="text-gray-600 mt-2">Track your income and expenses effortlessly</p>
        </div>

        {/* Current Month Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Current Month Income</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">৳{monthlySummary.totalIncome?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Current Month Expenses</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">৳{monthlySummary.totalExpense?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Current Month Balance</h3>
            <p className={`text-3xl font-bold mt-2 ${monthlySummary.netBalance ? (monthlySummary.netBalance >= 0 ? 'text-green-500' : 'text-red-500') : 'text-gray-500'}`}>
              ৳{monthlySummary.netBalance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Mini Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
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

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading transactions...</p>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.transactionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {transaction.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                          {transaction.type}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                          ৳{transaction.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ৳{transaction.balance?.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            href={`/expense-tracker/${transaction.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(transaction.id)}
                            className="ml-2 text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                          No transactions found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-4 pb-4">
                    <nav className="inline-flex rounded-md shadow">
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(number => (
                        <button
                          key={number}
                          onClick={() => handlePageChange(number)}
                          className={`px-3 py-1 rounded-md mx-1 ${pagination.currentPage === number
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}