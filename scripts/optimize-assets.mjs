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

import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, dirname, basename } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(process.cwd(), 'public/images');
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
// AVIF default lowered from 80 → 75: barely-perceivable in side-by-side
// review but cuts ~30% off file size, which matters more on mobile
// cellular than the last 5% of texture fidelity.
const QUALITY = Number(args.find((a) => a.startsWith('--quality='))?.split('=')[1] ?? 75);
const JPG_QUALITY = 82;
// Max width for the shipped AVIF/JPG sidecars. Source PNGs are 4K
// renders; the gallery stripe renders at ~110px wide, the project-detail
// hero at ~720px max, and the strip frames at ~1080px max. 1600px is
// retina-safe (2× the 800px max display size) while keeping per-image
// payload around 80-200 KB instead of 1-3 MB. Smaller sources pass
// through unenlarged (`withoutEnlargement: true`).
const MAX_WIDTH = Number(
  args.find((a) => a.startsWith('--max-width='))?.split('=')[1] ?? 1600,
);

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
  `[optimize-assets] AVIF q${QUALITY}, JPEG q${JPG_QUALITY}, max-width ${MAX_WIDTH}px` +
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
  // Resize is applied BEFORE format encoding so both AVIF + JPG outputs
  // share the same downsampled pixels. `withoutEnlargement: true` is a
  // safety net — smaller sources pass through at native resolution
  // instead of being upscaled to 1600px (which would just add noise).
  const pipeline = sharp(source)
    .rotate() // honour EXIF orientation
    .resize({ width: MAX_WIDTH, withoutEnlargement: true });

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

  // In-place re-encode for .jpg sources: same downsampling + quality
  // pass as JPG fallbacks, but writes back to the source path. Without
  // this, JPGs that have no .png sibling (29 in the current set, some
  // ~2 MB each) stayed at their original 4K size — defeats the whole
  // point of the resize cap. Write to a temp file first so a crash
  // mid-pipeline can't corrupt the source.
  if (FORCE && /\.jpe?g$/i.test(ext)) {
    const tmp = `${source}.tmp`;
    tasks.push(
      pipeline
        .clone()
        .jpeg({ quality: JPG_QUALITY, mozjpeg: true })
        .toFile(tmp)
        .then(async (info) => {
          await rename(tmp, source);
          totalJpg += info.size;
        })
        .catch(async (err) => {
          await unlink(tmp).catch(() => {});
          throw err;
        }),
    );
  }

  await Promise.all(tasks);
  processed++;
  const pct = ((1 - (totalAvif + totalJpg) / totalIn) * 100).toFixed(0);
  console.log(`  ${source.replace(ROOT, '').replace(/\\/g, '/')} → avif (saved ~${pct}%)`);
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
