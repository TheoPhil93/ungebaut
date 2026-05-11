# Issue 05 — Lenis smooth-scroll + `GalleryGL` integration

**Type:** AFK
**Status:** needs-triage
**Stories covered:** 6, 12, 16, 21, 23

## Parent

[docs/PRDs/2026-05-09-aristide-style-drilldown.md](../PRDs/2026-05-09-aristide-style-drilldown.md)

## What to build

Add Lenis as the smooth-scroll engine for the unified stack delivered in Issue 03, and wire its scroll source into `GalleryGL` so the canvas's scroll-derived wave math syncs with smooth scroll. Gated behind `prefers-reduced-motion` and (by default) disabled on touch — touch keeps native momentum.

This slice introduces one new hook (with unit tests) and two integrations.

**Add Lenis as a dependency.** Install `lenis` via pnpm (`pnpm add lenis`). Dynamic import inside `useLenisScroll` so it does not enter the eager critical path — same pattern `App.jsx` already uses for `Cursor`, `HomeView`, `IndexView`.

**`src/hooks/useLenisScroll.js`** — `useLenisScroll({ enabled }): { lenis: Lenis | null, subscribe: (cb) => () => void }`.

- When `enabled === true` and `usePrefersReducedMotion()` returns `false`, dynamically import Lenis, instantiate one with `{ smoothTouch: false, duration: 1.2, easing: o6Easing }`, and attach its `requestAnimationFrame` loop.
- Return `{ lenis, subscribe }`. `subscribe(cb)` registers `cb` as a `lenis.on('scroll', cb)` listener and returns an unsubscribe function. Listeners receive Lenis's scroll event payload (including `velocity`, `scroll`, `direction`).
- Tear down on `enabled → false` and on unmount: stop the RAF loop, call `lenis.destroy()`, null out the ref.
- When `enabled === false` or under reduced motion: return `{ lenis: null, subscribe: noopSubscribe }` (the noop returns a noop unsubscribe). Consumers handle the null case by falling back to native scroll.

**Wire `useLenisScroll` into `HomeView`.** Inside the selected-stack effect block:

- Call `useLenisScroll({ enabled: Boolean(selected) })`.
- Replace the EXPLORE button's `scrollIntoView` call (introduced in Issue 03) with: if `lenis` is non-null, call `lenis.scrollTo(section2Ref.current, { duration: 1.4, easing: o6Easing })`; otherwise fall back to `section2Ref.current?.scrollIntoView({ behavior: 'smooth' })`.
- Pass the `subscribe` handle to `GalleryGL` via a new `scrollSubscribe` prop.

**Wire `useLenisScroll` into `useScrollProgress`** (from Issue 04). The hook currently listens to native `scroll` on `window`. Update it to take an optional `lenis` argument (or read from a context). When Lenis is active, register via `lenis.on('scroll', recompute)` instead of `window.addEventListener('scroll', recompute)`. Behavior under reduced motion is unchanged — still returns `1` immediately.

**`GalleryGL` × Lenis integration.** Currently, `GalleryGL.jsx` runs its own RAF for the wave math (see `SCROLL_LERP`, `LATENCY_LERP_OUT`, `LATENCY_LERP_IN` constants at lines 16-19, and the `damp` function at lines 35-38). The hit-test math (`projectStripe`, `easeInOutQuad`) stays unchanged.

- Add a new optional prop `scrollSubscribe?: (cb) => () => void`. When provided, on mount, subscribe to it. Inside the callback, read Lenis's `velocity` and feed it as the scroll-velocity input that today's internal RAF computes from raw scroll deltas. The internal per-stripe damping math continues to run.
- When `scrollSubscribe` is `null`/`undefined` (idle gallery, no project selected, reduced motion), the canvas falls back to its current internal scroll source.
- Unsubscribe on unmount.

**Reduced-motion behavior.** When `prefers-reduced-motion: reduce` is set:

- `useLenisScroll` returns `{ lenis: null, subscribe: noopSubscribe }`.
- EXPLORE falls back to native `scrollIntoView`.
- `useScrollProgress` short-circuits to `1` (already wired in Issue 04).
- `GalleryGL` falls back to its internal scroll source.
- The morph (Issue 04) snaps to its end state.

**Touch behavior.** `smoothTouch: false` on the Lenis instance means touch devices use native momentum scrolling. Verify on a real device (or via DevTools touch emulation) that scrolling, swiping, and EXPLORE on touch behave naturally without Lenis interpolation.

**Unit tests** — `src/hooks/useLenisScroll.test.jsx`:

- Mock the dynamic Lenis import so the test asserts on the call sequence, not real DOM scroll.
- Mount with `enabled: true` (and `prefers-reduced-motion: no-preference`), assert Lenis is constructed and the RAF loop is started.
- Mount with `enabled: false`, assert Lenis is never constructed.
- Mount with `prefers-reduced-motion: reduce`, assert Lenis is never constructed regardless of `enabled`.
- Toggle `enabled: true → false`, assert `lenis.destroy()` is called and the returned `lenis` flips to `null`.
- Unmount with `enabled: true`, assert `lenis.destroy()` is called.
- The `subscribe` callback registers/unregisters via `lenis.on('scroll', ...)` / `lenis.off('scroll', ...)` correctly.
- Use `renderHook` + `act` patterns from `useUrlSync.test.jsx`.

## Acceptance criteria

- [ ] `lenis` added to `package.json` dependencies (~4kb gzipped).
- [ ] `src/hooks/useLenisScroll.js` exports `useLenisScroll({ enabled })` with the documented return shape.
- [ ] Lenis is dynamically imported inside the hook, not at module load.
- [ ] `HomeView.jsx` calls `useLenisScroll({ enabled: Boolean(selected) })`; EXPLORE upgrades to `lenis.scrollTo` when Lenis is active and falls back to native `scrollIntoView` otherwise.
- [ ] `GalleryGL.jsx` accepts an optional `scrollSubscribe` prop; when provided, reads scroll velocity from Lenis; when absent, uses its current internal source.
- [ ] `useScrollProgress` (from Issue 04) listens via Lenis when Lenis is active, native scroll otherwise.
- [ ] Under `prefers-reduced-motion: reduce`, Lenis is never instantiated; all consumers fall back to native scroll; the morph snaps to its end state.
- [ ] On touch devices, scroll uses native momentum (`smoothTouch: false`); EXPLORE smooth-scroll still works via `lenis.scrollTo` if reduced-motion is off; verify on a real device or via touch emulation.
- [ ] Unit tests in `src/hooks/useLenisScroll.test.jsx` cover: enabled mount, disabled mount, reduced-motion bypass, enabled→disabled teardown, unmount teardown, subscribe/unsubscribe.
- [ ] All unit tests (`vitest run`) pass.
- [ ] Existing E2E smoke (`npm run test:e2e`) passes — Lenis should not change the visual snapshots since they capture static states.
- [ ] No regression on the idle gallery (no project selected): scroll, hover, click-to-select all behave identically to today.
- [ ] Manual founder verification on the dev server: smooth-scroll feels polished, EXPLORE smooth-scroll has the right pacing (~1.4s with `o6` easing), the canvas wave math during smooth scroll feels in sync with the stripe motion (no jitter, no double-stepping).

## Blocked by

[Issue 03](2026-05-09-03-unified-scroll-stack.md) — needs the unified scroll stack to integrate against. Independent of Issue 04 (can ship before, after, or in parallel).
