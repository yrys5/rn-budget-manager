import type { Family, FamilyBudget, FamilyMember, User } from './types';

export const currentUserId = 'user-demo-1';

export const initialUsers: User[] = [
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

export const initialFamilies: Family[] = [
  {
    id: 'family-home',
    name: 'Dom',
  },
  {
    id: 'family-vacation',
    name: 'Wakacje',
  },
];

export const initialFamilyMembers: FamilyMember[] = [
  { id: 'member-home-marek', familyId: 'family-home', userId: currentUserId },
  { id: 'member-home-anna', familyId: 'family-home', userId: 'user-anna' },
  { id: 'member-home-ola', familyId: 'family-home', userId: 'user-ola' },
  { id: 'member-vacation-marek', familyId: 'family-vacation', userId: currentUserId },
  { id: 'member-vacation-piotr', familyId: 'family-vacation', userId: 'user-piotr' },
];

export const initialFamilyBudgets: FamilyBudget[] = [
  { id: 'family-budget-home-home', familyId: 'family-home', budgetId: 'home' },
  { id: 'family-budget-home-family', familyId: 'family-home', budgetId: 'family' },
  { id: 'family-budget-vacation-holidays', familyId: 'family-vacation', budgetId: 'holidays' },
];
