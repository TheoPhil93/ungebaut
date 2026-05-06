# PRD — Gallery text refresh for site launch

**Status:** needs-triage
**Date:** 2026-05-06
**Author:** Philippos Theofanidis (with Claude Code grilling pass)
**Files affected:** `src/data/projects.js` (substantive), `src/components/HomeView.jsx` (2 lines), `src/data/projects.test.js` (new)

---

## Problem Statement

The site is technically ready to publish but the gallery's text content isn't. Of 30 project cards in `src/data/projects.js`, 16 carry placeholder titles (`Project 019`, `Sequence 028`), generic clients (`UNGEBAUT`), placeholder locations (`Studio archive`), and descriptions cycled from a 6-line `LOOSE_CAPTIONS` array — half the gallery reads as filler. Several named cards have factual contradictions (002 _Paracelsius_'s description references the Via Salaria, balcony plants, and the Capitoline — all Rome — but its `location` is `Richterswil, Switzerland`). Client spellings drift across cards (`E Stduio/D I R R` and `E studio/D I I R` for the same Estudio DIIR client on cards 004 and 015). Card 010's `accent: '#bf7a6'` is a 6-character invalid hex and falls back silently to a browser default. The metadata panel's `Type` row reads `Visualisation` on more than half the cards — meaningless on a visualisation studio's portfolio. The `Role` row is hardcoded to `Visualisation & Direction` on every card, so it pays no rent in the panel.

The German content surfaces (About / Services / FAQ / Journal / Articles / Imprint / Datenschutz) and the home `SeoHead` strings are already SEO-tuned and ready. The block to launch is entirely on the gallery side.

## Solution

A complete validated text refresh of `src/data/projects.js` covering all 30 cards, plus a small per-project `role` field replacing the hardcoded string in `src/components/HomeView.jsx`. The 14 named cards undergo full validation (every field confirmed or corrected). The 16 placeholder cards are promoted to real projects with bespoke metadata. Format follows locked design rules:

- **Language split** — German for content pages (untouched). English for the gallery.
- **Tag vocabulary** — 12-token locked set. Subject: `Exterior`, `Interior`, `Urban`, `Landscape`, `Product`. Medium: `Motion`, `VR`, `Drone`. Sector: `Residential`, `Commercial`, `Retail`, `Cultural`, `Hospitality`. Deprecated tokens (`Architecture`, `Visualisation`, `Studio`, `Archive`, `Animation`, `Housing`, `Advertising`) removed; mappings: `Animation`→`Motion`, `Housing`→`Residential`, the rest dropped.
- **Role grammar** — `Brief · deliverables`. Brief is one of a 10-bucket fixed vocab: `Pitch`, `Pitch-deck visual`, `Marketing campaign`, `Brand campaign`, `Brand film`, `Competition entry`, `Studio film`, `Studio motion`, `Studio still`, `Product still`, `Pre-construction set`, `Site survey`.
- **Massive title** — bespoke editorial typography per card, all 30. Existing toolbox: caps vs. mixed case, `/` for manual line break, real spaces between letters for letterspacing, double spaces for wider gaps.
- **Architect/developer modelling** — single `client` field, defaults to architect when both exist. Developer named in description body when relevant.
- **Description rule** — 1 sentence · 18–30 words · em-dash dividing clauses · one concrete noun (material, place, time of day, light condition) · no client name · no deliverable count.
- **Featured tier** — dropped. `featuredCards` and `richProjects` arrays merged into a single flat `projects` array. Current render order preserved.
- **Mechanical bug fixes** — Estudio DIIR consistent across 004 + 015; card 010 hex `#bf7a6` → `#bfb7a6`; SSA twin cards (012, 014) keep their shared title intentionally; 002 Paracelsius location/description contradiction resolved during the validation pass.

The German content surfaces and the home `SeoHead` strings stay untouched.

## User Stories

1. As a Zürich architect evaluating UNGEBAUT, I want to see real client names and projects in the gallery, so that I can judge the studio's peer network and credibility before booking a call.
2. As a developer evaluating UNGEBAUT, I want each project's `Role` row to tell me what was actually delivered (e.g. `Marketing campaign · stills + animation`), so that I can match my brief to a project I see on the site.
3. As a journalist or industry editor, I want each card to credit a verifiable client, location, and year, so that I can reference UNGEBAUT's work accurately in coverage.
4. As a visitor on the home view, I want descriptions that feel specific to each project — not 6 lines recycled across 16 cards — so that the gallery reads as curated work and not filler.
5. As a visitor on the home view, I want the `Type` row in the metadata panel to communicate something useful (`Exterior`, `Interior`, `Motion`), not the word `Visualisation` on half the gallery.
6. As a visitor on the home view, I want the `Role` row to differ per card, so that it earns its space in the metadata panel rather than displaying the same string on every project.
7. As Mettler Entwickler (developer) on card 002 (_Paracelsius_), I want to see my firm credited in the description body even though the architect Baukontor is named in the panel, so that the developer who commissioned the work is publicly acknowledged.
8. As Estudio DIIR, I want my firm name spelled consistently across cards 004 and 015, not as `E Stduio/D I R R` on one card and `E studio/D I I R` on the other.
9. As an SEO operator, I want the German content surfaces (About / Services / FAQ / Journal / Articles / legal / home `SeoHead` strings) untouched because they have been hand-tuned for `architekturvisualisierung zürich` and related search terms.
10. As a visitor on card 002 (_Paracelsius_), I want the description and location to agree — currently the description references the Via Salaria, balcony plants, and the Capitoline (all Rome) while the location says Richterswil, Switzerland — so the card stops being internally contradictory.
11. As a visitor on card 010 (_Ferrum House_), I want the accent palette to render correctly — currently `accent: '#bf7a6'` is a 6-character invalid hex, so the panel silently falls back to a browser default rather than the intended stone-grey.
12. As a maintainer, I want the gallery's data shape to use a single flat array rather than two arrays (`featuredCards` + `richProjects`) with a hidden tier that pays no rent visually, so the data file matches what's actually rendered.
13. As a visitor scrolling the gallery, I want the existing curated card order preserved post-refactor, so the visual rhythm I see today doesn't change.
14. As a visitor opening any card, I want the massive editorial title to render as intentional typography (caps, mixed case, letterspacing, line breaks where needed), not auto-uppercased from a generic `PROJECT 019` placeholder.
15. As a maintainer, I want the new `role` string sourced from a per-project field on the data record, so I can update the deliverables shown per card without touching React component code.
16. As a maintainer, I want the deprecated tag tokens (`Architecture`, `Visualisation`, `Studio`, `Archive`, `Animation`, `Housing`, `Advertising`) removed from `projects.js`, so the vocabulary stays locked to the 12-token set going forward.
17. As a content owner, I want the locked tag vocabulary documented in the data file's header comment, so that future edits don't drift back to ad-hoc tagging.
18. As a content reader, I want every card's description to include one concrete noun (a material, a time of day, a place name), so that the gallery shares a unifying tonal signature.
19. As a content reader on a placeholder-promoted card (005, 011, 016–025, 027–030, 033, 034), I want real client metadata, a real title, a real year, a real location, a real brief, and a real description, so the card reads as a real project rather than `Project 0XX`.
20. As a content reader on a named card (001–004, 006, 008, 009, 010, 012, 013, 014, 015, f001, f003, f004), I want every existing field validated rather than trusted, so factual errors (like Paracelsius/Rome/Richterswil) are caught and corrected.
21. As a content owner, I want SSA Architekten cards 012 and 014 to share the same massive title `SSA  Arch/itekten` intentionally (they're the same office, two distinct projects), not flagged as duplication to fix.
22. As a content reader on f004 (_Timex_), I want the card to read as a brand/product still with a credible Role row (`Product still · 1 hero`), not as another `Studio archive` line.
23. As a content reader on f003 (_Golden Sanctum_), I want the description to acknowledge the studio-internal nature of the film honestly rather than claim a fictional client.
24. As a developer on the team, I want a content-validation test that fails when placeholder titles, deprecated tags, invalid hex values, or empty `role` strings reappear in the data file, so regressions are caught at PR time.
25. As a developer on the team, I want the test to check that no card has the `client: 'UNGEBAUT'` AND `location: 'Studio archive'` placeholder fingerprint together, so that pattern can't sneak back in.
26. As a visitor on the home view, I want the metadata panel layout to remain at 4 rows (Year, Type, Role, Client) — adding new rows is out of scope — so the visual rhythm of the panel stays as it is today.
27. As an architect or developer not yet named in the gallery, I trust UNGEBAUT to anonymize me on request — but for v1 launch, every named card has implicit consent because the metadata is being validated card-by-card with the founder during the refresh.
28. As a visitor on a motion archive card (027, 028, 034), I want the description to obey the same rule as commissioned work (1 sentence · 18–30 words · em-dash · one concrete noun · no client · no scope) rather than the looser placeholder language, so the gallery's voice is consistent across all 30 cards.

## Implementation Decisions

- **Single content file change.** `src/data/projects.js` undergoes a substantive refresh. All 30 cards validated or filled. The two arrays `featuredCards` and `richProjects` merge into one flat `projects` array. `looseCards` (currently empty) and the supporting constant `LOOSE_FILES = []` are removed. Render order matches what's currently visible.
- **Two-line component change.** `src/components/HomeView.jsx` lines 279 and 317 stop reading the literal `'Visualisation & Direction'` and read `focused.role` instead. A single static fallback (`'Visualisation & Direction'`) protects against an empty field; every card has a populated `role` after the refresh.
- **Project record shape.** Existing fields preserved (`id`, `client`, `title`, `tags`, `year`, `location`, `accent`, `accentSoft`, `detailBg`, `detailInk`, `description`, `image`, `detailImage`, `gallery`, `sections`, `massiveTitle`, `massiveInk`, `mediaType`, `video`). One new field added: `role: string` containing the `Brief · deliverables` line.
- **Tag vocabulary lock.** 12 tokens. Subject: `Exterior`, `Interior`, `Urban`, `Landscape`, `Product`. Medium: `Motion`, `VR`, `Drone`. Sector: `Residential`, `Commercial`, `Retail`, `Cultural`, `Hospitality`. Each card carries 1–3 tags; `tags[0]` is the headline `Type`. Deprecated tokens removed.
- **Role brief vocabulary.** 10-bucket fixed set: `Pitch`, `Pitch-deck visual`, `Marketing campaign`, `Brand campaign`, `Brand film`, `Competition entry`, `Studio film`, `Studio motion`, `Studio still`, `Product still`, `Pre-construction set`, `Site survey`.
- **Massive title typography.** Bespoke per card. Toolbox: ALL CAPS or mixed case, `/` for manual line break, real spaces between letters for letterspacing, double spaces for wider gaps.
- **Architect/developer modelling.** Single `client` field. Defaults to architect when both exist. Developer named in description body when relevant.
- **Description rule.** 1 sentence · 18–30 words · em-dash dividing clauses · one concrete noun (material, place, time of day, light condition) · no client name · no deliverable count.
- **Featured tier dropped.** `featuredCards` and `richProjects` merge. Current render order preserved (f001 → 006 → 009 → 010 → 001 → 002 → 003 → 004 → 005 → 007 → 008 → 011 → 012 → 013 → f004 → 014 → f003 → 015 → 016 → 017 → 018 → 019 → 020 → 021 → 022 → 023 → 024 → 025 → 027 → 028 → 029 → 030 → 033 → 034).
- **Mechanical bug fixes (settled).**
  1. Estudio DIIR spelling consistent across 004 and 015 massive titles.
  2. Card 010 `accent: '#bf7a6'` → `'#bfb7a6'`.
  3. SSA twin cards (012, 014) keep the shared `SSA  Arch/itekten` title — intentional, not a duplication bug.
  4. Card 002 Paracelsius location vs. description contradiction resolved during validation.
- **Architectural decisions out by explicit choice:** no separate `architect` field, no `scope`/`deliverables` field, no metadata-panel row count change, no schema migration beyond the `role` addition, no bilingual switch, no filter UI.

## Testing Decisions

- **What makes a good test here.** Assertion of the gallery's _content contract_ — schema rules that, if violated, mean the data has regressed to a pre-launch state. The test reads the exported `projects` array from `projects.js` and asserts properties of every record. It does not test rendering, layout, animation, or interaction (covered by the existing E2E smoke).
- **Module under test.** `src/data/projects.js` — the data shape only.
- **Test framework.** Vitest. Already configured per `src/hooks/useUrlSync.test.jsx` precedent.
- **Specific assertions** (per card):
  - `title` does not match `/^(Project|Sequence) \d{3}$/` (placeholder fingerprint).
  - Not the case that `client === 'UNGEBAUT' && location === 'Studio archive'` (placeholder fingerprint pair).
  - `role` is a non-empty string.
  - `tags` is an array of length 1–3 inclusive.
  - Every entry of `tags` is a member of the locked 12-token vocab.
  - `accent`, `accentSoft`, `detailBg`, `detailInk`, and `massiveInk` (when present) match `/^#[0-9a-fA-F]{6}$/`.
  - `description` is a non-empty string, length between 80 and 320 characters (sanity-bounded).
- **Specific assertions** (collection-level):
  - `projects` has exactly 30 entries.
  - All `id` values unique.
- **Prior art.** `src/hooks/useUrlSync.test.jsx` is the only existing unit test in the repo; same Vitest setup applies.
- **No additional test scope.** The existing Playwright smoke (per recent commits `9e84e02`, `3111638`, `6f7029e`) covers gallery rendering and selection. The home view's `role` row will be exercised by the existing flow once the field is populated.

## Out of Scope

- Any change to German content surfaces — `about.js`, `services.js`, `faq.js`, `journal.js`, `articles.js`, `ImpressumView.jsx`, `DatenschutzView.jsx`.
- Any change to the home page `SeoHead` strings (currently in `HomeView.jsx`).
- Any change to gallery layout, scroll behavior, hover treatment, animation, or `GalleryGL.jsx` shaders.
- Any change to the metadata panel's row count (stays at 4: Year, Type, Role, Client).
- Bilingual (en/de) language switching infrastructure.
- Filter UI on the gallery.
- Card reordering beyond the current curation.
- Visual differentiation of a "featured" tier (CSS / layout work).
- New journal entries or articles.
- Image, video, or asset work — every card already has its assets.
- Schema migration beyond adding a single `role: string` field.
- A separate `architect` field — single `client` field with architect-default rule covers it.
- A separate `scope` or `deliverables` field — that information lives in the `role` string.

## Further Notes

- **Workflow for execution.** The grilling pass in this conversation produced 11 locked design decisions (Q1–Q11). The remaining work is fact-collection: 16 placeholder cards filled from scratch, 14 named cards validated field-by-field. Recommended approach is a single linear pass through `projects.js` top to bottom, with per-card confirmations from the founder.
- **Paracelsius resolution.** The only factual contradiction not yet resolved. Description says Rome (Via Salaria, balcony plants, the Capitoline). Location says Richterswil, Switzerland. Resolution chosen during the named-card validation pass.
- **Massive title typography precedent.** The existing 14 named cards use a deliberate editorial register (caps + mixed case + letterspacing + manual line breaks). The 16 promoted placeholders should match that register or share an explicit subset of it. No global rule is being added; bespoke remains the standard.
- **Component-level fallback.** When `HomeView.jsx` reads `focused.role`, a static fallback string of `'Visualisation & Direction'` (the previous hardcoded value) is acceptable for the brief window between the field being added and every card having it filled. Once the data refresh is complete, no card hits the fallback.
- **No migration risk.** The only existing consumers of the project record's shape are `HomeView.jsx` and `ProjectDetail.jsx`. Adding the optional `role` field is non-breaking; merging the two arrays is non-breaking because external code already consumes the exported `projects` array.
- **Acceptance criteria for "publishable".** All 30 cards pass the content-validation test. Visual smoke E2E passes. The home view metadata panel shows differentiated `Type` and `Role` strings as the visitor scrolls. No card displays `PROJECT 0XX` or `STUDIO ARCHIVE` as a massive title.

---

## Locked design decisions reference (from grilling pass)

| #   | Decision                                                                                              |
| --- | ----------------------------------------------------------------------------------------------------- |
| 1   | German for content pages, English for gallery. No bilingual switch in v1.                             |
| 2   | Promote all 16 placeholder cards to real projects. ~30 cards total.                                   |
| 3   | Description voice = mood line; per-project `Role` row replaces hardcoded `Visualisation & Direction`. |
| 4   | Role grammar = `Brief · deliverables`, 10-bucket brief vocab.                                         |
| 5   | Massive titles = bespoke editorial typography per card; 4 cleanups settled.                           |
| 6   | Architect/developer = single `client` field, defaults to architect, developer named in description.   |
| 7   | Tags = 12-token locked vocab; `tags[]` array shape preserved; `tags[0]` is the headline `Type`.       |
| 8   | Featured tier dropped; flat array; current render order preserved.                                    |
| 9   | German content voice untouched (SEO-optimized).                                                       |
| 10  | Description rule: 1 sentence · 18–30 words · em-dash · one concrete noun · no client · no scope.      |
| 11  | Full validation pass on all 14 named cards (every field).                                             |
