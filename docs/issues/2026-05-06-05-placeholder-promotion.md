# Issue 05 — Placeholder promotion pass (16 cards)

**Type:** HITL
**Status:** needs-triage
**Stories covered:** 1, 2, 4, 14, 18, 19, 22, 28

## Parent

[docs/PRDs/2026-05-06-gallery-text-refresh.md](../PRDs/2026-05-06-gallery-text-refresh.md)

## What to build

Promote the 16 placeholder cards to real projects. Each currently has `client: 'UNGEBAUT'`, a `title` matching `Project 0XX` or `Sequence 0XX`, `location: 'Studio archive'`, and a description recycled from a 6-line `LOOSE_CAPTIONS` array.

Cards in scope: **005, 007** _Atelier_, **011, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 027, 028, 029, 030, 033, 034**.

Each card receives, with founder confirmation per card:

- A real `client` (not `UNGEBAUT`).
- A real `title` (not `Project 0XX` or `Sequence 0XX`).
- A real `year`.
- A real `location` (not `Studio archive`).
- A populated `role` of the form `Brief · deliverables` from the 10-bucket brief vocab.
- A `description` matching the locked rule (1 sentence · 18–30 words · em-dash · one concrete noun · no client · no scope).
- A bespoke `massiveTitle`.
- `tags` from the locked 12-token vocab; `tags.length ∈ [1, 3]`.

Motion archive cards (**027, 028, 034**) obey the same description rule as commissioned work — Q10 explicitly rejected a looser rule for motion archive.

## Acceptance criteria

- [ ] None of the 16 cards has a `title` matching `/^(Project|Sequence) \d{3}$/`.
- [ ] None of the 16 cards has the `client === 'UNGEBAUT' && location === 'Studio archive'` placeholder fingerprint pair.
- [ ] Every card has a populated `role` matching the `Brief · deliverables` grammar.
- [ ] Every card has a description matching the locked rule.
- [ ] Every card has a bespoke `massiveTitle`.
- [ ] Every card's `tags` are from the locked 12-token vocab; `tags.length ∈ [1, 3]`.
- [ ] Motion archive cards (027, 028, 034) obey the same description rule as commissioned work — no looser register.
- [ ] Existing E2E smoke and unit tests still pass.

## Blocked by

- Issue 01
- Issue 02
- Issue 03

(Parallel to Issue 04 — no dependency between them.)
