import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Picture } from './Picture';
import { isVideoSrc, toWebVideo } from '../lib/image';

// Aristide's `o6` (expo-out) approximated as cubic-bezier — see HomeView.
const ease = [0.16, 1, 0.3, 1];

// Build the gallery scroll-strip from THIS project's own assets — main
// image, detail image, any explicit `gallery` array, and `sections` thumbs.
// Deduplicated. When the project has only one asset we reuse it a few
// times so the strip below the hero still reads as a sequence.
function buildProjectGallery(project, max = 8, minPad = 4) {
  const candidates = [
    ...(project.gallery || []),
    project.detailImage,
    project.image,
    ...(project.sections || []).map((s) => s.image),
  ].filter(Boolean);
  const seen = new Set();
  const unique = [];
  for (const src of candidates) {
    if (seen.has(src)) continue;
    seen.add(src);
    unique.push(src);
    if (unique.length >= max) break;
  }
  if (unique.length === 1) {
    return Array.from({ length: minPad }, () => unique[0]);
  }
  return unique;
}

// Scrollable image strip beneath the hero — every additional frame from
// THIS project, stacked vertically and full-width. Renders nothing when the
// project has only one frame (the hero already shows it).
export function ProjectStrip({ project }) {
  const galleryItems = useMemo(() => buildProjectGallery(project), [project]);

  if (galleryItems.length <= 1) return null;

  return (
    <motion.section
      className="proj-strip"
      aria-label="More frames from this project"
      initial={{ y: 120, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ duration: 1.05, ease, delay: 0.18 }}
    >
      <p className="proj-strip__heading">Selected frames</p>
      <ul className="proj-strip__list">
        {galleryItems.slice(1).map((src, i) => {
          const itemIsVideo = isVideoSrc(src);
          return (
            <motion.li
              key={`${src}-${i}`}
              className="proj-strip__item"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.95, ease, delay: i * 0.05 }}
            >
              <figure className="proj-strip__figure">
                {itemIsVideo ? (
                  <video
                    src={toWebVideo(src)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <Picture src={src} alt="" loading="lazy" />
                )}
                <figcaption className="proj-strip__caption">
                  <span className="proj-strip__num">{String(i + 2).padStart(2, '0')}</span>
                  <span>{project.title}</span>
                </figcaption>
              </figure>
            </motion.li>
          );
        })}
      </ul>
    </motion.section>
  );
}
