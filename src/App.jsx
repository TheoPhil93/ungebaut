import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { useUrlSync, viewFromPath } from './hooks/useUrlSync';

// Cursor + HomeView are framer-motion users; lazy-loading them keeps the
// framer chunk off the eager critical path so its ~250ms parse/eval cost
// runs after FCP instead of blocking it. Cursor never renders on mobile/
// touch devices and HomeView's null Suspense fallback is acceptable because
// the WebGL gallery (its visible LCP element) is itself lazy.
const Cursor = lazy(() =>
  import('./components/Cursor').then((m) => ({ default: m.Cursor })),
);
const HomeView = lazy(() =>
  import('./components/HomeView').then((m) => ({ default: m.HomeView })),
);
const IndexView = lazy(() =>
  import('./components/IndexView').then((m) => ({ default: m.IndexView })),
);
const AboutView = lazy(() =>
  import('./components/AboutView').then((m) => ({ default: m.AboutView })),
);
const ServicesView = lazy(() =>
  import('./components/ServicesView').then((m) => ({ default: m.ServicesView })),
);
const JournalView = lazy(() =>
  import('./components/JournalView').then((m) => ({ default: m.JournalView })),
);
const ImpressumView = lazy(() =>
  import('./components/ImpressumView').then((m) => ({ default: m.ImpressumView })),
);
const DatenschutzView = lazy(() =>
  import('./components/DatenschutzView').then((m) => ({ default: m.DatenschutzView })),
);
const NotFoundView = lazy(() =>
  import('./components/NotFoundView').then((m) => ({ default: m.NotFoundView })),
);

const VIEWS = [
  'home',
  'index',
  'services',
  'journal',
  'about',
  'impressum',
  'datenschutz',
  'not-found',
];

export default function App() {
  const [view, setView] = useState(() =>
    typeof window === 'undefined' ? 'home' : viewFromPath(window.location.pathname),
  );
  // Selection drives HomeView's unified scroll stack (Section 1 hero +
  // Section 2 strip/footer). HomeView owns the close affordances and SEO
  // updates; App only knows whether something is selected so layout and
  // routing can react.
  const [selectedId, setSelectedId] = useState(null);

  const navigate = useCallback((next) => {
    if (!VIEWS.includes(next)) return;
    setSelectedId(null);
    setView(next);
  }, []);

  useUrlSync(view, navigate);

  // React side of the cold-entry loader handshake. The inline controller
  // in index.html dispatches `ungebaut:loaded` once at hand-off (natural,
  // Escape-skipped, or auto-skipped) and sets window.__ungebautLoaded
  // synchronously. We mark <html> with `.app--loaded` so HMR-triggered
  // re-mounts cannot accidentally re-suppress chrome opacity, and so any
  // future post-load logic can branch on a single persistent flag.
  //
  // Race note: on skip paths the event fires during the inline script's
  // synchronous run, BEFORE React mounts. Checking the window flag
  // covers that case.
  useEffect(() => {
    const markLoaded = () => {
      document.documentElement.classList.add('app--loaded');
    };
    if (window.__ungebautLoaded) {
      markLoaded();
      return undefined;
    }
    window.addEventListener('ungebaut:loaded', markLoaded, { once: true });
    return () => window.removeEventListener('ungebaut:loaded', markLoaded);
  }, []);

  const openProject = useCallback((project) => {
    setSelectedId(project ? project.id : null);
  }, []);

  // ESC at the route level — when no project is open, ESC navigates back
  // to home from any non-home route. Selection-mode ESC is owned by
  // HomeView (the unified scroll stack closes itself).
  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      if (selectedId) return;
      if (view !== 'home') navigate('home');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, selectedId, view]);

  const indexHandleSelect = useCallback(
    (project) => {
      navigate('home');
      // small delay to let view animation start before opening detail
      setTimeout(() => setSelectedId(project.id), 280);
    },
    [navigate],
  );

  return (
    <div className="app" data-detail={selectedId ? 'open' : 'closed'}>
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>

      <Suspense fallback={null}>
        <Cursor />
      </Suspense>
      <Nav view={view} onNavigate={navigate} />

      <main id="main" className="app__main">
        {/* Per-view CSS fade-in (see .app__view in index.css). Keyed by view
            so each route swap remounts the wrapper and re-runs the keyframe
            — same effect as the previous AnimatePresence/motion.div, minus
            the framer-motion dependency on the eager critical path. */}
        <div key={view} className="app__view">
          <Suspense fallback={null}>
            {view === 'home' && <HomeView onSelect={openProject} selectedId={selectedId} />}
            {view === 'index' && <IndexView onSelect={indexHandleSelect} />}
            {view === 'services' && <ServicesView />}
            {view === 'journal' && <JournalView />}
            {view === 'about' && <AboutView />}
            {view === 'impressum' && <ImpressumView />}
            {view === 'datenschutz' && <DatenschutzView />}
            {view === 'not-found' && <NotFoundView onNavigate={navigate} />}
          </Suspense>
        </div>
      </main>

      <Footer onNavigate={navigate} />
      <SpeedInsights />
    </div>
  );
}
