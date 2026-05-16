import { expect, type APIRequestContext, type Page } from '@playwright/test';

export type TestCredentials = {
  email: string;
  password: string;
  username: string;
};

export type BudgetSetup = {
  budgetName: string;
  expenseCategoryName: string;
  incomeCategoryName: string;
  limitAmount: string;
  limitYear: string;
};

export const logStep = (message: string, data?: unknown) => {
  console.log(`[e2e] ${message}`);

  if (data !== undefined) {
    console.log(JSON.stringify(data, null, 2));
  }
};

export const createCredentials = (usernamePrefix = 'e2e_user'): TestCredentials => {
  const timestamp = Date.now();

  return {
    email: `e2e_${timestamp}@example.com`,
    password: 'StrongPassword1',
    username: `${usernamePrefix}_${timestamp}`,
  };
};

export const createNamedCredentials = (username: string): TestCredentials => {
  const timestamp = Date.now();
  const normalizedUsername = username.toLowerCase().replace(/\s+/g, '_');

  return {
    email: `${normalizedUsername}_${timestamp}@example.com`,
    password: 'StrongPassword1',
    username: `${normalizedUsername}_${timestamp}`,
  };
};

export const createBudgetSetup = (): BudgetSetup => {
  const timestamp = Date.now();

  return {
    budgetName: `Budżet E2E ${timestamp}`,
    expenseCategoryName: `Wydatek E2E ${timestamp}`,
    incomeCategoryName: `Przychód E2E ${timestamp}`,
    limitAmount: '750',
    limitYear: '2026',
  };
};

export const registerUserViaApi = async (
  request: APIRequestContext,
  credentials: TestCredentials,
) => {
  const response = await request.post('http://localhost:5000/api/auth/register', {
    data: {
      acceptTerms: true,
      email: credentials.email,
      password: credentials.password,
      username: credentials.username,
    },
  });
  const body = await response.json();

  expect([200, 201]).toContain(response.status());
  expect(body.email).toBe(credentials.email);
  expect(body.username).toBe(credentials.username);

  return { body, response };
};

export const loginUserViaApi = async (
  request: APIRequestContext,
  credentials: Pick<TestCredentials, 'email' | 'password'>,
) => {
  const response = await request.post('http://localhost:5000/api/auth/login', {
    data: {
      email: credentials.email,
      password: credentials.password,
    },
  });
  const body = await response.json();

  expect(response.status()).toBe(200);
  expect(body.token).toBeTruthy();
  expect(body.user.email).toBe(credentials.email);

  return { body, response };
};

export const loginExistingUser = async (
  page: Page,
  credentials: Pick<TestCredentials, 'email' | 'password'>,
) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder('Wpisz hasło')).toBeVisible();
  await page.getByRole('textbox', { name: 'twoj@email.com' }).fill(credentials.email);
  await page.getByRole('textbox', { name: 'Wpisz hasło' }).fill(credentials.password);

  const [loginResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/auth/login') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Zaloguj konto').click(),
  ]);
  const loginSession = await loginResponse.json();

  expect(loginSession.token).toBeTruthy();
  expect(loginSession.user.email).toBe(credentials.email);
  await expect(page).toHaveURL(/\/dashboard/);

  return loginSession;
};

export const createBudgetWithCategoriesAndLimitViaApi = async (
  request: APIRequestContext,
  token: string,
  setup: BudgetSetup,
) => {
  const headers = { Authorization: `Bearer ${token}` };
  const budgetResponse = await request.post('http://localhost:5000/api/budgets', {
    data: { name: setup.budgetName },
    headers,
  });
  const budget = await budgetResponse.json();

  expect([200, 201]).toContain(budgetResponse.status());
  expect(budget.name).toBe(setup.budgetName);

  const budgetId = budget.budgetId ?? budget.id;
  const expenseCategoryResponse = await request.post(
    `http://localhost:5000/api/budgets/${budgetId}/categories`,
    {
      data: { name: setup.expenseCategoryName, type: 'Wydatek' },
      headers,
    },
  );
  const expenseCategory = await expenseCategoryResponse.json();

  expect([200, 201]).toContain(expenseCategoryResponse.status());
  expect(expenseCategory.name).toBe(setup.expenseCategoryName);

  const incomeCategoryResponse = await request.post(
    `http://localhost:5000/api/budgets/${budgetId}/categories`,
    {
      data: { name: setup.incomeCategoryName, type: 'Przychód' },
      headers,
    },
  );
  const incomeCategory = await incomeCategoryResponse.json();

  expect([200, 201]).toContain(incomeCategoryResponse.status());
  expect(incomeCategory.name).toBe(setup.incomeCategoryName);

  const expenseCategoryId = expenseCategory.categoryId ?? expenseCategory.id;
  const limitResponse = await request.post(
    `http://localhost:5000/api/budgets/${budgetId}/budget-limits`,
    {
      data: {
        categoryId: expenseCategoryId,
        currency: 'PLN',
        limitAmount: Number(setup.limitAmount),
        periodMonth: 5,
        periodYear: Number(setup.limitYear),
      },
      headers,
    },
  );
  const limit = await limitResponse.json();

  expect([200, 201]).toContain(limitResponse.status());
  expect(Number(limit.limitAmount)).toBe(Number(setup.limitAmount));

  return {
    budget,
    expenseCategory,
    incomeCategory,
    limit,
    token,
  };
};

export const registerAndLogin = async (
  page: Page,
  credentials: TestCredentials,
  options: { verbose: boolean },
) => {
  const { email, password, username } = credentials;

  if (options.verbose) {
    logStep('Otwieram stronę główną');
  }
  await page.goto('/');

  if (options.verbose) {
    logStep('Przechodzę do formularza rejestracji');
  }
  await page.locator('a[href="/register"]').click();
  await expect(page).toHaveURL(/\/register/);
  await expect(page.getByPlaceholder('np. kasia_nowak')).toBeVisible();

  if (options.verbose) {
    logStep('Wypełniam formularz rejestracji', {
      acceptTerms: true,
      email,
      password,
      username,
    });
  }
  await page.getByPlaceholder('np. kasia_nowak').fill(username);
  await page.getByPlaceholder('twoj@email.com').fill(email);
  await page.getByPlaceholder('Minimum 8 znaków').fill(password);
  await page.getByText('Akceptuję regulamin oraz zasady przetwarzania danych.').click();

  if (options.verbose) {
    logStep('Wysyłam rejestrację do API');
  }
  const [registerResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/auth/register') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Utwórz konto').click(),
  ]);
  const registeredUser = await registerResponse.json();

  if (options.verbose) {
    logStep('Odpowiedź API po rejestracji', {
      body: registeredUser,
      status: registerResponse.status(),
      url: registerResponse.url(),
    });
  }

  expect(registeredUser.email).toBe(email);
  expect(registeredUser.username).toBe(username);
  await expect(page.getByText('Konto zostało utworzone przez warstwę API.')).toBeVisible();

  if (options.verbose) {
    logStep('UI potwierdziło utworzenie konta');
    logStep('Przechodzę do logowania');
  }
  await page.getByRole('link', { name: 'Zaloguj się' }).click();
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByPlaceholder('Wpisz hasło')).toBeVisible();

  if (options.verbose) {
    logStep('Wypełniam formularz logowania', { email, password });
  }
  await page.getByPlaceholder('twoj@email.com').last().fill(email);
  await page.getByPlaceholder('Wpisz hasło').fill(password);

  if (options.verbose) {
    logStep('Wysyłam logowanie do API');
  }
  const [loginResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/auth/login') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Zaloguj konto').click(),
  ]);
  const loginSession = await loginResponse.json();

  if (options.verbose) {
    logStep('Odpowiedź API po logowaniu', {
      body: loginSession,
      status: loginResponse.status(),
      url: loginResponse.url(),
    });
  }

  expect(loginSession.token).toBeTruthy();
  expect(loginSession.user.email).toBe(email);
  await expect(page).toHaveURL(/\/dashboard/);

  if (options.verbose) {
    logStep('Logowanie zakończone, aplikacja przeszła na dashboard', { url: page.url() });
  }

  return { loginSession, registeredUser };
};

export const createBudgetWithCategoriesAndLimit = async (
  page: Page,
  setup: BudgetSetup,
  options: { verbose: boolean },
) => {
  if (options.verbose) {
    logStep('Przechodzę do zakładki Budżety');
  }
  await page.getByRole('tab', { name: 'Budżety' }).click();
  await expect(page.getByText('Zarządzaj planami')).toBeVisible();

  if (options.verbose) {
    logStep('Otwieram modal tworzenia budżetu');
  }
  await page.getByLabel('Dodaj budżet').click();
  await expect(page.getByText('Nowy budżet')).toBeVisible();

  if (options.verbose) {
    logStep('Wypełniam formularz tworzenia budżetu', { name: setup.budgetName });
  }
  await page.getByPlaceholder('np. Remont mieszkania').fill(setup.budgetName);

  if (options.verbose) {
    logStep('Wysyłam utworzenie budżetu do API');
  }
  const [budgetResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/budgets') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Utwórz budżet').click(),
  ]);
  const createdBudget = await budgetResponse.json();

  if (options.verbose) {
    logStep('Odpowiedź API po utworzeniu budżetu', {
      body: createdBudget,
      status: budgetResponse.status(),
      url: budgetResponse.url(),
    });
  }
  expect(createdBudget.name).toBe(setup.budgetName);
  await expect(page.getByText(setup.budgetName).first()).toBeVisible();

  if (options.verbose) {
    logStep('Otwieram formularz dodawania kategorii wydatku');
  }
  await page.getByLabel('Dodaj kategorię').first().click();
  await expect(page.getByText('Nowa kategoria')).toBeVisible();

  if (options.verbose) {
    logStep('Wypełniam kategorię wydatku', {
      name: setup.expenseCategoryName,
      type: 'Wydatek',
    });
  }
  await page.getByPlaceholder('np. Zwierzęta').fill(setup.expenseCategoryName);
  await page.getByText('Wydatek').click();

  if (options.verbose) {
    logStep('Wysyłam kategorię wydatku do API');
  }
  const [expenseCategoryResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/categories') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Dodaj kategorię').last().click(),
  ]);
  const expenseCategory = await expenseCategoryResponse.json();

  if (options.verbose) {
    logStep('Odpowiedź API po dodaniu kategorii wydatku', {
      body: expenseCategory,
      status: expenseCategoryResponse.status(),
      url: expenseCategoryResponse.url(),
    });
  }
  expect(expenseCategory.name).toBe(setup.expenseCategoryName);
  expect(expenseCategory.type).toBe('Wydatek');
  await expect(page.getByText(setup.expenseCategoryName)).toBeVisible();

  if (options.verbose) {
    logStep('Otwieram formularz dodawania kategorii przychodu');
  }
  await page.getByLabel('Dodaj kategorię').first().click();
  await expect(page.getByText('Nowa kategoria')).toBeVisible();

  if (options.verbose) {
    logStep('Wypełniam kategorię przychodu', {
      name: setup.incomeCategoryName,
      type: 'Przychód',
    });
  }
  await page.getByPlaceholder('np. Zwierzęta').fill(setup.incomeCategoryName);
  await page.getByText('Przychód').click();

  if (options.verbose) {
    logStep('Wysyłam kategorię przychodu do API');
  }
  const [incomeCategoryResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/categories') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Dodaj kategorię').last().click(),
  ]);
  const incomeCategory = await incomeCategoryResponse.json();

  if (options.verbose) {
    logStep('Odpowiedź API po dodaniu kategorii przychodu', {
      body: incomeCategory,
      status: incomeCategoryResponse.status(),
      url: incomeCategoryResponse.url(),
    });
  }
  expect(incomeCategory.name).toBe(setup.incomeCategoryName);
  expect(incomeCategory.type).toBe('Przychód');
  await expect(page.getByText(setup.incomeCategoryName)).toBeVisible();

  if (options.verbose) {
    logStep('Otwieram formularz dodawania limitu budżetowego');
  }
  await page.getByLabel('Dodaj limit budżetowy').first().click();
  await expect(page.getByText('Nowy limit')).toBeVisible();

  if (options.verbose) {
    logStep('Wypełniam limit budżetowy', {
      amount: setup.limitAmount,
      category: setup.expenseCategoryName,
      currency: 'PLN',
      month: 'Maj',
      year: setup.limitYear,
    });
  }
  await page.getByText(setup.expenseCategoryName).click();
  await page.getByPlaceholder('np. 1500').fill(setup.limitAmount);
  await page.getByPlaceholder('Rok').fill(setup.limitYear);

  if (options.verbose) {
    logStep('Wysyłam limit budżetowy do API');
  }
  const [limitResponse] = await Promise.all([
    page.waitForResponse((response) =>
      response.request().method() === 'POST' &&
      response.url().includes('/budget-limits') &&
      [200, 201].includes(response.status()),
    ),
    page.getByLabel('Dodaj limit').click(),
  ]);
  const createdLimit = await limitResponse.json();

  if (options.verbose) {
    logStep('Odpowiedź API po dodaniu limitu budżetowego', {
      body: createdLimit,
      status: limitResponse.status(),
      url: limitResponse.url(),
    });
  }
  expect(Number(createdLimit.limitAmount)).toBe(Number(setup.limitAmount));
  await expect(page.getByText(`${Number(setup.limitAmount).toLocaleString('pl-PL')} PLN`)).toBeVisible();

  if (options.verbose) {
    logStep('UI pokazuje dodany limit budżetowy', {
      amount: `${setup.limitAmount} PLN`,
      category: setup.expenseCategoryName,
    });
  }

  return {
    createdBudget,
    createdLimit,
    expenseCategory,
    incomeCategory,
  };
};
