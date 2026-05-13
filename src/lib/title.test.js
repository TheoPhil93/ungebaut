import { describe, it, expect } from 'vitest';
import { splitTitleForMorph } from './title';

// splitTitleForMorph codifies the row-split grammar (slash → first
// whitespace → midpoint) and the de-spacing that ProjectDetail used to
// do inline. Both MorphingTitle and MassiveTitle depend on the exact
// shape of these outputs, so the tests pin every branch of the grammar.

const NBSP = '\u00a0';

describe('splitTitleForMorph', () => {
  it('splits on an explicit slash separator and trims each half', () => {
    // De-spacing strips the inter-word spaces before the grammar runs,
    // so "DIGI / TAL ASSET" → "DIGI/TALASSET" → slash-split into rows.
    expect(splitTitleForMorph('DIGI / TAL ASSET')).toEqual({
      split: 'DIGI\nTAL ASSET',
      despaced: 'DIGI\nTALASSET',
    });
  });

  it('splits on the first whitespace when no slash is present', () => {
    expect(splitTitleForMorph('BENZ TRANSPORT')).toEqual({
      split: 'BENZ\nTRANSPORT',
      despaced: 'BENZTRA\nNSPORT',
    });
  });

  it('splits non-breaking space the same as a plain space', () => {
    expect(splitTitleForMorph(`BENZ${NBSP}TRANSPORT`)).toEqual({
      split: 'BENZ\nTRANSPORT',
      despaced: 'BENZTRA\nNSPORT',
    });
  });

  it('midpoint-splits single-word titles of length >= 4', () => {
    expect(splitTitleForMorph('CANALS')).toEqual({
      split: 'CAN\nALS',
      despaced: 'CAN\nALS',
    });
  });

  it('leaves an empty bottom row for titles shorter than 4 chars', () => {
    expect(splitTitleForMorph('LOT')).toEqual({
      split: 'LOT',
      despaced: 'LOT',
    });
  });

  it('returns an empty single row for empty input', () => {
    expect(splitTitleForMorph('')).toEqual({ split: '', despaced: '' });
  });

  it('handles a single character input', () => {
    expect(splitTitleForMorph('A')).toEqual({ split: 'A', despaced: 'A' });
  });

  it('handles whitespace-only input as empty', () => {
    expect(splitTitleForMorph(`   ${NBSP} `)).toEqual({
      split: '',
      despaced: '',
    });
  });

  it('preserves slash grammar in despaced form when input has slashes', () => {
    // "BENZ TRA / NSPORT" — slash wins over whitespace; both halves trim.
    expect(splitTitleForMorph('BENZ TRA / NSPORT')).toEqual({
      split: 'BENZ TRA\nNSPORT',
      despaced: 'BENZTRA\nNSPORT',
    });
  });

  it('returns null-safe rows for null/undefined-like input', () => {
    expect(splitTitleForMorph(null)).toEqual({ split: '', despaced: '' });
    expect(splitTitleForMorph(undefined)).toEqual({ split: '', despaced: '' });
  });
});
