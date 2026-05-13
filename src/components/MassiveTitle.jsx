import { motion } from 'framer-motion';
import { TextCascade } from './TextCascade';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { splitTitleForMorph } from '../lib/title';

// Slammed-in condensed display title. Two rows of giant condensed type sit
// over the selected project image — the first row bleeds in from the left,
// the second row from the right, so the picture peeks between the letters.
export function MassiveTitle({ text, subtitle, ink = '#241a4a', animate = true }) {
  const reduced = usePrefersReducedMotion();
  const reducedMotion = reduced || !animate;
  // The split grammar (slash → first-whitespace → midpoint) now lives in
  // src/lib/title.js so MorphingTitle and MassiveTitle share one source
  // of truth. splitTitleForMorph returns the split form as a newline-
  // joined two-row string; we parse it back into rows here.
  const [row1, row2 = ''] = splitTitleForMorph(text).split.split('\n');

  return (
    <div className="massive-title" aria-hidden="true" style={{ color: ink }}>
      <h2 className="massive-title__main">
        <span className="massive-title__row-wrap massive-title__row-wrap--top">
          <TextCascade
            text={row1}
            axis="x"
            range={200}
            enterFrom="left"
            exitTo="left"
            totalDuration={1.6}
            letterDelay={0.022}
            startDelay={0.16}
            ease="o6"
            className="massive-title__row"
            cellClassName="massive-title__cell"
            charClassName="massive-title__char"
            reduced={reducedMotion}
          />
        </span>
        {row2 ? (
          <span className="massive-title__row-wrap massive-title__row-wrap--bot">
            <TextCascade
              text={row2}
              axis="x"
              range={200}
              enterFrom="right"
              exitTo="right"
              totalDuration={1.6}
              letterDelay={0.022}
              startDelay={0.28}
              ease="o6"
              className="massive-title__row"
              cellClassName="massive-title__cell"
              charClassName="massive-title__char"
              reduced={reducedMotion}
            />
          </span>
        ) : null}
      </h2>
      {subtitle ? (
        <span className="massive-title__sub">
          <motion.span
            initial={reduced ? { opacity: 0 } : { y: '110%', opacity: 0 }}
            animate={reduced ? { opacity: 1 } : { y: '0%', opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { y: '110%', opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
            style={{ display: 'inline-block' }}
          >
            {subtitle}
          </motion.span>
        </span>
      ) : null}
    </div>
  );
}
