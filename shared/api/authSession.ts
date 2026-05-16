import type { AuthSession } from '@/shared/model/finance';

let currentSession: AuthSession | null = null;

export const getAuthSession = () => currentSession;

export const getAuthToken = () => currentSession?.token;

export const setAuthSession = (session: AuthSession) => {
  currentSession = session;
};

export const clearAuthSession = () => {
  currentSession = null;
};
