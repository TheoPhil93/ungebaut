import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

/**
 * Inject a <link rel="preload"> for the LCP-rendering font face. Vite
 * already module-preloads the JS chunks but not woff2 assets, so without
 * this the browser only discovers the font URL after the CSS bundle has
 * been parsed — costing roughly one round-trip on the LCP path.
 *
 * The LCP element is `.home__role` ("ARCHITECTURAL VISUALISATION") which
 * uses Inter 400 latin. Preloading that one face is the highest-leverage
 * preload; other faces lazy-load via the normal CSS dependency chain.
 */
function fontPreloadPlugin() {
  return {
    name: 'inject-font-preload',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle || {};
        const fontFile = Object.keys(bundle).find(
          (k) => k.includes('inter-latin-400-normal') && k.endsWith('.woff2'),
        );
        if (!fontFile) return html;
        const link =
          `<link rel="preload" href="/${fontFile}" as="font" ` +
          `type="font/woff2" crossorigin="anonymous">`;
        return html.replace('</head>', `    ${link}\n  </head>`);
      },
    },
  };
}

// Sentry sourcemap upload — only runs when SENTRY_AUTH_TOKEN is present at
// build time. Without the token the plugin is a no-op, so dev/CI builds
// don't fail when Sentry is not yet configured. Wire SENTRY_ORG /
// SENTRY_PROJECT / SENTRY_AUTH_TOKEN as deploy-host environment variables
// to flip it on (see #33).
const sentryPlugins = process.env.SENTRY_AUTH_TOKEN
  ? [
      sentryVitePlugin({
        org: process.env.SENTRY_ORG,
        project: process.env.SENTRY_PROJECT,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        sourcemaps: { assets: './dist/**' },
      }),
    ]
  : [];

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fontPreloadPlugin(), ...sentryPlugins],
  test: {
    // happy-dom is ~3× faster than jsdom for hook tests and ships the same
    // window/history/location surface that useUrlSync needs.
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    // e2e/ is Playwright (different runner) — explicitly excluded so vitest
    // doesn't try to import @playwright/test specs.
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
  build: {
    // Sentry needs sourcemaps to symbolicate stack traces. Hidden mode
    // emits the .map files for upload but keeps the //# sourceMappingURL
    // out of the bundle — production users never download them.
    sourcemap: 'hidden',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/ogl/')) return 'ogl';
          if (id.includes('/framer-motion/') || id.includes('/motion-')) return 'framer';
          if (id.includes('/react-dom/')) return 'react-dom';
          if (id.includes('/react/') || id.includes('/scheduler/')) return 'react';
        },
      },
    },
  },
});
