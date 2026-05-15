import type { Currency } from '@/components/budgets/types';

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  budgetId: string;
  currency: Currency;
};

export type GoalScreenMode = 'create' | 'edit' | null;
