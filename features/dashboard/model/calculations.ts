import type { Budget, Category, DashboardSummary, Transaction } from '@/shared/model/finance';

export const getBudgetUsage = (budget: Budget) =>
  budget.limit > 0 ? Math.min(Math.round((budget.spent / budget.limit) * 100), 100) : 0;

export const getGoalProgress = (currentAmount: number, targetAmount: number) =>
  targetAmount > 0 ? Math.min(Math.round((currentAmount / targetAmount) * 100), 100) : 0;

export const getCategorySpend = (
  transactions: Transaction[],
  budgetId: string,
  category: Category,
  year: number,
  month: number,
) =>
  transactions
    .filter((transaction) => {
      const isCurrentPeriod = transaction.transactionDate.startsWith(
        `${year}-${`${month}`.padStart(2, '0')}`,
      );

      return (
        isCurrentPeriod &&
        transaction.budgetId === budgetId &&
        transaction.categoryId === category.id &&
        category.type === 'Wydatek'
      );
    })
    .reduce((sum, transaction) => sum + transaction.amount, 0);

export const findCategory = (
  budgets: Budget[],
  transaction: Transaction,
): { budget?: Budget; category?: Category } => {
  const budget = budgets.find((item) => item.id === transaction.budgetId);
  const category = budget?.categories.find((item) => item.id === transaction.categoryId);

  return { budget, category };
};

export const getDashboardMetrics = (summary: DashboardSummary) => {
  const monthTransactions = summary.transactions.filter((transaction) =>
    transaction.transactionDate.startsWith(
      `${summary.currentYear}-${`${summary.currentMonth}`.padStart(2, '0')}`,
    ),
  );

  const monthBalance = monthTransactions.reduce((sum, transaction) => {
    const { category } = findCategory(summary.budgets, transaction);
    const signedAmount = category?.type === 'Przychód' ? transaction.amount : -transaction.amount;

    return sum + signedAmount;
  }, 0);

  const monthExpenses = monthTransactions.reduce((sum, transaction) => {
    const { category } = findCategory(summary.budgets, transaction);

    return category?.type === 'Wydatek' ? sum + transaction.amount : sum;
  }, 0);

  const totalBalance = summary.budgets.reduce((sum, budget) => sum + budget.balance, 0);
  const totalSpent = summary.budgets.reduce((sum, budget) => sum + budget.spent, 0);
  const totalLimit = summary.budgets.reduce((sum, budget) => sum + budget.limit, 0);
  const totalUsage = totalLimit > 0 ? Math.min(Math.round((totalSpent / totalLimit) * 100), 100) : 0;
  const totalGoalTarget = summary.goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalGoalSaved = summary.goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const goalsProgress = getGoalProgress(totalGoalSaved, totalGoalTarget);
  const pulseScore = Math.round((100 - totalUsage) * 0.45 + goalsProgress * 0.35 + 20);
  const pulseLabel =
    pulseScore >= 75 ? 'Spokojny rytm' : pulseScore >= 55 ? 'Pod kontrolą' : 'Wymaga uwagi';

  return {
    goalsProgress,
    monthBalance,
    monthExpenses,
    pulseLabel,
    pulseScore,
    totalBalance,
    totalUsage,
  };
};
