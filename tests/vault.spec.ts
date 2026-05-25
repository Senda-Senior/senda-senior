import { test, expect } from '@playwright/test';

test.describe('Vault Operations', () => {
  test('should redirect unauthenticated users to login with next=/vault', async ({ page }) => {
    await page.goto('/vault');

    await expect(page).toHaveURL(/\/login\?next=%2Fvault$/, { timeout: 5000 });
    await expect(page.locator('#auth-email')).toBeVisible();
  });

  test('should keep the vault route protected after a failed login attempt', async ({ page }) => {
    await page.goto('/login?next=/vault');

    await page.locator('#auth-email').fill('test@example.com');
    await page.locator('#auth-password').fill('testpassword123');
    await page.getByRole('button', { name: /entrar na senda/i }).click();

    await expect(page).toHaveURL(/\/login(?:\?|$)/, { timeout: 10000 });
    await expect(page.locator('.bg-\\[\\#fff3f1\\]')).toBeVisible();

    await page.goto('/vault');
    await expect(page).toHaveURL(/\/login\?next=%2Fvault$/, { timeout: 5000 });
  });
});
