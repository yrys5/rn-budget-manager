export const validateGoal = (input: {
  budgetId?: string;
  currentAmount: string;
  name: string;
  startDate: string;
  targetAmount: string;
  targetDate: string;
}) => {
  const normalizedTargetAmount = Number(input.targetAmount.replace(',', '.'));
  const normalizedCurrentAmount = Number(input.currentAmount.replace(',', '.'));

  if (input.name.trim().length < 3) {
    return 'Nazwa celu musi mieć minimum 3 znaki.';
  }

  if (!Number.isFinite(normalizedTargetAmount) || normalizedTargetAmount <= 0) {
    return 'Kwota docelowa musi być większa od zera.';
  }

  if (!Number.isFinite(normalizedCurrentAmount) || normalizedCurrentAmount < 0) {
    return 'Aktualna kwota nie może być ujemna.';
  }

  if (normalizedCurrentAmount > normalizedTargetAmount) {
    return 'Aktualna kwota nie może być większa niż kwota docelowa.';
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(input.targetDate)) {
    return 'Daty celu muszą mieć format YYYY-MM-DD.';
  }

  if (new Date(`${input.targetDate}T00:00:00`) < new Date(`${input.startDate}T00:00:00`)) {
    return 'Data celu nie może być wcześniejsza niż data startu.';
  }

  if (!input.budgetId) {
    return 'Wybierz budżet dla celu.';
  }

  return '';
};
