/* eslint-disable no-restricted-syntax */
import { defineConfig, devices } from '@playwright/test';

const LANDING_TEST = '**/landing.spec.ts';

export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     */
    timeout: 5000,

    /**
     * Visual regression defaults — applied to every `toHaveScreenshot()` call.
     * Phase 0 of refactor/landing-coherence: see plan + docs/landing-pattern-budget.md
     *
     * `maxDiffPixelRatio: 0.01` — tolerates 1% of pixels differing (font subpixel jitter)
     * `threshold: 0.2`           — YIQ tolerance per pixel (color difference)
     * `animations: 'disabled'`   — freeze CSS/Framer animations at end-state
     * `caret: 'hide'`            — hide blinking text cursor
     */
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Single worker to prevent runaway node process spawning on Windows.
   * History: 2026-05-10 a Playwright OOM crash left 412 orphan node procs
   * consuming 23.8 GB RAM. Sequential execution + single worker prevents
   * the worker explosion. Local + CI both use 1. */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. */
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  /* Configure projects for major environments */
  projects: [
    /* ─── Landing visual regression — chromium-only, 3 viewports ──────── */
    /*  Other projects exclude landing.spec.ts via testIgnore (below).      */
    /*  Run with: npx playwright test --project=landing-desktop             */
    {
      name: 'landing-mobile',
      testMatch: LANDING_TEST,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 375, height: 812 },
        reducedMotion: 'reduce',
      },
    },
    {
      name: 'landing-tablet',
      testMatch: LANDING_TEST,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
        reducedMotion: 'reduce',
      },
    },
    {
      name: 'landing-desktop',
      testMatch: LANDING_TEST,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        reducedMotion: 'reduce',
      },
    },

    /* ─── Existing projects (auth, vault, login) ──────────────────────── */
    /*  All existing projects exclude landing.spec.ts to avoid 7-browser    */
    /*  baseline matrix problem (see plan §"Pixel diff" decision).          */
    {
      name: 'chromium',
      testIgnore: LANDING_TEST,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testIgnore: LANDING_TEST,
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testIgnore: LANDING_TEST,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      testIgnore: LANDING_TEST,
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      testIgnore: LANDING_TEST,
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Microsoft Edge',
      testIgnore: LANDING_TEST,
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      testIgnore: LANDING_TEST,
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  /* Folder for test artifacts (screenshots on failure, videos, traces). */
  outputDir: 'test-results/',

  /* Run your local dev server before starting the tests.
   * NODE_OPTIONS gives Turbopack/Next 4GB heap (default 1.5GB causes OOM
   * crash under repeated test runs, which was leaving orphan workers). */
  webServer: {
    command: 'npm run dev',
    env: {
      NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'playwright-test-anon-key',
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
      E2E_DISABLE_RATE_LIMIT: 'true',
      NODE_OPTIONS: '--max-old-space-size=4096',
    },
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
