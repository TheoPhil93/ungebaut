// Stamp <lastmod> on every URL in public/sitemap.xml to today's date.
//
// Search engines treat lastmod as a hint for re-crawl prioritisation. For a
// site this size, bumping every route on each production build is fine — the
// alternative (per-route git log lookups) adds complexity for negligible
// SEO gain. If a route ever needs a hard-pinned date, exempt it manually
// here.
//
// Wired into `pnpm build:prerender`. Manual run: `pnpm sync-sitemap`.
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const SITEMAP = resolve(process.cwd(), 'public/sitemap.xml');
const today = new Date().toISOString().slice(0, 10);

const xml = await readFile(SITEMAP, 'utf8');
const next = xml.replace(/<lastmod>.*?<\/lastmod>/g, `<lastmod>${today}</lastmod>`);

if (xml !== next) {
  await writeFile(SITEMAP, next);
  console.log(`[sync-sitemap] lastmod stamped → ${today}`);
} else {
  console.log(`[sync-sitemap] already current (${today})`);
}
