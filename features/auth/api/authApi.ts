import { backend } from '@/shared/api/backend';

export const authApi = {
  login: (email: string, password: string) => backend.login(email, password),
  me: () => backend.me(),
  register: (input: { username: string; email: string; password: string }) =>
    backend.register(input),
};
