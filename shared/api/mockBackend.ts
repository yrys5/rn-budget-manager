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
  RegisterInput,
  SavingsGoal,
  Transaction,
} from '@/shared/model/finance';
import {
  currentUserId,
  demoBudgets,
  demoFamilies,
  demoFamilyBudgets,
  demoFamilyMembers,
  demoGoals,
  demoTransactions,
  demoUsers,
  getDemoDashboardSummary,
} from '@/shared/testing/demoData';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const wait = async () => new Promise((resolve) => setTimeout(resolve, 80));

let budgets = clone(demoBudgets);
let transactions = clone(demoTransactions);
let goals = clone(demoGoals);
let families = clone(demoFamilies);
let familyBudgets = clone(demoFamilyBudgets);
let familyMembers = clone(demoFamilyMembers);
let users = clone(demoUsers);

const currentUser = (): AuthUser => {
  const user = users.find((item) => item.id === currentUserId) ?? users[0];

  return {
    createdAt: user.createdAt,
    email: user.email,
    id: user.id,
    username: user.username,
  };
};

export const mockBackend = {
  async login(email: string): Promise<AuthSession> {
    await wait();
    const user = users.find((item) => item.email === email) ?? users[0];

    return {
      token: 'mock-session-token',
      user: {
        createdAt: user.createdAt,
        email: user.email,
        id: user.id,
        username: user.username,
      },
    };
  },

  async register(input: RegisterInput): Promise<AuthSession> {
    await wait();
    const nextUser = {
      id: `user-${Date.now()}`,
      username: input.username,
      email: input.email,
      passwordHash: 'mock-hash',
      createdAt: new Date().toISOString(),
    };

    users = [nextUser, ...users];

    return {
      token: 'mock-session-token',
      user: {
        createdAt: nextUser.createdAt,
        email: nextUser.email,
        id: nextUser.id,
        username: nextUser.username,
      },
    };
  },

  async me(): Promise<AuthUser> {
    await wait();
    return clone(currentUser());
  },

  async getDashboardSummary(): Promise<DashboardSummary> {
    await wait();
    return clone({
      ...getDemoDashboardSummary(),
      budgets,
      families,
      familyBudgets,
      familyMembers,
      goals,
      transactions,
      users,
    });
  },

  async listBudgets(): Promise<Budget[]> {
    await wait();
    return clone(budgets);
  },

  async saveBudget(budget: Budget): Promise<Budget> {
    await wait();
    const savedBudget = { ...budget, id: budget.id || `budget-${Date.now()}` };

    budgets = budgets.some((item) => item.id === savedBudget.id)
      ? budgets.map((item) => (item.id === savedBudget.id ? savedBudget : item))
      : [savedBudget, ...budgets];

    return clone(savedBudget);
  },

  async deleteBudget(budgetId: string): Promise<void> {
    await wait();
    budgets = budgets.filter((budget) => budget.id !== budgetId);
    familyBudgets = familyBudgets.filter((familyBudget) => familyBudget.budgetId !== budgetId);
  },

  async saveCategory(budgetId: string, category: Category): Promise<Category> {
    await wait();
    const savedCategory = { ...category, id: category.id || `category-${Date.now()}` };

    budgets = budgets.map((budget) => {
      if (budget.id !== budgetId) {
        return budget;
      }

      const categories = budget.categories.some((item) => item.id === savedCategory.id)
        ? budget.categories.map((item) =>
            item.id === savedCategory.id ? savedCategory : item,
          )
        : [savedCategory, ...budget.categories];

      return { ...budget, categories };
    });

    return clone(savedCategory);
  },

  async deleteCategory(budgetId: string, categoryId: string): Promise<void> {
    await wait();
    budgets = budgets.map((budget) =>
      budget.id === budgetId
        ? {
            ...budget,
            categories: budget.categories.filter((category) => category.id !== categoryId),
            limits: budget.limits.filter((limit) => limit.categoryId !== categoryId),
          }
        : budget,
    );
  },

  async saveLimit(budgetId: string, limit: BudgetLimit): Promise<BudgetLimit> {
    await wait();
    const savedLimit = { ...limit, id: limit.id || `limit-${Date.now()}` };

    budgets = budgets.map((budget) => {
      if (budget.id !== budgetId) {
        return budget;
      }

      const limits = budget.limits.some((item) => item.id === savedLimit.id)
        ? budget.limits.map((item) => (item.id === savedLimit.id ? savedLimit : item))
        : [savedLimit, ...budget.limits];

      return { ...budget, limits };
    });

    return clone(savedLimit);
  },

  async deleteLimit(budgetId: string, limitId: string): Promise<void> {
    await wait();
    budgets = budgets.map((budget) =>
      budget.id === budgetId
        ? { ...budget, limits: budget.limits.filter((limit) => limit.id !== limitId) }
        : budget,
    );
  },

  async listTransactions(): Promise<Transaction[]> {
    await wait();
    return clone(transactions);
  },

  async saveTransaction(transaction: Transaction): Promise<Transaction> {
    await wait();
    const savedTransaction = {
      ...transaction,
      id: transaction.id || `transaction-${Date.now()}`,
    };

    transactions = transactions.some((item) => item.id === savedTransaction.id)
      ? transactions.map((item) =>
          item.id === savedTransaction.id ? savedTransaction : item,
        )
      : [savedTransaction, ...transactions];

    return clone(savedTransaction);
  },

  async deleteTransaction(transactionId: string): Promise<void> {
    await wait();
    transactions = transactions.filter((transaction) => transaction.id !== transactionId);
  },

  async listGoals(): Promise<SavingsGoal[]> {
    await wait();
    return clone(goals);
  },

  async saveGoal(goal: SavingsGoal): Promise<SavingsGoal> {
    await wait();
    const savedGoal = { ...goal, id: goal.id || `goal-${Date.now()}` };

    goals = goals.some((item) => item.id === savedGoal.id)
      ? goals.map((item) => (item.id === savedGoal.id ? savedGoal : item))
      : [savedGoal, ...goals];

    return clone(savedGoal);
  },

  async deleteGoal(goalId: string): Promise<void> {
    await wait();
    goals = goals.filter((goal) => goal.id !== goalId);
  },

  async getFamilyWorkspace(): Promise<{
    families: Family[];
    familyBudgets: FamilyBudget[];
    members: FamilyMember[];
    users: typeof users;
  }> {
    await wait();
    return clone({ families, familyBudgets, members: familyMembers, users });
  },

  async saveFamily(input: {
    family: Family;
    budgetIds: string[];
    ownerUserId?: string;
  }): Promise<{ family: Family; familyBudgets: FamilyBudget[]; member?: FamilyMember }> {
    await wait();
    const savedFamily = {
      ...input.family,
      id: input.family.id || `family-${Date.now()}`,
    };
    const exists = families.some((family) => family.id === savedFamily.id);
    families = exists
      ? families.map((family) => (family.id === savedFamily.id ? savedFamily : family))
      : [savedFamily, ...families];

    const nextFamilyBudgets = input.budgetIds.map((budgetId) => ({
      id: `${savedFamily.id}-${budgetId}`,
      familyId: savedFamily.id,
      budgetId,
    }));

    familyBudgets = [
      ...nextFamilyBudgets,
      ...familyBudgets.filter((item) => item.familyId !== savedFamily.id),
    ];

    const member = !exists
      ? {
          id: `${savedFamily.id}-${input.ownerUserId ?? currentUserId}`,
          familyId: savedFamily.id,
          userId: input.ownerUserId ?? currentUserId,
        }
      : undefined;

    if (member) {
      familyMembers = [member, ...familyMembers];
    }

    return clone({ family: savedFamily, familyBudgets: nextFamilyBudgets, member });
  },

  async deleteFamily(familyId: string): Promise<void> {
    await wait();
    families = families.filter((family) => family.id !== familyId);
    familyMembers = familyMembers.filter((member) => member.familyId !== familyId);
    familyBudgets = familyBudgets.filter((familyBudget) => familyBudget.familyId !== familyId);
  },

  async addFamilyMember(familyId: string, userId: string): Promise<FamilyMember> {
    await wait();
    const member = {
      id: `${Date.now()}-${userId}`,
      familyId,
      userId,
    };
    familyMembers = [member, ...familyMembers];

    return clone(member);
  },

  async removeFamilyMember(familyId: string, userId: string): Promise<void> {
    await wait();
    familyMembers = familyMembers.filter(
      (member) => !(member.familyId === familyId && member.userId === userId),
    );
  },
};
