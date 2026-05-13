import { toAvif, toJpgFallback } from '../lib/image';

// <picture> wrapper that ships an AVIF source + a JPG raster as fallback.
// Browsers that can decode AVIF pick the small file (~85-92% smaller for
// our hero PNGs); Safari ≤16.3 falls back to the JPG.
//
// Usage matches a plain <img>: pass `src` (the original path, e.g. .png),
// `alt`, plus any other img attribute. We pass through extra props to the
// fallback <img> so loading/decoding/className/sizes all work as expected.
//
// Path resolution:
//   - .png input → AVIF source + JPG fallback (both shipped, .png stays
//     local-only as the renderer source)
//   - .jpg input → AVIF source + JPG fallback (unchanged)
//   - already-AVIF or unsupported extension → plain <img>
export function Picture({ src, alt = '', ...rest }) {
  if (!src) return null;
  const avifSrc = toAvif(src);
  const fallbackSrc = toJpgFallback(src);
  // No swap happened (already AVIF or unsupported extension) — render plain
  // <img> to keep the DOM minimal.
  if (avifSrc === src) {
    return <img src={fallbackSrc} alt={alt} {...rest} />;
  }
  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <img src={fallbackSrc} alt={alt} {...rest} />
    </picture>
  );
}
