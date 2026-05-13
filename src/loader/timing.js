// Pure timing math for the cold-entry loader.
//
// Returns the floor/ceiling envelope the controller uses to schedule the
// hand-off: the loader cannot exit before `floorMs` (preserves the brand
// moment on fast networks) and cannot persist past `ceilingMs` (guards
// against slow networks). The actual exit fires on:
//   max(floorMs, min(ceilingMs, windowLoadFiredAt + 200ms))
//
// Four variants:
//   - desktop, full motion:   {3500, 5500}
//   - mobile, full motion:    {1500, 4000}
//   - reduced-motion:         { 800, 5500}
//   - mobile + reduced-motion:{1500, 5500}
//
// Desktop's 3500ms floor accommodates the no-morph gesture: letter
// reveal 1.25s + box-grow 1.25s + shuffle 1s = 3.5s total. The picture
// stays at letter scale; exit slides the whole loader left. Mobile
// and reduced-motion skip the box phase so their floors stay short.
//
// The combined variant picks mobile's floor (the static-line typography
// still needs ~1.5s of dwell to read) and reduced-motion's ceiling (a
// motion-sensitive user has the same network patience as a desktop user;
// the mobile ceiling shortens out of attention-span concerns, not asset
// concerns, and reduced-motion users tend to read longer).

const DESKTOP = Object.freeze({ floorMs: 3500, ceilingMs: 5500 });
const MOBILE = Object.freeze({ floorMs: 1500, ceilingMs: 4000 });
const REDUCED_MOTION = Object.freeze({ floorMs: 800, ceilingMs: 5500 });
const MOBILE_REDUCED_MOTION = Object.freeze({ floorMs: 1500, ceilingMs: 5500 });

/**
 * @param {{ reducedMotion?: boolean, isMobile?: boolean }} [opts]
 * @returns {{ floorMs: number, ceilingMs: number }}
 */
export function computeHandoffTiming(opts = {}) {
  const { reducedMotion = false, isMobile = false } = opts;
  if (reducedMotion && isMobile) return { ...MOBILE_REDUCED_MOTION };
  if (reducedMotion) return { ...REDUCED_MOTION };
  if (isMobile) return { ...MOBILE };
  return { ...DESKTOP };
}
