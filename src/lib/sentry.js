// Sentry init — gated on VITE_SENTRY_DSN. Without a DSN this file resolves
// to a no-op and the @sentry/react bundle is never fetched, so production
// builds without Sentry configured stay zero-cost. Drop a DSN into
// `.env.production.local` (and set SENTRY_AUTH_TOKEN at deploy time for
// sourcemap upload — see vite.config.js) to flip it on.
//
// CSP note: vercel.json + public/_headers already pre-list
// `https://*.ingest.sentry.io` and `https://*.ingest.us.sentry.io` in
// connect-src, so enabling Sentry does not need a header change.
export async function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  const Sentry = await import('@sentry/react');

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    // Tracing — sample 10% of transactions in production. Bump while
    // debugging then drop back to 0.1 to stay within free-tier quota.
    tracesSampleRate: 0.1,
    integrations: [Sentry.browserTracingIntegration()],
    // Filter the noisy framer-motion ResizeObserver loop warning that fires
    // on Safari but never breaks anything.
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications.',
    ],
  });
}
