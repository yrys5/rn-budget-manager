import { expect, test } from '@playwright/test';

import {
  createBudgetSetup,
  createCredentials,
  createBudgetWithCategoriesAndLimitViaApi,
  loginExistingUser,
  loginUserViaApi,
  logStep,
  registerUserViaApi,
} from './helpers';

test('creates transactions with different values and descriptions', async ({ page, request }) => {
  const credentials = createCredentials();
  const setup = createBudgetSetup();
  const transactions = [
    { amount: '45.50', category: setup.expenseCategoryName, description: 'Kawa i śniadanie E2E' },
    { amount: '199.99', category: setup.expenseCategoryName, description: 'Zakupy domowe E2E' },
    { amount: '3200', category: setup.incomeCategoryName, description: 'Wynagrodzenie E2E' },
  ];

  logStep('Cicho zakładam użytkownika oraz dane budżetu', {
    email: credentials.email,
    password: credentials.password,
  });
  await registerUserViaApi(request, credentials);
  const { body: loginSession } = await loginUserViaApi(request, credentials);
  await createBudgetWithCategoriesAndLimitViaApi(request, loginSession.token, setup);
  await loginExistingUser(page, credentials);

  logStep('Przechodzę do zakładki Transakcje');
  await page.getByRole('tab', { name: 'Transakcje' }).click();
  await expect(page.getByText('Historia wydatków')).toBeVisible();

  for (const transaction of transactions) {
    logStep('Otwieram formularz dodawania transakcji', transaction);
    await page.getByLabel('Dodaj transakcję').first().click();
    await expect(page.getByText('Nowa transakcja')).toBeVisible();

    logStep('Wypełniam transakcję', transaction);
    await page.getByPlaceholder('np. Zakupy spożywcze').fill(transaction.description);
    await page.getByPlaceholder('np. 120').fill(transaction.amount);
    await page.getByText(transaction.category).last().click();

    logStep('Wysyłam transakcję do API');
    const [transactionResponse] = await Promise.all([
      page.waitForResponse((response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/transactions') &&
        [200, 201].includes(response.status()),
      ),
      page.getByLabel('Dodaj transakcję').last().click(),
    ]);
    const createdTransaction = await transactionResponse.json();

    logStep('Odpowiedź API po dodaniu transakcji', {
      body: createdTransaction,
      status: transactionResponse.status(),
      url: transactionResponse.url(),
    });
    expect(createdTransaction.description).toBe(transaction.description);
    expect(Number(createdTransaction.amount)).toBe(Number(transaction.amount));
    await expect(page.getByText(transaction.description)).toBeVisible();
  }

  logStep('Test transakcji zakończony sukcesem');
});
