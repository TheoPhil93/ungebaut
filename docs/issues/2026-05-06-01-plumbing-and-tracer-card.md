# Issue 01 — Plumbing & first validated card (tracer)

**Type:** HITL
**Status:** needs-triage
**Stories covered:** 15, 24

## Parent

[docs/PRDs/2026-05-06-gallery-text-refresh.md](../PRDs/2026-05-06-gallery-text-refresh.md)

## What to build

The end-to-end scaffold for the gallery text refresh, exercised on one real card. Add a `role: string` field to the project record shape on every card with a default value of `'Visualisation & Direction'` (preserves current rendering). Update `HomeView.jsx` to source the metadata panel's `Role` row from `focused.role` instead of the hardcoded literal at lines 279 and 317, with the same string as a defensive fallback. Create `src/data/projects.test.js` (Vitest, following the prior art in `src/hooks/useUrlSync.test.jsx`) with a stub asserting `projects.length === 30`.

Then fully validate **f001 Ard de Vries** end-to-end as the tracer card: confirm year/location/client with the founder, write a `role` of the form `Brief · deliverables` from the 10-bucket brief vocab, lock its `tags` to the 12-token vocab, rewrite its description to the locked rule (1 sentence · 18–30 words · em-dash · one concrete noun · no client · no scope). Verify on the dev server that f001's metadata panel shows the new `Role` text while every other card still reads the fallback.

## Acceptance criteria

- [ ] `role` field added to every project record in `src/data/projects.js` with default `'Visualisation & Direction'`.
- [ ] `HomeView.jsx` lines 279 and 317 read `focused.role` with the same string as a defensive fallback.
- [ ] `src/data/projects.test.js` exists and contains at minimum the assertion `projects.length === 30`.
- [ ] Card f001 (Ard de Vries) has a populated `role`, locked-vocab `tags`, and a rewritten description to the locked rule.
- [ ] No visual regression on any other card — Role row still reads `Visualisation & Direction` everywhere except f001.
- [ ] Existing E2E smoke (`npm run test:e2e`) passes.
- [ ] New unit test (`vitest run`) passes.

## Blocked by

None — can start immediately.
