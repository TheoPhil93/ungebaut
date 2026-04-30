import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
})
