'use client';
import { useId, useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

// Local recreation of @unlumen-ui/fluid-blobs (the registry only publishes
// the BlobCard wrapper). API surface matches the upstream contract called
// by ../unlumen-ui/blob-card:
//
//   lightColors  string[]   blob fills in light theme (one per origin)
//   darkColors   string[]   blob fills in dark theme (light-only site — unused)
//   origins      {x,y}[]    blob positions, normalised 0-100 space (% of canvas)
//   margin       number     drives base blob radius
//   blur         number     CSS-px-equivalent Gaussian blur (mapped to stdDeviation)
//
// Implementation: each origin spawns one SVG <circle>. Per-blob seeds
// (size, x/y offset, animation phase) prevent the four upstream-style
// stacked origins from collapsing into one mass. Two motion layers run
// at once:
//
//   1) Idle  — every circle has cx/cy keyframes drifting in a slow
//              Lissajous loop, so the field is alive without input.
//   2) Hover — a parent <motion.g> translate follows the mouse via
//              spring-smoothed motion values. When the cursor enters
//              the SVG the field leans toward it; when the cursor
//              leaves the springs settle back to (0, 0).

const DEFAULT_ORIGINS = [
  { x: 50, y: -55 },
  { x: 50, y: -25 },
  { x: 50, y: -25 },
  { x: 50, y: -25 },
];

// dx/dy values stay close to zero so the four blobs concentrate around
// the same anchor and overlap heavily — the blur merges them into one
// fluid mass with subtle internal variation, rather than four separate
// circles fanned out across the canvas.
const SEED = [
  { dx: -8, dy: -6, scale: 1.0, phase: 0.0 },
  { dx: 4, dy: 10, scale: 1.15, phase: 0.35 },
  { dx: 10, dy: -2, scale: 1.05, phase: 0.7 },
  { dx: -4, dy: 12, scale: 1.2, phase: 0.55 },
];

// How strongly the blob field translates toward the cursor. 1.0 = the
// blob centroid lands exactly on the mouse position; lower values lean
// toward the cursor without locking onto it. The user asked for a
// "blob centred where the mouse is" so we run at full strength.
const MOUSE_INFLUENCE = 1.0;

// Where the blob centroid sits when the cursor is absent. Origins all
// pass at x:50 with y averaging -32; per-blob seeds shift this by about
// (+1, +6.5). We anchor at (50, -25) — close enough that translating by
// (cursor − anchor) lines the visible blob mass up under the cursor.
const ANCHOR_X = 50;
const ANCHOR_Y = -25;

export function FluidBlobs({
  lightColors = ['#ff0020', '#fc0f60', '#e8227a', '#ff85b3'],
  // eslint-disable-next-line no-unused-vars
  darkColors,
  origins = DEFAULT_ORIGINS,
  margin = 60,
  blur = 50,
}) {
  const reduced = useReducedMotion();
  const filterId = useId();
  const svgRef = useRef(null);

  // Per-instance phase shift derived from the `useId()` string. Each
  // <FluidBlobs> mounted on the page gets a different filterId
  // (`:r0:` / `:r1:` / `:r2:` …), so summing char codes and taking
  // mod 100 yields a stable, deterministic 0–4 s offset that's
  // distinct between cards. The result is the three cards on the
  // services page each starting their idle drift at a different
  // point in the cycle, never moving in lockstep.
  const cardPhase =
    (filterId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 100) / 25;

  // Mouse offset in viewBox units (0-100 coordinate space). Spring is
  // tuned for a smooth, continuous flow rather than a snappy lock —
  // moderate stiffness, near-critical damping, slightly heavier mass.
  // The blob field arrives under the cursor over roughly 400-500 ms.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const SPRING = { stiffness: 40, damping: 26, mass: 1.6, restDelta: 0.05 };
  const smoothX = useSpring(mouseX, SPRING);
  const smoothY = useSpring(mouseY, SPRING);

  // Bigger radius forces the four (already-clustered) circles to overlap
  // strongly. With margin × 0.85 ≈ 51, each circle covers roughly half
  // the canvas, and any two of the four overlap by 60–80%.
  const baseRadius = margin * 0.85;
  const drift = margin * 0.35;

  const handleMove = (event) => {
    if (reduced) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    // Cursor position in viewBox space (0..100 on each axis) — the SVG
    // is preserveAspectRatio="none", so this maps client coords linearly.
    const cursorVbX = ((event.clientX - rect.left) / rect.width) * 100;
    const cursorVbY = ((event.clientY - rect.top) / rect.height) * 100;
    // Translate the blob group so its anchor centroid lines up under
    // the cursor (delta = cursor − anchor). MOUSE_INFLUENCE of 1.0
    // gives a 1:1 follow; lower values lean rather than lock.
    mouseX.set((cursorVbX - ANCHOR_X) * MOUSE_INFLUENCE);
    mouseY.set((cursorVbY - ANCHOR_Y) * MOUSE_INFLUENCE);
  };

  const handleLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <svg
      ref={svgRef}
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      // pointer-events: all so the entire SVG bounding box catches mouse
      // moves, not only the painted blob regions (default visiblePainted
      // would skip transparent pixels).
      style={{ pointerEvents: 'all' }}
    >
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur / 10} />
        </filter>
      </defs>
      <motion.g filter={`url(#${filterId})`} style={{ x: smoothX, y: smoothY }}>
        {origins.map((origin, i) => {
          const color = lightColors[i % lightColors.length];
          const seed = SEED[i % SEED.length];
          const baseX = origin.x + seed.dx;
          const baseY = origin.y + seed.dy;
          const r = baseRadius * seed.scale;

          return (
            <motion.circle
              key={i}
              cx={baseX}
              cy={baseY}
              r={r}
              fill={color}
              fillOpacity={0.7}
              animate={
                reduced
                  ? {}
                  : {
                      cx: [
                        baseX,
                        baseX + drift,
                        baseX - drift * 0.6,
                        baseX + drift * 0.4,
                        baseX,
                      ],
                      cy: [
                        baseY,
                        baseY - drift * 0.5,
                        baseY + drift * 0.7,
                        baseY - drift * 0.3,
                        baseY,
                      ],
                    }
              }
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      duration: 9 + i * 1.7,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: cardPhase + seed.phase * 4,
                    }
              }
            />
          );
        })}
      </motion.g>
    </svg>
  );
}
