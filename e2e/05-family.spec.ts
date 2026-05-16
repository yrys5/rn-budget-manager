import { expect, test } from '@playwright/test';

import {
  createBudgetSetup,
  createBudgetWithCategoriesAndLimitViaApi,
  createNamedCredentials,
  loginExistingUser,
  loginUserViaApi,
  logStep,
  registerUserViaApi,
} from './helpers';

const maleNames = ['Jan', 'Piotr', 'Marek', 'Tomasz', 'Adam'];
const femaleNames = ['Anna', 'Kasia', 'Ola', 'Magda', 'Ewa'];

const pickName = (names: string[]) => names[Math.floor(Math.random() * names.length)];

test('creates a family and adds a second user as a member', async ({ page, request }) => {
  const maleName = pickName(maleNames);
  const femaleName = pickName(femaleNames);
  const firstUser = createNamedCredentials(maleName);
  const secondUser = createNamedCredentials(femaleName);
  const setup = createBudgetSetup();
  const familyName = `${maleName}-${femaleName}-${Date.now() % 10000}`;

  logStep('Tworzę dwóch użytkowników z losowymi imionami', {
    firstUser: {
      email: firstUser.email,
      password: firstUser.password,
      username: firstUser.username,
    },
    secondUser: {
      email: secondUser.email,
      password: secondUser.password,
      username: secondUser.username,
    },
  });

  await registerUserViaApi(request, firstUser);
  await registerUserViaApi(request, secondUser);
  const { body: firstUserSession } = await loginUserViaApi(request, firstUser);
  await createBudgetWithCategoriesAndLimitViaApi(request, firstUserSession.token, setup);
  await loginExistingUser(page, firstUser);

  logStep('Przechodzę do zakładki Rodzina');
  await page.getByRole('tab', { name: 'Rodzina' }).click();
  await expect(page.getByText('Wspólne budżety')).toBeVisible();

  logStep('Otwieram modal tworzenia rodziny');
  await page.getByLabel('Dodaj rodzinę').click();
  await expect(page.getByText('Nowa rodzina')).toBeVisible();

  logStep('Wypełniam rodzinę', {
    budget: setup.budgetName,
    name: familyName,
  });
  await page.getByPlaceholder('np. Dom').fill(familyName);
  await page.getByLabel(`Wybierz budżet ${setup.budgetName}`).click();

  logStep('Wysyłam utworzenie rodziny do API');
  const [familyResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/families') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Utwórz rodzinę').click(),
  ]);
  const createdFamily = await familyResponse.json();

  logStep('Odpowiedź API po utworzeniu rodziny', {
    body: createdFamily,
    status: familyResponse.status(),
    url: familyResponse.url(),
  });
  expect(createdFamily.name).toBe(familyName);
  await expect(page.getByText(familyName).first()).toBeVisible();

  logStep('Otwieram modal dodawania członka rodziny');
  await page.getByLabel('Dodaj członka rodziny').click();
  await expect(page.getByText('Dodaj członka')).toBeVisible();

  logStep('Dodaję drugiego użytkownika do rodziny', {
    email: secondUser.email,
    family: familyName,
  });
  await page.getByPlaceholder('np. anna@example.com').fill(secondUser.email);

  logStep('Wysyłam dodanie członka rodziny do API');
  const [memberResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/members') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Dodaj do rodziny').click(),
  ]);
  const createdMember = await memberResponse.json();

  logStep('Odpowiedź API po dodaniu członka rodziny', {
    body: createdMember,
    status: memberResponse.status(),
    url: memberResponse.url(),
  });
  await expect(page.getByText(secondUser.email)).toBeVisible();

  logStep('Test rodziny zakończony sukcesem');
});
