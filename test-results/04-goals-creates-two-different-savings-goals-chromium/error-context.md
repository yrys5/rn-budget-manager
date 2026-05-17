# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 04-goals.spec.ts >> creates two different savings goals
- Location: e2e\04-goals.spec.ts:13:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e11]:
  - generic [ref=e12]:
    - generic [ref=e14]: 
    - generic [ref=e15]: Budget Manager
    - generic [ref=e16]: Witaj ponownie
    - generic [ref=e17]: Zaloguj się, żeby wrócić do swojego budżetu i ostatnich planów.
  - generic [ref=e18]:
    - generic [ref=e19]:
      - generic [ref=e20]: Email
      - generic [ref=e21]:
        - generic [ref=e22]: 
        - textbox "twoj@email.com" [ref=e23]
      - generic [ref=e24]: Podaj poprawny adres email.
    - generic [ref=e25]:
      - generic [ref=e26]: Hasło
      - generic [ref=e27]:
        - generic [ref=e28]: 
        - textbox "Wpisz hasło" [ref=e29]: StrongPassword1
        - generic "Pokaż hasło" [ref=e30] [cursor=pointer]:
          - generic [ref=e31]: 
    - generic [ref=e32]:
      - checkbox " Zapamiętaj mnie" [ref=e33] [cursor=pointer]:
        - generic [ref=e35]: 
        - generic [ref=e36]: Zapamiętaj mnie
      - generic [ref=e38] [cursor=pointer]: Nie pamiętam hasła
    - generic "Zaloguj konto" [active] [ref=e39] [cursor=pointer]:
      - generic [ref=e40]: Zaloguj się
      - generic [ref=e41]: 
    - generic [ref=e42]:
      - generic [ref=e43]: Nie masz konta?
      - link "Zarejestruj się" [ref=e44] [cursor=pointer]:
        - /url: /register
        - generic [ref=e45]: Zarejestruj się
```

# Test source

```ts
  8   | 
  9   | export type BudgetSetup = {
  10  |   budgetName: string;
  11  |   expenseCategoryName: string;
  12  |   incomeCategoryName: string;
  13  |   limitAmount: string;
  14  |   limitYear: string;
  15  | };
  16  | 
  17  | export const logStep = (message: string, data?: unknown) => {
  18  |   console.log(`[e2e] ${message}`);
  19  | 
  20  |   if (data !== undefined) {
  21  |     console.log(JSON.stringify(data, null, 2));
  22  |   }
  23  | };
  24  | 
  25  | export const createCredentials = (usernamePrefix = 'e2e_user'): TestCredentials => {
  26  |   const timestamp = Date.now();
  27  | 
  28  |   return {
  29  |     email: `e2e_${timestamp}@example.com`,
  30  |     password: 'StrongPassword1',
  31  |     username: `${usernamePrefix}_${timestamp}`,
  32  |   };
  33  | };
  34  | 
  35  | export const createNamedCredentials = (username: string): TestCredentials => {
  36  |   const timestamp = Date.now();
  37  |   const normalizedUsername = username.toLowerCase().replace(/\s+/g, '_');
  38  | 
  39  |   return {
  40  |     email: `${normalizedUsername}_${timestamp}@example.com`,
  41  |     password: 'StrongPassword1',
  42  |     username: `${normalizedUsername}_${timestamp}`,
  43  |   };
  44  | };
  45  | 
  46  | export const createBudgetSetup = (): BudgetSetup => {
  47  |   const timestamp = Date.now();
  48  | 
  49  |   return {
  50  |     budgetName: `Budżet E2E ${timestamp}`,
  51  |     expenseCategoryName: `Wydatek E2E ${timestamp}`,
  52  |     incomeCategoryName: `Przychód E2E ${timestamp}`,
  53  |     limitAmount: '750',
  54  |     limitYear: '2026',
  55  |   };
  56  | };
  57  | 
  58  | export const registerUserViaApi = async (
  59  |   request: APIRequestContext,
  60  |   credentials: TestCredentials,
  61  | ) => {
  62  |   const response = await request.post('http://localhost:5000/api/auth/register', {
  63  |     data: {
  64  |       acceptTerms: true,
  65  |       email: credentials.email,
  66  |       password: credentials.password,
  67  |       username: credentials.username,
  68  |     },
  69  |   });
  70  |   const body = await response.json();
  71  | 
  72  |   expect([200, 201]).toContain(response.status());
  73  |   expect(body.email).toBe(credentials.email);
  74  |   expect(body.username).toBe(credentials.username);
  75  | 
  76  |   return { body, response };
  77  | };
  78  | 
  79  | export const loginUserViaApi = async (
  80  |   request: APIRequestContext,
  81  |   credentials: Pick<TestCredentials, 'email' | 'password'>,
  82  | ) => {
  83  |   const response = await request.post('http://localhost:5000/api/auth/login', {
  84  |     data: {
  85  |       email: credentials.email,
  86  |       password: credentials.password,
  87  |     },
  88  |   });
  89  |   const body = await response.json();
  90  | 
  91  |   expect(response.status()).toBe(200);
  92  |   expect(body.token).toBeTruthy();
  93  |   expect(body.user.email).toBe(credentials.email);
  94  | 
  95  |   return { body, response };
  96  | };
  97  | 
  98  | export const loginExistingUser = async (
  99  |   page: Page,
  100 |   credentials: Pick<TestCredentials, 'email' | 'password'>,
  101 | ) => {
  102 |   await page.goto('/login');
  103 |   await expect(page.getByPlaceholder('Wpisz hasło')).toBeVisible();
  104 |   await page.locator('input').nth(0).fill(credentials.email);
  105 |   await page.locator('input').nth(1).fill(credentials.password);
  106 | 
  107 |   const [loginResponse] = await Promise.all([
> 108 |     page.waitForResponse((response) =>
      |          ^ Error: page.waitForResponse: Test timeout of 60000ms exceeded.
  109 |       response.request().method() === 'POST' &&
  110 |       response.url().includes('/auth/login') &&
  111 |       [200, 201].includes(response.status()),
  112 |     ),
  113 |     page.getByLabel('Zaloguj konto').click(),
  114 |   ]);
  115 |   const loginSession = await loginResponse.json();
  116 | 
  117 |   expect(loginSession.token).toBeTruthy();
  118 |   expect(loginSession.user.email).toBe(credentials.email);
  119 |   await expect(page).toHaveURL(/\/dashboard/);
  120 | 
  121 |   return loginSession;
  122 | };
  123 | 
  124 | export const createBudgetWithCategoriesAndLimitViaApi = async (
  125 |   request: APIRequestContext,
  126 |   token: string,
  127 |   setup: BudgetSetup,
  128 | ) => {
  129 |   const headers = { Authorization: `Bearer ${token}` };
  130 |   const budgetResponse = await request.post('http://localhost:5000/api/budgets', {
  131 |     data: { name: setup.budgetName },
  132 |     headers,
  133 |   });
  134 |   const budget = await budgetResponse.json();
  135 | 
  136 |   expect([200, 201]).toContain(budgetResponse.status());
  137 |   expect(budget.name).toBe(setup.budgetName);
  138 | 
  139 |   const budgetId = budget.budgetId ?? budget.id;
  140 |   const expenseCategoryResponse = await request.post(
  141 |     `http://localhost:5000/api/budgets/${budgetId}/categories`,
  142 |     {
  143 |       data: { name: setup.expenseCategoryName, type: 'Wydatek' },
  144 |       headers,
  145 |     },
  146 |   );
  147 |   const expenseCategory = await expenseCategoryResponse.json();
  148 | 
  149 |   expect([200, 201]).toContain(expenseCategoryResponse.status());
  150 |   expect(expenseCategory.name).toBe(setup.expenseCategoryName);
  151 | 
  152 |   const incomeCategoryResponse = await request.post(
  153 |     `http://localhost:5000/api/budgets/${budgetId}/categories`,
  154 |     {
  155 |       data: { name: setup.incomeCategoryName, type: 'Przychód' },
  156 |       headers,
  157 |     },
  158 |   );
  159 |   const incomeCategory = await incomeCategoryResponse.json();
  160 | 
  161 |   expect([200, 201]).toContain(incomeCategoryResponse.status());
  162 |   expect(incomeCategory.name).toBe(setup.incomeCategoryName);
  163 | 
  164 |   const expenseCategoryId = expenseCategory.categoryId ?? expenseCategory.id;
  165 |   const limitResponse = await request.post(
  166 |     `http://localhost:5000/api/budgets/${budgetId}/budget-limits`,
  167 |     {
  168 |       data: {
  169 |         categoryId: expenseCategoryId,
  170 |         currency: 'PLN',
  171 |         limitAmount: Number(setup.limitAmount),
  172 |         periodMonth: 5,
  173 |         periodYear: Number(setup.limitYear),
  174 |       },
  175 |       headers,
  176 |     },
  177 |   );
  178 |   const limit = await limitResponse.json();
  179 | 
  180 |   expect([200, 201]).toContain(limitResponse.status());
  181 |   expect(Number(limit.limitAmount)).toBe(Number(setup.limitAmount));
  182 | 
  183 |   return {
  184 |     budget,
  185 |     expenseCategory,
  186 |     incomeCategory,
  187 |     limit,
  188 |     token,
  189 |   };
  190 | };
  191 | 
  192 | export const registerAndLogin = async (
  193 |   page: Page,
  194 |   credentials: TestCredentials,
  195 |   options: { verbose: boolean },
  196 | ) => {
  197 |   const { email, password, username } = credentials;
  198 | 
  199 |   if (options.verbose) {
  200 |     logStep('Otwieram stronę główną');
  201 |   }
  202 |   await page.goto('/');
  203 | 
  204 |   if (options.verbose) {
  205 |     logStep('Przechodzę do formularza rejestracji');
  206 |   }
  207 |   await page.locator('a[href="/register"]').click();
  208 |   await expect(page).toHaveURL(/\/register/);
```