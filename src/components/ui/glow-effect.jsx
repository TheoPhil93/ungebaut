'use client';

// Local recreation of @unlumen-ui/glow-effect. API surface matches the
// upstream contract called by ../unlumen-ui/blob-card:
//   colors    string[]              gradient stops, evenly distributed around 360°
//   mode      'rotate' | 'pulse'    animation strategy
//   blur      'soft' | 'medium' | 'strong' | 'strongest'
//   duration  number                seconds per full rotation
//   scale     number                element size relative to its container

const BLUR_PX = {
  soft: 4,
  medium: 8,
  strong: 12,
  strongest: 16,
};

export function GlowEffect({
  colors = ['#ff96a9', '#e8b4f0', '#ffb3c6', '#d44d8a', '#ff96a9'],
  mode = 'rotate',
  blur = 'strongest',
  duration = 5,
  scale = 1,
}) {
  const blurPx = BLUR_PX[blur] ?? BLUR_PX.strongest;

  // Build a conic-gradient string with stops evenly distributed around the
  // circle from the colors array.
  const step = 360 / Math.max(colors.length - 1, 1);
  const stops = colors.map((c, i) => `${c} ${(i * step).toFixed(2)}deg`).join(', ');
  const background = `conic-gradient(from 0deg, ${stops})`;

  // `scale` controls the oversize factor used to ensure rotation never
  // reveals corners. scale=1 → 200% oversize so the rotated square fully
  // covers the rounded rectangle of the parent frame.
  const inset = `${-50 * scale}%`;
  const size = `${200 * scale}%`;

  return (
    <span
      aria-hidden="true"
      className={
        mode === 'rotate'
          ? 'glow-effect glow-effect--rotate'
          : 'glow-effect glow-effect--pulse'
      }
      style={{
        position: 'absolute',
        inset,
        width: size,
        height: size,
        background,
        filter: `blur(${blurPx}px)`,
        animationDuration: `${duration}s`,
        transformOrigin: 'center',
        pointerEvents: 'none',
      }}
    />
  );
}
