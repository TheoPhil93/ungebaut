import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Returns a 0..1 progress value as the referenced element's bounding rect
// crosses the viewport from bottom (entry) to top (exit).
//
// `enterAt` and `exitAt` are viewport-fraction thresholds — they describe
// how far up the viewport the ref must be before progress starts moving
// from 0 (enterAt) and stops at 1 (exitAt). Defaults (0, 1) measure the
// full crossing: progress = 0 when the ref's top is at the bottom of the
// viewport, progress = 1 when the ref's top is at the top.
//
// Listener is native window scroll for now. Issue 05 swaps in a Lenis
// subscription via the same internal recompute call.
//
// Under prefers-reduced-motion: reduce the hook short-circuits to 1 so
// consumers (MorphingTitle) render the post-morph end state immediately
// with no scroll listener attached at all.
export function useScrollProgress({ ref, enterAt = 0, exitAt = 1 }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reduced motion short-circuits to the post-morph end state — no
    // scroll listener attached, no internal state updates. The derived
    // return below substitutes 1 for the live progress while reduced.
    if (reduced) return undefined;
    const node = ref?.current;
    if (!node || typeof window === 'undefined') return undefined;

    const recompute = () => {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 0;
      // enterY/exitY are the absolute Y coordinates (in viewport space) at
      // which progress crosses 0 and 1. With defaults enterAt=0 (bottom of
      // viewport) and exitAt=1 (top), enterY = viewportHeight and exitY = 0.
      const enterY = (1 - enterAt) * viewportHeight;
      const exitY = (1 - exitAt) * viewportHeight;
      const top = rect.top;
      let next;
      if (top >= enterY) {
        next = 0;
      } else if (top <= exitY) {
        next = 1;
      } else {
        const span = enterY - exitY;
        next = span === 0 ? 1 : (enterY - top) / span;
      }
      setProgress(next);
    };

    recompute();
    window.addEventListener('scroll', recompute, { passive: true });
    window.addEventListener('resize', recompute, { passive: true });
    return () => {
      window.removeEventListener('scroll', recompute);
      window.removeEventListener('resize', recompute);
    };
  }, [reduced, ref, enterAt, exitAt]);

  return reduced ? 1 : progress;
}
