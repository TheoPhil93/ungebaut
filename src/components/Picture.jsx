import { toAvif } from '../lib/image';

// <picture> wrapper that ships an AVIF source + the original raster as
// fallback. Browsers that can decode AVIF pick the small file (~85-92%
// smaller for our hero PNGs); Safari ≤16.3 falls back to the original.
//
// Usage matches a plain <img>: pass `src` (the original path, e.g. .png),
// `alt`, plus any other img attribute. We pass through extra props to the
// fallback <img> so loading/decoding/className/sizes all work as expected.
export function Picture({ src, alt = '', ...rest }) {
  if (!src) return null;
  const avifSrc = toAvif(src);
  // No swap happened (already AVIF or unsupported extension) — render plain
  // <img> to keep the DOM minimal.
  if (avifSrc === src) {
    return <img src={src} alt={alt} {...rest} />;
  }
  return (
    <picture>
      <source srcSet={avifSrc} type="image/avif" />
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
}
