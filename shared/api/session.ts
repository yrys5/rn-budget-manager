import type { AuthSession } from '@/shared/model/finance';

const AUTH_TOKEN_STORAGE_KEY = 'rn-budget-manager.authToken';

let authToken = '';

const getWebStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

export const getAuthToken = () => {
  if (authToken) {
    return authToken;
  }

  const storedToken = getWebStorage()?.getItem(AUTH_TOKEN_STORAGE_KEY) ?? '';
  authToken = storedToken;

  return authToken;
};

export const setAuthSession = (session: AuthSession) => {
  authToken = session.token;
  getWebStorage()?.setItem(AUTH_TOKEN_STORAGE_KEY, session.token);

  return session;
};

export const clearAuthSession = () => {
  authToken = '';
  getWebStorage()?.removeItem(AUTH_TOKEN_STORAGE_KEY);
};
