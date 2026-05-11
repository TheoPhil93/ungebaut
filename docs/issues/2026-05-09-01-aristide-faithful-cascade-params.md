# Issue 01 — Aristide-faithful cascade params

**Type:** AFK
**Status:** needs-triage
**Stories covered:** 5

## Parent

[docs/PRDs/2026-05-09-aristide-style-drilldown.md](../PRDs/2026-05-09-aristide-style-drilldown.md)

## What to build

Tune the click-to-select massive-title cascade to match the Aristide reference exactly: longer letter travel, slower settle, pure expo-out (no overshoot). Touches the two `TextCascade` calls inside `MassiveTitle.jsx` only — both the top row (`enterFrom: 'left'`) and the bottom row (`enterFrom: 'right'`).

Update both `TextCascade` calls so:

- `range` changes from `110` to `200` (letters start further off-screen).
- `totalDuration` changes from `1.2` to `1.6` (longer dwell).
- `letterDelay` stays at `0.022`.
- `startDelay` stays at `0.16` (top row) / `0.28` (bottom row).
- `ease` stays at `'o6'` (expo-out approximation already wired in `TextCascade`).

No new props introduced on `MassiveTitle` or `TextCascade`. No behavior change for `prefers-reduced-motion: reduce` (the existing `reduced` prop short-circuits to static text either way).

After the change, manually verify on the dev server: clicking any stripe in the WebGL gallery shows the title sliding in with visibly longer travel and a longer settle than today, with no bounce.

## Acceptance criteria

- [ ] `MassiveTitle.jsx` top-row `TextCascade` props: `range={200}`, `totalDuration={1.6}` (other props unchanged).
- [ ] `MassiveTitle.jsx` bottom-row `TextCascade` props: `range={200}`, `totalDuration={1.6}` (other props unchanged).
- [ ] `ease="o6"` preserved on both rows.
- [ ] No new props introduced on `MassiveTitle` or `TextCascade`.
- [ ] No regressions on `prefers-reduced-motion: reduce` — title still renders as static text under that media query.
- [ ] Existing E2E smoke (`npm run test:e2e`) passes; no snapshot changes expected (cascade is mid-animation when snapshots are typically captured, but verify).
- [ ] Manual founder verification on the dev server that the cascade visibly travels further and settles longer than today's.

## Blocked by

None — can start immediately.
