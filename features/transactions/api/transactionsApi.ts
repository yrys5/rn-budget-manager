import { backend } from '@/shared/api/backend';
import type { Transaction } from '@/shared/model/finance';

export const transactionsApi = {
  delete: (transactionId: string, budgetId?: string) =>
    backend.deleteTransaction(transactionId, budgetId),
  list: () => backend.listTransactions(),
  save: (transaction: Transaction) => backend.saveTransaction(transaction),
};
