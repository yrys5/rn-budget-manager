import { backend } from '@/shared/api/backend';
import type { Family } from '@/shared/model/finance';

export const familyApi = {
  addMember: (familyId: string, userId: string) => backend.addFamilyMember(familyId, userId),
  deleteFamily: (familyId: string) => backend.deleteFamily(familyId),
  getWorkspace: () => backend.getFamilyWorkspace(),
  removeMember: (familyId: string, memberId: string) =>
    backend.removeFamilyMember(familyId, memberId),
  saveFamily: (input: { family: Family; budgetIds: string[]; ownerUserId?: string }) =>
    backend.saveFamily(input),
};
