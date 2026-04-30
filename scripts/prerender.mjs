// Post-build prerender. Boots `vite preview`, drives Puppeteer through every
// public route, and snapshots the fully-rendered HTML into the dist folder so
// each URL is served as static HTML to crawlers and AI agents.
//
// Usage: pnpm build && node scripts/prerender.mjs
// Requires: pnpm add -D puppeteer

import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');
const ROUTES = ['/', '/index', '/services', '/journal', '/about'];
const PORT = 4321;
const ORIGIN = `http://localhost:${PORT}`;

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 404) return;
    } catch {
      // not up yet
    }
    if (Date.now() - start > timeoutMs) {
      throw new Error(`server at ${url} did not become ready in ${timeoutMs}ms`);
    }
    await new Promise((r) => setTimeout(r, 250));
  }
}

async function isServerLive() {
  try {
    const res = await fetch(ORIGIN);
    return res.ok || res.status === 404;
  } catch {
    return false;
  }
}

async function startPreview() {
  // If something already serves the port (e.g. a leftover preview from a
  // previous run), reuse it instead of trying to spawn a duplicate.
  if (await isServerLive()) {
    // eslint-disable-next-line no-console
    console.log(`[prerender] reusing existing server at ${ORIGIN}`);
    return null;
  }

  const isWin = process.platform === 'win32';
  const child = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], {
    cwd: resolve(__dirname, '..'),
    stdio: ['ignore', 'pipe', 'pipe'],
    // Windows: .cmd shims (npx.cmd) require shell to launch correctly.
    shell: isWin,
  });

  child.stderr.on('data', (chunk) => {
    process.stderr.write(`[preview] ${chunk}`);
  });

  await waitForServer(ORIGIN);
  return child;
}

async function snapshot(browser, route) {
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (compatible; UngebautPrerender/1.0)');
  await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });

  // Pause briefly to let TextCascade & Framer settle into their final state.
  await new Promise((r) => setTimeout(r, 800));

  const html = await page.content();
  const outDir = route === '/' ? DIST : join(DIST, route.replace(/^\//, ''));
  await mkdir(outDir, { recursive: true });
  await writeFile(join(outDir, 'index.html'), html, 'utf8');

  await page.close();
  // eslint-disable-next-line no-console
  console.log(`[prerender] ${route} → ${outDir}/index.html`);
}

async function main() {
  // Lazy import so the script can be parsed even when puppeteer is missing.
  const puppeteer = (await import('puppeteer')).default;

  // Sanity-check the build exists.
  await readFile(join(DIST, 'index.html'), 'utf8').catch(() => {
    throw new Error('dist/index.html not found — run `pnpm build` first.');
  });

  const preview = await startPreview();
  const browser = await puppeteer.launch({ headless: 'new' });

  try {
    for (const route of ROUTES) {
      await snapshot(browser, route);
    }
  } finally {
    await browser.close();
    if (preview) preview.kill();
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
