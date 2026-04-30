import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { Cursor } from './components/Cursor';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { getProject } from './data/projects';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useUrlSync, viewFromPath } from './hooks/useUrlSync';

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
const ProjectDetail = lazy(() =>
  import('./components/ProjectDetail').then((m) => ({ default: m.ProjectDetail })),
);
const ImpressumView = lazy(() =>
  import('./components/ImpressumView').then((m) => ({ default: m.ImpressumView })),
);
const DatenschutzView = lazy(() =>
  import('./components/DatenschutzView').then((m) => ({ default: m.DatenschutzView })),
);

const VIEWS = ['home', 'index', 'services', 'journal', 'about', 'impressum', 'datenschutz'];

export default function App() {
  const reduced = usePrefersReducedMotion();
  const [view, setView] = useState(() =>
    typeof window === 'undefined' ? 'home' : viewFromPath(window.location.pathname),
  );
  const [selectedId, setSelectedId] = useState(null);
  // Two-stage drill-down: clicking a card opens stage 1 (HomeView's in-place
  // expansion). Clicking EXPLORE opens stage 2 (the deeper ProjectDetail
  // with side thumbnails). Closing stage 2 returns to stage 1.
  const [detailMode, setDetailMode] = useState(false);
  const selected = selectedId ? getProject(selectedId) : null;

  const navigate = useCallback((next) => {
    if (!VIEWS.includes(next)) return;
    setSelectedId(null);
    setDetailMode(false);
    setView(next);
  }, []);

  useUrlSync(view, navigate);

  const openProject = useCallback((project) => {
    setSelectedId(project ? project.id : null);
    if (!project) setDetailMode(false);
  }, []);

  const exploreProject = useCallback(() => {
    setDetailMode(true);
  }, []);

  const closeProject = useCallback(() => {
    if (detailMode) {
      // First click closes the deeper view, second click clears the card.
      setDetailMode(false);
    } else {
      setSelectedId(null);
    }
  }, [detailMode]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') {
        if (detailMode) setDetailMode(false);
        else if (selectedId) setSelectedId(null);
        else if (view !== 'home') navigate('home');
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navigate, selectedId, view, detailMode]);

  // Per-route titles are rendered inside each view via <SeoHead>. Project
  // detail keeps the dynamic title here since it depends on the selected
  // record.
  useEffect(() => {
    if (selected) {
      document.title = `${selected.client} — ${selected.title} · UNGEBAUT`;
    }
  }, [selected]);

  const indexHandleSelect = useCallback(
    (project) => {
      navigate('home');
      // small delay to let view animation start before opening detail
      setTimeout(() => setSelectedId(project.id), 280);
    },
    [navigate],
  );

  const transition = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        initial: { y: 60, opacity: 0, clipPath: 'inset(15% 0% 15% 0%)' },
        animate: { y: 0, opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' },
        exit: { y: -40, opacity: 0, clipPath: 'inset(15% 0% 15% 0%)' },
      };

  return (
    <div className="app" data-detail={selected ? 'open' : 'closed'}>
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>

      <Cursor />
      <Nav view={view} onNavigate={navigate} />

      <main id="main" className="app__main">
        <LayoutGroup id="project-title-transition">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            {...transition}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
          >
            <Suspense fallback={null}>
              {view === 'home' && (
                <HomeView
                  onSelect={openProject}
                  onExplore={exploreProject}
                  selectedId={selectedId}
                />
              )}
              {view === 'index' && <IndexView onSelect={indexHandleSelect} />}
              {view === 'services' && <ServicesView />}
              {view === 'journal' && <JournalView />}
              {view === 'about' && <AboutView />}
              {view === 'impressum' && <ImpressumView />}
              {view === 'datenschutz' && <DatenschutzView />}
            </Suspense>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selected && detailMode ? (
            <Suspense fallback={null}>
              <ProjectDetail project={selected} onClose={closeProject} />
            </Suspense>
          ) : null}
        </AnimatePresence>
        </LayoutGroup>
      </main>

      <Footer onNavigate={navigate} />
    </div>
  );
}
