# PRD — Aristide-style unified drill-down (project view → explore)

**Status:** needs-triage
**Date:** 2026-05-09
**Author:** Philippos Theofanidis (with Claude Code grilling pass)
**Files affected:** `src/App.jsx`, `src/components/HomeView.jsx`, `src/components/ProjectDetail.jsx` (retired), `src/components/MassiveTitle.jsx`, `src/components/GalleryGL.jsx`, new `src/components/MorphingTitle.jsx`, new `src/components/ProjectStrip.jsx`, new `src/components/ProjectFooterMeta.jsx`, new `src/hooks/useLenisScroll.js`, new `src/hooks/useScrollProgress.js`, new `src/lib/title.js`, new `src/lib/clipPath.js`, `src/index.css`, `e2e/visual.spec.js-snapshots/` (regenerated)

---

## Problem Statement

The current drill-down from gallery to project detail is a two-stage modal pattern, not the unified scroll experience visitors expect on a contemporary studio site. After clicking a stripe in the WebGL gallery, the home view enters a "selected" state with a massive title cascade, an expanded canvas hero, and a meta block. To go deeper, the visitor clicks the EXPLORE CTA, which mounts `ProjectDetail` as a full-screen panel that slides up from `y:100%` over the home view. The home title underneath does not visibly _go_ anywhere — it is occluded by the panel — and the panel's title clip-path-wipes in 0.18s later. The two motions are stacked, not choreographed. The image is a WebGL stripe in stage 1 but a fresh DOM `<img>` in stage 2 with no continuity between them. The top chrome (counter, ticks, focused project label) disappears entirely under the panel.

The reference the founder wants to match is aristidebenoist.com, where the equivalent transition is one continuous motion across one scrollable document: title morphs in place via a counter-direction clip-path wipe, hero image scrolls naturally with its section, top metadata stays sticky, and there is no panel-over-page mechanic at all.

A second gap exists on the click-to-select moment itself. The `MassiveTitle` cascade fires with `range: 110%` and `totalDuration: 1.2s` — short travel, fast settle. Aristide's cascades travel further (~200%) and dwell longer (~1.6s), and the drama comes from heavy stagger overlap with pure expo-out (no overshoot), not from animation-library tricks. The current cascade reads as competent but not editorial.

## Solution

Replace the panel-mode drill-down with a unified scrollable two-section stack inside `HomeView`. When a project is selected, the home becomes a scrollable document: Section 1 holds the current selected hero (canvas + chrome + split massive title + meta + description + EXPLORE), Section 2 holds the gallery strip and footer ported from `ProjectDetail`. EXPLORE no longer mounts a panel — it smooth-scrolls to Section 2 via Lenis. The visitor can also scroll naturally; either gesture triggers the same morph at the section boundary.

The massive title appears as one logical element with two renderings: Section 1 holds the existing split form (`BENZ TRA / NSPORT`), Section 2 holds the de-spaced form (`BENZTRANSPORT`). At the section boundary, scroll progress drives a counter-wipe — the split form's `clip-path` animates `inset(0 0 0 0)` → `inset(0 0 0 100%)` (wipes right), the de-spaced form's `clip-path` animates `inset(0 100% 0 0)` → `inset(0 0 0 0)` (wipes in from left). The morph is a one-shot at the boundary; before and after, both halves scroll naturally with their sections.

The WebGL canvas stays in native flow inside Section 1 and scrolls up and out of view as Section 2 enters — no FLIP, no parallax, no canvas-to-DOM handoff. Top chrome (counter, ticks, focused label) is sticky and persists across both sections. Close affordances are: a sticky × always visible during selection, ESC, and a wheel-up-at-`scrollTop ≤ 1` gesture ported from the existing `ProjectDetail`.

The click-to-select cascade is tuned to Aristide's parameters: `MassiveTitle` calls `TextCascade` with `range: 200`, `totalDuration: 1.6`, keep `o6` expo-out, no overshoot. Letters travel further, dwell longer, arrive cleanly.

Lenis (~4kb) is added as the smooth-scroll engine, gated behind `prefers-reduced-motion`. Its scroll source is wired into `GalleryGL` so the existing scroll-derived wave math syncs with smooth scroll velocity.

## User Stories

1. As a visitor evaluating UNGEBAUT, I want clicking a project in the gallery to feel like one continuous motion all the way down to the project's gallery strip, so the studio reads as design-led rather than CMS-template.
2. As a visitor on the home view, when I click EXPLORE on a selected project, I want the page to smooth-scroll into the deeper content rather than have a panel slide over the top, so the experience feels like one document, not two.
3. As a visitor on the home view, when I click EXPLORE, I want the massive title to morph in place via a counter-direction wipe (split form wipes right, de-spaced form wipes in from left), so the title feels like one element evolving rather than two separate titles fading in and out.
4. As a visitor on the home view, when I scroll naturally past a selected project's hero (without clicking EXPLORE), I want the same title morph to fire at the section boundary, so my gesture and the explicit CTA produce the same result.
5. As a visitor on the home view, when I click a stripe in the gallery, I want the massive title's letters to cascade in with longer travel and a slower settle than today (range ~200%, total ~1.6s, pure expo-out), so the moment of selection reads as editorial typography, not stock motion.
6. As a visitor on the home view with `prefers-reduced-motion: reduce`, I want Lenis to be skipped, all clip-path morphs to fall back to opacity-only changes, and the cascade to render as static text, so motion-sensitive visitors get a usable experience.
7. As a visitor on the home view, once I have selected a project and scrolled into the strip section, I want the top chrome (counter, ticks, focused project label) to stay sticky at the top of the viewport, so I always know which project I'm in and where I am in the gallery sequence.
8. As a visitor in a selected project's strip section, I want a sticky close × button always visible at the top right, so I can return to the idle gallery without scrolling back up first.
9. As a visitor in a selected project's hero (Section 1), if I wheel-scroll up while already at the top of the page, I want that gesture to close the project (matching the existing `ProjectDetail` behavior), so the close affordance lives where my hand naturally is.
10. As a keyboard visitor, I want the ESC key to close the selected project from any scroll position, so closing does not require finding a button.
11. As a visitor on `/index` (the list-style gallery), I want clicking a row to take me to the home view with that project selected (current behavior preserved), so the list view still routes into the new unified drill-down without a regression.
12. As a visitor on a touch device, I want native scroll momentum (no Lenis on touch) and tap-to-select on the gallery, so scroll feels native rather than artificially smoothed.
13. As a visitor with `prefers-reduced-motion: reduce` enabled, I want the title morph to be a hard cross-fade (or simply switch text at the boundary) rather than a clip-path wipe, so I don't get vestibular triggers from clipping motion.
14. As a maintainer, I want the title morph's clip-path math extracted into a pure function (`clipPathFromProgress`), so the math is unit-testable independently of any React component.
15. As a maintainer, I want the title text splitting (split form vs de-spaced form) extracted into a pure function (`splitTitleForMorph`), so the rules currently scattered across `MassiveTitle.splitToRows` and `ProjectDetail.detailTitleText` live in one tested place.
16. As a maintainer, I want a `useLenisScroll` hook that takes `{ enabled }`, initializes Lenis when enabled and reduced-motion is off, and tears down cleanly when disabled or unmounted, so the smooth-scroll lifecycle is hidden behind a one-prop interface.
17. As a maintainer, I want a `useScrollProgress` hook that takes a target ref and entry/exit thresholds and returns a 0..1 progress value, so any scroll-driven animation in the future can subscribe without rewriting scroll math.
18. As a maintainer, I want `ProjectDetail.jsx` retired and its content decomposed into two extracted presentational components (`ProjectStrip` and `ProjectFooterMeta`), so the strip + footer can be composed inside `HomeView` without dragging in the panel-mode plumbing.
19. As a maintainer, I want `App.jsx`'s `detailMode` state, `exploreProject` callback, and `closeProject` callback removed once the unified stack lands, so there is no dead two-stage control flow alongside the new one-stage flow.
20. As a maintainer, I want the new `MorphingTitle` component to wrap `MassiveTitle` and `TextCascade` rather than fork them, so the cascade primitives stay the single source of truth for letter motion.
21. As a maintainer, I want `GalleryGL` to accept a scroll source — Lenis subscription when active, its own internal RAF as fallback — so the canvas wave math syncs with smooth scroll without a hard Lenis dependency for idle gallery rendering.
22. As a maintainer, I want the existing E2E visual snapshots regenerated for the new layout, with selectors updated where they previously referenced `.detail` (which no longer exists as a separate panel), so the visual regression suite keeps its meaning.
23. As a maintainer, I want unit tests for the pure functions (`splitTitleForMorph`, `clipPathFromProgress`) and both new hooks (`useLenisScroll`, `useScrollProgress`), so the deepest abstractions in this PR are pinned by isolated tests.
24. As a visitor, I want the EXPLORE button itself to remain visible at the bottom of the hero section while a project is selected, so the affordance is still discoverable for visitors who don't realize they can scroll.
25. As a visitor, when I close a selected project, I want the page to scroll back to the top and the counter-wipe to run in reverse, so closing feels like the inverse of opening rather than a hard cut.
26. As a visitor on the home view with no project selected, I want the scrollable behavior NOT to apply (the idle gallery stays a single fixed viewport), so the only time the page becomes a scroll document is when there is a project to drill into.
27. As a visitor in Section 2 (the strip), I want the strip's frames to stagger in as I scroll past them (preserving the current `whileInView` motion in `ProjectDetail.jsx:236-245`), so the strip feels alive section-by-section rather than landing all at once.
28. As an SEO operator, I want the `document.title` and meta description updates currently performed inside `ProjectDetail` (lines 67-75) to be preserved in the new stack — driven by selection, not by panel mount — so search-engine-visible metadata is unchanged.
29. As an a11y operator, I want focus to move to the close button when a project is selected (mirroring the current `ProjectDetail` focus management at lines 61-64), so keyboard users land on the natural exit affordance.
30. As a maintainer, I want no change to the URL state — `useUrlSync` keeps the existing route map, selecting a project does NOT push a new URL — so this PRD does not also become a routing PRD.

## Implementation Decisions

- **Drop the panel mode entirely.** Remove `detailMode`, `exploreProject`, `closeProject` from `App.jsx`. Remove the standalone `<ProjectDetail>` mount. The `selected` flag alone now drives the unified scroll experience. Closing a project still works through `openProject(null)`.
- **`HomeView` becomes a two-section scroll host when selected.** Section 1 = the current selected hero composition (canvas, chrome, split title, meta, description, EXPLORE). Section 2 = the gallery strip + footer composition ported from `ProjectDetail`. When idle (no selection), `HomeView` renders only Section 1's idle state, with no scrollable Section 2 mounted.
- **`ProjectDetail.jsx` is retired.** Its strip JSX (lines 225-272) becomes `ProjectStrip`. Its footer JSX (lines 274-320) becomes `ProjectFooterMeta`. The wheel-up-close, focus-on-mount, and SEO meta-description updates port to `HomeView`'s selected-stack effect block.
- **`MorphingTitle` component (new).** Wraps `MassiveTitle` for both renderings and `TextCascade` for the inner letters. Consumes `useScrollProgress` against the section-boundary ref. Computes split-form `clip-path` and de-spaced-form `clip-path` via `clipPathFromProgress(progress, direction)`. Rendered once per selected project in the home stack.
- **`splitTitleForMorph` pure function (new, in `src/lib/title.js`).** Signature: `(text: string) → { split: string, despaced: string }`. Codifies the split rules currently in `MassiveTitle.splitToRows` (slash → manual split, first space → space split, no space → midpoint split) and the de-spacing rule currently in `ProjectDetail.jsx:131` (`replace(/[  ]+/g, '')`).
- **`clipPathFromProgress` pure function (new, in `src/lib/clipPath.js`).** Signature: `(progress: number, direction: 'wipe-out-right' | 'wipe-in-left') → string`. Returns an `inset(0 X 0 Y)` string. `wipe-out-right` maps `progress: 0 → 1` to `inset(0 0 0 0) → inset(0 0 0 100%)`. `wipe-in-left` maps `progress: 0 → 1` to `inset(0 100% 0 0) → inset(0 0 0 0)`. Clamps to `[0, 1]`.
- **`useLenisScroll` hook (new, in `src/hooks/useLenisScroll.js`).** Signature: `({ enabled: boolean }) → { lenis: Lenis | null, subscribe: (cb) => unsubscribe }`. Initializes Lenis when `enabled === true` and `usePrefersReducedMotion()` returns false. Disposes on disable/unmount. The `subscribe` callback is what `GalleryGL` uses to read scroll velocity. On touch devices, Lenis is initialized with `smoothTouch: false` (default) so touch momentum stays native.
- **`useScrollProgress` hook (new, in `src/hooks/useScrollProgress.js`).** Signature: `({ ref: React.RefObject, enterAt?: number, exitAt?: number }) → number`. Reads from Lenis when available, native scroll otherwise. `enterAt` / `exitAt` default to `0` and `1` in viewport-fraction space. Returns `0..1` clamped. Returns `1` immediately under reduced motion (so morph snaps to its end state without animating).
- **`MassiveTitle` cascade tuning.** In `MassiveTitle.jsx`, the two `TextCascade` calls bump `range` from `110` → `200` and `totalDuration` from `1.2` → `1.6`. `letterDelay` stays at `0.022`. `startDelay` stays at `0.16` / `0.28`. Ease stays `o6`. No new props introduced.
- **`GalleryGL` × Lenis integration.** Currently runs its own RAF for scroll-derived wave math (`SCROLL_LERP`, `LATENCY_LERP_OUT`, `LATENCY_LERP_IN` in `GalleryGL.jsx:16-19`). New behavior: when a Lenis instance exists (passed in via prop or read via context from `useLenisScroll`), subscribe to its scroll events for velocity input; keep internal RAF for the per-stripe damping math but read scroll velocity from Lenis. When Lenis is null (idle gallery, reduced motion), fall back to current internal scroll source. The wave hit-test logic (`projectStripe`, `easeInOutQuad`) is unchanged.
- **Sticky chrome.** Top chrome (`.home__top` containing counter, ticks, focused-project label) wraps in a `position: sticky; top: 0;` container during selection. The sticky close button is a new fixed-position element rendered when a project is selected.
- **Wheel-up-close.** Ported from `ProjectDetail.jsx:78-96`. Listens on the section-1 scroll surface; closes when `scrollTop ≤ 1` and `event.deltaY < -28`; debounces 600ms.
- **EXPLORE CTA behavior change.** No longer triggers `setDetailMode(true)`. Now calls `lenis.scrollTo(<section-2 ref>, { duration: 1.4, easing: o6 })`. Under reduced motion, falls back to native `scrollIntoView({ behavior: 'auto' })`.
- **`document.title` and meta description.** The `useEffect` blocks currently in `App.jsx:105-109` (title) and `ProjectDetail.jsx:67-75` (meta description) consolidate into one effect inside `HomeView`'s selected-stack block, keyed on `selected`.
- **CSS class system.** New: `.home--scroll` (applied to `.home` when selected, switches the section to scrollable layout), `.home__section--hero` (Section 1), `.home__section--strip` (Section 2 wrapping `ProjectStrip` and `ProjectFooterMeta`), `.home__sticky-chrome` (sticky top chrome wrapper), `.home__sticky-close` (sticky close button). The existing `.detail__*` selectors retire alongside `ProjectDetail.jsx`; their styles are renamed and ported into the `.home__section--strip` namespace.
- **No URL state change.** `useUrlSync` is unchanged. Selecting a project does not push history. Hitting back from a selected project lands on whatever route was previous (today: `/`).
- **No bilingual / no filter / no schema change.** Out of scope (see below).

## Testing Decisions

- **What makes a good test here.** Tests assert _external behavior_ of pure functions and hooks — input → output, mount/unmount lifecycle, scroll-progress mapping at viewport boundaries. Tests do NOT assert specific clip-path animations rendered on screen, do NOT assert Lenis internals, do NOT assert that motion components mounted with specific framer-motion variants. Visual outcomes are covered by Playwright snapshots, not unit tests.
- **Modules under test.**
  - `src/lib/title.js` — `splitTitleForMorph(text)`: returns `{ split, despaced }`. Cases: explicit `/` separator, first-space separator, midpoint split for no-space single-word titles, empty string, single character, very short titles (length < 4), unicode whitespace (` `).
  - `src/lib/clipPath.js` — `clipPathFromProgress(progress, direction)`: cases at `progress = 0`, `0.5`, `1`; both directions; clamps below 0 and above 1; returns the exact `inset(...)` string contract.
  - `src/hooks/useLenisScroll.js` — `useLenisScroll({ enabled })`: initializes Lenis when `enabled && !reducedMotion`; tears down on `enabled → false` and on unmount; never initializes when `prefers-reduced-motion: reduce` is set; the `subscribe` callback dispatches when `lenis.emit('scroll')` is invoked. Lenis is mocked so the test asserts on call sequences, not real scroll behavior.
  - `src/hooks/useScrollProgress.js` — `useScrollProgress({ ref, enterAt, exitAt })`: returns `0` before the ref enters viewport, `1` after the ref leaves viewport, linear in between; reduced-motion shortcut returns `1` immediately. Geometry stubs use `getBoundingClientRect` mocks per the testing-library pattern in `useUrlSync.test.jsx`.
- **Test framework.** Vitest. Configured per `src/hooks/useUrlSync.test.jsx` precedent. Pure-function tests need no jsdom setup; hook tests use `@testing-library/react`'s `renderHook` and `act`.
- **Prior art.** `src/hooks/useUrlSync.test.jsx` (renderHook + popstate driving + spyOn `window.history`). `src/data/projects.test.js` (data-shape assertions). Both establish the project's testing voice: assert contracts, not implementation.
- **Out of unit-test scope.** `MorphingTitle` rendering, `HomeView` selected-stack rendering, `GalleryGL` × Lenis integration. These get visual regression coverage via Playwright snapshots in `e2e/visual.spec.js-snapshots/`. The existing snapshot suite needs regeneration; selectors that referenced `.detail` need to be updated to `.home__section--strip`.

## Out of Scope

- Any change to the idle gallery behavior — stripes, hover, click-to-select, the WebGL canvas's wave math itself.
- FLIP / shared-element morph between the WebGL canvas and the strip's first thumbnail. The canvas exits via native flow; the strip starts at frame #2 (current `galleryItems.slice(1)` behavior preserved).
- Parallax / sticky behavior on the WebGL canvas during scroll. The canvas is in native flow and scrolls away.
- A separate route for selected projects (e.g., `/p/:id`). `useUrlSync` is untouched.
- Changes to `IndexView` row interaction beyond preserving the existing 280ms route-and-select sequence in `App.jsx:111-118`.
- Changes to `ProjectDetail`'s aspect-ratio probing for hero images. The probing logic (`ProjectDetail.jsx:99-122`) is not needed in the unified stack — the WebGL canvas is the hero, and the strip frames render via `Picture` at their natural aspect ratio.
- Adding overshoot to the cascade. `o6` expo-out stays.
- Adding a scroll indicator in the gallery hero (e.g., a chevron or "scroll" label). The EXPLORE CTA is the affordance; the visitor either clicks it or scrolls naturally.
- Changes to the German content surfaces, the home `SeoHead` strings, or the gallery data file. Those are owned by the gallery-text-refresh PRD.
- Adding a curtain / page-color wipe transition. The unified scroll stack replaces both the panel and any need for a curtain.
- Lenis on touch. `smoothTouch: false` is the explicit choice; native momentum on touch.
- Mobile-specific layout for the unified stack. Section 1 / Section 2 reuse the existing responsive rules from `.home` and `.detail` namespaces; no new breakpoints introduced.

## Further Notes

- **Implementation order.** Recommended sequence: (1) extract pure functions `splitTitleForMorph` and `clipPathFromProgress` with unit tests; (2) extract `ProjectStrip` and `ProjectFooterMeta` from `ProjectDetail.jsx` (no behavior change yet); (3) build `useLenisScroll` and `useScrollProgress` hooks with unit tests; (4) build `MorphingTitle` component; (5) refactor `HomeView` to host the two-section stack and rewire `App.jsx` to drop `detailMode`; (6) wire `GalleryGL` × Lenis; (7) tune `MassiveTitle` cascade params; (8) regenerate Playwright snapshots; (9) retire `ProjectDetail.jsx` once the new path is proven.
- **Reduced-motion contract.** `useLenisScroll` returns `{ lenis: null, subscribe: noop }` under reduced motion. `useScrollProgress` returns `1` (end state) immediately under reduced motion so consumers render the post-morph state without animating. `MassiveTitle`'s cascade is already gated by `usePrefersReducedMotion` via the `reduced` prop on `TextCascade`. The combined effect is: no smooth scroll, no clip-path wipes, static text — but the unified scroll layout still works because native scroll is unaffected.
- **Accessibility checklist.** Focus moves to the sticky close button on selection mount (port from `ProjectDetail.jsx:61-64`). ESC closes from any scroll position. Wheel-up-at-top close is keyboard-equivalent via ESC. Top chrome and close button maintain the same aria-label semantics as today (`aria-label="Close project"`, `aria-hidden="true"` on decorative chrome).
- **No migration risk for the data shape.** `ProjectStrip` and `ProjectFooterMeta` consume the same `project` record shape that `ProjectDetail` consumes today. No schema changes.
- **Lenis bundle cost.** Lenis is ~4kb gzipped. It is dynamically imported inside `useLenisScroll` so it does not enter the eager critical path; the same pattern `App.jsx` already uses for `Cursor`, `HomeView`, and `IndexView`.
- **E2E snapshot churn.** All snapshots that include the open `ProjectDetail` panel need regeneration. The `close-button selector` fix (`6f7029e: fix(e2e): scope close-button selector to .detail panel`) needs to flip to the new sticky-close selector. New snapshots: home selected hero, home selected scrolled into strip, deselect/close path. Recommend running `npm run test:e2e -- --update-snapshots` once the implementation is green and reviewing the diff manually before committing.
- **Acceptance criteria for "publishable".** Selecting a project enters the scroll stack. EXPLORE smooth-scrolls to Section 2. Scrolling naturally produces the same morph at the boundary. Title morph is a counter-direction wipe. Top chrome is sticky. Close from any scroll position via × / ESC / wheel-up-at-top. Reduced-motion users get a usable static experience. All four unit tests pass. Visual regression suite passes (post-regeneration).

---

## Locked design decisions reference (from grilling pass)

| #   | Decision                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------ |
| 1   | Both transitions (IndexView → home-selected, home-selected → ProjectDetail) share one motion language. |
| 2   | Title behavior across EXPLORE = counter-direction wipe (split wipes right, de-spaced wipes in left).   |
| 3   | Image behavior = native flow (canvas scrolls up and out with Section 1; no FLIP, no cross-fade panel). |
| 4   | Structural mechanic = no panel; unified scrollable two-section stack inside HomeView.                  |
| 5   | Scroll engine = Lenis, gated behind prefers-reduced-motion, dynamically imported.                      |
| 6   | Title model = one logical title, two renderings (split + de-spaced), in-place morph.                   |
| 7   | Title scroll behavior = one-shot morph at the section boundary, then both halves scroll naturally.     |
| 8   | WebGL hero behavior = native flow, scrolls up and out with Section 1.                                  |
| 9   | "Gallery" in the click-to-select moment = HomeView WebGL stripes (not IndexView).                      |
| 10  | Click-to-select cascade gap = more dramatic per-letter cascade with longer travel.                     |
| 11  | Cascade tuning = Aristide-faithful: range 110 → 200, totalDuration 1.2 → 1.6, keep o6, no overshoot.   |
| 12  | Close mechanic = sticky × button + ESC + wheel-up at top.                                              |
| 13  | Top chrome = stays sticky throughout the selected scroll.                                              |
