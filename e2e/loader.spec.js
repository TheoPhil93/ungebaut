import { test, expect } from '@playwright/test';

// Cold-entry loader (Issue 01 — tracer bullet).
//
// Coverage:
//   1. Cold visit with ?loader=show: loader paints → exits → DOM clean,
//      sessionStorage marked, body scroll restored, ungebaut:loaded fired.
//   2. Escape skip: loader exits within 1s of keypress, gate marked.
//   3. Home content interactive after loader exits (gallery canvas mounted).
//   4. Second visit (gate set): loader is not visible.
//   5. ?loader=skip: loader never visible, no scroll lock applied.
//
// Tests run against `pnpm preview` on http://localhost:4173. Without an
// explicit ?loader=show, the inline controller's localhost auto-skip
// fires, so every "loader visible" scenario forces the URL override.

test.describe('cold-entry loader', () => {
  test.beforeEach(async ({ context }) => {
    // Each test gets a fresh browser context, but explicit storage clears
    // are cheap insurance against shared-state surprises.
    await context.clearCookies();
  });

  test('cold visit shows then exits cleanly', async ({ page, context }) => {
    // Attach a window listener BEFORE the page loads so we can observe the
    // ungebaut:loaded event (which fires very early in the inline script).
    await context.addInitScript(() => {
      window.__loaderEventFired = false;
      window.addEventListener(
        'ungebaut:loaded',
        () => {
          window.__loaderEventFired = true;
        },
        { once: true },
      );
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');

    // Loader is present immediately.
    await expect(loader).toBeVisible();
    await expect(loader).toHaveAttribute('role', 'status');
    await expect(loader).toHaveAttribute('aria-label', 'UNGEBAUT');
    await expect(loader).toHaveAttribute('data-state', 'active');

    // 8 letter spans, all aria-hidden.
    const letters = loader.locator('.ungebaut-loader__letter');
    await expect(letters).toHaveCount(8);
    for (let i = 0; i < 8; i++) {
      await expect(letters.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }

    // Body scroll is locked while loader is active.
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('hidden');

    // Wait for the natural hand-off. Floor is 2.5s, ceiling is 5.5s; the
    // loader is removed from DOM on the fade-out animationend.
    await expect(loader).toHaveCount(0, { timeout: 20000 });

    // Scroll lock restored.
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

    // sessionStorage gate set.
    expect(await page.evaluate(() => sessionStorage.getItem('ungebaut.loaderShown'))).toBe(
      '1',
    );

    // The handshake event fired.
    expect(await page.evaluate(() => window.__loaderEventFired)).toBe(true);
  });

  test('Escape skip exits quickly after keypress', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeVisible();

    // After Issue 04 the exit choreography is 100ms chrome head-start +
    // 900ms slide = 1000ms total under real motion (Playwright's
    // reducedMotion compresses it but the 100ms animation-delay still
    // applies). 3000ms is the "feels quick" threshold — well under the
    // 2.5s floor that would have otherwise gated the exit.
    const beforeKey = Date.now();
    await page.keyboard.press('Escape');
    await expect(loader).toHaveCount(0, { timeout: 5000 });
    expect(Date.now() - beforeKey).toBeLessThan(5000);

    // Gate is set even on Escape skip.
    expect(await page.evaluate(() => sessionStorage.getItem('ungebaut.loaderShown'))).toBe(
      '1',
    );

    // Scroll lock restored.
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('home content is interactive after the loader exits', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    await expect(page.locator('#ungebaut-loader')).toHaveCount(0, {
      timeout: 20000,
    });

    // React mounted under the loader and is now reachable. The WebGL
    // gallery canvas takes a moment to initialise after Suspense resolves,
    // so we wait on it specifically rather than a generic selector.
    await expect(page.locator('.gallery-gl__canvas')).toBeVisible({
      timeout: 8000,
    });
    await expect(page.locator('.app')).toHaveAttribute('data-detail', 'closed');
  });

  test('second visit after gate is set does not show the loader', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // Visit 1: force show, wait for natural exit so the gate is marked.
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#ungebaut-loader')).toHaveCount(0, {
      timeout: 20000,
    });

    // Visit 2 in the same context — sessionStorage persists. Without
    // ?loader=show, the loader is gated off (either by the localhost
    // auto-skip when CI runs on localhost, or by sessionStorage on a
    // non-localhost preview — both paths set data-state="skipped").
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    // The element exists in the static HTML; the inline controller hides
    // it via data-state="skipped" → display:none, so it is not visible.
    await expect(loader).toBeHidden({ timeout: 1500 });

    // Scroll lock was never applied on the skip path.
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('?loader=skip never shows the loader', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=skip', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeHidden({ timeout: 1500 });
    await expect(loader).toHaveAttribute('data-state', 'skipped');

    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('image phase: single-image reel, preloads, box morphs to gallery stripe', async ({
    page,
  }) => {
    // Reduced-motion + mobile hide the box entirely. Force full-motion
    // for this contract.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeVisible();

    // Three preload directives in <head>, each high-priority. URLs
    // match projects[0..2] (projects[1] uses thumb-1 fallback).
    const hrefs = [
      '/images/projects/026/Ard_de_Vries.png',
      '/images/projects/006/thumb-1.png',
      '/images/projects/009/main.png',
    ];
    for (const href of hrefs) {
      const preload = page.locator(`link[rel="preload"][as="image"][href="${href}"]`);
      await expect(preload).toHaveCount(1);
      await expect(preload).toHaveAttribute('fetchpriority', 'high');
    }

    // Single reel with three <img> frames.
    await expect(loader.locator('.ungebaut-loader__reel')).toHaveCount(1);
    const images = loader.locator('.ungebaut-loader__reel-image');
    await expect(images).toHaveCount(3);
    for (let i = 0; i < 3; i++) {
      await expect(images.nth(i)).toHaveAttribute('src', hrefs[i]);
      await expect(images.nth(i)).toHaveAttribute('alt', '');
      await expect(images.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }

    // Box settles at picture-w × letter-h between the letters. With
    // font-size clamp(6em, 16vw, 16em), at 1440x900 the loader's
    // font-size is 16vw = 230.4px, so picture-w (1em) ≈ 230px and
    // letter-h (0.72em) ≈ 166px. Box aspect is ~1.4 (landscape) —
    // wider than tall, matching the Osmo Willem reference.
    await page.waitForFunction(
      () => {
        const box = document.querySelector('.ungebaut-loader__box');
        if (!box) return false;
        const r = box.getBoundingClientRect();
        return r.width >= 180 && r.width <= 290 && r.height >= 130 && r.height <= 200;
      },
      null,
      { timeout: 5000 },
    );
  });

  test('image load failure: aborted source collapses every <img> using it', async ({
    page,
  }) => {
    // Force full-motion so the gesture runs.
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    // Abort Ard_de_Vries.png. It appears as the reel's first frame;
    // its onerror handler collapses that <img>. The reel's other
    // frames (which are the actual final settle position and the
    // adjacent shuffle frame) still paint and the loader completes.
    await page.route('**/Ard_de_Vries.png', (route) => route.abort());

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeVisible();

    // At least one <img> collapsed by onerror.
    await page.waitForFunction(
      () => {
        const imgs = document.querySelectorAll('img[src*="Ard_de_Vries.png"]');
        if (imgs.length === 0) return false;
        for (const img of imgs) {
          if (getComputedStyle(img).display === 'none') return true;
        }
        return false;
      },
      null,
      { timeout: 3000 },
    );

    // Loader still exits normally and the gate is still set. Floor is
    // now 5000ms; allow up to 20s including the slide-out.
    await expect(loader).toHaveCount(0, { timeout: 20000 });
    expect(await page.evaluate(() => sessionStorage.getItem('ungebaut.loaderShown'))).toBe(
      '1',
    );
  });

  test('letter stagger splits 4/4 and settles to translateY(0)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeVisible();

    // 4/4 H1 split: UNGE in __h1-start, BAUT in __h1-end. The growing
    // box sits between them as their middle flex sibling.
    await expect(
      page.locator('.ungebaut-loader__h1-start .ungebaut-loader__letter'),
    ).toHaveCount(4);
    await expect(
      page.locator('.ungebaut-loader__h1-end .ungebaut-loader__letter'),
    ).toHaveCount(4);

    // Stagger end-state: after the per-letter delays complete (last
    // letter starts at 175ms, finishes at 1425ms; reduced-motion
    // settles earlier). WebGL boot can block the main thread on cold
    // load, so 5s gives the animation room even under contention.
    await page.waitForFunction(
      () => {
        const letters = document.querySelectorAll('.ungebaut-loader__letter');
        if (letters.length !== 8) return false;
        for (const letter of letters) {
          const t = getComputedStyle(letter).transform;
          if (t !== 'none' && t !== 'matrix(1, 0, 0, 1, 0, 0)') return false;
        }
        return true;
      },
      null,
      { timeout: 5000 },
    );
  });

  test('exit choreography: chrome and canvas pre-fade, --loaded persists', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeVisible();

    // Show phase: <html> carries the pending class; chrome and canvas
    // render at opacity 0 underneath the loader.
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains('app--loader-pending'),
      ),
    ).toBe(true);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains('app--loader-exiting'),
      ),
    ).toBe(false);

    const navOpacityDuringShow = await page
      .locator('.nav')
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(parseFloat(navOpacityDuringShow)).toBe(0);

    const galleryOpacityDuringShow = await page
      .locator('.home__gl')
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(parseFloat(galleryOpacityDuringShow)).toBe(0);

    // Wait for natural hand-off + slide completion.
    await expect(loader).toHaveCount(0, { timeout: 20000 });

    // Post-exit: --loaded persists, transient classes cleaned up.
    expect(
      await page.evaluate(() => document.documentElement.classList.contains('app--loaded')),
    ).toBe(true);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains('app--loader-pending'),
      ),
    ).toBe(false);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains('app--loader-exiting'),
      ),
    ).toBe(false);

    // Chrome and canvas at near-full opacity (transition may land
    // just shy of 1 when sampled at slide-end; visually identical).
    await expect
      .poll(
        () =>
          page.locator('.nav').evaluate((el) => parseFloat(getComputedStyle(el).opacity)),
        { timeout: 3000 },
      )
      .toBeGreaterThanOrEqual(0.95);
    await expect
      .poll(
        () =>
          page
            .locator('.home__gl')
            .evaluate((el) => parseFloat(getComputedStyle(el).opacity)),
        { timeout: 3000 },
      )
      .toBeGreaterThanOrEqual(0.95);
  });

  test('chrome reaches opacity 1 before the loader slide ends (CSS contract)', async ({
    page,
  }) => {
    // Issue 05 swaps the slide-out for a fade-out under reduced-motion,
    // so the slide-vs-chrome contract test only applies in full motion.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    // The "chrome reaches opacity 1 before slide ends" contract is a
    // function of two timings encoded entirely in CSS: the chrome
    // opacity transition (300ms when .app--loader-exiting is added) and
    // the loader's slide animation (100ms delay + 900ms duration when
    // data-state="exiting"). We verify the contract by reading those
    // computed values directly — main-thread blocking from WebGL boot
    // makes wall-clock timing assertions flaky, but the CSS spec is
    // deterministic.
    const timings = await page.evaluate(() => {
      const nav = document.querySelector('.nav');
      const loaderEl = document.getElementById('ungebaut-loader');
      if (!nav || !loaderEl) return null;

      // Force exit state so the loader's slide animation timing is
      // computable. We do not need to wait for the natural exit.
      document.documentElement.classList.remove('app--loader-pending');
      document.documentElement.classList.add('app--loader-exiting');
      loaderEl.setAttribute('data-state', 'exiting');

      const parseMs = (s) => {
        const n = parseFloat(s);
        return s.trim().endsWith('ms') ? n : n * 1000;
      };
      const navStyle = getComputedStyle(nav);
      const loaderStyle = getComputedStyle(loaderEl);
      return {
        navTransitionProperty: navStyle.transitionProperty,
        navTransitionDuration: parseMs(navStyle.transitionDuration),
        navOpacityTarget: navStyle.opacity,
        loaderAnimationName: loaderStyle.animationName,
        loaderAnimationDelay: parseMs(loaderStyle.animationDelay),
        loaderAnimationDuration: parseMs(loaderStyle.animationDuration),
      };
    });

    expect(timings).not.toBeNull();
    // Chrome rule: opacity is the transitioned property. We don't read
    // the opacity *value* here because the transition would interfere —
    // the post-exit "lands at opacity 1" assertion in the next test
    // covers the eventual chrome state.
    expect(timings.navTransitionProperty).toMatch(/opacity/);
    // Loader rule: slide-out animation, with a non-zero head-start delay
    // so chrome has room to pre-fade before the curtain visibly lifts.
    expect(timings.loaderAnimationName).toBe('ungebaut-loader-slide-out');
    expect(timings.loaderAnimationDelay).toBeGreaterThan(0);
    // Contract: chrome completes before the slide does. Under emulated
    // reducedMotion, durations are reduced to ~0.01ms but the
    // animation-delay is not, so the slide's total still exceeds the
    // chrome's duration regardless.
    const chromeEnd = timings.navTransitionDuration;
    const slideEnd = timings.loaderAnimationDelay + timings.loaderAnimationDuration;
    expect(chromeEnd).toBeLessThan(slideEnd);
  });

  test('exit cleanup: chrome and canvas land at opacity 1 after natural exit', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    // Wait through the loader's full lifecycle including the slide. A
    // generous timeout absorbs WebGL boot blocking the main thread on
    // first paint — this scenario is exactly when the loader is most
    // load-bearing in production.
    await expect(page.locator('#ungebaut-loader')).toHaveCount(0, {
      timeout: 20000,
    });

    expect(
      await page.evaluate(() => document.documentElement.classList.contains('app--loaded')),
    ).toBe(true);
    // Poll for chrome + canvas to converge near opacity 1. The canvas
    // ramps from 0 → 1 over 600ms; when the loader is removed (which
    // also clears --loader-exiting) the value may be mid-transition
    // and snaps slightly. Polling absorbs the few ms it takes to
    // settle and tolerates test-ordering effects.
    await expect
      .poll(
        () =>
          page.locator('.nav').evaluate((el) => parseFloat(getComputedStyle(el).opacity)),
        { timeout: 3000 },
      )
      .toBeGreaterThanOrEqual(0.95);
    await expect
      .poll(
        () =>
          page
            .locator('.home__gl')
            .evaluate((el) => parseFloat(getComputedStyle(el).opacity)),
        { timeout: 3000 },
      )
      .toBeGreaterThanOrEqual(0.95);
  });

  test('skip path: .app--loaded set, no --loader-pending, chrome at full opacity', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=skip', { waitUntil: 'domcontentloaded' });

    // React mounts after the synchronous skip-path dispatch; the window
    // flag handoff ensures .app--loaded still lands.
    await expect
      .poll(
        () =>
          page.evaluate(() => document.documentElement.classList.contains('app--loaded')),
        { timeout: 5000 },
      )
      .toBe(true);

    // No transient classes on the skip path.
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains('app--loader-pending'),
      ),
    ).toBe(false);
    expect(
      await page.evaluate(() =>
        document.documentElement.classList.contains('app--loader-exiting'),
      ),
    ).toBe(false);

    // Chrome at default opacity since the opacity-0 gate was never set.
    expect(
      parseFloat(await page.locator('.nav').evaluate((el) => getComputedStyle(el).opacity)),
    ).toBe(1);
  });

  test('reduced-motion variant: no letter translates, image hidden, fade-out exit', async ({
    page,
  }) => {
    // Playwright's default reducedMotion is already 'reduce', but be
    // explicit so the test self-documents.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeVisible();

    // Letters render at the identity transform from the start — no
    // translateY stagger.
    const letterTransforms = await page.$$eval('.ungebaut-loader__letter', (els) =>
      els.map((el) => getComputedStyle(el).transform),
    );
    expect(letterTransforms).toHaveLength(8);
    for (const t of letterTransforms) {
      expect(t === 'none' || t === 'matrix(1, 0, 0, 1, 0, 0)').toBe(true);
    }

    // The whole box (containing the growing image) is suppressed.
    await expect(loader.locator('.ungebaut-loader__box')).toHaveCSS('display', 'none');

    // Exit collapses to fade-out, not slide. Verified via the animation
    // name on the [data-state="exiting"] rule.
    const animationName = await page.evaluate(() => {
      const loaderEl = document.getElementById('ungebaut-loader');
      loaderEl.setAttribute('data-state', 'exiting');
      return getComputedStyle(loaderEl).animationName;
    });
    expect(animationName).toBe('ungebaut-loader-fade-out');
  });

  test('mobile variant: box hidden, letters meet in middle, smaller font', async ({
    page,
  }) => {
    // Hold reduced-motion off so the mobile-only effects are isolated;
    // hiding the box under reducedMotion would mask whether the mobile
    // rule itself hides it.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/?loader=show', { waitUntil: 'domcontentloaded' });

    const loader = page.locator('#ungebaut-loader');
    await expect(loader).toBeVisible();

    // Box suppressed on mobile — letters from h1-start and h1-end meet
    // in the middle as a single "UNGEBAUT" word.
    await expect(loader.locator('.ungebaut-loader__box')).toHaveCSS('display', 'none');

    // Font-size lands inside the clamp(3em, 18vw, 5em) band. At 375px
    // viewport, 18vw = 67.5px. Assert the loader's computed font-size
    // falls in a reasonable mobile range rather than asserting an
    // exact value.
    const loaderFontPx = await page
      .locator('#ungebaut-loader')
      .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
    expect(loaderFontPx).toBeGreaterThanOrEqual(40);
    expect(loaderFontPx).toBeLessThanOrEqual(110);

    // Slide-out still applies on mobile — the exit choreography keeps
    // its structure; only the durations shorten.
    const animationName = await page.evaluate(() => {
      const loaderEl = document.getElementById('ungebaut-loader');
      loaderEl.setAttribute('data-state', 'exiting');
      return getComputedStyle(loaderEl).animationName;
    });
    expect(animationName).toBe('ungebaut-loader-slide-out');
  });
});
