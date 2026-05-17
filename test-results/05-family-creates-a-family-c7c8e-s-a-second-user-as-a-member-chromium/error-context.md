# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 05-family.spec.ts >> creates a family and adds a second user as a member
- Location: e2e\05-family.spec.ts:18:5

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: page.waitForResponse: Test timeout of 60000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e8]:
    - tablist "Main" [ref=e9]:
      - tab "Pulpit" [ref=e10] [cursor=pointer]
      - tab "Budżety" [ref=e11] [cursor=pointer]
      - tab "Transakcje" [ref=e12] [cursor=pointer]
      - tab "Cele" [ref=e13] [cursor=pointer]
      - tab "Rodzina" [selected] [ref=e14] [cursor=pointer]
    - tabpanel "Rodzina" [ref=e15]:
      - generic [ref=e18]:
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]: Rodzina
            - generic [ref=e22]: Wspólne budżety
          - generic "Dodaj rodzinę" [ref=e23] [cursor=pointer]:
            - generic [ref=e24]: 
        - generic [ref=e25]:
          - generic [ref=e26]: 
          - generic [ref=e27]: Brak rodzin
          - generic [ref=e28]: Utwórz rodzinę, żeby dodać do niej użytkowników.
  - dialog [ref=e30]:
    - generic [ref=e36]:
      - generic [ref=e38]:
        - generic [ref=e39]: Nowa rodzina
        - generic [ref=e41] [cursor=pointer]: 
      - generic [ref=e42]:
        - generic [ref=e43]: Nazwa rodziny
        - textbox "np. Dom" [ref=e44]: Piotr-Anna-5861
      - generic [ref=e45]:
        - generic [ref=e46]: Powiązane budżety
        - generic "Wybierz budżet Budżet E2E 1779023255861" [ref=e48] [cursor=pointer]:
          - generic [ref=e50]:
            - generic [ref=e51]: Budżet E2E 1779023255861
            - generic [ref=e52]: 2 kategorii
        - generic [ref=e53]: Wybierz przynajmniej jeden budżet dla rodziny.
      - generic "Utwórz rodzinę" [active] [ref=e54] [cursor=pointer]:
        - generic [ref=e55]: Utwórz rodzinę
        - generic [ref=e56]: 
```

# Test source

```ts
  1   | import { expect, test } from '@playwright/test';
  2   | 
  3   | import {
  4   |   createBudgetSetup,
  5   |   createBudgetWithCategoriesAndLimitViaApi,
  6   |   createNamedCredentials,
  7   |   loginExistingUser,
  8   |   loginUserViaApi,
  9   |   logStep,
  10  |   registerUserViaApi,
  11  | } from './helpers';
  12  | 
  13  | const maleNames = ['Jan', 'Piotr', 'Marek', 'Tomasz', 'Adam'];
  14  | const femaleNames = ['Anna', 'Kasia', 'Ola', 'Magda', 'Ewa'];
  15  | 
  16  | const pickName = (names: string[]) => names[Math.floor(Math.random() * names.length)];
  17  | 
  18  | test('creates a family and adds a second user as a member', async ({ page, request }) => {
  19  |   const maleName = pickName(maleNames);
  20  |   const femaleName = pickName(femaleNames);
  21  |   const firstUser = createNamedCredentials(maleName);
  22  |   const secondUser = createNamedCredentials(femaleName);
  23  |   const setup = createBudgetSetup();
  24  |   const familyName = `${maleName}-${femaleName}-${Date.now() % 10000}`;
  25  | 
  26  |   logStep('Tworzę dwóch użytkowników z losowymi imionami', {
  27  |     firstUser: {
  28  |       email: firstUser.email,
  29  |       password: firstUser.password,
  30  |       username: firstUser.username,
  31  |     },
  32  |     secondUser: {
  33  |       email: secondUser.email,
  34  |       password: secondUser.password,
  35  |       username: secondUser.username,
  36  |     },
  37  |   });
  38  | 
  39  |   await registerUserViaApi(request, firstUser);
  40  |   await registerUserViaApi(request, secondUser);
  41  |   const { body: firstUserSession } = await loginUserViaApi(request, firstUser);
  42  |   await createBudgetWithCategoriesAndLimitViaApi(request, firstUserSession.token, setup);
  43  |   await loginExistingUser(page, firstUser);
  44  | 
  45  |   logStep('Przechodzę do zakładki Rodzina');
  46  |   await page.getByRole('tab', { name: 'Rodzina' }).click();
  47  |   await expect(page.getByText('Wspólne budżety')).toBeVisible();
  48  | 
  49  |   logStep('Otwieram modal tworzenia rodziny');
  50  |   await page.getByLabel('Dodaj rodzinę').click();
  51  |   await expect(page.getByText('Nowa rodzina')).toBeVisible();
  52  | 
  53  |   logStep('Wypełniam rodzinę', {
  54  |     budget: setup.budgetName,
  55  |     name: familyName,
  56  |   });
  57  |   await page.getByPlaceholder('np. Dom').fill(familyName);
  58  |   await page.getByLabel(`Wybierz budżet ${setup.budgetName}`).click();
  59  | 
  60  |   logStep('Wysyłam utworzenie rodziny do API');
  61  |   const [familyResponse] = await Promise.all([
> 62  |     page.waitForResponse((response) =>
      |          ^ Error: page.waitForResponse: Test timeout of 60000ms exceeded.
  63  |       response.request().method() === 'POST' &&
  64  |       response.url().includes('/families') &&
  65  |       [200, 201].includes(response.status()),
  66  |     ),
  67  |     page.getByLabel('Utwórz rodzinę').click(),
  68  |   ]);
  69  |   const createdFamily = await familyResponse.json();
  70  | 
  71  |   logStep('Odpowiedź API po utworzeniu rodziny', {
  72  |     body: createdFamily,
  73  |     status: familyResponse.status(),
  74  |     url: familyResponse.url(),
  75  |   });
  76  |   expect(createdFamily.name).toBe(familyName);
  77  |   await expect(page.getByText(familyName).first()).toBeVisible();
  78  | 
  79  |   logStep('Otwieram modal dodawania członka rodziny');
  80  |   await page.getByLabel('Dodaj członka rodziny').click();
  81  |   await expect(page.getByText('Dodaj członka')).toBeVisible();
  82  | 
  83  |   logStep('Dodaję drugiego użytkownika do rodziny', {
  84  |     email: secondUser.email,
  85  |     family: familyName,
  86  |   });
  87  |   await page.getByPlaceholder('np. anna@example.com').fill(secondUser.email);
  88  | 
  89  |   logStep('Wysyłam dodanie członka rodziny do API');
  90  |   const [memberResponse] = await Promise.all([
  91  |     page.waitForResponse((response) =>
  92  |       response.request().method() === 'POST' &&
  93  |       response.url().includes('/members') &&
  94  |       [200, 201].includes(response.status()),
  95  |     ),
  96  |     page.getByLabel('Dodaj do rodziny').click(),
  97  |   ]);
  98  |   const createdMember = await memberResponse.json();
  99  | 
  100 |   logStep('Odpowiedź API po dodaniu członka rodziny', {
  101 |     body: createdMember,
  102 |     status: memberResponse.status(),
  103 |     url: memberResponse.url(),
  104 |   });
  105 |   await expect(page.getByText(secondUser.email)).toBeVisible();
  106 | 
  107 |   logStep('Test rodziny zakończony sukcesem');
  108 | });
  109 | 
```