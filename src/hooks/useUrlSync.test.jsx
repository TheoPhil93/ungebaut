import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { pathFromView, useUrlSync, viewFromPath } from './useUrlSync';

// useUrlSync is the only piece of routing infrastructure between the SPA's
// view state and the address bar. Test the three contracts:
//   1. viewFromPath / pathFromView are total + symmetric for known views
//   2. mounting with a view that mismatches the URL pushes the new path
//   3. popstate events drive `navigate` so back/forward work
//   4. the 'not-found' view never pushes (it would clobber the typed path)

describe('viewFromPath', () => {
  it.each([
    ['/', 'home'],
    ['/index', 'index'],
    ['/services', 'services'],
    ['/journal', 'journal'],
    ['/about', 'about'],
    ['/impressum', 'impressum'],
    ['/datenschutz', 'datenschutz'],
  ])('maps %s → %s', (path, view) => {
    expect(viewFromPath(path)).toBe(view);
  });

  it('routes empty string to home (treated as root)', () => {
    expect(viewFromPath('')).toBe('home');
  });

  it.each(['/projects/foo', '/random', '/index/extra', '/SERVICES'])(
    'routes unknown path %s → not-found',
    (path) => {
      expect(viewFromPath(path)).toBe('not-found');
    },
  );
});

describe('pathFromView', () => {
  it.each([
    ['home', '/'],
    ['index', '/index'],
    ['services', '/services'],
    ['journal', '/journal'],
    ['about', '/about'],
    ['impressum', '/impressum'],
    ['datenschutz', '/datenschutz'],
  ])('maps %s → %s', (view, path) => {
    expect(pathFromView(view)).toBe(path);
  });

  it('falls back to / for unknown views', () => {
    expect(pathFromView('totally-made-up')).toBe('/');
  });

  it('round-trips for every known view', () => {
    for (const view of ['home', 'index', 'services', 'journal', 'about']) {
      expect(viewFromPath(pathFromView(view))).toBe(view);
    }
  });
});

describe('useUrlSync hook', () => {
  beforeEach(() => {
    // Reset URL between tests so order doesn't leak state.
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });

  it('pushes the new path when the view changes', () => {
    const navigate = vi.fn();
    const pushSpy = vi.spyOn(window.history, 'pushState');

    const { rerender } = renderHook(({ view }) => useUrlSync(view, navigate), {
      initialProps: { view: 'home' },
    });

    // 'home' matches '/', so no push on first render.
    expect(pushSpy).not.toHaveBeenCalled();

    rerender({ view: 'index' });

    expect(pushSpy).toHaveBeenCalledWith({ view: 'index' }, '', '/index');
    expect(window.location.pathname).toBe('/index');
  });

  it('does not push when the URL already matches the view', () => {
    window.history.replaceState({}, '', '/services');
    const navigate = vi.fn();
    const pushSpy = vi.spyOn(window.history, 'pushState');

    renderHook(() => useUrlSync('services', navigate));

    expect(pushSpy).not.toHaveBeenCalled();
  });

  it('never pushes for the not-found view (preserves the typed URL)', () => {
    window.history.replaceState({}, '', '/this/path/does/not/exist');
    const navigate = vi.fn();
    const pushSpy = vi.spyOn(window.history, 'pushState');

    renderHook(() => useUrlSync('not-found', navigate));

    expect(pushSpy).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/this/path/does/not/exist');
  });

  it('drives navigate from popstate events', () => {
    const navigate = vi.fn();
    renderHook(() => useUrlSync('home', navigate));

    act(() => {
      window.history.replaceState({}, '', '/journal');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(navigate).toHaveBeenCalledWith('journal');
  });

  it('routes unknown popstate paths to not-found', () => {
    const navigate = vi.fn();
    renderHook(() => useUrlSync('home', navigate));

    act(() => {
      window.history.replaceState({}, '', '/nope');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(navigate).toHaveBeenCalledWith('not-found');
  });

  it('removes the popstate listener on unmount', () => {
    const navigate = vi.fn();
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useUrlSync('home', navigate));
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('popstate', expect.any(Function));
  });
});
