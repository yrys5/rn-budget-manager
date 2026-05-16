import { test } from '@playwright/test';

import { createCredentials, logStep, registerAndLogin } from './helpers';

test('registers and logs in', async ({ page }) => {
  const credentials = createCredentials();

  logStep('Start testu rejestracji i logowania', {
    email: credentials.email,
    password: credentials.password,
    username: credentials.username,
  });

  await registerAndLogin(page, credentials, { verbose: true });

  logStep('Test rejestracji i logowania zakończony sukcesem');
});
