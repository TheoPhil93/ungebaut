import { test, expect } from '@playwright/test';

// Critical-path smoke: home loads → tap a gallery stripe → Explore scrolls
// down to Section 2 (strip + footer) → sticky × closes back to browse. The
// gallery itself is a WebGL canvas (no DOM children for individual cards),
// so we tap pixel coordinates and rely on the data-detail attribute to
// confirm state changes.
//
// Issue 03: ProjectDetail panel retired. The drilldown now lives entirely
// inside HomeView as a unified scroll stack — there's no .detail panel and
// no separate panel mount; close affordances belong to the sticky × button.
test('home → card → explore → close', async ({ page }) => {
  // motion isn't suppressed here — the smoke run wants to exercise the real
  // animation path and prove nothing blocks the user during transitions.
  await page.setViewportSize({ width: 1440, height: 900 });
  // `networkidle` doesn't work here — the gallery auto-loads 16 AVIF textures
  // plus an autoplaying poster video, so the network never goes idle within
  // the test timeout on CI. Use `domcontentloaded` and assert on the canvas
  // being mounted instead.
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);

  // Confirm the gallery canvas mounted and the app is in browse state.
  const canvas = page.locator('.gallery-gl__canvas');
  await expect(canvas).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.app')).toHaveAttribute('data-detail', 'closed');

  // Tap roughly where the centre stripe sits at this viewport. The gallery
  // hit-tests synchronously on pointerdown, so a deterministic click point
  // resolves to whichever stripe the wave currently centres on.
  const box = await canvas.boundingBox();
  if (!box) throw new Error('gallery canvas has no bounding box');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);

  // Selected state: .app picks up data-detail='open', .home picks up
  // .home--scroll (the unified scroll stack), and Section 2 mounts below.
  await expect(page.locator('.app')).toHaveAttribute('data-detail', 'open', {
    timeout: 4000,
  });
  await expect(page.locator('.home--scroll')).toBeVisible();
  const stickyClose = page.locator('.home__sticky-close');
  await expect(stickyClose).toBeVisible();

  // Section 2 should exist in the DOM (strip + footer container).
  const section2 = page.locator('.home__section--strip');
  await expect(section2).toBeAttached({ timeout: 4000 });

  // Click EXPLORE — this used to mount a takeover panel; now it
  // smooth-scrolls to Section 2 within the same surface.
  const explore = page.getByRole('button', { name: /explore/i });
  await expect(explore).toBeVisible();
  await explore.click();

  // Wait for the smooth scroll to bring Section 2 into view (give the
  // browser ~1.2s to finish the scroll).
  await expect(section2).toBeInViewport({ timeout: 4000 });

  // Sticky × stays clickable across sections. Click it and confirm the
  // selection clears + the scroll stack tears down.
  await stickyClose.click();

  await expect(page.locator('.app')).toHaveAttribute('data-detail', 'closed', {
    timeout: 4000,
  });
  await expect(page.locator('.home--scroll')).toHaveCount(0);
});
