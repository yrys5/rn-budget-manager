import { useCallback, useState } from 'react';

import { familyApi } from '../api/familyApi';
import { useApiResource } from '@/shared/model/useApiResource';

export const useFamilyWorkspace = () => {
  const loader = useCallback(() => familyApi.getWorkspace(), []);
  const resource = useApiResource(loader);
  const [isSaving, setIsSaving] = useState(false);

  return { ...resource, isSaving, setIsSaving };
};
