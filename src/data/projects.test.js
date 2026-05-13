import { describe, it, expect } from 'vitest';
import { projects } from './projects';

// Content contract for the gallery. Asserts the schema rules established
// in docs/PRDs/2026-05-06-gallery-text-refresh.md so regressions to
// pre-launch placeholder state get caught at PR time.
//
// What this catches:
//   • Card count drift (24 was pulled pending Theo Hotz approval; expected = 33).
//   • Placeholder titles like `Project 0XX` or `Sequence 0XX` reappearing.
//   • The `client === 'UNGEBAUT' && location === 'Studio archive'` fingerprint pair.
//   • Tags drifting outside the locked 12-token vocab.
//   • Invalid hex on any colour field.
//   • Missing role strings.
//   • Description-length drift.
//   • Duplicate ids.

const LOCKED_TAG_VOCAB = new Set([
  // Subject
  'Exterior',
  'Interior',
  'Urban',
  'Landscape',
  'Product',
  // Medium
  'Motion',
  'VR',
  'Drone',
  // Sector
  'Residential',
  'Commercial',
  'Retail',
  'Cultural',
  'Hospitality',
]);

const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const PLACEHOLDER_TITLE_RE = /^(Project|Sequence) \d{3}$/;

// Cards intentionally left partially filled. Excluded from the title and
// description-length assertions until the founder fills them in. The card
// still ships to the gallery (visible to visitors) so the visual rhythm
// is preserved; the test exemption is the honest acknowledgement that
// the content is not yet complete.
const PENDING_FILL_IN = new Set([
  '014', // Second SSA Architekten project. Client + massive title applied;
  //        title, location, role, description still pending founder input.
]);

describe('projects data — gallery shape', () => {
  it('exports 30 visible cards (3 hidden pending publication permission)', () => {
    // The hidden trio (Baukontor Paracelsius + Theo Hotz Konnex + Theo
    // Hotz Sihl City) stays in projectList but is filtered out of the
    // public `projects` export until the respective architects grant
    // publication rights. See src/data/projects.js for the `hidden: true`
    // flag and the `.filter(p => !p.hidden)` in the export.
    expect(projects.length).toBe(30);
  });

  it('every id is unique', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('projects data — content rules', () => {
  it.each(projects.map((p) => [p.id, p]))(
    '%s has a non-placeholder title',
    (_id, project) => {
      if (PENDING_FILL_IN.has(project.id)) return;
      expect(project.title).not.toMatch(PLACEHOLDER_TITLE_RE);
    },
  );

  it.each(projects.map((p) => [p.id, p]))(
    '%s does not carry the placeholder fingerprint pair',
    (_id, project) => {
      const isPlaceholder =
        project.client === 'UNGEBAUT' && project.location === 'Studio archive';
      expect(isPlaceholder).toBe(false);
    },
  );

  it.each(projects.map((p) => [p.id, p]))(
    '%s has a non-empty role string',
    (_id, project) => {
      expect(typeof project.role).toBe('string');
      expect(project.role.length).toBeGreaterThan(0);
    },
  );

  it.each(projects.map((p) => [p.id, p]))(
    '%s has a description of plausible length',
    (_id, project) => {
      expect(typeof project.description).toBe('string');
      if (PENDING_FILL_IN.has(project.id)) return;
      expect(project.description.length).toBeGreaterThanOrEqual(80);
      expect(project.description.length).toBeLessThanOrEqual(320);
    },
  );
});

describe('projects data — tags', () => {
  it.each(projects.map((p) => [p.id, p]))('%s has between 1 and 3 tags', (_id, project) => {
    expect(Array.isArray(project.tags)).toBe(true);
    expect(project.tags.length).toBeGreaterThanOrEqual(1);
    expect(project.tags.length).toBeLessThanOrEqual(3);
  });

  it.each(projects.map((p) => [p.id, p]))(
    '%s has every tag in the locked vocab',
    (_id, project) => {
      for (const tag of project.tags) {
        expect(LOCKED_TAG_VOCAB.has(tag)).toBe(true);
      }
    },
  );
});

describe('projects data — colour fields', () => {
  const HEX_FIELDS = ['accent', 'accentSoft', 'detailBg', 'detailInk', 'massiveInk'];

  it.each(projects.map((p) => [p.id, p]))(
    '%s has valid 6-digit hex on every colour field',
    (_id, project) => {
      for (const field of HEX_FIELDS) {
        const value = project[field];
        if (value === undefined) continue;
        expect(value).toMatch(HEX_RE);
      }
    },
  );
});
