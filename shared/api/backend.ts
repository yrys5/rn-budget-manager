import { apiRequest, API_BASE_URL } from './client';
import { endpoints } from './contracts';
import { mockBackend } from './mockBackend';
import type {
  AuthSession,
  AuthUser,
  Budget,
  BudgetLimit,
  Category,
  DashboardSummary,
  Family,
  FamilyBudget,
  FamilyMember,
  SavingsGoal,
  Transaction,
  User,
} from '@/shared/model/finance';

export type FamilyWorkspace = {
  families: Family[];
  familyBudgets: FamilyBudget[];
  members: FamilyMember[];
  users: User[];
};

const httpBackend = {
  login: (email: string, password: string) =>
    apiRequest<AuthSession>(endpoints.auth.login, { body: { email, password }, method: 'POST' }),
  register: (input: { username: string; email: string; password: string }) =>
    apiRequest<AuthSession>(endpoints.auth.register, { body: input, method: 'POST' }),
  me: () => apiRequest<AuthUser>(endpoints.auth.me),
  getDashboardSummary: () => apiRequest<DashboardSummary>(endpoints.dashboard.summary),
  listBudgets: () => apiRequest<Budget[]>(endpoints.budgets.collection),
  saveBudget: (budget: Budget) =>
    apiRequest<Budget>(
      budget.id ? endpoints.budgets.detail(budget.id) : endpoints.budgets.collection,
      { body: budget, method: budget.id ? 'PATCH' : 'POST' },
    ),
  deleteBudget: (budgetId: string) =>
    apiRequest<void>(endpoints.budgets.detail(budgetId), { method: 'DELETE' }),
  saveCategory: (budgetId: string, category: Category) =>
    apiRequest<Category>(endpoints.budgets.category(budgetId, category.id), {
      body: category,
      method: category.id ? 'PATCH' : 'POST',
    }),
  deleteCategory: (budgetId: string, categoryId: string) =>
    apiRequest<void>(endpoints.budgets.category(budgetId, categoryId), { method: 'DELETE' }),
  saveLimit: (budgetId: string, limit: BudgetLimit) =>
    apiRequest<BudgetLimit>(endpoints.budgets.limit(budgetId, limit.id), {
      body: limit,
      method: limit.id ? 'PATCH' : 'POST',
    }),
  deleteLimit: (budgetId: string, limitId: string) =>
    apiRequest<void>(endpoints.budgets.limit(budgetId, limitId), { method: 'DELETE' }),
  listTransactions: () => apiRequest<Transaction[]>(endpoints.transactions.collection),
  saveTransaction: (transaction: Transaction) =>
    apiRequest<Transaction>(endpoints.transactions.detail(transaction.id), {
      body: transaction,
      method: transaction.id ? 'PATCH' : 'POST',
    }),
  deleteTransaction: (transactionId: string) =>
    apiRequest<void>(endpoints.transactions.detail(transactionId), { method: 'DELETE' }),
  listGoals: () => apiRequest<SavingsGoal[]>(endpoints.goals.collection),
  saveGoal: (goal: SavingsGoal) =>
    apiRequest<SavingsGoal>(endpoints.goals.detail(goal.id), {
      body: goal,
      method: goal.id ? 'PATCH' : 'POST',
    }),
  deleteGoal: (goalId: string) =>
    apiRequest<void>(endpoints.goals.detail(goalId), { method: 'DELETE' }),
  getFamilyWorkspace: () => apiRequest<FamilyWorkspace>(endpoints.families.collection),
  saveFamily: (input: { family: Family; budgetIds: string[]; ownerUserId?: string }) =>
    apiRequest<{ family: Family; familyBudgets: FamilyBudget[]; member?: FamilyMember }>(
      endpoints.families.detail(input.family.id),
      { body: input, method: input.family.id ? 'PATCH' : 'POST' },
    ),
  deleteFamily: (familyId: string) =>
    apiRequest<void>(endpoints.families.detail(familyId), { method: 'DELETE' }),
  addFamilyMember: (familyId: string, userId: string) =>
    apiRequest<FamilyMember>(endpoints.families.member(familyId, userId), {
      body: { userId },
      method: 'POST',
    }),
  removeFamilyMember: (familyId: string, memberId: string) =>
    apiRequest<void>(endpoints.families.member(familyId, memberId), { method: 'DELETE' }),
};

export const backend = API_BASE_URL ? httpBackend : mockBackend;
