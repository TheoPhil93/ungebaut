import { describe, it, expect } from 'vitest';
import { clipPathFromProgress } from './clipPath';

// clipPathFromProgress is a pure mapping from 0..1 progress to a CSS
// inset() string. The exact string output matters because MorphingTitle
// passes it straight into a style attribute — any drift in formatting
// would cause a re-paint mismatch. Tests pin both directions at the
// boundary values + midpoint, and confirm clamping outside [0, 1].

describe('clipPathFromProgress — wipe-out-right', () => {
  it('is fully open at progress 0', () => {
    expect(clipPathFromProgress(0, 'wipe-out-right')).toBe('inset(0 0 0 0)');
  });

  it('is half-clipped at progress 0.5', () => {
    expect(clipPathFromProgress(0.5, 'wipe-out-right')).toBe('inset(0 0 0 50%)');
  });

  it('is fully clipped at progress 1', () => {
    expect(clipPathFromProgress(1, 'wipe-out-right')).toBe('inset(0 0 0 100%)');
  });
});

describe('clipPathFromProgress — wipe-in-left', () => {
  it('is fully clipped at progress 0', () => {
    expect(clipPathFromProgress(0, 'wipe-in-left')).toBe('inset(0 100% 0 0)');
  });

  it('is half-clipped at progress 0.5', () => {
    expect(clipPathFromProgress(0.5, 'wipe-in-left')).toBe('inset(0 50% 0 0)');
  });

  it('is fully open at progress 1', () => {
    expect(clipPathFromProgress(1, 'wipe-in-left')).toBe('inset(0 0 0 0)');
  });
});

describe('clipPathFromProgress — clamping', () => {
  it('clamps progress < 0 to 0 for wipe-out-right', () => {
    expect(clipPathFromProgress(-0.5, 'wipe-out-right')).toBe('inset(0 0 0 0)');
  });

  it('clamps progress > 1 to 1 for wipe-out-right', () => {
    expect(clipPathFromProgress(1.5, 'wipe-out-right')).toBe('inset(0 0 0 100%)');
  });

  it('clamps progress < 0 to 0 for wipe-in-left', () => {
    expect(clipPathFromProgress(-0.5, 'wipe-in-left')).toBe('inset(0 100% 0 0)');
  });

  it('clamps progress > 1 to 1 for wipe-in-left', () => {
    expect(clipPathFromProgress(1.5, 'wipe-in-left')).toBe('inset(0 0 0 0)');
  });

  it('treats NaN as 0', () => {
    expect(clipPathFromProgress(NaN, 'wipe-out-right')).toBe('inset(0 0 0 0)');
    expect(clipPathFromProgress(NaN, 'wipe-in-left')).toBe('inset(0 100% 0 0)');
  });
});

describe('clipPathFromProgress — unknown direction', () => {
  it('returns a no-op inset for unknown direction', () => {
    expect(clipPathFromProgress(0.5, 'sideways')).toBe('inset(0 0 0 0)');
  });
});
