# Issue 03 — Unified scroll stack — replace panel with two-section stack

**Type:** HITL
**Status:** needs-triage
**Stories covered:** 1, 2, 7, 8, 9, 10, 11, 19, 22, 24, 25, 26, 27, 28, 29, 30

## Parent

[docs/PRDs/2026-05-09-aristide-style-drilldown.md](../PRDs/2026-05-09-aristide-style-drilldown.md)

## What to build

Replace the two-stage drill-down (HomeView selected → ProjectDetail panel) with a unified scrollable two-section stack hosted inside `HomeView`. After this slice lands, `ProjectDetail.jsx` is deleted and `App.jsx` no longer manages a separate "detail mode".

This slice does NOT add the title morph (Issue 04) or Lenis smooth-scroll (Issue 05). Both title forms render at their respective sections without animation; scrolling is native.

**`HomeView.jsx`** — when a project is selected, render two sequential sections:

- **Section 1** (`.home__section--hero`) — current selected hero composition (canvas + chrome + split massive title + meta block + description + EXPLORE button). Approximately 100vh tall.
- **Section 2** (`.home__section--strip`) — `<ProjectStrip />` followed by `<ProjectFooterMeta />` (extracted in Issue 02). Naturally tall based on its content. Hosts the de-spaced massive title at its top (just static text in this slice — the morph wires up in Issue 04).

When no project is selected, `HomeView` renders only Section 1's idle state. Section 2 is not mounted. The page remains a single fixed viewport.

**Sticky chrome** — wrap the existing `.home__top` (counter, ticks, focused project label) in a `position: sticky; top: 0;` container during selection so it persists across both sections.

**Sticky close button** — new fixed-position × button visible whenever a project is selected. Rendered inside `HomeView`, not `App.jsx`. `aria-label="Close project"`. Calls the same close handler.

**Close affordances** — three paths, all of which call `openProject(null)`:

1. Sticky × button click.
2. ESC keypress (move existing handler from `App.jsx:90-100` and `ProjectDetail.jsx:48-54` into one place inside `HomeView`).
3. Wheel-up at `scrollTop ≤ 1` (port from `ProjectDetail.jsx:78-96`, including the 600ms cooldown). Listen on the section-1 scroll surface.

On close: page scroll-resets to top, deselect runs.

**EXPLORE CTA behavior change** — no longer triggers `setDetailMode(true)`. Now calls `section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })`. Lenis upgrade lands in Issue 05.

**Focus management** — port the `requestAnimationFrame(() => closeRef.current?.focus())` from `ProjectDetail.jsx:61-64` into `HomeView`'s selection-mount effect, targeting the new sticky × button.

**SEO meta updates** — consolidate the `document.title` effect (`App.jsx:105-109`) and the meta description effect (`ProjectDetail.jsx:67-75`) into a single effect inside `HomeView` keyed on `selected`. Behavior is unchanged.

**`App.jsx` cleanup** — drop:

- `detailMode` state (line 60).
- `exploreProject` callback (lines 77-79).
- `closeProject` callback (lines 81-88).
- The standalone `<ProjectDetail>` mount block (lines 155-159).
- The `setDetailMode(false)` call inside `navigate` (line 66).
- The ESC handling for `detailMode` (line 93).

`HomeView` continues to receive `onSelect` and `selectedId`. The `onExplore` prop is replaced with internal scrolling and is removed from the `HomeView` signature.

**Retire `ProjectDetail.jsx`** — delete the file. Remove its lazy import block in `App.jsx:28-30`.

**CSS work** — port the existing `.detail__*` styles into the `.home__section--strip` namespace. Add:

- `.home--scroll` (applied to `.home` when selected; switches the section to scrollable layout).
- `.home__section--hero` (Section 1).
- `.home__section--strip` (Section 2 wrapping `ProjectStrip` and `ProjectFooterMeta`).
- `.home__sticky-chrome` (sticky top chrome wrapper).
- `.home__sticky-close` (sticky × button).
- Migrate `.detail__strip`, `.detail__footer`, `.detail__strip-*`, `.detail__footer-*`, `.detail__meta-*` rules to use the new `.home__section--strip` parent. Strip the `--detail-bg`, `--detail-ink`, `--detail-accent` CSS variable scope from `.detail` and re-establish on `.home--scroll`.

**E2E updates** — the existing visual regression suite includes snapshots that depended on `.detail` selectors. Update `e2e/visual.spec.js` to target the new sticky-close selector and the new section structure. Regenerate snapshots with `npm run test:e2e -- --update-snapshots`. Manually review the diffs before committing.

## Acceptance criteria

- [ ] `HomeView.jsx` renders Section 1 + Section 2 as a scrollable stack when a project is selected. When no project is selected, only Section 1's idle state mounts.
- [ ] Sticky top chrome (counter, ticks, focused project label) persists across both sections while a project is selected.
- [ ] Sticky × close button is always visible during selection and closes the project on click.
- [ ] ESC closes the project from any scroll position.
- [ ] Wheel-up at `scrollTop ≤ 1` closes the project (with a 600ms debounce); does not close from any other scroll position.
- [ ] Clicking EXPLORE smooth-scrolls to Section 2 via native `scrollIntoView({ behavior: 'smooth' })`.
- [ ] Section 2 renders `<ProjectStrip />` followed by `<ProjectFooterMeta />` (the children extracted in Issue 02).
- [ ] Section 2 hosts the de-spaced massive title (static text in this slice; morph lands in Issue 04).
- [ ] On selection mount, focus moves to the sticky × button.
- [ ] `document.title` and meta description still update as the selected project changes.
- [ ] `App.jsx` no longer references `detailMode`, `exploreProject`, `closeProject`, or `<ProjectDetail>`.
- [ ] `src/components/ProjectDetail.jsx` is deleted.
- [ ] `App.jsx`'s `<HomeView>` mount no longer passes `onExplore`.
- [ ] `useUrlSync` is unchanged — selecting a project does NOT push history.
- [ ] CSS rules previously scoped under `.detail__*` are migrated under `.home__section--strip`. The class `.detail` no longer exists in the codebase.
- [ ] Existing visual regression snapshots regenerated; manual diff review completed; new snapshots committed.
- [ ] E2E smoke (`npm run test:e2e`) passes against the new selectors.
- [ ] Existing unit tests (`vitest run`) pass without modification.
- [ ] HITL: founder reviews the unified-stack layout on the dev server before merge — particularly the section transition feel under native scroll, the sticky chrome behavior, and the close affordances.

## Blocked by

[Issue 02](2026-05-09-02-extract-project-strip-and-footer.md) — needs `ProjectStrip` and `ProjectFooterMeta` extracted before Section 2 can compose them.
