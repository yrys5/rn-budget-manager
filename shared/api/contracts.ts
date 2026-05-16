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
    categoryDetail: (budgetId: string, categoryId: string) =>
      `/budgets/${budgetId}/categories/${categoryId}`,
    limits: (budgetId: string) => `/budgets/${budgetId}/budget-limits`,
    limitDetail: (budgetId: string, limitId: string) =>
      `/budgets/${budgetId}/budget-limits/${limitId}`,
    transactions: (budgetId: string) => `/budgets/${budgetId}/transactions`,
    transactionDetail: (budgetId: string, transactionId: string) =>
      `/budgets/${budgetId}/transactions/${transactionId}`,
    goals: (budgetId: string) => `/budgets/${budgetId}/savings-goals`,
    goalDetail: (budgetId: string, goalId: string) =>
      `/budgets/${budgetId}/savings-goals/${goalId}`,
  },
  dashboard: {
    summary: '/dashboard/summary',
  },
  families: {
    collection: '/families',
    detail: (familyId: string) => `/families/${familyId}`,
    members: (familyId: string) => `/families/${familyId}/members`,
    memberDetail: (familyId: string, userId: string) => `/families/${familyId}/members/${userId}`,
  },
} as const;
