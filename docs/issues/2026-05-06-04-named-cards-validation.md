# Issue 04 — Named cards validation pass (13 remaining)

**Type:** HITL
**Status:** needs-triage
**Stories covered:** 1, 2, 3, 7, 10, 14, 18, 20, 23, 26, 27

## Parent

[docs/PRDs/2026-05-06-gallery-text-refresh.md](../PRDs/2026-05-06-gallery-text-refresh.md)

## What to build

Field-by-field validation pass on the 13 named cards not covered by Issue 01. Per Q11=B every field is confirmed or corrected, not trusted.

Cards in scope:

- **001** _Quarry House_ (Winwood McKenzy, UK)
- **002** _Paracelsius_ (Baukontor — architect; Mettler Entwickler — developer). **Resolve the Rome/Richterswil contradiction**: description currently references the Via Salaria, balcony plants, and the Capitoline (Rome) while `location` says `Richterswil, Switzerland`. Founder picks the correct direction; description and location must agree afterward.
- **003** _Chelsea Brut House_ (Pricegore, London)
- **004** _Neutrale_ (Estudio DIIR, Madrid)
- **006** _Karamanli Haus_ (Ilias Skroumeplos, Athens)
- **008** (Stefan Wülser, Zürich)
- **009** (SGGK = Steib Gmür Geschwentner Kyburz)
- **010** _Ferrum House_ (J.S. Bonnington, Harpenden)
- **012** _Areal Moosbühl_ (SSA Architekten, Moosseedorf CH)
- **013** _Konnex_ (Theo Hotz, Baden CH)
- **014** (SSA Architekten — currently `title: 'Project 014'`; needs a real title)
- **015** _Casa Neutrale_ (Estudio DIIR, Madrid)
- **f003** _Golden Sanctum_ (studio-internal — description acknowledges this honestly)
- **f004** (Timex)

Each card receives:

- Validated `client`, `title`, `year`, `location`.
- A rewritten `description` to the locked rule (1 sentence · 18–30 words · em-dash · one concrete noun · no client · no scope).
- A populated `role` of the form `Brief · deliverables` from the 10-bucket brief vocab.
- A bespoke `massiveTitle` (no falling back to `client.toUpperCase()`).
- `tags` from the locked 12-token vocab; `tags.length ∈ [1, 3]`.

Card 002 specifically: the developer Mettler Entwickler is named in the description body while the panel `client` stays as `Baukontor` (per the architect-default rule from Q6=D).

## Acceptance criteria

- [ ] All 13 cards have validated `client`, `title`, `year`, `location`.
- [ ] Card 002 location and description agree (no Rome/Richterswil contradiction).
- [ ] Card 014 has a real title (not `Project 014`).
- [ ] Card 002 description references Mettler Entwickler as the developer.
- [ ] Every card has a populated `role` matching the `Brief · deliverables` grammar.
- [ ] Every card has a description matching the locked rule.
- [ ] Every card has a bespoke `massiveTitle`.
- [ ] Every card's `tags` are from the locked 12-token vocab; `tags.length ∈ [1, 3]`.
- [ ] Existing E2E smoke and unit tests still pass.

## Blocked by

- Issue 01
- Issue 02
- Issue 03
