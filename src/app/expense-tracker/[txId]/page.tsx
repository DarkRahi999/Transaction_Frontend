"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getTransaction } from '@/services/transaction.service';
import { EditTransactionForm } from '@/components/feature/TransactionEditForm';
import { TransactionRes } from '@/interface/transaction';

export default function EditTransactionPage() {
  const router = useRouter();
  const params = useParams();
  const txId = params.txId as string;
  const [transaction, setTransaction] = useState<TransactionRes | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTransaction = useCallback(async () => {
    try {
      const data = await getTransaction(Number(txId));
      setTransaction(data);
    } catch (error) {
      console.error('Error fetching transaction:', error);
    } finally {
      setLoading(false);
    }
  }, [txId]);

  useEffect(() => {
    if (txId) {
      fetchTransaction();
    }
  }, [txId, fetchTransaction]);

  const handleTransactionUpdated = () => {
    router.push('/');
  };

  const handleCancel = () => {
    router.push('/');
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
          <h1 className="text-3xl font-bold text-gray-800">Edit Transaction</h1>
          <p className="text-gray-600 mt-2">Update your transaction details</p>
        </div>

        {/* Edit Transaction Form */}
        <div className="bg-white rounded-lg shadow p-6">
          {transaction ? (
            <EditTransactionForm 
              transaction={transaction} 
              onTransactionUpdated={handleTransactionUpdated}
              onCancel={handleCancel}
            />
          ) : (
            <p className="text-gray-500 text-center py-4">Transaction not found</p>
          )}
        </div>
      </div>
    </div>
  );
}