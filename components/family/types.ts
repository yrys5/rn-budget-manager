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

export type FamilyMember = {
  id: string;
  familyId: string;
  userId: string;
};

export type FamilyScreenMode = 'create' | 'edit' | null;
