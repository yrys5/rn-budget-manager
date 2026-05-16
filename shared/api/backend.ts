import { apiRequest, API_BASE_URL, ApiError } from './client';
import { endpoints } from './contracts';
import { mockBackend } from './mockBackend';
import { setAuthSession } from './session';
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

const toId = (value: unknown) => `${value ?? ''}`;

const toNumericId = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const isClientGeneratedId = (value: string) => /^\d{12,}$/.test(value);

const isNotFound = (error: unknown) => error instanceof ApiError && error.status === 404;

const emptyOnNotFound = async <T>(request: Promise<T>, fallback: T) => {
  try {
    return await request;
  } catch (error) {
    if (isNotFound(error)) {
      return fallback;
    }

    throw error;
  }
};

const normalizeSession = (payload: AuthSession & { accessToken?: string; jwt?: string }) =>
  setAuthSession({
    token: payload.token ?? payload.accessToken ?? payload.jwt ?? '',
    user: {
      createdAt: payload.user.createdAt,
      email: payload.user.email,
      id: toId(payload.user.id),
      username: payload.user.username,
    },
  });

const normalizeCategory = (category: Category): Category => ({
  color: category.color ?? (category.type === 'Przychód' ? '#157348' : '#B73E3E'),
  icon:
    category.icon ??
    (category.type === 'Przychód' ? 'arrow-up-circle-outline' : 'arrow-down-circle-outline'),
  id: toId(category.id),
  name: category.name,
  type: category.type,
});

const normalizeLimit = (budgetId: string, limit: BudgetLimit): BudgetLimit => ({
  ...limit,
  budgetId: toId(limit.budgetId ?? budgetId),
  categoryId: toId(limit.categoryId),
  createdAt: limit.createdAt ?? new Date().toISOString(),
  id: toId(limit.id),
});

const normalizeTransaction = (budgetId: string, transaction: Transaction): Transaction => ({
  ...transaction,
  budgetId: toId(transaction.budgetId ?? budgetId),
  categoryId: toId(transaction.categoryId),
  createdAt: transaction.createdAt ?? new Date().toISOString(),
  id: toId(transaction.id),
  userId: toId(transaction.userId),
});

const normalizeGoal = (budgetId: string, goal: SavingsGoal): SavingsGoal => ({
  ...goal,
  budgetId: toId(goal.budgetId ?? budgetId),
  id: toId(goal.id),
});

const listBudgetCategories = (budgetId: string) =>
  emptyOnNotFound(apiRequest<Category[]>(endpoints.budgets.categories(budgetId)), []).then(
    (categories) => categories.map(normalizeCategory),
  );

const listBudgetLimits = (budgetId: string) =>
  emptyOnNotFound(apiRequest<BudgetLimit[]>(endpoints.budgets.limits(budgetId)), []).then(
    (limits) => limits.map((limit) => normalizeLimit(budgetId, limit)),
  );

const listBudgetTransactions = (budgetId: string) =>
  emptyOnNotFound(apiRequest<Transaction[]>(endpoints.budgets.transactions(budgetId)), []).then(
    (transactions) =>
      transactions.map((transaction) => normalizeTransaction(budgetId, transaction)),
  );

const listBudgetGoals = (budgetId: string) =>
  emptyOnNotFound(apiRequest<SavingsGoal[]>(endpoints.budgets.goals(budgetId)), []).then((goals) =>
    goals.map((goal) => normalizeGoal(budgetId, goal)),
  );

const normalizeBudget = async (budget: Budget): Promise<Budget> => {
  const budgetId = toId(budget.id);
  const [categories, limits] = await Promise.all([
    budget.categories
      ? Promise.resolve(budget.categories.map(normalizeCategory))
      : listBudgetCategories(budgetId),
    budget.limits
      ? Promise.resolve(budget.limits.map((limit) => normalizeLimit(budgetId, limit)))
      : listBudgetLimits(budgetId),
  ]);

  const totalLimit = limits.reduce((sum, limit) => sum + Number(limit.limitAmount), 0);

  return {
    balance: budget.balance ?? 0,
    categories,
    id: budgetId,
    limit: budget.limit ?? totalLimit,
    limits,
    name: budget.name,
    spent: budget.spent ?? 0,
  };
};

const listBudgets = async () => {
  const budgets = await apiRequest<Budget[]>(endpoints.budgets.collection);

  return Promise.all(budgets.map(normalizeBudget));
};

const currentDate = new Date();

const httpBackend = {
  login: async (email: string, password: string) =>
    normalizeSession(
      await apiRequest<AuthSession>(endpoints.auth.login, {
        body: { email, password },
        method: 'POST',
      }),
    ),
  register: async (input: {
    username: string;
    email: string;
    password: string;
    acceptTerms: boolean;
  }) =>
    normalizeSession(
      await apiRequest<AuthSession>(endpoints.auth.register, { body: input, method: 'POST' }),
    ),
  me: () => apiRequest<AuthUser>(endpoints.auth.me),
  getDashboardSummary: async (): Promise<DashboardSummary> => {
    const budgets = await listBudgets();
    const [transactionsByBudget, goalsByBudget, familyWorkspace] = await Promise.all([
      Promise.all(budgets.map((budget) => listBudgetTransactions(budget.id))),
      Promise.all(budgets.map((budget) => listBudgetGoals(budget.id))),
      httpBackend.getFamilyWorkspace(),
    ]);

    return {
      budgets,
      currentMonth: currentDate.getMonth() + 1,
      currentYear: currentDate.getFullYear(),
      families: familyWorkspace.families,
      familyBudgets: familyWorkspace.familyBudgets,
      familyMembers: familyWorkspace.members,
      goals: goalsByBudget.flat(),
      transactions: transactionsByBudget.flat(),
      users: familyWorkspace.users,
    };
  },
  listBudgets,
  saveBudget: async (budget: Budget) => {
    const isCreate = !budget.id || isClientGeneratedId(budget.id);

    return normalizeBudget(
      await apiRequest<Budget>(
        isCreate ? endpoints.budgets.collection : endpoints.budgets.detail(budget.id),
        {
          body: { name: budget.name },
          method: isCreate ? 'POST' : 'PUT',
        },
      ),
    );
  },
  deleteBudget: (budgetId: string) =>
    apiRequest<void>(endpoints.budgets.detail(budgetId), { method: 'DELETE' }),
  saveCategory: (budgetId: string, category: Category) =>
    apiRequest<Category>(endpoints.budgets.categories(budgetId), {
      body: { name: category.name, type: category.type },
      method: 'POST',
    }).then(normalizeCategory),
  deleteCategory: (budgetId: string, categoryId: string) =>
    apiRequest<void>(endpoints.budgets.category(budgetId, categoryId), { method: 'DELETE' }),
  saveLimit: (budgetId: string, limit: BudgetLimit) =>
    apiRequest<BudgetLimit>(
      isClientGeneratedId(limit.id)
        ? endpoints.budgets.limits(budgetId)
        : endpoints.budgets.limit(budgetId, limit.id),
      {
        body: {
          categoryId: toNumericId(limit.categoryId, 1),
          currency: limit.currency,
          limitAmount: limit.limitAmount,
          periodMonth: limit.periodMonth,
          periodYear: limit.periodYear,
        },
        method: isClientGeneratedId(limit.id) ? 'POST' : 'PUT',
      },
    ).then((savedLimit) => normalizeLimit(budgetId, savedLimit)),
  deleteLimit: (budgetId: string, limitId: string) =>
    apiRequest<void>(endpoints.budgets.limit(budgetId, limitId), { method: 'DELETE' }),
  listTransactions: async () => {
    const budgets = await listBudgets();
    const transactionsByBudget = await Promise.all(
      budgets.map((budget) => listBudgetTransactions(budget.id)),
    );

    return transactionsByBudget.flat();
  },
  saveTransaction: (transaction: Transaction) =>
    apiRequest<Transaction>(
      isClientGeneratedId(transaction.id)
        ? endpoints.budgets.transactions(transaction.budgetId)
        : endpoints.budgets.transaction(transaction.budgetId, transaction.id),
      {
        body: {
          amount: transaction.amount,
          categoryId: toNumericId(transaction.categoryId, 1),
          currency: transaction.currency,
          description: transaction.description,
          transactionDate: transaction.transactionDate,
          userId: toNumericId(transaction.userId, 1),
        },
        method: isClientGeneratedId(transaction.id) ? 'POST' : 'PUT',
      },
    ).then((savedTransaction) => normalizeTransaction(transaction.budgetId, savedTransaction)),
  deleteTransaction: async (transactionId: string) => {
    const transactions = await httpBackend.listTransactions();
    const transaction = transactions.find((item) => item.id === transactionId);

    if (transaction) {
      await apiRequest<void>(
        endpoints.budgets.transaction(transaction.budgetId, transactionId),
        { method: 'DELETE' },
      );
    }
  },
  listGoals: async () => {
    const budgets = await listBudgets();
    const goalsByBudget = await Promise.all(budgets.map((budget) => listBudgetGoals(budget.id)));

    return goalsByBudget.flat();
  },
  saveGoal: (goal: SavingsGoal) =>
    apiRequest<SavingsGoal>(
      isClientGeneratedId(goal.id)
        ? endpoints.budgets.goals(goal.budgetId)
        : endpoints.budgets.goal(goal.budgetId, goal.id),
      {
        body: {
          currency: goal.currency,
          currentAmount: goal.currentAmount,
          name: goal.name,
          startDate: goal.startDate,
          targetAmount: goal.targetAmount,
          targetDate: goal.targetDate,
        },
        method: isClientGeneratedId(goal.id) ? 'POST' : 'PUT',
      },
    ).then((savedGoal) => normalizeGoal(goal.budgetId, savedGoal)),
  deleteGoal: async (goalId: string) => {
    const goals = await httpBackend.listGoals();
    const goal = goals.find((item) => item.id === goalId);

    if (goal) {
      await apiRequest<void>(endpoints.budgets.goal(goal.budgetId, goalId), { method: 'DELETE' });
    }
  },
  getFamilyWorkspace: async (): Promise<FamilyWorkspace> => {
    const families = await emptyOnNotFound(apiRequest<Family[]>(endpoints.families.collection), []);
    const membersByFamily = await Promise.all(
      families.map((family) =>
        emptyOnNotFound(apiRequest<FamilyMember[]>(endpoints.families.members(toId(family.id))), []),
      ),
    );

    return {
      families: families.map((family) => ({ ...family, id: toId(family.id) })),
      familyBudgets: [],
      members: membersByFamily.flat().map((member) => ({
        ...member,
        familyId: toId(member.familyId),
        id: toId(member.id ?? `${member.familyId}-${member.userId}`),
        userId: toId(member.userId),
      })),
      users: [],
    };
  },
  saveFamily: (input: { family: Family; budgetIds: string[]; ownerUserId?: string }) =>
    {
      const isCreate = !input.family.id || isClientGeneratedId(input.family.id);

      return apiRequest<Family>(
        isCreate ? endpoints.families.collection : endpoints.families.detail(input.family.id),
        { body: { name: input.family.name }, method: isCreate ? 'POST' : 'PUT' },
      ).then((family) => ({
        family: { ...family, id: toId(family.id) },
        familyBudgets: input.budgetIds.map((budgetId) => ({
          budgetId,
          familyId: toId(family.id),
          id: `${family.id}-${budgetId}`,
        })),
        member: undefined,
      }));
    },
  deleteFamily: (familyId: string) =>
    apiRequest<void>(endpoints.families.detail(familyId), { method: 'DELETE' }),
  addFamilyMember: (familyId: string, userId: string) =>
    apiRequest<FamilyMember>(`${endpoints.families.detail(familyId)}/members`, {
      body: { userId: toNumericId(userId, 1) },
      method: 'POST',
    }).then((member) => ({
      ...member,
      familyId: toId(member.familyId ?? familyId),
      id: toId(member.id ?? `${familyId}-${userId}`),
      userId: toId(member.userId ?? userId),
    })),
  removeFamilyMember: (familyId: string, memberId: string) =>
    apiRequest<void>(endpoints.families.member(familyId, memberId), { method: 'DELETE' }),
};

export const backend = API_BASE_URL ? httpBackend : mockBackend;
