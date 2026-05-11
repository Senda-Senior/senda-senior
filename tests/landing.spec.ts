/**
 * ─── Landing Page Visual Regression ────────────────────────────────────
 *
 * Phase 0 of refactor/landing-coherence: visual safety net for upcoming
 * refactor of `src/features/landing/components/*` and related files.
 *
 * Captures the landing page at every viewport-height scroll position
 * across 3 viewports (mobile/tablet/desktop). Future refactors that
 * change visual output will fail this gate.
 *
 * Scoping:
 *   - This file ONLY runs under landing-{mobile,tablet,desktop} projects.
 *   - Other projects (chromium, firefox, …) ignore it via `testIgnore` in
 *     playwright.config.ts. This avoids cross-platform baseline drift.
 *
 * Determinism:
 *   - reducedMotion: 'reduce' is set per project so Framer Motion does not
 *     animate during screenshots. Real users still see animations.
 *   - Mouse moved off-screen so the CustomCursor doesn't introduce noise.
 *   - waitForTimeout(500) after each scroll lets sticky deck settle.
 *
 * Run:
 *   - All viewports:    npx playwright test tests/landing.spec.ts
 *   - One viewport:     npx playwright test --project=landing-desktop
 *   - Update baseline:  npx playwright test tests/landing.spec.ts --update-snapshots
 * ───────────────────────────────────────────────────────────────────────
 */

import { test, expect } from '@playwright/test'

test.describe.configure({ mode: 'serial' })

test.describe('landing visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for hydration + initial network requests
    await page.waitForLoadState('networkidle')
    // Settle SplashScreen + Framer Motion mount animations
    await page.waitForTimeout(2000)
    // Park mouse off-screen so CustomCursor stays out of frame
    await page.mouse.move(-10, -10)
    // Ensure we're at the top before measuring
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    await page.waitForTimeout(300)
  })

  test('full-page scroll capture (every viewport-height)', async ({ page }) => {
    // Measure document and viewport AFTER load + any client-side height changes
    const { totalHeight, viewportHeight } = await page.evaluate(() => ({
      totalHeight: document.documentElement.scrollHeight,
      viewportHeight: window.innerHeight,
    }))

    const numScreens = Math.max(1, Math.ceil(totalHeight / viewportHeight))

    for (let i = 0; i < numScreens; i++) {
      const scrollY = i * viewportHeight
      await page.evaluate((y) => {
        window.scrollTo({ top: y, behavior: 'auto' })
      }, scrollY)
      // Allow sticky deck (z-index stacking) + Lenis smooth-scroll to settle
      await page.waitForTimeout(500)
      await expect(page).toHaveScreenshot(
        `scroll-${String(i).padStart(2, '0')}.png`,
      )
    }
  })

  test('header at rest (top of page)', async ({ page }) => {
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    await page.waitForTimeout(400)
    const header = page.locator('header').first()
    await expect(header).toHaveScreenshot('header-rest.png')
  })

  test('header after small scroll (post-threshold)', async ({ page }) => {
    // Scroll just past the header's "scrolled" threshold to capture the
    // opaque/contrast state without triggering auto-hide (which usually
    // requires more travel + a downward direction signal).
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'auto' }))
    await page.waitForTimeout(500)
    const header = page.locator('header').first()
    await expect(header).toHaveScreenshot('header-scrolled.png')
  })
})
