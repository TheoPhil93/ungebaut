# Issue 02 — Mechanical bug fixes

**Type:** AFK
**Status:** needs-triage
**Stories covered:** 8, 11, 21

## Parent

[docs/PRDs/2026-05-06-gallery-text-refresh.md](../PRDs/2026-05-06-gallery-text-refresh.md)

## What to build

Three settled mechanical fixes plus one schema-rule test addition.

1. **Card 010 (Ferrum House) — invalid hex.** `accent: '#bf7a6'` is a 6-character invalid hex (5 digits after `#`); panel currently falls back silently to a browser default. Change to `'#bfb7a6'` so the panel renders the intended stone-grey.
2. **Cards 004 + 015 — Estudio DIIR spelling drift.** Card 004 currently uses `'E Stduio/D I R R'` (typo `Stduio`); card 015 uses `'E studio/D I I R'`. Pick one canonical form and apply identically to both `massiveTitle` strings.
3. **Cards 012 + 014 — SSA twin cards.** Both currently share `'SSA  Arch/itekten'`. This is intentional (same office, two distinct projects). No change to the field — but the commit message must record this so the duplication is not flagged later as a bug.

Test addition (folded into `projects.test.js`): every `accent`, `accentSoft`, `detailBg`, `detailInk`, and `massiveInk` (when present) matches `/^#[0-9a-fA-F]{6}$/` on every card.

## Acceptance criteria

- [ ] Card 010 `accent` is a valid 6-digit hex.
- [ ] Cards 004 and 015 share an identical Estudio DIIR `massiveTitle` string.
- [ ] Hex-format unit test added to `projects.test.js` and passing on all 30 cards.
- [ ] Commit message documents that cards 012 and 014 intentionally share the SSA massive title.
- [ ] No other field changed.

## Blocked by

None — can start immediately, parallel to Issue 01.
