"use client";

import { useState, useEffect } from 'react';
import { TransactionRes } from '@/interface/book';
import { getTransactions, deleteTransaction, getTransactionSummary, getMonthlySummary, TransactionSummary, MonthlySummary } from '@/services/transaction.service';
import { ExpenseForm } from '@/components/feature/expense-form';
import { EditTransactionForm } from '@/components/feature/edit-transaction-form';

export default function ExpenseTracker() {
  const [transactions, setTransactions] = useState<TransactionRes[]>([]);
  const [summary, setSummary] = useState<TransactionSummary>({ 
    totalIncome: 0, 
    totalExpense: 0, 
    currentBalance: 0,
    netBalance: 0
  });
  const [monthlySummaries, setMonthlySummaries] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState<TransactionRes | null>(null);

  // Fetch transactions and summary
  useEffect(() => {
    fetchTransactions();
    fetchSummary();
    fetchMonthlySummaries();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      console.log('Fetched transactions:', data); // Debug log
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const data = await getTransactionSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchMonthlySummaries = async () => {
    try {
      const data = await getMonthlySummary();
      console.log('Fetched monthly summaries:', data); // Debug log
      setMonthlySummaries(data);
    } catch (error) {
      console.error('Error fetching monthly summaries:', error);
    }
  };

  const handleTransactionAdded = (newTransaction: TransactionRes) => {
    setTransactions(prev => [newTransaction, ...prev]);
    fetchSummary(); // Refresh summary
    fetchMonthlySummaries(); // Refresh monthly summaries
  };

  const handleTransactionUpdated = (updatedTransaction: TransactionRes) => {
    setTransactions(prev => 
      prev.map(transaction => 
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
    setEditingTransaction(null);
    fetchSummary(); // Refresh summary
    fetchMonthlySummaries(); // Refresh monthly summaries
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(transaction => transaction.id !== id));
      fetchSummary(); // Refresh summary
      fetchMonthlySummaries(); // Refresh monthly summaries
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert(error instanceof Error ? error.message : 'Failed to delete transaction');
    }
  };

  const startEditing = (transaction: TransactionRes) => {
    setEditingTransaction(transaction);
  };

  const cancelEditing = () => {
    setEditingTransaction(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800">Daily Expense Tracker</h1>
          <p className="text-gray-600 mt-2">Track your income and expenses effortlessly</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Total Income</h3>
            <p className="text-3xl font-bold text-green-500 mt-2">৳{summary.totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Total Expenses</h3>
            <p className="text-3xl font-bold text-red-500 mt-2">৳{summary.totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-700">Current Balance</h3>
            <p className={`text-3xl font-bold mt-2 ${summary.netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ৳{summary.netBalance.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Monthly Summary Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Summary</h2>
          {monthlySummaries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {monthlySummaries.map((summary, index) => (
                    <tr key={`${summary.month}-${summary.year}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {summary.month} {summary.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        ৳{summary.totalIncome.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        ৳{summary.totalExpense.toFixed(2)}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${summary.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ৳{summary.netBalance.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No monthly data available</p>
          )}
        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Transaction</h2>
          <ExpenseForm onTransactionAdded={handleTransactionAdded} />
        </div>

        {/* Edit Transaction Form (if editing) */}
        {editingTransaction && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Transaction</h2>
            <EditTransactionForm 
              transaction={editingTransaction} 
              onTransactionUpdated={handleTransactionUpdated}
              onCancel={cancelEditing}
            />
          </div>
        )}

        {/* Transactions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
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
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ৳{transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ৳{transaction.balance?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => startEditing(transaction)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
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
          </div>
        </div>
      </div>
    </div>
  );
}