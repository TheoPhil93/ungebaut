import { defineConfig, devices } from '@playwright/test';

// Visual-regression baseline. Snapshots commit to e2e/__screenshots__/ so
// regressions show up as a diff in PR review. Run `pnpm test:visual:update`
// to regenerate baselines after intentional UI changes.
//
// Determinism notes:
// - reducedMotion: 'reduce' settles every framer-motion + CSS animation.
// - WebGL canvas (.gallery-gl__canvas), live clock (.footer__time), and the
//   custom cursor are masked in the spec so non-deterministic regions don't
//   cause false positives.
// - Web fonts: spec waits for `document.fonts.ready` before snapshotting.
// - Single Chromium project — visual baselines per browser × viewport gets
//   expensive fast; flag follows up on cross-browser via ops issue.
//
// First-time setup on a new machine:
//   pnpm exec playwright install --with-deps chromium
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  expect: {
    toHaveScreenshot: {
      // Allow up to 2% pixel drift — antialiasing + browser-rendered text
      // wobbles by a couple of pixels even with reducedMotion + font ready.
      maxDiffPixelRatio: 0.02,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    video: 'off',
    screenshot: 'off',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  },
  webServer: {
    command: 'pnpm preview --host',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
