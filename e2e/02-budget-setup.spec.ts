import { test } from '@playwright/test';

import {
  createBudgetSetup,
  createCredentials,
  createBudgetWithCategoriesAndLimit,
  logStep,
  registerAndLogin,
} from './helpers';

test('creates a budget with expense, income, and one budget limit', async ({ page }) => {
  const credentials = createCredentials();
  const setup = createBudgetSetup();

  logStep('Utworzę nowego użytkownika testowego', {
    email: credentials.email,
    password: credentials.password,
  });
  await registerAndLogin(page, credentials, { verbose: false });

  await createBudgetWithCategoriesAndLimit(page, setup, { verbose: true });

  logStep('Test budżetu, kategorii i limitu zakończony sukcesem');
});
