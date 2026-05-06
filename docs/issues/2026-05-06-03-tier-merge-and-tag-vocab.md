# Issue 03 — Featured tier merge & tag vocabulary migration

**Type:** AFK
**Status:** needs-triage
**Stories covered:** 12, 13, 16, 17

## Parent

[docs/PRDs/2026-05-06-gallery-text-refresh.md](../PRDs/2026-05-06-gallery-text-refresh.md)

## What to build

Two structural cleanups and three new schema test assertions.

1. **Merge `featuredCards` and `richProjects` into one flat `projects` array.** Preserve current render order: f001 → 006 → 009 → 010 → 001 → 002 → 003 → 004 → 005 → 007 → 008 → 011 → 012 → 013 → f004 → 014 → f003 → 015 → 016 → 017 → 018 → 019 → 020 → 021 → 022 → 023 → 024 → 025 → 027 → 028 → 029 → 030 → 033 → 034. Remove the now-dead `looseCards`, `LOOSE_FILES`, and the `looseCards.map(...)` block.
2. **Tag vocabulary migration.** Map deprecated tags: `Animation` → `Motion`, `Housing` → `Residential`. Drop `Architecture`, `Visualisation`, `Studio`, `Archive`, `Advertising` wherever they appear (project meaning is preserved by remaining tags + the new `role` field).
3. **Header comment.** Update the data file's header comment to document the locked 12-token vocabulary with categories (Subject: `Exterior`, `Interior`, `Urban`, `Landscape`, `Product` · Medium: `Motion`, `VR`, `Drone` · Sector: `Residential`, `Commercial`, `Retail`, `Cultural`, `Hospitality`).

Test additions to `projects.test.js`:

- Every entry in every card's `tags` is a member of the locked 12-token vocab.
- Every card's `tags.length ∈ [1, 3]`.
- Every `id` is unique across the array.

## Acceptance criteria

- [ ] `src/data/projects.js` exports a single flat `projects` array of length 30.
- [ ] `featuredCards`, `richProjects`, `looseCards`, and `LOOSE_FILES` are removed from the file.
- [ ] No occurrence of any deprecated tag token (`Architecture`, `Visualisation`, `Studio`, `Archive`, `Animation`, `Housing`, `Advertising`) anywhere in the file.
- [ ] File header comment lists the 12 locked tag tokens with their categories.
- [ ] Three new test assertions added to `projects.test.js` and passing.
- [ ] No visual change to gallery render order on the dev server.
- [ ] Existing E2E smoke and unit tests still pass.

## Blocked by

- Issue 01 (test scaffold must exist).
