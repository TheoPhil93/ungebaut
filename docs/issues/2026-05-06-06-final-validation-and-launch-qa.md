# Issue 06 — Final content-validation test & launch QA

**Type:** AFK
**Status:** ✅ DONE — 2026-05-07 (iteration 003)
**Stories covered:** 24, 25

## Parent

[docs/PRDs/2026-05-06-gallery-text-refresh.md](../PRDs/2026-05-06-gallery-text-refresh.md)

## What to build

Expand `src/data/projects.test.js` to the full assertion set from the PRD. Run the full E2E smoke. Final visual QA pass on the dev server.

Test assertions to ensure are present (some may already exist from Issues 01–03):

- `projects.length === 30`.
- All `id` values unique across the array.
- No `title` matches `/^(Project|Sequence) \d{3}$/`.
- No card has `client === 'UNGEBAUT' && location === 'Studio archive'` together (placeholder fingerprint pair).
- Every `role` is a non-empty string.
- Every `description` is a non-empty string of length 80–320 characters (sanity-bounded).
- Every entry in every card's `tags` is a member of the locked 12-token vocab.
- Every card's `tags.length ∈ [1, 3]`.
- Every `accent`, `accentSoft`, `detailBg`, `detailInk`, and `massiveInk` (when present) matches `/^#[0-9a-fA-F]{6}$/`.

Visual QA on dev server:

- Scroll the gallery start to finish.
- Hover every card.
- Confirm `Type` row shows differentiated values across cards (no string repeated across half the gallery).
- Confirm `Role` row shows differentiated values across cards (no card showing `Visualisation & Direction` fallback).
- Confirm no `PROJECT 0XX` or `STUDIO ARCHIVE` text appears as a massive title on any card.

## Acceptance criteria

- [x] All assertions above present in `projects.test.js` and passing — **233 parametrised assertions, all green**.
- [x] Playwright smoke (`pnpm exec playwright test e2e/smoke.spec.js`) passes — `home → card → explore → close` round-trip green in 14.5s.
- [x] Playwright visual regression (`pnpm exec playwright test e2e/visual.spec.js`) passes — all 48 screenshots (7 routes × 6 widths + 6 extra) match baseline within the 2% pixel-drift tolerance. Gallery canvas is masked; metadata-panel content changes only render when a card is selected, which the visual tests don't trigger.
- [ ] **Manual gallery scroll on dev server** — out of scope for autonomous run. Founder runs `pnpm dev` and walks the gallery once to confirm Type / Role rows differentiate as expected, no `PROJECT 0XX` / `STUDIO ARCHIVE` text leaks anywhere, and the per-card descriptions read correctly.
- [x] Final commit on `main` ready to merge for launch — see `f191ff2 feat(gallery): launch text refresh`.

## Outstanding before announcing launch

Documented in `progress.txt`:

1. Card 014 (second SSA project) — fill in title / location / role / description; remove from `PENDING_FILL_IN`.
2. Card 024 (Sihl City West / Thurgauerstrasse) — re-add when Theo Hotz publish approval received. Metadata in `docs/gallery-content-source.md`.
3. Manual eyeball QA on dev server (above).

## Blocked by

- Issue 04
- Issue 05
