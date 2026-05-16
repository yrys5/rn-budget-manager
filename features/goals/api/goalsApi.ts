import { backend } from '@/shared/api/backend';
import type { SavingsGoal } from '@/shared/model/finance';

export const goalsApi = {
  delete: (goalId: string, budgetId?: string) => backend.deleteGoal(goalId, budgetId),
  list: () => backend.listGoals(),
  save: (goal: SavingsGoal) => backend.saveGoal(goal),
};
