import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

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

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), fontPreloadPlugin()],
  build: {
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
