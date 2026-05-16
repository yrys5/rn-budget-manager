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

test('creates two different savings goals', async ({ page, request }) => {
  const credentials = createCredentials();
  const setup = createBudgetSetup();
  const timestamp = Date.now();
  const goals = [
    {
      currentAmount: '2500',
      name: `Poduszka E2E ${timestamp}`,
      targetAmount: '12000',
    },
    {
      currentAmount: '800',
      name: `Wakacje E2E ${timestamp}`,
      targetAmount: '5000',
    },
  ];

  logStep('Cicho zakładam użytkownika oraz dane budżetu', {
    email: credentials.email,
    password: credentials.password,
  });
  await registerUserViaApi(request, credentials);
  const { body: loginSession } = await loginUserViaApi(request, credentials);
  await createBudgetWithCategoriesAndLimitViaApi(request, loginSession.token, setup);
  await loginExistingUser(page, credentials);

  logStep('Przechodzę do zakładki Cele');
  await page.getByRole('tab', { name: 'Cele' }).click();
  await expect(page.getByText('Oszczędności', { exact: true })).toBeVisible();

  for (const goal of goals) {
    logStep('Otwieram formularz dodawania celu', goal);
    await page.getByLabel('Dodaj cel').first().click();
    await expect(page.getByText('Nowy cel')).toBeVisible();

    logStep('Wypełniam cel', goal);
    await page.getByPlaceholder('np. Poduszka bezpieczeństwa').fill(goal.name);
    await page.getByPlaceholder('np. 12000').fill(goal.targetAmount);
    await page.getByPlaceholder('np. 2500').fill(goal.currentAmount);

    logStep('Wysyłam cel do API');
    const [goalResponse] = await Promise.all([
      page.waitForResponse((response) =>
        response.request().method() === 'POST' &&
        response.url().includes('/savings-goals') &&
        [200, 201].includes(response.status()),
      ),
      page.getByLabel('Dodaj cel').last().click(),
    ]);
    const createdGoal = await goalResponse.json();

    logStep('Odpowiedź API po dodaniu celu', {
      body: createdGoal,
      status: goalResponse.status(),
      url: goalResponse.url(),
    });
    expect(createdGoal.name).toBe(goal.name);
    expect(Number(createdGoal.targetAmount)).toBe(Number(goal.targetAmount));
    expect(Number(createdGoal.currentAmount)).toBe(Number(goal.currentAmount));
    await expect(page.getByText(goal.name)).toBeVisible();
  }

  logStep('Test celów zakończony sukcesem');
});
