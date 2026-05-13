import { useMemo } from 'react';
import { MassiveTitle } from './MassiveTitle';
import { splitTitleForMorph } from '../lib/title';
import { clipPathFromProgress } from '../lib/clipPath';
import { useScrollProgress } from '../hooks/useScrollProgress';

// Counter-direction wipe between the split form (with whitespace, e.g.
// "BENZ TRA / NSPORT") and the de-spaced form ("BENZTRA / NSPORT" with
// the spaces collapsed) at the section boundary inside the unified
// scroll stack.
//
// Both forms render at the same screen position, stacked. The split form
// is clip-path-wiped to the right as scroll progresses; the de-spaced
// form is clip-path-wiped in from the left in lockstep. Reduced motion
// snaps progress to 1 immediately so only the de-spaced form is visible.
export function MorphingTitle({ text, ink, boundaryRef }) {
  const { split, despaced } = useMemo(() => splitTitleForMorph(text), [text]);
  const progress = useScrollProgress({ ref: boundaryRef });

  const splitClip = clipPathFromProgress(progress, 'wipe-out-right');
  const despacedClip = clipPathFromProgress(progress, 'wipe-in-left');

  return (
    <div className="morphing-title" aria-hidden="true">
      <div
        className="morphing-title__form morphing-title__form--split"
        style={{ clipPath: splitClip, WebkitClipPath: splitClip }}
      >
        <MassiveTitle text={split} ink={ink} />
      </div>
      <div
        className="morphing-title__form morphing-title__form--despaced"
        style={{ clipPath: despacedClip, WebkitClipPath: despacedClip }}
      >
        <MassiveTitle text={despaced} ink={ink} animate={false} />
      </div>
    </div>
  );
}
