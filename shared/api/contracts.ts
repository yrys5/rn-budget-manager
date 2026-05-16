export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    register: '/auth/register',
  },
  budgets: {
    collection: '/budgets',
    detail: (budgetId: string) => `/budgets/${budgetId}`,
    categories: (budgetId: string) => `/budgets/${budgetId}/categories`,
    category: (budgetId: string, categoryId: string) =>
      `/budgets/${budgetId}/categories/${categoryId}`,
    limits: (budgetId: string) => `/budgets/${budgetId}/budget-limits`,
    limit: (budgetId: string, limitId: string) =>
      `/budgets/${budgetId}/budget-limits/${limitId}`,
    transactions: (budgetId: string) => `/budgets/${budgetId}/transactions`,
    transaction: (budgetId: string, transactionId: string) =>
      `/budgets/${budgetId}/transactions/${transactionId}`,
    goals: (budgetId: string) => `/budgets/${budgetId}/savings-goals`,
    goal: (budgetId: string, goalId: string) => `/budgets/${budgetId}/savings-goals/${goalId}`,
  },
  dashboard: {
    summary: '/dashboard/summary',
  },
  families: {
    collection: '/families',
    detail: (familyId: string) => `/families/${familyId}`,
    members: (familyId: string) => `/families/${familyId}/members`,
    member: (familyId: string, memberId: string) => `/families/${familyId}/members/${memberId}`,
  },
} as const;
