import type {
  Budget,
  Family,
  FamilyBudget,
  FamilyMember,
  SavingsGoal,
  Transaction,
  User,
} from '@/shared/model/finance';

export const currentUserId = 'user-demo-1';

export const demoBudgets: Budget[] = [
  {
    id: 'home',
    name: 'Domowy',
    balance: 4280,
    spent: 3120,
    limit: 7400,
    categories: [
      {
        id: 'food',
        name: 'Zakupy spożywcze',
        type: 'Wydatek',
        icon: 'restaurant-outline',
        color: '#1D8E62',
      },
      {
        id: 'bills',
        name: 'Opłaty mieszkaniowe',
        type: 'Wydatek',
        icon: 'home-outline',
        color: '#466B8F',
      },
      {
        id: 'fun',
        name: 'Weekend',
        type: 'Wydatek',
        icon: 'game-controller-outline',
        color: '#D89D26',
      },
      {
        id: 'salary',
        name: 'Wynagrodzenie',
        type: 'Przychód',
        icon: 'cash-outline',
        color: '#157348',
      },
    ],
    limits: [
      {
        id: 'limit-food-may',
        limitAmount: 1700,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-01T08:00:00.000Z',
        budgetId: 'home',
        categoryId: 'food',
        currency: 'PLN',
      },
      {
        id: 'limit-fun-may',
        limitAmount: 850,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-01T08:10:00.000Z',
        budgetId: 'home',
        categoryId: 'fun',
        currency: 'PLN',
      },
    ],
  },
  {
    id: 'holidays',
    name: 'Wakacje',
    balance: 1850,
    spent: 650,
    limit: 2500,
    categories: [
      {
        id: 'travel',
        name: 'Dojazdy',
        type: 'Wydatek',
        icon: 'car-outline',
        color: '#526E9E',
      },
      {
        id: 'hotel',
        name: 'Apartament',
        type: 'Wydatek',
        icon: 'home-outline',
        color: '#466B8F',
      },
    ],
    limits: [
      {
        id: 'limit-travel-may',
        limitAmount: 900,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-02T09:00:00.000Z',
        budgetId: 'holidays',
        categoryId: 'travel',
        currency: 'PLN',
      },
    ],
  },
  {
    id: 'family',
    name: 'Rodzina',
    balance: 6120,
    spent: 2380,
    limit: 8500,
    categories: [
      {
        id: 'school',
        name: 'Kieszonkowe',
        type: 'Wydatek',
        icon: 'person-outline',
        color: '#6E7681',
      },
      {
        id: 'health',
        name: 'Lekarz i apteka',
        type: 'Wydatek',
        icon: 'medical-outline',
        color: '#C45A5A',
      },
      {
        id: 'house',
        name: 'Dom',
        type: 'Wydatek',
        icon: 'home-outline',
        color: '#466B8F',
      },
    ],
    limits: [
      {
        id: 'limit-health-may',
        limitAmount: 1000,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-03T10:00:00.000Z',
        budgetId: 'family',
        categoryId: 'health',
        currency: 'PLN',
      },
    ],
  },
];

export const demoTransactions: Transaction[] = [
  {
    id: 'transaction-food-1',
    amount: 184,
    description: 'Zakupy spożywcze',
    transactionDate: '2026-05-14',
    createdAt: '2026-05-14T17:20:00.000Z',
    budgetId: 'home',
    userId: currentUserId,
    categoryId: 'food',
    currency: 'PLN',
  },
  {
    id: 'transaction-bills-1',
    amount: 320,
    description: 'Prąd i gaz',
    transactionDate: '2026-05-10',
    createdAt: '2026-05-10T09:30:00.000Z',
    budgetId: 'home',
    userId: currentUserId,
    categoryId: 'bills',
    currency: 'PLN',
  },
  {
    id: 'transaction-travel-1',
    amount: 120,
    description: 'Bilety kolejowe',
    transactionDate: '2026-05-08',
    createdAt: '2026-05-08T12:10:00.000Z',
    budgetId: 'holidays',
    userId: currentUserId,
    categoryId: 'travel',
    currency: 'PLN',
  },
  {
    id: 'transaction-salary-1',
    amount: 5800,
    description: 'Wynagrodzenie',
    transactionDate: '2026-05-01',
    createdAt: '2026-05-01T08:00:00.000Z',
    budgetId: 'home',
    userId: currentUserId,
    categoryId: 'salary',
    currency: 'PLN',
  },
  {
    id: 'transaction-food-previous',
    amount: 96,
    description: 'Piekarnia i warzywa',
    transactionDate: '2026-04-26',
    createdAt: '2026-04-26T13:40:00.000Z',
    budgetId: 'home',
    userId: currentUserId,
    categoryId: 'food',
    currency: 'PLN',
  },
  {
    id: 'transaction-fun-previous',
    amount: 75,
    description: 'Kino',
    transactionDate: '2026-04-12',
    createdAt: '2026-04-12T19:15:00.000Z',
    budgetId: 'home',
    userId: currentUserId,
    categoryId: 'fun',
    currency: 'PLN',
  },
];

export const demoGoals: SavingsGoal[] = [
  {
    id: 'goal-emergency',
    name: 'Poduszka bezpieczeństwa',
    targetAmount: 12000,
    currentAmount: 4280,
    startDate: '2026-01-01',
    targetDate: '2026-12-31',
    budgetId: 'home',
    currency: 'PLN',
  },
  {
    id: 'goal-holidays',
    name: 'Wyjazd wakacyjny',
    targetAmount: 5000,
    currentAmount: 1850,
    startDate: '2026-03-01',
    targetDate: '2026-08-15',
    budgetId: 'holidays',
    currency: 'PLN',
  },
  {
    id: 'goal-health',
    name: 'Rezerwa zdrowotna',
    targetAmount: 3000,
    currentAmount: 900,
    startDate: '2026-04-01',
    targetDate: '2026-10-31',
    budgetId: 'family',
    currency: 'PLN',
  },
];

export const demoUsers: User[] = [
  {
    id: currentUserId,
    username: 'marek',
    email: 'marek@example.com',
    passwordHash: 'local-demo-hash',
    createdAt: '2026-05-01T08:00:00.000Z',
  },
  {
    id: 'user-anna',
    username: 'anna',
    email: 'anna@example.com',
    passwordHash: 'local-demo-hash',
    createdAt: '2026-05-02T08:00:00.000Z',
  },
  {
    id: 'user-ola',
    username: 'ola',
    email: 'ola@example.com',
    passwordHash: 'local-demo-hash',
    createdAt: '2026-05-03T08:00:00.000Z',
  },
  {
    id: 'user-piotr',
    username: 'piotr',
    email: 'piotr@example.com',
    passwordHash: 'local-demo-hash',
    createdAt: '2026-05-04T08:00:00.000Z',
  },
];

export const demoFamilies: Family[] = [
  {
    id: 'family-home',
    name: 'Dom',
  },
  {
    id: 'family-vacation',
    name: 'Wakacje',
  },
];

export const demoFamilyMembers: FamilyMember[] = [
  { id: 'member-home-marek', familyId: 'family-home', userId: currentUserId },
  { id: 'member-home-anna', familyId: 'family-home', userId: 'user-anna' },
  { id: 'member-home-ola', familyId: 'family-home', userId: 'user-ola' },
  { id: 'member-vacation-marek', familyId: 'family-vacation', userId: currentUserId },
  { id: 'member-vacation-piotr', familyId: 'family-vacation', userId: 'user-piotr' },
];

export const demoFamilyBudgets: FamilyBudget[] = [
  { id: 'family-budget-home-home', familyId: 'family-home', budgetId: 'home' },
  { id: 'family-budget-home-family', familyId: 'family-home', budgetId: 'family' },
  { id: 'family-budget-vacation-holidays', familyId: 'family-vacation', budgetId: 'holidays' },
];

export const getDemoDashboardSummary = () => ({
  budgets: demoBudgets,
  transactions: demoTransactions,
  goals: demoGoals,
  families: demoFamilies,
  familyBudgets: demoFamilyBudgets,
  familyMembers: demoFamilyMembers,
  users: demoUsers,
  currentMonth: 5,
  currentYear: 2026,
});
