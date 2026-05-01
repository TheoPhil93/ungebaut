import { test, expect } from '@playwright/test';

// Critical-path smoke: home loads → tap a gallery stripe → Explore opens the
// deep ProjectDetail view → close returns to gallery. The gallery itself is
// a WebGL canvas (no DOM children for individual cards), so we tap pixel
// coordinates and rely on the data-detail attribute to confirm state changes.
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

  // Selected state: .app picks up data-detail='open', the close button
  // becomes available (mobile-only — desktop hides it, so we look for the
  // Explore CTA which renders on every breakpoint when selected).
  await expect(page.locator('.app')).toHaveAttribute('data-detail', 'open', {
    timeout: 4000,
  });
  const explore = page.getByRole('button', { name: /explore/i });
  await expect(explore).toBeVisible();

  await explore.click();

  // ProjectDetail mounts as a takeover panel.
  const detail = page.locator('.detail');
  await expect(detail).toBeVisible({ timeout: 4000 });

  // The detail close button is auto-focused on mount (a11y commit 7bdeba2),
  // so Escape exits the takeover. We use the button click instead so the
  // smoke also covers the click handler.
  await page.locator('.detail__close, button[aria-label="Close project"]').first().click();

  // Back to selected card view (one level up). One more close returns to
  // pure browse.
  await expect(detail).toBeHidden({ timeout: 4000 });
});
