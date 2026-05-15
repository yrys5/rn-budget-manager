import type { Transaction } from './types';

export const currentUserId = 'user-demo-1';

export const initialTransactions: Transaction[] = [
  {
    id: 'transaction-food-1',
    amount: -184,
    description: 'Zakupy spożywcze',
    transactionDate: '2026-05-14',
    createdAt: '2026-05-14T17:20:00.000Z',
    budgetId: 'home',
    userId: currentUserId,
    categoryId: 'food',
    currency: 'PLN',
  },
  {
    id: 'transaction-bills-1',
    amount: -320,
    description: 'Prąd i gaz',
    transactionDate: '2026-05-10',
    createdAt: '2026-05-10T09:30:00.000Z',
    budgetId: 'home',
    userId: currentUserId,
    categoryId: 'bills',
    currency: 'PLN',
  },
  {
    id: 'transaction-travel-1',
    amount: -120,
    description: 'Bilety kolejowe',
    transactionDate: '2026-05-08',
    createdAt: '2026-05-08T12:10:00.000Z',
    budgetId: 'holidays',
    userId: currentUserId,
    categoryId: 'travel',
    currency: 'PLN',
  },
];

export const formatTransactionAmount = (amount: number, currency: string) => {
  const prefix = amount > 0 ? '+' : '';

  return `${prefix}${amount.toLocaleString('pl-PL')} ${currency}`;
};
