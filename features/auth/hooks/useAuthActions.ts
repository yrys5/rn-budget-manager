import { useState } from 'react';

import { authApi } from '../api/authApi';
import { mapApiError } from '@/shared/api/client';
import type { RegisterInput } from '@/shared/model/finance';

export const useAuthActions = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setError('');
    setIsLoading(true);

    try {
      return await authApi.login(email, password);
    } catch (requestError) {
      const apiError = mapApiError(requestError);
      setError(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (input: RegisterInput) => {
    setError('');
    setIsLoading(true);

    try {
      return await authApi.register(input);
    } catch (requestError) {
      const apiError = mapApiError(requestError);
      setError(apiError.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { error, isLoading, login, register };
};
