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

// Unknown paths route to the 404 view. The pathname is preserved (we don't
// rewrite to /404) so the URL the user typed stays in the address bar,
// matching standard 404 UX. Real HTTP 404 status is a deploy-host concern
// — see the deploy-host issue.
export function viewFromPath(pathname) {
  if (pathname in PATH_TO_VIEW) return PATH_TO_VIEW[pathname];
  if (pathname === '/' || pathname === '') return 'home';
  return 'not-found';
}

export function pathFromView(view) {
  return VIEW_TO_PATH[view] ?? '/';
}

export function useUrlSync(view, navigate) {
  // Push the URL whenever the view changes. Skip if the URL already matches
  // (e.g. on first mount or when navigation came from a popstate event).
  // The 'not-found' view is special: it has no canonical URL — pushing one
  // would rewrite the user's typed path back to '/', which we don't want.
  useEffect(() => {
    if (view === 'not-found') return;
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
