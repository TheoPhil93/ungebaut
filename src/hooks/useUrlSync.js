import { useEffect } from 'react';

// Map state-based views to real URLs without pulling in a router. Keeps the
// existing AnimatePresence wiring intact while giving Google, prerenderers
// and AI crawlers a unique URL per view.

const PATH_TO_VIEW = {
  '/': 'home',
  '/index': 'index',
  '/services': 'services',
  '/journal': 'journal',
  '/about': 'about',
  '/impressum': 'impressum',
  '/datenschutz': 'datenschutz',
};

const VIEW_TO_PATH = Object.fromEntries(
  Object.entries(PATH_TO_VIEW).map(([path, view]) => [view, path]),
);

export function viewFromPath(pathname) {
  return PATH_TO_VIEW[pathname] ?? 'home';
}

export function pathFromView(view) {
  return VIEW_TO_PATH[view] ?? '/';
}

export function useUrlSync(view, navigate) {
  // Push the URL whenever the view changes. Skip if the URL already matches
  // (e.g. on first mount or when navigation came from a popstate event).
  useEffect(() => {
    const target = pathFromView(view);
    if (typeof window !== 'undefined' && window.location.pathname !== target) {
      window.history.pushState({ view }, '', target);
    }
  }, [view]);

  // Browser back/forward should drive the view, not break it.
  useEffect(() => {
    const onPop = () => {
      navigate(viewFromPath(window.location.pathname));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [navigate]);
}
