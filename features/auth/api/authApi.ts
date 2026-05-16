import { backend } from '@/shared/api/backend';
import type { RegisterInput } from '@/shared/model/finance';

export const authApi = {
  login: (email: string, password: string) => backend.login(email, password),
  me: () => backend.me(),
  register: (input: RegisterInput) => backend.register(input),
};
