import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type Currency = 'PLN' | 'EUR' | 'USD';

export type CategoryType = 'Przychód' | 'Wydatek';

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  icon: IconName;
  color: string;
};

export type CategoryTypeOption = {
  label: CategoryType;
  icon: IconName;
  color: string;
};

export type BudgetLimit = {
  id: string;
  limitAmount: number;
  periodYear: number;
  periodMonth: number;
  createdAt: string;
  budgetId: string;
  categoryId: string;
  currency: Currency;
};

export type Budget = {
  id: string;
  name: string;
  balance: number;
  spent: number;
  limit: number;
  categories: Category[];
  limits: BudgetLimit[];
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  transactionDate: string;
  createdAt: string;
  budgetId: string;
  userId: string;
  categoryId: string;
  currency: Currency;
};

export type SavingsGoal = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  startDate: string;
  targetDate: string;
  budgetId: string;
  currency: Currency;
};

export type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type Family = {
  id: string;
  name: string;
};

export type FamilyBudget = {
  id: string;
  familyId: string;
  budgetId: string;
};

export type FamilyMember = {
  id: string;
  familyId: string;
  userId: string;
};

export type DashboardSummary = {
  budgets: Budget[];
  transactions: Transaction[];
  goals: SavingsGoal[];
  families: Family[];
  familyBudgets: FamilyBudget[];
  familyMembers: FamilyMember[];
  users: User[];
  currentMonth: number;
  currentYear: number;
};

export type AuthUser = Pick<User, 'id' | 'username' | 'email' | 'createdAt'>;

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type RegisterInput = {
  username: string;
  email: string;
  password: string;
  acceptTerms: boolean;
};

export type CategoryScreenMode = 'create' | 'edit' | null;
export type LimitScreenMode = 'create' | 'edit' | null;
export type TransactionScreenMode = 'create' | 'edit' | null;
export type GoalScreenMode = 'create' | 'edit' | null;
export type FamilyScreenMode = 'create' | 'edit' | null;

export const categoryTypes: CategoryTypeOption[] = [
  { label: 'Wydatek', icon: 'arrow-down-circle-outline', color: '#B73E3E' },
  { label: 'Przychód', icon: 'arrow-up-circle-outline', color: '#157348' },
];

export const currencies: Currency[] = ['PLN', 'EUR', 'USD'];

export const months = [
  { value: 1, label: 'Styczeń' },
  { value: 2, label: 'Luty' },
  { value: 3, label: 'Marzec' },
  { value: 4, label: 'Kwiecień' },
  { value: 5, label: 'Maj' },
  { value: 6, label: 'Czerwiec' },
  { value: 7, label: 'Lipiec' },
  { value: 8, label: 'Sierpień' },
  { value: 9, label: 'Wrzesień' },
  { value: 10, label: 'Październik' },
  { value: 11, label: 'Listopad' },
  { value: 12, label: 'Grudzień' },
];

export const formatCurrency = (value: number) => `${value.toLocaleString('pl-PL')} zł`;

export const formatLimitCurrency = (value: number, currency: Currency) =>
  `${value.toLocaleString('pl-PL')} ${currency}`;

export const getMonthLabel = (month: number) =>
  months.find((monthOption) => monthOption.value === month)?.label ?? `${month}`;
