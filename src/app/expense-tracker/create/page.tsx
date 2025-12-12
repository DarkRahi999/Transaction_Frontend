"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseForm } from '@/components/feature/TransactionForm';
import { getTransactions } from '@/services/transaction.service';
import { TransactionRes } from '@/interface/transaction';

export default function CreateTransactionPage() {
  const router = useRouter();
  const [recentTransactions, setRecentTransactions] = useState<TransactionRes[]>([]);

  const handleTransactionAdded = () => {
    router.push('/expense-tracker');
  };

  // Fetch recent transactions
  const fetchRecentTransactions = async () => {
    try {
      const allTransactions = await getTransactions();
      // Get the last 10 transactions
      const last10Transactions = allTransactions.slice(0, 10);
      setRecentTransactions(last10Transactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
    }
  };

  useEffect(() => {
    fetchRecentTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-800">Add New Transaction</h1>
          <p className="text-gray-600 mt-2">Record a new income or expense</p>
        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <ExpenseForm onTransactionAdded={handleTransactionAdded} />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            {recentTransactions.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent transactions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}