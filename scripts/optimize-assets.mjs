// One-shot asset pipeline: walks public/images/projects/** and emits AVIF +
// JPEG sidecars next to every PNG/JPG. Originals stay untouched so anyone
// can re-run with different quality settings.
//
// Output: <name>.avif (q80, ~85-92% smaller) + <name>.jpg (q85, fallback for
// Safari < 16.3). The <picture> element in projectImage.jsx picks the best
// available format per browser. PNGs that already have transparency keep a
// .png fallback instead of .jpg — only photographs get the JPEG conversion.
//
// Run: pnpm optimize-assets
//      pnpm optimize-assets -- --quality=85   (override AVIF quality)
//      pnpm optimize-assets -- --force        (regenerate even if up-to-date)

import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, dirname, basename } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(process.cwd(), 'public/images');
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const QUALITY = Number(
  args.find((a) => a.startsWith('--quality='))?.split('=')[1] ?? 80,
);
const JPG_QUALITY = 85;

// Walk recursively, returning every PNG/JPG/JPEG file path.
async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (/\.(png|jpe?g)$/i.test(entry.name)) {
      yield full;
    }
  }
}

// Collect every source path first so we can detect collisions: if both
// thumb-2.png and thumb-2.jpg exist, the PNG must NOT emit a JPG fallback,
// or we'd clobber a hand-curated sibling.
async function collectSources() {
  const set = new Set();
  for await (const p of walk(ROOT)) set.add(p.toLowerCase());
  return set;
}
const ALL_SOURCES = await collectSources();

// True when the sidecar exists AND is newer than the source. With --force,
// always regenerate.
async function isFresh(source, sidecar) {
  if (FORCE || !existsSync(sidecar)) return false;
  const [s, t] = await Promise.all([stat(source), stat(sidecar)]);
  return t.mtimeMs >= s.mtimeMs;
}

let totalIn = 0;
let totalAvif = 0;
let totalJpg = 0;
let processed = 0;
let skipped = 0;

console.log(
  `[optimize-assets] AVIF q${QUALITY}, JPEG q${JPG_QUALITY}` +
    (FORCE ? ' (force regenerate)' : ''),
);

for await (const source of walk(ROOT)) {
  const ext = extname(source);
  const base = basename(source, ext);
  const dir = dirname(source);
  const avifPath = resolve(dir, `${base}.avif`);
  const jpgPath = resolve(dir, `${base}.jpg`);

  const sourceStat = await stat(source);
  totalIn += sourceStat.size;

  const avifFresh = await isFresh(source, avifPath);
  // Emit JPEG fallback only when:
  //   1. Source isn't already a .jpg/.jpeg
  //   2. No independent .jpg sibling exists (would clobber hand-curated asset)
  const wantsJpgFallback =
    !/\.jpe?g$/i.test(ext) && !ALL_SOURCES.has(jpgPath.toLowerCase());
  const jpgFresh = !wantsJpgFallback || (await isFresh(source, jpgPath));

  if (avifFresh && jpgFresh) {
    skipped++;
    continue;
  }

  // Sharp's pipeline reads once, encodes twice — cheaper than two open()s.
  const pipeline = sharp(source).rotate(); // honour EXIF orientation

  const tasks = [];
  if (!avifFresh) {
    tasks.push(
      pipeline
        .clone()
        .avif({ quality: QUALITY, effort: 6 })
        .toFile(avifPath)
        .then((info) => {
          totalAvif += info.size;
        }),
    );
  }
  if (wantsJpgFallback && !jpgFresh) {
    tasks.push(
      pipeline
        .clone()
        .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
        .toFile(jpgPath)
        .then((info) => {
          totalJpg += info.size;
        }),
    );
  }

  await Promise.all(tasks);
  processed++;
  const pct = ((1 - (totalAvif + totalJpg) / totalIn) * 100).toFixed(0);
  console.log(
    `  ${source.replace(ROOT, '').replace(/\\/g, '/')} → avif (saved ~${pct}%)`,
  );
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `\n[optimize-assets] processed ${processed}, skipped ${skipped} (already fresh)`,
);
console.log(
  `  source ${mb(totalIn)} MB → avif ${mb(totalAvif)} MB + jpg ${mb(
    totalJpg,
  )} MB = ${mb(totalAvif + totalJpg)} MB total ` +
    `(${((1 - (totalAvif + totalJpg) / totalIn) * 100).toFixed(0)}% smaller)`,
);
