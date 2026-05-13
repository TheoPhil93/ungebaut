import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useScrollProgress } from './useScrollProgress';
import * as reducedMotionModule from './usePrefersReducedMotion';

// useScrollProgress translates a ref's bounding rect into a 0..1 value
// driven by native window scroll. The contract under test:
//   1. before the ref enters the viewport (rect.top above the bottom
//      edge), progress is 0;
//   2. after the ref exits (rect.top above the top edge), progress is 1;
//   3. mid-viewport interpolates linearly;
//   4. prefers-reduced-motion short-circuits to 1 and skips listeners.

const VIEWPORT_HEIGHT = 800;

function makeRef(initialTop) {
  let currentTop = initialTop;
  const node = {
    getBoundingClientRect() {
      return { top: currentTop, bottom: currentTop + 50, height: 50 };
    },
  };
  return {
    ref: { current: node },
    setTop(next) {
      currentTop = next;
    },
  };
}

describe('useScrollProgress', () => {
  beforeEach(() => {
    window.innerHeight = VIEWPORT_HEIGHT;
    vi.spyOn(reducedMotionModule, 'usePrefersReducedMotion').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 0 when the ref sits below the viewport', () => {
    const { ref } = makeRef(VIEWPORT_HEIGHT + 100);
    const { result } = renderHook(() => useScrollProgress({ ref }));
    expect(result.current).toBe(0);
  });

  it('returns 1 when the ref has scrolled above the viewport', () => {
    const { ref } = makeRef(-100);
    const { result } = renderHook(() => useScrollProgress({ ref }));
    expect(result.current).toBe(1);
  });

  it('interpolates linearly across the viewport', () => {
    // With defaults (enterAt=0, exitAt=1), enterY = viewportHeight, exitY = 0.
    // At rect.top = viewportHeight/2, progress = 0.5.
    const { ref } = makeRef(VIEWPORT_HEIGHT / 2);
    const { result } = renderHook(() => useScrollProgress({ ref }));
    expect(result.current).toBeCloseTo(0.5, 5);
  });

  it('recomputes on scroll events', () => {
    const target = makeRef(VIEWPORT_HEIGHT + 50);
    const { result } = renderHook(() => useScrollProgress({ ref: target.ref }));
    expect(result.current).toBe(0);

    act(() => {
      target.setTop(VIEWPORT_HEIGHT / 4);
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current).toBeCloseTo(0.75, 5);
  });

  it('returns 1 immediately under prefers-reduced-motion', () => {
    vi.spyOn(reducedMotionModule, 'usePrefersReducedMotion').mockReturnValue(true);
    const { ref } = makeRef(VIEWPORT_HEIGHT + 100);
    const { result } = renderHook(() => useScrollProgress({ ref }));
    expect(result.current).toBe(1);
  });

  it('removes scroll and resize listeners on unmount', () => {
    const { ref } = makeRef(VIEWPORT_HEIGHT / 2);
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => useScrollProgress({ ref }));
    unmount();
    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('honours custom enterAt and exitAt thresholds', () => {
    // enterAt=0.4, exitAt=0.8 ⇒ enterY = 0.6 * 800 = 480, exitY = 0.2 * 800 = 160.
    // At rect.top = 320 (midway), progress = (480 - 320) / (480 - 160) = 0.5.
    const { ref } = makeRef(320);
    const { result } = renderHook(() =>
      useScrollProgress({ ref, enterAt: 0.4, exitAt: 0.8 }),
    );
    expect(result.current).toBeCloseTo(0.5, 5);
  });
});
