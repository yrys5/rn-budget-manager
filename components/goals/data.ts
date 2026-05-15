import type { SavingsGoal } from './types';

export const initialGoals: SavingsGoal[] = [
  {
    id: 'goal-emergency',
    name: 'Poduszka bezpieczeństwa',
    targetAmount: 12000,
    currentAmount: 4280,
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    budgetId: 'home',
    currency: 'PLN',
  },
  {
    id: 'goal-holidays',
    name: 'Wyjazd wakacyjny',
    targetAmount: 5000,
    currentAmount: 1850,
    startDate: '2026-03-01',
    targetDate: '2026-08-15',
    budgetId: 'holidays',
    currency: 'PLN',
  },
  {
    id: 'goal-health',
    name: 'Rezerwa zdrowotna',
    targetAmount: 3000,
    currentAmount: 900,
    startDate: '2026-04-01',
    targetDate: '2026-10-31',
    budgetId: 'family',
    currency: 'PLN',
  },
];
