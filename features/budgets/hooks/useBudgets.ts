import { useCallback, useState } from 'react';

import { budgetsApi } from '../api/budgetsApi';
import { useApiResource } from '@/shared/model/useApiResource';

export const useBudgets = () => {
  const loader = useCallback(() => budgetsApi.list(), []);
  const resource = useApiResource(loader);
  const [isSaving, setIsSaving] = useState(false);

  return { ...resource, isSaving, setIsSaving };
};
