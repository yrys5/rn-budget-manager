import { backend } from '@/shared/api/backend';

export const dashboardApi = {
  getSummary: () => backend.getDashboardSummary(),
};
