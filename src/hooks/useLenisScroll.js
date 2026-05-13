import { useCallback, useEffect, useRef, useState } from 'react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Aristide's `o6` (expo-out) ease — same curve TextCascade uses for the
// massive title slide. Mirrors `[0.16, 1, 0.3, 1]` closely enough that the
// page scroll and the title cascade feel like they share a clock.
const o6Easing = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

const noopUnsubscribe = () => {};
const noopSubscribe = () => noopUnsubscribe;

// Manages a single Lenis smooth-scroll instance while a project is open.
//
// `enabled` should track whatever app state should turn smooth scroll on
// (HomeView passes `Boolean(selected)`). When enabled flips to false or
// the component unmounts, the Lenis instance is destroyed and its RAF
// loop stops.
//
// Lenis is dynamically imported so its ~4kB stays off the eager critical
// path. The lenis instance + subscribe handle become non-null on the
// render after the import resolves; consumers fall back to native scroll
// while it's null.
//
// Under prefers-reduced-motion: reduce the hook never constructs Lenis
// and returns the noop subscribe handle so callers (useScrollProgress,
// GalleryGL) stay on their native code paths.
export function useLenisScroll({ enabled }) {
  const reduced = usePrefersReducedMotion();
  const [lenis, setLenis] = useState(null);
  // Mirror the latest lenis in a ref so the stable `subscribe` callback
  // below can register listeners against whichever instance is current
  // without re-creating itself (and tearing down consumer subscriptions)
  // every time the lenis prop changes identity.
  const lenisRef = useRef(null);

  useEffect(() => {
    if (!enabled || reduced || typeof window === 'undefined') return undefined;

    let cancelled = false;
    let instance = null;
    let rafId = 0;

    (async () => {
      const mod = await import('lenis');
      if (cancelled) return;
      const Lenis = mod.default ?? mod.Lenis ?? mod;
      instance = new Lenis({
        smoothTouch: false,
        duration: 1.2,
        easing: o6Easing,
      });
      const raf = (time) => {
        if (!instance) return;
        instance.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);
      lenisRef.current = instance;
      setLenis(instance);
    })();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (instance) {
        instance.destroy();
      }
      lenisRef.current = null;
      setLenis(null);
    };
  }, [enabled, reduced]);

  // Stable subscribe handle — registers `cb` against whatever lenis
  // instance is current at call time. Returns the matching unsubscribe.
  // Reduced motion / disabled state returns the noop pair so callers can
  // unconditionally call `subscribe(cb)` without null-guarding.
  const subscribe = useCallback((cb) => {
    const active = lenisRef.current;
    if (!active) return noopUnsubscribe;
    active.on('scroll', cb);
    return () => {
      active.off('scroll', cb);
    };
  }, []);

  if (!enabled || reduced) {
    return { lenis: null, subscribe: noopSubscribe };
  }
  return { lenis, subscribe };
}

export { o6Easing };
