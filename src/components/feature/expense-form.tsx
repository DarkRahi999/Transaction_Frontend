"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, TransactionFormData, addTransaction } from '@/services/transaction.service';
import { TransactionRes } from '@/interface/book';

interface ExpenseFormProps {
  onTransactionAdded: (transaction: TransactionRes) => void;
}

export function ExpenseForm({ onTransactionAdded }: ExpenseFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema.omit({ 
      id: true, 
      balance: true, 
      createdAt: true, 
      updatedAt: true 
    })),
    defaultValues: {
      amount: 0,
      type: 'income',
      category: 'salary',
      transactionDate: new Date().toISOString().split('T')[0],
    }
  });

  const onSubmit = async (data: TransactionFormData) => {
    setIsSubmitting(true);
    try {
      const newTransaction = await addTransaction(data);
      onTransactionAdded(newTransaction);
      reset();
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert(error instanceof Error ? error.message : 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
        <input
          type="number"
          {...register('amount', { valueAsNumber: true })}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0.00"
        />
        {errors.amount && <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select
          {...register('type')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          {...register('category')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="salary">Salary</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <option value="entertainment">Entertainment</option>
          <option value="utilities">Utilities</option>
          <option value="healthcare">Healthcare</option>
          <option value="shopping">Shopping</option>
          <option value="other">Other</option>
        </select>
        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          {...register('transactionDate')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.transactionDate ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.transactionDate && <p className="mt-1 text-sm text-red-600">{errors.transactionDate.message}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          {...register('description')}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Description"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>
      
      <div className="lg:col-span-5 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}