// Debug: tenta login, espera 8s, dumpa body e SALVA STORAGE
import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';

const URL = 'https://sendasenior.com.br';
const EMAIL = 'donheringer@gmail.com';
const PASSWORD = '123456789';
const OUT = './screenshots';

(async () => {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext();
  const page = await ctx.newPage();

  await page.goto(`${URL}/login?next=/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.locator('#auth-email').fill(EMAIL);
  await page.locator('#auth-password').fill(PASSWORD);
  await page.getByRole('button', { name: /entrar na senda/i }).click();
  await page.waitForTimeout(8000);

  console.log('URL final:', page.url());
  const storage = await ctx.storageState();
  writeFileSync(`${OUT}/auth.json`, JSON.stringify(storage, null, 2));
  console.log('✓ Storage salvo em', `${OUT}/auth.json`);

  // captura uma screenshot de teste
  await page.screenshot({ path: `${OUT}/test-dashboard.png`, fullPage: true });
  console.log('✓ Screenshot teste salvo');

  await browser.close();
})();
