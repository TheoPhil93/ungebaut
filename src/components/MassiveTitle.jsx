import { motion } from 'framer-motion';
import { TextCascade } from './TextCascade';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Split a single title string into two display rows. If there's a space, we
// split on the FIRST space (so multi-word titles read naturally as a stacked
// composition). Otherwise we split by midpoint, which mirrors the Aristide
// "DIGI / TAL ASSET" / "CAN / ALS" treatment for single-word titles.
function splitToRows(text) {
  if (!text) return ['', ''];
  const trimmed = text.trim();
  if (!trimmed) return ['', ''];
  if (trimmed.includes('/')) {
    const [top = '', bottom = ''] = trimmed.split('/');
    return [top.trim(), bottom.trim()];
  }
  const spaceIdx = trimmed.indexOf(' ');
  if (spaceIdx > 0) {
    return [trimmed.slice(0, spaceIdx), trimmed.slice(spaceIdx + 1)];
  }
  if (trimmed.length < 4) return [trimmed, ''];
  const mid = Math.ceil(trimmed.length / 2);
  return [trimmed.slice(0, mid), trimmed.slice(mid)];
}

// Slammed-in condensed display title. Two rows of giant condensed type sit
// over the selected project image — the first row bleeds in from the left,
// the second row from the right, so the picture peeks between the letters.
export function MassiveTitle({ text, subtitle, ink = '#241a4a', animate = true }) {
  const reduced = usePrefersReducedMotion();
  const reducedMotion = reduced || !animate;
  const [row1, row2] = splitToRows(text);

  return (
    <div className="massive-title" aria-hidden="true" style={{ color: ink }}>
      <h2 className="massive-title__main">
        <span className="massive-title__row-wrap massive-title__row-wrap--top">
          <TextCascade
            text={row1}
            axis="x"
            range={110}
            enterFrom="left"
            exitTo="left"
            totalDuration={1.2}
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
              range={110}
              enterFrom="right"
              exitTo="right"
            totalDuration={1.2}
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
