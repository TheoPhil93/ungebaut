import { describe, it, expect } from 'vitest';
import { computeHandoffTiming } from './timing';

describe('computeHandoffTiming', () => {
  it.each([
    [{}, { floorMs: 3500, ceilingMs: 5500 }],
    [
      { reducedMotion: false, isMobile: false },
      { floorMs: 3500, ceilingMs: 5500 },
    ],
    [
      { reducedMotion: true, isMobile: false },
      { floorMs: 800, ceilingMs: 5500 },
    ],
    [
      { reducedMotion: false, isMobile: true },
      { floorMs: 1500, ceilingMs: 4000 },
    ],
    // Combined: mobile floor wins (typography needs dwell), reduced-motion
    // ceiling wins (motion-sensitive users have desktop-like network patience).
    [
      { reducedMotion: true, isMobile: true },
      { floorMs: 1500, ceilingMs: 5500 },
    ],
  ])('returns %j for %j', (input, expected) => {
    expect(computeHandoffTiming(input)).toEqual(expected);
  });

  it('returns a new object each call (no shared reference)', () => {
    const a = computeHandoffTiming();
    const b = computeHandoffTiming();
    expect(a).not.toBe(b);
    a.floorMs = 0;
    expect(b.floorMs).toBe(3500);
  });

  it('returns a new object for each variant (no module-level mutation)', () => {
    const a = computeHandoffTiming({ reducedMotion: true });
    a.floorMs = 0;
    const b = computeHandoffTiming({ reducedMotion: true });
    expect(b.floorMs).toBe(800);
  });
});
