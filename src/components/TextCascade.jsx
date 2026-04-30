import { useMemo } from 'react';
import { motion } from 'framer-motion';

// Per-letter cascade reveal, ported from Aristide Benoist's `T`/`k`/`L` classes.
//
// The signature trait of his text reveals: each letter shares a *fraction* of
// the total animation, but its window is offset by `letterDelay` from its
// neighbour. Letter i runs from `i * letterDelay` to `1 - (n - 1 - i) * delay`
// of total progress — so all letters take the same chunk but heavily overlap.
// That overlap is why the reveal reads as a single fluid wave instead of a
// typewriter cascade.
//
// `o6` ease (his default for show) ≈ exponential ease-out: a sharp start that
// glides to rest. We approximate with `[0.16, 1, 0.3, 1]` cubic-bezier.

const EASE_O6 = [0.16, 1, 0.3, 1]; // expo-out approximation
const EASE_O3 = [0.33, 1, 0.68, 1]; // cubic-out approximation (used on hide)

function shuffleIndices(n) {
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function TextCascade({
  text,
  axis = 'y',
  range = 110,
  reverse = false,
  enterFrom,
  exitTo,
  totalDuration = 1.6,
  letterDelay = 0.025,
  startDelay = 0,
  startIndex = 0,
  totalChars,
  random = false,
  ease = 'o6',
  className = '',
  cellClassName = '',
  charClassName = '',
  style,
  reduced = false,
  preserveSpaces = true,
  as: Tag = 'span',
}) {
  const chars = useMemo(() => Array.from(text || ''), [text]);
  const n = chars.length;

  const order = useMemo(() => (random ? shuffleIndices(n) : null), [random, n]);

  const cascadeChars = Math.max(n, totalChars || n);
  const visiblePortion = Math.max(0.05, 1 - (cascadeChars - 1) * letterDelay);
  const perLetterDuration = visiblePortion * totalDuration;

  const easeArr = ease === 'o3' ? EASE_O3 : EASE_O6;

  if (reduced) {
    return (
      <Tag className={`cascade ${className}`} style={style}>
        {text}
      </Tag>
    );
  }

  const offset = `${reverse ? -range : range}%`;
  const xOffset = (side) => (side === 'right' ? `${range}%` : `${-range}%`);
  const init =
    axis === 'x'
      ? { x: xOffset(enterFrom || (reverse ? 'right' : 'left')) }
      : { y: offset };
  const target = axis === 'x' ? { x: '0%' } : { y: '0%' };
  const exit = axis === 'x' ? { x: xOffset(exitTo || (reverse ? 'right' : 'left')) } : init;

  // Build per-character cells, then bundle consecutive non-space cells
  // into `cascade__word` wrappers (white-space: nowrap) so paragraphs
  // wrap at word boundaries instead of mid-word in narrow columns.
  const renderCell = (ch, i) => {
    const orderIdx = order ? order.indexOf(i) : i;
    const delay = startDelay + (startIndex + orderIdx) * letterDelay * totalDuration;
    const isSpace = ch === ' ';

    return (
      <span
        key={`${ch}-${i}`}
        className={`cascade__cell ${cellClassName}${isSpace ? ' cascade__cell--space' : ''}`}
      >
        <motion.span
          className={`cascade__char ${charClassName}`}
          initial={init}
          animate={target}
          exit={exit}
          transition={{
            duration: perLetterDuration,
            ease: easeArr,
            delay,
          }}
        >
          {isSpace && preserveSpaces ? ' ' : ch}
        </motion.span>
      </span>
    );
  };

  const nodes = [];
  let wordBuffer = [];
  let wordStart = 0;
  const flushWord = () => {
    if (!wordBuffer.length) return;
    nodes.push(
      <span key={`w-${wordStart}`} className="cascade__word">
        {wordBuffer}
      </span>,
    );
    wordBuffer = [];
  };
  chars.forEach((ch, i) => {
    if (ch === ' ') {
      flushWord();
      nodes.push(renderCell(ch, i));
    } else {
      if (wordBuffer.length === 0) wordStart = i;
      wordBuffer.push(renderCell(ch, i));
    }
  });
  flushWord();

  return (
    <Tag className={`cascade ${className}`} style={style}>
      {nodes}
    </Tag>
  );
}
