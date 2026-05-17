import { apiRequest, API_BASE_URL, ApiError } from './client';
import { endpoints } from './contracts';
import { mockBackend } from './mockBackend';
import { getAuthSession, setAuthSession } from './authSession';
import { categoryTypes } from '@/shared/model/finance';
import type {
  AuthSession,
  AuthUser,
  Budget,
  BudgetLimit,
  Category,
  CategoryType,
  DashboardSummary,
  Family,
  FamilyBudget,
  FamilyMember,
  RegisterInput,
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

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readValue = (source: ApiRecord, keys: string[]) => {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key];
    }
  }

  return undefined;
};

const readString = (source: ApiRecord, keys: string[], fallback = '') => {
  const value = readValue(source, keys);

  return value === undefined ? fallback : `${value}`;
};

const readNumber = (source: ApiRecord, keys: string[], fallback = 0) => {
  const value = readValue(source, keys);
  const numberValue = typeof value === 'number' ? value : Number(value);

  return Number.isFinite(numberValue) ? numberValue : fallback;
};

const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const toDateOnly = (value: unknown, fallback = new Date().toISOString().slice(0, 10)) => {
  const rawValue = value === undefined || value === null ? fallback : `${value}`;
  const dateOnlyMatch = rawValue.match(/^(\d{4}-\d{2}-\d{2})/);

  if (dateOnlyMatch) {
    return dateOnlyMatch[1];
  }

  const parsedDate = new Date(rawValue);

  if (!Number.isNaN(parsedDate.getTime())) {
    return formatDateOnly(parsedDate);
  }

  return fallback;
};

const readArray = (source: ApiRecord, keys: string[]) => {
  const value = readValue(source, keys);

  return Array.isArray(value) ? value : [];
};

const unwrapList = (value: unknown, keys: string[] = []) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (!isRecord(value)) {
    return [];
  }

  const listKeys = [...keys, 'items', 'data', 'value', 'values', '$values', 'results'];

  for (const key of listKeys) {
    const list = value[key];

    if (Array.isArray(list)) {
      return list;
    }
  }

  return [];
};

const isNumericId = (id: string) => /^\d+$/.test(id);

const toBackendId = (id: string) => (isNumericId(id) ? Number(id) : id);

const toBackendUserId = (id: string) => {
  const sessionUserId = getAuthSession()?.user.id ?? '';
  const resolvedId = isNumericId(id) ? id : sessionUserId;

  if (!isNumericId(resolvedId)) {
    throw new ApiError('Brak numerycznego identyfikatora użytkownika.', 'INVALID_USER_ID');
  }

  return Number(resolvedId);
};

const toCategoryType = (value: unknown): CategoryType =>
  value === 'Przychód' ? 'Przychód' : 'Wydatek';

const getCategoryPresentation = (type: CategoryType) =>
  categoryTypes.find((categoryType) => categoryType.label === type) ?? categoryTypes[0];

const normalizeCategory = (value: unknown, fallback?: Partial<Category>): Category => {
  const source = isRecord(value) ? value : {};
  const type = toCategoryType(readValue(source, ['type']) ?? fallback?.type);
  const presentation = getCategoryPresentation(type);

  return {
    color: readString(source, ['color'], fallback?.color ?? presentation.color),
    icon: (readString(source, ['icon'], fallback?.icon ?? presentation.icon) ||
      presentation.icon) as Category['icon'],
    id: readString(source, ['id', 'categoryId'], fallback?.id ?? `${Date.now()}`),
    name: readString(source, ['name'], fallback?.name ?? ''),
    type,
  };
};

const normalizeLimit = (
  value: unknown,
  budgetId: string,
  fallback?: Partial<BudgetLimit>,
): BudgetLimit => {
  const source = isRecord(value) ? value : {};

  return {
    budgetId: readString(source, ['budgetId'], fallback?.budgetId ?? budgetId),
    categoryId: readString(source, ['categoryId'], fallback?.categoryId ?? ''),
    createdAt: readString(source, ['createdAt'], fallback?.createdAt ?? new Date().toISOString()),
    currency: (readString(source, ['currency'], fallback?.currency ?? 'PLN') ||
      'PLN') as BudgetLimit['currency'],
    id: readString(source, ['id', 'budgetLimitId', 'limitId'], fallback?.id ?? `${Date.now()}`),
    limitAmount: readNumber(source, ['limitAmount'], fallback?.limitAmount ?? 0),
    periodMonth: readNumber(source, ['periodMonth'], fallback?.periodMonth ?? 1),
    periodYear: readNumber(source, ['periodYear'], fallback?.periodYear ?? new Date().getFullYear()),
  };
};

const normalizeBudget = (
  value: unknown,
  categories: Category[] = [],
  limits: BudgetLimit[] = [],
): Budget => {
  const source = isRecord(value) ? value : {};
  const budgetId = readString(source, ['id', 'budgetId'], `${Date.now()}`);
  const embeddedCategories = readArray(source, ['categories']).map((category) =>
    normalizeCategory(category),
  );
  const embeddedLimits = readArray(source, ['limits', 'budgetLimits']).map((limit) =>
    normalizeLimit(limit, budgetId),
  );
  const nextCategories = categories.length ? categories : embeddedCategories;
  const nextLimits = limits.length ? limits : embeddedLimits;
  const limitFallback = nextLimits.reduce((sum, limit) => sum + limit.limitAmount, 0);

  return {
    balance: readNumber(source, ['balance'], 0),
    categories: nextCategories,
    id: budgetId,
    limit: readNumber(source, ['limit'], limitFallback),
    limits: nextLimits,
    name: readString(source, ['name'], ''),
    spent: readNumber(source, ['spent'], 0),
  };
};

const normalizeTransaction = (
  value: unknown,
  budgetId: string,
  fallback?: Partial<Transaction>,
): Transaction => {
  const source = isRecord(value) ? value : {};

  return {
    amount: readNumber(source, ['amount'], fallback?.amount ?? 0),
    budgetId: readString(source, ['budgetId'], fallback?.budgetId ?? budgetId),
    categoryId: readString(source, ['categoryId'], fallback?.categoryId ?? ''),
    createdAt: readString(source, ['createdAt'], fallback?.createdAt ?? new Date().toISOString()),
    currency: (readString(source, ['currency'], fallback?.currency ?? 'PLN') ||
      'PLN') as Transaction['currency'],
    description: readString(source, ['description'], fallback?.description ?? ''),
    id: readString(source, ['id', 'transactionId'], fallback?.id ?? `${Date.now()}`),
    transactionDate: toDateOnly(
      readValue(source, ['transactionDate']),
      fallback?.transactionDate ?? new Date().toISOString().slice(0, 10),
    ),
    userId: readString(source, ['userId'], fallback?.userId ?? ''),
  };
};

const normalizeGoal = (
  value: unknown,
  budgetId: string,
  fallback?: Partial<SavingsGoal>,
): SavingsGoal => {
  const source = isRecord(value) ? value : {};

  return {
    budgetId: readString(source, ['budgetId'], fallback?.budgetId ?? budgetId),
    currency: (readString(source, ['currency'], fallback?.currency ?? 'PLN') ||
      'PLN') as SavingsGoal['currency'],
    currentAmount: readNumber(source, ['currentAmount'], fallback?.currentAmount ?? 0),
    id: readString(source, ['id', 'goalId', 'savingsGoalId'], fallback?.id ?? `${Date.now()}`),
    name: readString(source, ['name'], fallback?.name ?? ''),
    startDate: toDateOnly(
      readValue(source, ['startDate']),
      fallback?.startDate ?? new Date().toISOString().slice(0, 10),
    ),
    targetAmount: readNumber(source, ['targetAmount'], fallback?.targetAmount ?? 0),
    targetDate: toDateOnly(
      readValue(source, ['targetDate']),
      fallback?.targetDate ?? new Date().toISOString().slice(0, 10),
    ),
  };
};

const normalizeFamily = (value: unknown, fallback?: Partial<Family>): Family => {
  const source = isRecord(value) ? value : {};

  return {
    id: readString(source, ['id', 'familyId'], fallback?.id ?? `${Date.now()}`),
    name: readString(source, ['name'], fallback?.name ?? ''),
  };
};

const normalizeUser = (value: unknown): User | null => {
  if (!isRecord(value)) {
    return null;
  }

  const id = readString(value, ['id', 'userId']);

  if (!id) {
    return null;
  }

  return {
    createdAt: readString(value, ['createdAt'], ''),
    email: readString(value, ['email'], ''),
    id,
    passwordHash: readString(value, ['passwordHash'], ''),
    username: readString(value, ['username', 'name'], ''),
  };
};

const normalizeFamilyMember = (value: unknown, familyId: string): FamilyMember => {
  const source = isRecord(value) ? value : {};
  const embeddedUser = normalizeUser(readValue(source, ['user']));
  const userId = readString(source, ['userId'], embeddedUser?.id ?? '');

  return {
    familyId: readString(source, ['familyId'], familyId),
    id: readString(source, ['id', 'familyMemberId', 'memberId'], `${familyId}-${userId}`),
    userId,
  };
};

const normalizeFamilyBudget = (value: unknown, familyId: string): FamilyBudget | null => {
  const source = isRecord(value) ? value : {};
  const embeddedBudget = isRecord(readValue(source, ['budget']))
    ? (readValue(source, ['budget']) as ApiRecord)
    : undefined;
  const budgetId = readString(
    source,
    ['budgetId', 'id'],
    readString(embeddedBudget ?? {}, ['id', 'budgetId']),
  );

  if (!budgetId) {
    return null;
  }

  return {
    budgetId,
    familyId: readString(source, ['familyId'], familyId),
    id: readString(source, ['id', 'familyBudgetId'], `${familyId}-${budgetId}`),
  };
};

const getFamilyMembersFromPayload = (familyPayload: unknown, familyId: string) => {
  const source = isRecord(familyPayload) ? familyPayload : {};

  return unwrapList(readValue(source, ['members', 'familyMembers'])).map((member) =>
    normalizeFamilyMember(member, familyId),
  );
};

const getFamilyBudgetsFromPayload = (familyPayload: unknown, familyId: string) => {
  const source = isRecord(familyPayload) ? familyPayload : {};

  return unwrapList(readValue(source, ['budgets', 'familyBudgets']))
    .map((budget) => normalizeFamilyBudget(budget, familyId))
    .filter((familyBudget): familyBudget is FamilyBudget => Boolean(familyBudget));
};

const createFamilyBudgets = (familyId: string, budgetIds: string[]): FamilyBudget[] =>
  budgetIds.map((budgetId) => ({
    budgetId,
    familyId,
    id: `${familyId}-${budgetId}`,
  }));

const getUsersFromFamilyPayload = (familyPayload: unknown) => {
  const source = isRecord(familyPayload) ? familyPayload : {};

  return unwrapList(readValue(source, ['members', 'familyMembers']))
    .map((member) => normalizeUser(readValue(isRecord(member) ? member : {}, ['user']) ?? member))
    .filter((user): user is User => Boolean(user));
};

const uniqueUsers = (users: User[]) =>
  Array.from(new Map(users.map((user) => [user.id, user])).values());

const normalizeAuthUser = (value: unknown): AuthUser => {
  const source = isRecord(value) ? value : {};

  return {
    createdAt: readString(source, ['createdAt'], ''),
    email: readString(source, ['email'], ''),
    id: readString(source, ['id', 'userId'], ''),
    username: readString(source, ['username'], ''),
  };
};

const normalizeAuthSession = (value: unknown): AuthSession => {
  const source = isRecord(value) ? value : {};

  return {
    token: readString(source, ['token']),
    user: normalizeAuthUser(readValue(source, ['user'])),
  };
};

const optionalListRequest = async <T>(
  path: string,
  normalize: (value: unknown) => T,
  listKeys: string[] = [],
) => {
  try {
    const response = await apiRequest<unknown>(path);

    return unwrapList(response, listKeys).map(normalize);
  } catch (error) {
    if (error instanceof ApiError && (error.status === 404 || error.status === 405)) {
      return [];
    }

    throw error;
  }
};

const listBudgetCategories = async (budgetId: string) =>
  optionalListRequest(endpoints.budgets.categories(budgetId), normalizeCategory);

const listBudgetLimits = async (budgetId: string) =>
  optionalListRequest(endpoints.budgets.limits(budgetId), (limit) =>
    normalizeLimit(limit, budgetId),
  );

const listBudgetTransactions = async (budgetId: string) =>
  optionalListRequest(endpoints.budgets.transactions(budgetId), (transaction) =>
    normalizeTransaction(transaction, budgetId),
  );

const listBudgetGoals = async (budgetId: string) =>
  optionalListRequest(endpoints.budgets.goals(budgetId), (goal) => normalizeGoal(goal, budgetId));

const httpBackend = {
  async login(email: string, password: string): Promise<AuthSession> {
    const response = await apiRequest<unknown>(endpoints.auth.login, {
      auth: false,
      body: { email, password },
      method: 'POST',
    });
    const session = normalizeAuthSession(response);

    setAuthSession(session);
    return session;
  },
  async register(input: RegisterInput): Promise<AuthSession> {
    const response = await apiRequest<unknown>(endpoints.auth.register, {
      auth: false,
      body: input,
      method: 'POST',
    });
    const session = normalizeAuthSession(response);

    setAuthSession(session);
    return session;
  },
  async me(): Promise<AuthUser> {
    const response = await apiRequest<unknown>(endpoints.auth.me);

    return normalizeAuthUser(response);
  },
  async getDashboardSummary(): Promise<DashboardSummary> {
    const [budgets, transactions, goals, familyWorkspace] = await Promise.all([
      this.listBudgets(),
      this.listTransactions(),
      this.listGoals(),
      this.getFamilyWorkspace(),
    ]);
    const now = new Date();

    return {
      budgets,
      currentMonth: now.getMonth() + 1,
      currentYear: now.getFullYear(),
      families: familyWorkspace.families,
      familyBudgets: familyWorkspace.familyBudgets,
      familyMembers: familyWorkspace.members,
      goals,
      transactions,
      users: familyWorkspace.users,
    };
  },
  async listBudgets(): Promise<Budget[]> {
    const response = await apiRequest<unknown[]>(endpoints.budgets.collection);

    return Promise.all(
      response.map(async (budget) => {
        const budgetId = normalizeBudget(budget).id;
        const [categories, limits] = await Promise.all([
          listBudgetCategories(budgetId),
          listBudgetLimits(budgetId),
        ]);

        return normalizeBudget(budget, categories, limits);
      }),
    );
  },
  async saveBudget(budget: Budget): Promise<Budget> {
    const response = await apiRequest<unknown>(endpoints.budgets.collection, {
      body: { name: budget.name },
      method: 'POST',
    });

    return normalizeBudget(response, [], []);
  },
  deleteBudget: (budgetId: string) =>
    apiRequest<void>(endpoints.budgets.detail(budgetId), { method: 'DELETE' }),
  async saveCategory(budgetId: string, category: Category): Promise<Category> {
    const response = await apiRequest<unknown>(endpoints.budgets.categories(budgetId), {
      body: { name: category.name, type: category.type },
      method: 'POST',
    });

    return normalizeCategory(response, category);
  },
  deleteCategory: (budgetId: string, categoryId: string) =>
    apiRequest<void>(endpoints.budgets.categoryDetail(budgetId, categoryId), { method: 'DELETE' }),
  async saveLimit(budgetId: string, limit: BudgetLimit): Promise<BudgetLimit> {
    const body = {
      categoryId: toBackendId(limit.categoryId),
      currency: limit.currency,
      limitAmount: limit.limitAmount,
      periodMonth: limit.periodMonth,
      periodYear: limit.periodYear,
    };
    const response = await apiRequest<unknown>(
      limit.id ? endpoints.budgets.limitDetail(budgetId, limit.id) : endpoints.budgets.limits(budgetId),
      { body, method: limit.id ? 'PUT' : 'POST' },
    );

    return normalizeLimit(response, budgetId, limit);
  },
  deleteLimit: (budgetId: string, limitId: string) =>
    apiRequest<void>(endpoints.budgets.limitDetail(budgetId, limitId), { method: 'DELETE' }),
  async listTransactions(): Promise<Transaction[]> {
    const budgets = await this.listBudgets();
    const transactionsByBudget = await Promise.all(
      budgets.map((budget) => listBudgetTransactions(budget.id)),
    );

    return transactionsByBudget.flat();
  },
  async saveTransaction(transaction: Transaction): Promise<Transaction> {
    const body = {
      amount: transaction.amount,
      categoryId: toBackendId(transaction.categoryId),
      currency: transaction.currency,
      description: transaction.description,
      transactionDate: transaction.transactionDate,
      userId: toBackendUserId(transaction.userId),
    };
    const response = await apiRequest<unknown>(
      transaction.id
        ? endpoints.budgets.transactionDetail(transaction.budgetId, transaction.id)
        : endpoints.budgets.transactions(transaction.budgetId),
      { body, method: transaction.id ? 'PUT' : 'POST' },
    );

    return normalizeTransaction(response, transaction.budgetId, transaction);
  },
  async deleteTransaction(transactionId: string, budgetId?: string): Promise<void> {
    if (budgetId) {
      await apiRequest<void>(endpoints.budgets.transactionDetail(budgetId, transactionId), {
        method: 'DELETE',
      });
      return;
    }

    const transactions = await this.listTransactions();
    const transaction = transactions.find((item) => item.id === transactionId);

    if (!transaction) {
      throw new ApiError('Nie znaleziono transakcji do usunięcia.', 'NOT_FOUND', 404);
    }

    await apiRequest<void>(
      endpoints.budgets.transactionDetail(transaction.budgetId, transactionId),
      { method: 'DELETE' },
    );
  },
  async listGoals(): Promise<SavingsGoal[]> {
    const budgets = await this.listBudgets();
    const goalsByBudget = await Promise.all(budgets.map((budget) => listBudgetGoals(budget.id)));

    return goalsByBudget.flat();
  },
  async saveGoal(goal: SavingsGoal): Promise<SavingsGoal> {
    const body = {
      currency: goal.currency,
      currentAmount: goal.currentAmount,
      name: goal.name,
      startDate: goal.startDate,
      targetAmount: goal.targetAmount,
      targetDate: goal.targetDate,
    };
    const response = await apiRequest<unknown>(
      goal.id
        ? endpoints.budgets.goalDetail(goal.budgetId, goal.id)
        : endpoints.budgets.goals(goal.budgetId),
      { body, method: goal.id ? 'PUT' : 'POST' },
    );

    return normalizeGoal(response, goal.budgetId, goal);
  },
  async deleteGoal(goalId: string, budgetId?: string): Promise<void> {
    if (budgetId) {
      await apiRequest<void>(endpoints.budgets.goalDetail(budgetId, goalId), { method: 'DELETE' });
      return;
    }

    const goals = await this.listGoals();
    const goal = goals.find((item) => item.id === goalId);

    if (!goal) {
      throw new ApiError('Nie znaleziono celu do usunięcia.', 'NOT_FOUND', 404);
    }

    await apiRequest<void>(endpoints.budgets.goalDetail(goal.budgetId, goalId), {
      method: 'DELETE',
    });
  },
  async getFamilyWorkspace(): Promise<FamilyWorkspace> {
    const response = await apiRequest<unknown>(endpoints.families.collection);
    const familyPayloads = unwrapList(response, ['families']);
    const families = familyPayloads.map((familyPayload) => normalizeFamily(familyPayload));
    const familyBudgets = familyPayloads.flatMap((familyPayload, index) =>
      getFamilyBudgetsFromPayload(familyPayload, families[index]?.id ?? ''),
    );
    const embeddedMembers = familyPayloads.flatMap((familyPayload, index) =>
      getFamilyMembersFromPayload(familyPayload, families[index]?.id ?? ''),
    );
    const fallbackMembersByFamily = embeddedMembers.length
      ? []
      : await Promise.all(
          families.map((family) =>
            optionalListRequest(
              endpoints.families.members(family.id),
              (member) => normalizeFamilyMember(member, family.id),
              ['members', 'familyMembers'],
            ),
          ),
        );
    const members = embeddedMembers.length ? embeddedMembers : fallbackMembersByFamily.flat();
    const embeddedUsers = familyPayloads.flatMap(getUsersFromFamilyPayload);
    const fallbackUsers = members.map((member) => ({
        createdAt: '',
        email: '',
        id: member.userId,
        passwordHash: '',
        username: `Użytkownik ${member.userId}`,
    }));
    const users = uniqueUsers([...fallbackUsers, ...embeddedUsers]);

    return { families, familyBudgets, members, users };
  },
  async saveFamily(input: {
    family: Family;
    budgetIds: string[];
    ownerUserId?: string;
  }): Promise<{ family: Family; familyBudgets: FamilyBudget[]; member?: FamilyMember }> {
    const response = await apiRequest<unknown>(
      input.family.id ? endpoints.families.detail(input.family.id) : endpoints.families.collection,
      { body: { name: input.family.name }, method: input.family.id ? 'PUT' : 'POST' },
    );
    const family = normalizeFamily(response, input.family);
    const familyBudgets = getFamilyBudgetsFromPayload(response, family.id);

    return {
      family,
      familyBudgets: familyBudgets.length
        ? familyBudgets
        : createFamilyBudgets(family.id, input.budgetIds),
    };
  },
  deleteFamily: (familyId: string) =>
    apiRequest<void>(endpoints.families.detail(familyId), { method: 'DELETE' }),
  async addFamilyMember(familyId: string, email: string): Promise<FamilyMember> {
    const response = await apiRequest<unknown>(endpoints.families.members(familyId), {
      body: { email },
      method: 'POST',
    });

    return normalizeFamilyMember(response, familyId);
  },
  removeFamilyMember: (familyId: string, memberId: string) =>
    apiRequest<void>(endpoints.families.memberDetail(familyId, memberId), { method: 'DELETE' }),
};

export const backend = API_BASE_URL ? httpBackend : mockBackend;
