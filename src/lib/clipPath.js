// `clip-path: inset(...)` strings driven by a 0..1 scroll progress value.
// Used by MorphingTitle to wipe the split form out to the right while the
// de-spaced form wipes in from the left, in lockstep.
//
// `inset(t r b l)` insets the visible region by those amounts from each
// edge of the element's box. We only ever animate the horizontal edges:
//   - wipe-out-right: at progress 0 the element is fully visible
//     (inset(0 0 0 0)); at progress 1 it's clipped from the left edge
//     all the way across (inset(0 0 0 100%)).
//   - wipe-in-left: at progress 0 the element is clipped from the right
//     edge (inset(0 100% 0 0)); at progress 1 it's fully visible.

function clamp(progress) {
  if (!Number.isFinite(progress)) return 0;
  if (progress < 0) return 0;
  if (progress > 1) return 1;
  return progress;
}

function formatLength(fraction) {
  if (fraction === 0) return '0';
  if (fraction === 1) return '100%';
  return `${fraction * 100}%`;
}

export function clipPathFromProgress(progress, direction) {
  const p = clamp(progress);
  if (direction === 'wipe-out-right') {
    return `inset(0 0 0 ${formatLength(p)})`;
  }
  if (direction === 'wipe-in-left') {
    return `inset(0 ${formatLength(1 - p)} 0 0)`;
  }
  return 'inset(0 0 0 0)';
}
