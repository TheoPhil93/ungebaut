# Issue 02 — Extract `ProjectStrip` + `ProjectFooterMeta`

**Type:** AFK
**Status:** needs-triage
**Stories covered:** 18

## Parent

[docs/PRDs/2026-05-09-aristide-style-drilldown.md](../PRDs/2026-05-09-aristide-style-drilldown.md)

## What to build

Decompose `ProjectDetail.jsx` into two presentational child components so they can be reused inside the upcoming unified scroll stack (Issue 03) without dragging in panel-mode plumbing. Pure refactor — visible behavior unchanged.

Create two new components:

- **`src/components/ProjectStrip.jsx`** — renders the gallery strip currently at `ProjectDetail.jsx:225-272`. Owns the `buildProjectGallery` call (move the helper into the new file), the per-frame `whileInView` stagger animation, and the `Picture`/`<video>` switching logic. Props: `{ project }`. Returns the `<motion.section className="detail__strip">` block as-is.
- **`src/components/ProjectFooterMeta.jsx`** — renders the footer currently at `ProjectDetail.jsx:274-320`. Owns the meta grid (A/B/C/D rows), the footer CTA, and the SEO blurb. Props: `{ project }`. Returns the `<motion.footer className="detail__footer">` block as-is.

`ProjectDetail.jsx` continues to mount as a panel and now composes the two children:

```
<motion.section ref={scrollRef} className="detail" ...>
  <motion.div className="detail__bg" ... />
  <header className="detail__top"> ... </header>
  <div className="detail__main"> ... title + hero ... </div>
  {galleryItems.length > 1 ? <ProjectStrip project={project} /> : null}
  <ProjectFooterMeta project={project} />
</motion.section>
```

The hero composition (`detail__main`, including the title wipe and aspect-ratio probing) stays inside `ProjectDetail.jsx` — those bits are panel-specific and will retire alongside the panel in Issue 03.

CSS classes (`.detail__strip`, `.detail__footer`, all child selectors) are unchanged in this slice. Renaming happens in Issue 03 when the panel itself goes away.

## Acceptance criteria

- [ ] New file `src/components/ProjectStrip.jsx` exports `ProjectStrip({ project })` and renders the strip JSX previously at `ProjectDetail.jsx:225-272`.
- [ ] New file `src/components/ProjectFooterMeta.jsx` exports `ProjectFooterMeta({ project })` and renders the footer JSX previously at `ProjectDetail.jsx:274-320`.
- [ ] `buildProjectGallery` helper moves into `ProjectStrip.jsx` (keeps it co-located with its only consumer).
- [ ] `ProjectDetail.jsx` imports and composes both children; deletes the inlined strip + footer JSX.
- [ ] All CSS class names referenced in the extracted components are unchanged (`detail__strip`, `detail__strip-list`, `detail__strip-item`, `detail__footer`, `detail__meta-grid`, etc.).
- [ ] No prop signature changes on `ProjectDetail` itself — `App.jsx` continues to mount it as `<ProjectDetail project={selected} onClose={closeProject} />`.
- [ ] Existing E2E smoke (`npm run test:e2e`) passes against unchanged `.detail` selectors.
- [ ] Existing visual regression snapshots pass without regeneration (no visible change).
- [ ] Manual verification on the dev server: open any project, click EXPLORE, confirm the strip and footer render and behave identically to today (stagger on scroll, footer CTA, SEO blurb, meta grid).

## Blocked by

None — can start immediately.
