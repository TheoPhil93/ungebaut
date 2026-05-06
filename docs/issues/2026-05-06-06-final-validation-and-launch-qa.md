# Issue 06 — Final content-validation test & launch QA

**Type:** AFK
**Status:** needs-triage
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

- [ ] All assertions above present in `projects.test.js` and passing.
- [ ] `npm run test:e2e` (Playwright smoke) passes.
- [ ] Manual gallery scroll on dev server: no placeholder text visible at any point.
- [ ] Manual gallery scroll: `Type` row shows differentiated values across cards.
- [ ] Manual gallery scroll: `Role` row shows differentiated values across cards.
- [ ] Final commit on `main` ready to merge for launch.

## Blocked by

- Issue 04
- Issue 05
