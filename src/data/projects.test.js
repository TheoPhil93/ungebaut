import { describe, it, expect } from 'vitest';
import { projects } from './projects';

// Content contract for the gallery. Asserts the schema rules established
// in docs/PRDs/2026-05-06-gallery-text-refresh.md so regressions to
// pre-launch placeholder state get caught at PR time.
//
// Issue 01 (plumbing) ships the count assertion only. Issues 02/03/06
// extend this file with hex validation, tag vocab membership, placeholder
// fingerprints, role population, and description-length bounds.

describe('projects data', () => {
  it('exports the full gallery array', () => {
    expect(projects.length).toBe(34);
  });

  it('every card has a non-empty role', () => {
    for (const project of projects) {
      expect(typeof project.role).toBe('string');
      expect(project.role.length).toBeGreaterThan(0);
    }
  });
});
