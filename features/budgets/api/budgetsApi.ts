import { backend } from '@/shared/api/backend';
import type { Budget, BudgetLimit, Category } from '@/shared/model/finance';

export const budgetsApi = {
  deleteBudget: (budgetId: string) => backend.deleteBudget(budgetId),
  deleteCategory: (budgetId: string, categoryId: string) =>
    backend.deleteCategory(budgetId, categoryId),
  deleteLimit: (budgetId: string, limitId: string) => backend.deleteLimit(budgetId, limitId),
  list: () => backend.listBudgets(),
  saveBudget: (budget: Budget) => backend.saveBudget(budget),
  saveCategory: (budgetId: string, category: Category) => backend.saveCategory(budgetId, category),
  saveLimit: (budgetId: string, limit: BudgetLimit) => backend.saveLimit(budgetId, limit),
};
