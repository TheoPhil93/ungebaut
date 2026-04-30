import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
import './index.css';
import App from './App.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';

// reducedMotion="user" → framer-motion skips transform animations (x/y/scale
// /rotate/skew) when the OS reports prefers-reduced-motion: reduce. Opacity
// and other non-transform values still animate, so cross-fades remain. The
// global CSS reset for *::before/after also nukes CSS keyframes/transitions
// in the same media block — see index.css.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MotionConfig>
  </StrictMode>,
);
