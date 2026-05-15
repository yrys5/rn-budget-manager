import type { Currency } from '@/components/budgets/types';

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  transactionDate: string;
  createdAt: string;
  budgetId: string;
  userId: string;
  categoryId: string;
  currency: Currency;
};

export type TransactionScreenMode = 'create' | 'edit' | null;
