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
let avifProbe;
export function detectAvifSupport() {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (avifProbe) return avifProbe;
  avifProbe = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1 && img.height === 1);
    img.onerror = () => resolve(false);
    // 64-byte AV1 still — minimum viable AVIF the spec allows.
    img.src =
      'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK';
  });
  return avifProbe;
}

// Resolve a path against the user's decode capabilities. Returns AVIF when
// supported, original otherwise. Awaits the probe on first call only.
export async function pickBestImage(path) {
  const supports = await detectAvifSupport();
  return supports ? toAvif(path) : path;
}

// Swap an .mp4 source to its `.web.mp4` re-encoded sidecar (H.264 capped at
// 3 Mbps with audio stripped — see scripts/optimize-videos.mjs). The
// originals stay in the source tree so designers can reach them; only the
// .web.mp4 ever ships to the browser.
const VIDEO_EXT = /\.mp4$/i;
export function toWebVideo(path) {
  if (!path || !VIDEO_EXT.test(path) || /\.web\.mp4$/i.test(path)) return path;
  return path.replace(VIDEO_EXT, '.web.mp4');
}
