export const validateTransaction = (input: {
  amount: string;
  budgetId?: string;
  categoryId?: string;
  description: string;
  transactionDate: string;
}) => {
  const normalizedAmount = Number(input.amount.replace(',', '.'));

  if (!Number.isFinite(normalizedAmount) || normalizedAmount <= 0) {
    return 'Kwota transakcji musi być większa od zera.';
  }

  if (input.description.trim().length < 3) {
    return 'Opis transakcji musi mieć minimum 3 znaki.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.transactionDate)) {
    return 'Data transakcji musi mieć format YYYY-MM-DD.';
  }

  if (!input.budgetId || !input.categoryId) {
    return 'Wybierz budżet oraz kategorię.';
  }

  return '';
};
