import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import { initSentry } from './lib/sentry.js';
import { resolveAvifSupport } from './lib/image.js';

// Fire-and-forget — initSentry resolves immediately when no DSN is set, so
// rendering never waits on it. With a DSN configured the @sentry/react
// bundle is dynamically imported into its own chunk.
initSentry();

const root = createRoot(document.getElementById('root'));
const render = () =>
  // reducedMotion="user" → framer-motion skips transform animations (x/y
  // /scale/rotate/skew) when the OS reports prefers-reduced-motion: reduce.
  // Opacity and other non-transform values still animate, so cross-fades
  // remain. The global CSS reset for *::before/after also nukes CSS
  // keyframes/transitions in the same media block — see index.css.
  root.render(
    <StrictMode>
      <MotionConfig reducedMotion="user">
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </MotionConfig>
    </StrictMode>,
  );

// AVIF probe runs before React mounts so GalleryGL's first-frame texture
// loads see a synchronous answer (getAvifSupport()) and request the .avif
// sidecars instead of the multi-MB PNG originals. Bounded at 100ms so a
// hung probe never blocks render — the 64-byte data URI typically resolves
// in <5ms.
resolveAvifSupport().finally(render);
