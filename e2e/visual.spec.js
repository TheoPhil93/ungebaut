import { test, expect } from '@playwright/test';

// Routes to capture. /404 is a valid client-side route — useUrlSync resolves
// any unknown path to view='not-found' and renders NotFoundView.
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/index', name: 'index' },
  { path: '/services', name: 'services' },
  { path: '/journal', name: 'journal' },
  { path: '/about', name: 'about' },
  { path: '/impressum', name: 'impressum' },
  { path: '/datenschutz', name: 'datenschutz' },
  { path: '/404', name: 'not-found' },
];

// WCAG-relevant breakpoints + the laptop sweet spot. 1920 dropped — 1440 is
// the largest viewport most users actually run, and the layout is fluid past
// that anyway.
const WIDTHS = [320, 375, 414, 768, 1024, 1440];

// Regions that are non-deterministic across runs. Mask them so the diff
// engine ignores them entirely.
const masks = (page) => [
  page.locator('.gallery-gl__canvas'),
  page.locator('.footer__time'),
  page.locator('.cursor'),
];

for (const route of ROUTES) {
  for (const width of WIDTHS) {
    test(`${route.name} @ ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route.path, { waitUntil: 'networkidle' });
      // Wait for self-hosted fonts to settle before snapshotting; otherwise
      // FOUT shifts text positions and the diff engine flags the page even
      // when nothing semantic changed.
      await page.evaluate(() => document.fonts.ready);
      // Give framer-motion view transition + lazy Suspense one extra rAF to
      // settle. reducedMotion shortens animations to 0.01ms but Suspense
      // resolutions still need a tick.
      await page.waitForTimeout(150);
      await expect(page).toHaveScreenshot(`${route.name}-${width}.png`, {
        fullPage: true,
        mask: masks(page),
      });
    });
  }
}
