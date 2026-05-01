import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

// `eslint-config-prettier` is appended LAST so it disables every ESLint rule
// that overlaps with Prettier's own formatting decisions. This keeps the two
// tools out of each other's way: Prettier owns layout, ESLint owns logic.
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // Build config + Node scripts run under Node, not in the browser. Without
    // this override `process`/`__dirname`/etc. trip the no-undef rule.
    files: ['vite.config.js', 'playwright.config.js', 'scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: { ...globals.node, ...globals.es2022 },
    },
  },
]);
