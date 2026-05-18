import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show registration form and allow user interaction', async ({ page }) => {
    await page.goto('/login');

    // Switch to register mode
    await page.getByRole('button', { name: 'Cadastrar', exact: true }).click();

    // #auth-email: getByLabel('E-mail') falha em strict mode no registo porque o texto
    // do consentimento contém "e-mail" e o Playwright associa o checkbox ao mesmo token.
    const emailInput = page.locator('#auth-email');
    const passwordInput = page.locator('#auth-password');
    const submitButton = page.getByRole('button', { name: /juntar-se à senda/i });

    // Verify form elements are present
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('should show an auth error when credentials hit the fake Supabase backend', async ({ page }) => {
    await page.goto('/login?next=/dashboard');
    await expect(page.locator('#auth-email')).toBeVisible({ timeout: 20_000 });

    await page.locator('#auth-email').fill('test@example.com');
    await page.locator('#auth-password').fill('securepassword123');

    await page.getByRole('button', { name: /entrar na senda/i }).click();

    await expect(page).toHaveURL(/\/login(?:\?|$)/, { timeout: 10000 });
    await expect(page.locator('.bg-\\[\\#fff3f1\\]')).toBeVisible();
  });

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/login?next=/dashboard');
    await expect(page.locator('#auth-email')).toBeVisible({ timeout: 20_000 });

    // Fill with invalid credentials
    await page.locator('#auth-email').fill('invalid-email');
    await page.locator('#auth-password').fill('any-password');

    // Submit
    await page.getByRole('button', { name: /entrar na senda/i }).click();

    await expect(page.locator('#auth-email-error')).toBeVisible();
  });

  test('should protect routes requiring authentication', async ({ page }) => {
    // Try to access dashboard without logging in
    await page.goto('/dashboard');
    
    // Supabase middleware should redirect to login
    await expect(page).toHaveURL(/.*\/login/, { timeout: 5000 });
  });
});
