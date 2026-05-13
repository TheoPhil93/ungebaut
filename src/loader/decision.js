// Pure decision for "should the cold-entry loader render right now?"
//
// The inline <script> in index.html runs before any module loads and
// duplicates a minimal copy of this logic so the loader can decide before
// React mounts. The unit tests for this module are the contract that the
// inline copy must agree with — drift between the two surfaces would be
// caught by e2e/loader.spec.js but not by these unit tests alone, so any
// change here must also be reflected in the inline copy in index.html.
//
// Rules, in evaluation order:
//   1. ?loader=skip wins over everything (even ?loader=show).
//   2. ?loader=show overrides every other gate.
//   3. localhost / 127.0.0.1 default to skip.
//   4. Otherwise: show iff pathname is home AND sessionStorage flag absent.

/**
 * @param {{
 *   pathname: string,
 *   search: string,
 *   hostname: string,
 *   sessionStorageSeen: boolean,
 * }} opts
 * @returns {boolean}
 */
export function shouldShowLoader({ pathname, search, hostname, sessionStorageSeen }) {
  const params = new URLSearchParams(search || '');
  // Use getAll so skip wins on conflict regardless of which value
  // URLSearchParams.get would return first — the PRD contract is "skip
  // overrides everything including show".
  const forceValues = params.getAll('loader');

  if (forceValues.includes('skip')) return false;
  if (forceValues.includes('show')) return true;

  if (hostname === 'localhost' || hostname === '127.0.0.1') return false;

  const onHome = pathname === '/' || pathname === '';
  if (!onHome) return false;

  return !sessionStorageSeen;
}
