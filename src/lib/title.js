// Title-shape rules for the massive display titles. Previously scattered
// across MassiveTitle.splitToRows and ProjectDetail's de-spacing replace.
// Issue 04 centralises them here so MassiveTitle and the new MorphingTitle
// share one grammar.
//
// The grammar (in order of precedence):
//   1. An explicit `/` separator splits the title into [before, after]
//      with each half trimmed. This is how the founder marks the line
//      break in titles like "DIGI / TAL" or "BENZ TRA / NSPORT".
//   2. Otherwise, the first run of whitespace (space or non-breaking
//      space) splits the title at that point.
//   3. Single-word titles (no `/`, no whitespace) of length >= 4 split at
//      the ceiling midpoint — mirrors the Aristide "CAN / ALS" treatment.
//   4. Titles shorter than 4 chars become a single row with an empty
//      second row, so MassiveTitle still renders something sensible.

const STRIP_WS = /[ \u00a0]+/g;
const WS = /[ \u00a0]/;

function rowsFor(text) {
  if (!text) return ['', ''];
  const trimmed = text.trim();
  if (!trimmed) return ['', ''];

  if (trimmed.includes('/')) {
    const [top = '', bottom = ''] = trimmed.split('/');
    return [top.trim(), bottom.trim()];
  }

  const wsIdx = trimmed.search(WS);
  if (wsIdx > 0) {
    return [trimmed.slice(0, wsIdx), trimmed.slice(wsIdx + 1).trim()];
  }

  if (trimmed.length < 4) return [trimmed, ''];

  const mid = Math.ceil(trimmed.length / 2);
  return [trimmed.slice(0, mid), trimmed.slice(mid)];
}

function joinRows([top, bottom]) {
  return bottom ? `${top}\n${bottom}` : top;
}

// Returns { split, despaced } as newline-joined two-row strings.
//   - `split` preserves the input's line-break grammar (slash/space/midpoint).
//   - `despaced` strips all spaces + non-breaking spaces first, then applies
//     the same grammar — so "BENZ TRA / NSPORT" → "BENZTRA\nNSPORT" and
//     "BENZTRANSPORT" → "BENZTRA\nNSPORT" via the midpoint rule.
// MassiveTitle consumes either form by splitting on `\n`.
export function splitTitleForMorph(text) {
  const split = joinRows(rowsFor(text));
  const despacedSource = (text || '').replace(STRIP_WS, '');
  const despaced = joinRows(rowsFor(despacedSource));
  return { split, despaced };
}
