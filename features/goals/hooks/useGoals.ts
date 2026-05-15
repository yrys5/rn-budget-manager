import { useCallback, useState } from 'react';

import { goalsApi } from '../api/goalsApi';
import { useApiResource } from '@/shared/model/useApiResource';

export const useGoals = () => {
  const loader = useCallback(() => goalsApi.list(), []);
  const resource = useApiResource(loader);
  const [isSaving, setIsSaving] = useState(false);

  return { ...resource, isSaving, setIsSaving };
};
