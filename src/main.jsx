import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
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
// Reduced-motion is enforced via the global CSS reset in index.css (it nukes
// keyframes/transitions/animation-* under prefers-reduced-motion: reduce).
// Framer-motion's MotionConfig used to live here but pulled the framer chunk
// onto the eager critical path — every framer-using component is now
// lazy-loaded so the chunk parses after first paint instead of blocking it.
const render = () =>
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
        <Analytics />
      </ErrorBoundary>
    </StrictMode>,
  );

// AVIF probe runs before React mounts so GalleryGL's first-frame texture
// loads see a synchronous answer (getAvifSupport()) and request the .avif
// sidecars instead of the multi-MB PNG originals. Bounded at 100ms so a
// hung probe never blocks render — the 64-byte data URI typically resolves
// in <5ms.
resolveAvifSupport().finally(render);
