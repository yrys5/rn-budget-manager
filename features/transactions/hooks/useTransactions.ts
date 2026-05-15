import { useCallback, useState } from 'react';

import { transactionsApi } from '../api/transactionsApi';
import { useApiResource } from '@/shared/model/useApiResource';

export const useTransactions = () => {
  const loader = useCallback(() => transactionsApi.list(), []);
  const resource = useApiResource(loader);
  const [isSaving, setIsSaving] = useState(false);

  return { ...resource, isSaving, setIsSaving };
};
