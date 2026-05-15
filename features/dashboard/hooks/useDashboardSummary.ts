import { useCallback } from 'react';

import { dashboardApi } from '../api/dashboardApi';
import { useApiResource } from '@/shared/model/useApiResource';

export const useDashboardSummary = () => {
  const loader = useCallback(() => dashboardApi.getSummary(), []);

  return useApiResource(loader);
};
