export const validateFamily = (input: { budgetIds: string[]; name: string }) => {
  if (input.name.trim().length < 3) {
    return 'Nazwa rodziny musi mieć minimum 3 znaki.';
  }

  if (!input.budgetIds.length) {
    return 'Wybierz przynajmniej jeden budżet dla rodziny.';
  }

  return '';
};
