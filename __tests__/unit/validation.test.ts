import { validateBudgetLimit, validateBudgetName } from '@/features/budgets/model/validation';
import { validateFamily } from '@/features/family/model/validation';
import { validateGoal } from '@/features/goals/model/validation';
import { validateTransaction } from '@/features/transactions/model/validation';

describe('domain validation', () => {
  it('validates budget names and limits', () => {
    expect(validateBudgetName('Do')).toBe('Nazwa budżetu musi mieć minimum 3 znaki.');
    expect(validateBudgetName('Dom')).toBe('');
    expect(validateBudgetLimit({ amount: '0', categoryId: 'food', year: '2026' })).toBe(
      'Kwota limitu musi być większa od zera.',
    );
    expect(validateBudgetLimit({ amount: '200', categoryId: 'food', year: '2026' })).toBe('');
  });

  it('validates transactions', () => {
    expect(
      validateTransaction({
        amount: '100',
        budgetId: 'home',
        categoryId: 'food',
        description: 'Zakupy',
        transactionDate: '2026-05-15',
      }),
    ).toBe('');
    expect(
      validateTransaction({
        amount: '-1',
        budgetId: 'home',
        categoryId: 'food',
        description: 'Zakupy',
        transactionDate: '2026-05-15',
      }),
    ).toBe('Kwota transakcji musi być większa od zera.');
  });

  it('validates goals and family forms', () => {
    expect(
      validateGoal({
        budgetId: 'home',
        currentAmount: '200',
        name: 'Cel',
        startDate: '2026-05-15',
        targetAmount: '100',
        targetDate: '2026-12-31',
      }),
    ).toBe('Aktualna kwota nie może być większa niż kwota docelowa.');
    expect(validateFamily({ budgetIds: [], name: 'Dom' })).toBe(
      'Wybierz przynajmniej jeden budżet dla rodziny.',
    );
  });
});
