export const endpoints = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    register: '/auth/register',
  },
  budgets: {
    collection: '/budgets',
    detail: (budgetId: string) => `/budgets/${budgetId}`,
    category: (budgetId: string, categoryId: string) =>
      `/budgets/${budgetId}/categories/${categoryId}`,
    limit: (budgetId: string, limitId: string) => `/budgets/${budgetId}/limits/${limitId}`,
  },
  dashboard: {
    summary: '/dashboard/summary',
  },
  families: {
    collection: '/families',
    detail: (familyId: string) => `/families/${familyId}`,
    member: (familyId: string, memberId: string) => `/families/${familyId}/members/${memberId}`,
  },
  goals: {
    collection: '/goals',
    detail: (goalId: string) => `/goals/${goalId}`,
  },
  transactions: {
    collection: '/transactions',
    detail: (transactionId: string) => `/transactions/${transactionId}`,
  },
} as const;
