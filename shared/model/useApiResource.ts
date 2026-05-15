import { useCallback, useEffect, useState } from 'react';

import { type ApiState, mapApiError, toApiState } from '@/shared/api/client';

export const useApiResource = <T>(loader: () => Promise<T>) => {
  const [state, setState] = useState<ApiState<T>>({ status: 'idle' });

  const reload = useCallback(async () => {
    setState((current) => ({ data: current.data, status: 'loading' }));

    try {
      const data = await loader();
      setState(toApiState(data));
    } catch (error) {
      setState((current) => ({
        data: current.data,
        error: mapApiError(error),
        status: 'error',
      }));
    }
  }, [loader]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { reload, state, setState };
};
