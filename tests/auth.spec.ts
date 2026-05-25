import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should show registration form and allow user interaction', async ({ page }) => {
    await page.goto('/login');
    
    // Switch to register mode
    await page.getByRole('button', { name: 'Cadastrar', exact: true }).click();
    
    // Look for registration form elements using accessibility locators
    const emailInput = page.getByLabel('E-mail');
    const passwordInput = page.getByLabel('Senha');
    const submitButton = page.getByRole('button', { name: /juntar-se a senda/i });
    
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
    
    // Fill with invalid credentials
    await page.getByLabel('E-mail').fill('invalid-email');
    await page.getByLabel('Senha').fill('any-password');
    
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
