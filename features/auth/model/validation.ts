export type LoginErrors = Partial<Record<'email' | 'password', string>>;
export type RegisterErrors = Partial<Record<'username' | 'email' | 'password' | 'terms', string>>;

export const validateLogin = (input: { email: string; password: string }) => {
  const errors: LoginErrors = {};

  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) {
    errors.email = 'Podaj poprawny adres email.';
  }

  if (!input.password) {
    errors.password = 'Hasło jest wymagane.';
  }

  return errors;
};

export const validateRegister = (input: {
  acceptedTerms: boolean;
  email: string;
  password: string;
  username: string;
}) => {
  const errors: RegisterErrors = {};

  if (input.username.trim().length < 3) {
    errors.username = 'Username musi mieć minimum 3 znaki.';
  }

  if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) {
    errors.email = 'Podaj poprawny adres email.';
  }

  if (input.password.length < 8) {
    errors.password = 'Hasło musi mieć minimum 8 znaków.';
  }

  if (!input.acceptedTerms) {
    errors.terms = 'Akceptacja regulaminu jest wymagana.';
  }

  return errors;
};
