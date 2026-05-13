import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useLenisScroll } from './useLenisScroll';
import * as reducedMotionModule from './usePrefersReducedMotion';

// useLenisScroll's contract:
//   1. When enabled && not reduced motion → dynamic-imports Lenis,
//      constructs it once, starts an RAF loop.
//   2. When disabled or reduced motion → never constructs Lenis;
//      returns { lenis: null, subscribe: noop } where noop returns noop.
//   3. enabled → disabled or unmount destroys the instance and stops RAF.
//   4. The returned `subscribe` registers a scroll callback via
//      lenis.on('scroll', cb) and the returned unsubscriber calls
//      lenis.off('scroll', cb).
//
// All Lenis surface area is mocked — these tests assert call orchestration,
// not real DOM scroll behavior.

const mockOn = vi.fn();
const mockOff = vi.fn();
const mockRaf = vi.fn();
const mockDestroy = vi.fn();
const mockConstructor = vi.fn();

class MockLenis {
  constructor(opts) {
    mockConstructor(opts);
    this.on = mockOn;
    this.off = mockOff;
    this.raf = mockRaf;
    this.destroy = mockDestroy;
  }
}

vi.mock('lenis', () => ({
  default: MockLenis,
}));

describe('useLenisScroll', () => {
  beforeEach(() => {
    mockOn.mockClear();
    mockOff.mockClear();
    mockRaf.mockClear();
    mockDestroy.mockClear();
    mockConstructor.mockClear();
    vi.spyOn(reducedMotionModule, 'usePrefersReducedMotion').mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('constructs Lenis with smoothTouch:false and o6 easing when enabled', async () => {
    renderHook(() => useLenisScroll({ enabled: true }));
    await waitFor(() => expect(mockConstructor).toHaveBeenCalledTimes(1));
    const opts = mockConstructor.mock.calls[0][0];
    expect(opts.smoothTouch).toBe(false);
    expect(opts.duration).toBe(1.2);
    expect(typeof opts.easing).toBe('function');
    // Sanity-check the easing curve — o6 at t=0 returns ~0, at t=1
    // returns ~1, and accelerates fast off the start.
    expect(opts.easing(0)).toBeCloseTo(0, 2);
    expect(opts.easing(1)).toBeCloseTo(1, 2);
  });

  it('starts an RAF loop after construction', async () => {
    renderHook(() => useLenisScroll({ enabled: true }));
    await waitFor(() => expect(mockRaf).toHaveBeenCalled());
  });

  it('never constructs Lenis when disabled', async () => {
    renderHook(() => useLenisScroll({ enabled: false }));
    // Give the microtask queue a chance to resolve any phantom import.
    await new Promise((r) => setTimeout(r, 30));
    expect(mockConstructor).not.toHaveBeenCalled();
  });

  it('never constructs Lenis under prefers-reduced-motion', async () => {
    vi.spyOn(reducedMotionModule, 'usePrefersReducedMotion').mockReturnValue(true);
    renderHook(() => useLenisScroll({ enabled: true }));
    await new Promise((r) => setTimeout(r, 30));
    expect(mockConstructor).not.toHaveBeenCalled();
  });

  it('returns { lenis: null, subscribe: noop } when disabled', () => {
    const { result } = renderHook(() => useLenisScroll({ enabled: false }));
    expect(result.current.lenis).toBeNull();
    const unsub = result.current.subscribe(() => {});
    expect(typeof unsub).toBe('function');
    // Calling the noop unsubscribe is safe and does not register listeners.
    unsub();
    expect(mockOn).not.toHaveBeenCalled();
  });

  it('returns { lenis: null, subscribe: noop } under reduced motion', () => {
    vi.spyOn(reducedMotionModule, 'usePrefersReducedMotion').mockReturnValue(true);
    const { result } = renderHook(() => useLenisScroll({ enabled: true }));
    expect(result.current.lenis).toBeNull();
    const unsub = result.current.subscribe(() => {});
    expect(mockOn).not.toHaveBeenCalled();
    unsub();
  });

  it('destroys the instance when enabled flips to false', async () => {
    const { rerender } = renderHook(({ enabled }) => useLenisScroll({ enabled }), {
      initialProps: { enabled: true },
    });
    await waitFor(() => expect(mockConstructor).toHaveBeenCalledTimes(1));

    act(() => {
      rerender({ enabled: false });
    });

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('destroys the instance on unmount', async () => {
    const { unmount } = renderHook(() => useLenisScroll({ enabled: true }));
    await waitFor(() => expect(mockConstructor).toHaveBeenCalledTimes(1));

    act(() => {
      unmount();
    });

    expect(mockDestroy).toHaveBeenCalledTimes(1);
  });

  it('subscribe registers on Lenis and the returned unsubscribe calls off', async () => {
    const { result } = renderHook(() => useLenisScroll({ enabled: true }));
    await waitFor(() => expect(result.current.lenis).not.toBeNull());

    const cb = vi.fn();
    const unsubscribe = result.current.subscribe(cb);
    expect(mockOn).toHaveBeenCalledWith('scroll', cb);

    unsubscribe();
    expect(mockOff).toHaveBeenCalledWith('scroll', cb);
  });
});
