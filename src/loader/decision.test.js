import { describe, it, expect } from 'vitest';
import { shouldShowLoader } from './decision';

// shouldShowLoader is the gate the inline <script> in index.html consults
// (via a duplicated copy of the same logic) before deciding whether to
// render the loader. The contract is documented in
// docs/issues/2026-05-12-01-loader-foundation.md acceptance criteria and
// must produce identical outputs to the inline copy.

const PROD = {
  pathname: '/',
  search: '',
  hostname: 'www.ungebaut.com',
  sessionStorageSeen: false,
};

describe('shouldShowLoader', () => {
  it('shows on a cold visit to home from production', () => {
    expect(shouldShowLoader(PROD)).toBe(true);
  });

  it('skips on the second visit when sessionStorage flag is set', () => {
    expect(shouldShowLoader({ ...PROD, sessionStorageSeen: true })).toBe(false);
  });

  it.each(['/services', '/about', '/journal', '/index', '/impressum', '/datenschutz'])(
    'skips on non-home pathname %s',
    (pathname) => {
      expect(shouldShowLoader({ ...PROD, pathname })).toBe(false);
    },
  );

  it('treats empty pathname as home', () => {
    expect(shouldShowLoader({ ...PROD, pathname: '' })).toBe(true);
  });

  it('skips on localhost hostname', () => {
    expect(shouldShowLoader({ ...PROD, hostname: 'localhost' })).toBe(false);
  });

  it('treats 127.0.0.1 as localhost', () => {
    expect(shouldShowLoader({ ...PROD, hostname: '127.0.0.1' })).toBe(false);
  });

  it('?loader=show overrides every other gate', () => {
    expect(
      shouldShowLoader({
        pathname: '/services',
        search: '?loader=show',
        hostname: 'localhost',
        sessionStorageSeen: true,
      }),
    ).toBe(true);
  });

  it('?loader=skip overrides every other gate including ?loader=show', () => {
    // getAll is used so skip wins regardless of order — these are the two
    // permutations a paranoid QA reviewer could construct.
    expect(shouldShowLoader({ ...PROD, search: '?loader=show&loader=skip' })).toBe(false);
    expect(shouldShowLoader({ ...PROD, search: '?loader=skip&loader=show' })).toBe(false);
  });

  it('?loader=skip wins on a fresh cold visit', () => {
    expect(shouldShowLoader({ ...PROD, search: '?loader=skip' })).toBe(false);
  });

  it('unknown loader values fall through to the default decision', () => {
    expect(shouldShowLoader({ ...PROD, search: '?loader=maybe' })).toBe(true);
  });
});
