export const validateBudgetName = (name: string) => {
  if (name.trim().length < 3) {
    return 'Nazwa budżetu musi mieć minimum 3 znaki.';
  }

  return '';
};

export const validateCategoryName = (name: string) => {
  if (name.trim().length < 3) {
    return 'Nazwa kategorii musi mieć minimum 3 znaki.';
  }

  return '';
};

export const validateBudgetLimit = (input: {
  amount: string;
  categoryId?: string | null;
  year: string;
}) => {
  const normalizedAmount = Number(input.amount.replace(',', '.'));
  const normalizedYear = Number(input.year);

  if (!input.categoryId) {
    return 'Dodaj lub wybierz kategorię dla limitu.';
  }

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    return 'Kwota limitu musi być większa od zera.';
  }

  if (!Number.isInteger(normalizedYear) || normalizedYear < 2000) {
    return 'Podaj poprawny rok limitu.';
  }

  return '';
};
