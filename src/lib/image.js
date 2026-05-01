// Asset format helpers. Sources still reference the original PNG/JPG paths
// (so projects.js stays format-agnostic); the helpers below resolve the best
// format the current browser can decode at runtime.

const EXT = /\.(png|jpe?g)$/i;

// Swap extension to .avif. Returns the input untouched if it doesn't end in
// a raster extension (e.g. .mp4, already .avif, weird path).
export function toAvif(path) {
  if (!path || !EXT.test(path)) return path;
  return path.replace(EXT, '.avif');
}

// One-shot AVIF support probe. Browsers that ship native AVIF decode return
// a successful load; older Safari (≤16.3) errors out. Result is cached so
// every subsequent call resolves instantly.
//
// `avifSupportedSync` mirrors the resolved promise value for synchronous
// readers (consumers that set img.src on the same tick they decide). It stays
// `null` until the probe resolves; resolveAvifSupport() (called from main.jsx)
// awaits the promise before React mounts so GalleryGL sees a definite value
// when it kicks off its first texture loads.
let avifProbe;
let avifSupportedSync = null;
export function detectAvifSupport() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (avifProbe) return avifProbe;
  avifProbe = new Promise((resolve) => {
    const img = new Image();
    // Use img.decode() so we know the AVIF actually decoded — onload alone
    // can fire before width/height are populated (Chrome does decode async
    // for some image formats), which made the previous width===1 check
    // intermittently false even when AVIF was supported. decode() rejects
    // when the format is unsupported, which is the signal we care about.
    img.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK';
    img
      .decode()
      .then(() => resolve(true))
      .catch(() => resolve(false));
  }).then((ok) => {
    avifSupportedSync = ok;
    return ok;
  });
  return avifProbe;
}

// Synchronous accessor for code paths that can't await (image.src assignment
// in a render loop). Returns `false` while the probe is in flight or if it
// hasn't been kicked off — callers must trigger detectAvifSupport() at boot
// to get a meaningful answer.
export function getAvifSupport() {
  return avifSupportedSync === true;
}

// Bounded wait used by main.jsx — gives the probe up to `timeoutMs` to
// resolve, then proceeds regardless. Prevents a stuck probe from blocking
// React from rendering. The 64-byte data URI typically resolves in <5ms.
export function resolveAvifSupport(timeoutMs = 100) {
  return Promise.race([
    detectAvifSupport(),
    new Promise((resolve) => setTimeout(() => resolve(false), timeoutMs)),
  ]);
}

// Resolve a path against the user's decode capabilities. Returns AVIF when
// supported, original otherwise. Awaits the probe on first call only.
export async function pickBestImage(path) {
  const supports = await detectAvifSupport();
  return supports ? toAvif(path) : path;
}

// Swap any source video (mp4/mov/webm/m4v) to its `.web.mp4` re-encoded
// sidecar (H.264 capped at 3 Mbps with audio stripped — see
// scripts/optimize-videos.mjs). The originals stay in the source tree so
// designers can reach them; only the .web.mp4 ever ships to the browser.
//
// Important: ProRes/HEVC .mov files don't decode in Chrome at all and
// stream as multi-MB partial fetches in Safari, so the swap is correctness,
// not just optimization.
const VIDEO_EXT = /\.(mp4|mov|webm|m4v)$/i;
export function toWebVideo(path) {
  if (!path || !VIDEO_EXT.test(path) || /\.web\.mp4$/i.test(path)) return path;
  return path.replace(VIDEO_EXT, '.web.mp4');
}
