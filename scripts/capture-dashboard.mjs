// Captura screenshots da dashboard em múltiplas resoluções
// Estratégia: faz login UMA vez (sem waitForURL, só espera conteúdo), salva storageState, e reusa
// Uso: node scripts/capture-dashboard.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

const URL = 'https://sendasenior.com.br';
const EMAIL = 'donheringer@gmail.com';
const PASSWORD = '123456789';
const OUT = join(process.cwd(), 'screenshots');
const STORAGE = join(OUT, 'auth.json');
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
];

async function doLogin(ctx) {
  const page = await ctx.newPage();
  await page.goto(`${URL}/login?next=/dashboard`, { waitUntil: 'domcontentloaded' });
  await page.locator('#auth-email').waitFor({ timeout: 20000 });
  await page.locator('#auth-email').fill(EMAIL);
  await page.locator('#auth-password').fill(PASSWORD);
  await page.getByRole('button', { name: /entrar na senda/i }).click();
  // espera conteúdo da dashboard (mais robusto que waitForURL em SPA)
  try {
    await page.waitForSelector('text=Painel', { state: 'attached', timeout: 30000 });
  } catch (e) {
    const text = (await page.locator('body').textContent()) || '';
    console.log('  URL:', page.url());
    console.log('  Body (500):', text.slice(0, 500));
    throw e;
  }
  await page.waitForLoadState('networkidle', { timeout: 30000 });
  await page.waitForTimeout(2500);
  console.log('✓ Login OK, em:', page.url());
  await page.close();
  return ctx.storageState();
}

(async () => {
  const browser = await chromium.launch();

  // 1) login + persistir storage
  let storage;
  if (existsSync(STORAGE)) {
    console.log('→ Reusando storageState de', STORAGE);
    storage = JSON.parse(readFileSync(STORAGE, 'utf8'));
    const ctx = await browser.newContext({ storageState: storage });
    const p = await ctx.newPage();
    await p.goto(`${URL}/dashboard`, { waitUntil: 'domcontentloaded' });
    const ok = p.url().includes('/dashboard');
    await p.close();
    await ctx.close();
    if (!ok) {
      console.log('→ Sessão expirada, refazendo login');
      storage = null;
    }
  }

  if (!storage) {
    const ctx = await browser.newContext();
    storage = await doLogin(ctx);
    writeFileSync(STORAGE, JSON.stringify(storage, null, 2));
    await ctx.close();
    console.log('→ Storage salvo em', STORAGE);
  }

  // 2) para cada viewport, abre com storage e tira screenshots
  for (const vp of VIEWPORTS) {
    console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) ===`);
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: 'reduce',
      storageState: storage,
    });
    const page = await ctx.newPage();
    try {
      await page.goto(`${URL}/dashboard`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('text=Painel', { state: 'attached', timeout: 60000 });
      await page.waitForLoadState('networkidle', { timeout: 30000 });
      await page.waitForTimeout(2500);
      console.log('  url:', page.url());

      const fullPath = join(OUT, `dashboard-${vp.name}-full.png`);
      await page.screenshot({ path: fullPath, fullPage: true });
      console.log(`  ✓ ${fullPath}`);

      const vpPath = join(OUT, `dashboard-${vp.name}-viewport.png`);
      await page.screenshot({ path: vpPath, fullPage: false });
      console.log(`  ✓ ${vpPath}`);
    } catch (e) {
      console.error(`  ✗ ${vp.name}:`, e.message);
    }
    await ctx.close();
  }

  await browser.close();
  console.log('\n✅ Concluído. Veja:', OUT);
})();
