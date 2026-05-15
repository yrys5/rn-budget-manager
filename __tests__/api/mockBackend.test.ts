import { mockBackend } from '@/shared/api/mockBackend';

describe('mock backend contract', () => {
  it('returns dashboard data through the backend-shaped adapter', async () => {
    const summary = await mockBackend.getDashboardSummary();

    expect(summary.budgets.length).toBeGreaterThan(0);
    expect(summary.transactions.length).toBeGreaterThan(0);
    expect(summary.currentMonth).toBe(5);
  });

  it('persists a transaction with the same contract as the future API', async () => {
    const transaction = {
      amount: 42,
      budgetId: 'home',
      categoryId: 'food',
      createdAt: '2026-05-15T12:00:00.000Z',
      currency: 'PLN' as const,
      description: 'Test adaptera',
      id: 'transaction-contract-test',
      transactionDate: '2026-05-15',
      userId: 'current-user',
    };

    await mockBackend.saveTransaction(transaction);
    const transactions = await mockBackend.listTransactions();

    expect(transactions).toEqual(expect.arrayContaining([transaction]));
  });
});
