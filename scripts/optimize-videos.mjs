// Re-encode every .mp4 under public/images/ at a web-friendly bitrate.
// Originals stay; output sidecar is `<name>.web.mp4` so we can A/B and
// reroute consumers when satisfied.
//
// Pipeline rationale:
//   - H.264 universal compat (every browser since IE9). HEVC/AV1 would be
//     smaller but Firefox can't decode HEVC and Safari ≤16 can't decode AV1.
//   - CRF 23 + preset slow: visually lossless on photographic timelapse
//     content at 30-40% of typical ProRes/H.264 high-bitrate output.
//   - -maxrate 3M + -bufsize 6M: cap bitrate so the rare frame doesn't
//     spike to 12 Mbps. Below 3 Mbps you start to see block artefacts on
//     pan-heavy clips.
//   - -movflags +faststart: moov atom at the front so a player can begin
//     decoding before the whole file is downloaded.
//   - -an: strip audio. Every gallery video loops silent; saves a couple
//     hundred KB per clip and prevents browsers from allocating an audio
//     decoder for nothing.
//
// Run: pnpm optimize-videos
//      pnpm optimize-videos -- --crf=20  (higher quality, larger file)
//      pnpm optimize-videos -- --force   (regenerate even if up-to-date)

import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, extname, dirname, basename } from 'node:path';
import { spawn } from 'node:child_process';

const ROOT = resolve(process.cwd(), 'public/images');
const args = process.argv.slice(2);
const FORCE = args.includes('--force');
const CRF = Number(args.find((a) => a.startsWith('--crf='))?.split('=')[1] ?? 23);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    // Catch every common upload format the design tools spit out. Skip
    // .web.mp4 to avoid re-encoding our own outputs on rerun.
    else if (/\.(mp4|mov|webm|m4v)$/i.test(entry.name) && !/\.web\.mp4$/i.test(entry.name))
      yield full;
  }
}

async function isFresh(source, sidecar) {
  if (FORCE || !existsSync(sidecar)) return false;
  const [s, t] = await Promise.all([stat(source), stat(sidecar)]);
  return t.mtimeMs >= s.mtimeMs;
}

function encode(input, output) {
  return new Promise((res, rej) => {
    const args = [
      '-hide_banner',
      '-loglevel',
      'error',
      '-y',
      '-i',
      input,
      '-c:v',
      'libx264',
      '-preset',
      'slow',
      '-crf',
      String(CRF),
      '-maxrate',
      '3M',
      '-bufsize',
      '6M',
      '-pix_fmt',
      'yuv420p',
      '-movflags',
      '+faststart',
      '-an',
      output,
    ];
    const child = spawn('ffmpeg', args, { stdio: ['ignore', 'pipe', 'inherit'] });
    child.on('error', rej);
    child.on('close', (code) =>
      code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`)),
    );
  });
}

let totalIn = 0;
let totalOut = 0;
let processed = 0;
let skipped = 0;

console.log(`[optimize-videos] H.264 CRF ${CRF}, max 3 Mbps, audio stripped`);

for await (const source of walk(ROOT)) {
  const ext = extname(source);
  const base = basename(source, ext);
  const dir = dirname(source);
  const out = resolve(dir, `${base}.web.mp4`);

  const sourceStat = await stat(source);
  totalIn += sourceStat.size;

  if (await isFresh(source, out)) {
    skipped++;
    continue;
  }

  const rel = source.replace(ROOT, '').replace(/\\/g, '/');
  process.stdout.write(`  ${rel} → encoding... `);
  const t0 = Date.now();
  try {
    await encode(source, out);
  } catch (err) {
    console.error(`\n[optimize-videos] failed on ${rel}:`, err.message);
    process.exit(1);
  }
  const outSize = (await stat(out)).size;
  totalOut += outSize;
  processed++;
  const pct = ((1 - outSize / sourceStat.size) * 100).toFixed(0);
  console.log(`done in ${((Date.now() - t0) / 1000).toFixed(1)}s, saved ~${pct}%`);
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
console.log(
  `\n[optimize-videos] processed ${processed}, skipped ${skipped} (already fresh)`,
);
if (processed > 0) {
  console.log(
    `  source ${mb(totalIn)} MB → web ${mb(totalOut)} MB ` +
      `(${((1 - totalOut / totalIn) * 100).toFixed(0)}% smaller)`,
  );
}
