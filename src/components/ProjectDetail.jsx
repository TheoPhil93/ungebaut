import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MassiveTitle } from './MassiveTitle';

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
    ...((project.sections || []).map((s) => s.image)),
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

function isVideoSrc(src = '') {
  return /\.(mp4|webm|mov)(\?|$)/i.test(src);
}

export function ProjectDetail({ project, onClose }) {
  const galleryItems = useMemo(() => buildProjectGallery(project), [project]);
  const heroSrc = galleryItems[0] || project.detailImage || project.image;
  const [heroRatio, setHeroRatio] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // SEO meta description while a project is open.
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    const previous = meta?.getAttribute('content');
    const next = `${project.client} — ${project.title}. ${project.description}`;
    if (meta) meta.setAttribute('content', next);
    return () => {
      if (meta && previous != null) meta.setAttribute('content', previous);
    };
  }, [project]);

  // Wheel-up at scrollTop = 0 closes the detail and returns to the gallery.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;
    let cooldown = false;
    const onWheel = (event) => {
      if (cooldown) return;
      const atTop = root.scrollTop <= 1;
      if (atTop && event.deltaY < -28) {
        event.preventDefault();
        cooldown = true;
        onClose();
        setTimeout(() => {
          cooldown = false;
        }, 600);
      }
    };
    root.addEventListener('wheel', onWheel, { passive: false });
    return () => root.removeEventListener('wheel', onWheel);
  }, [onClose]);

  // Probe natural aspect of hero so the figure renders at true proportions.
  useEffect(() => {
    if (!heroSrc) return;
    if (isVideoSrc(heroSrc)) {
      const v = document.createElement('video');
      v.preload = 'metadata';
      v.muted = true;
      v.src = heroSrc;
      v.addEventListener(
        'loadedmetadata',
        () => {
          const r = (v.videoWidth || 16) / (v.videoHeight || 9);
          setHeroRatio(r);
        },
        { once: true },
      );
    } else {
      const img = new Image();
      img.onload = () => {
        const r = (img.naturalWidth || 16) / (img.naturalHeight || 9);
        setHeroRatio(r);
      };
      img.src = heroSrc;
    }
  }, [heroSrc]);

  const ink = project.massiveInk || project.detailInk;
  const heroIsVideo = isVideoSrc(heroSrc);
  const titleText =
    project.massiveTitle ||
    (project.client === 'UNGEBAUT'
      ? project.title.toUpperCase()
      : project.client.toUpperCase());
  const detailTitleText = titleText.replace(/[ \u00a0]+/g, '');

  return (
    <motion.section
      ref={scrollRef}
      className="detail"
      style={{
        '--detail-bg': project.detailBg,
        '--detail-ink': ink,
        '--detail-accent': project.accent,
      }}
      initial={{ y: '100%' }}
      animate={{ y: '0%' }}
      exit={{ y: '100%' }}
      transition={{ duration: 1.05, ease }}
      aria-label={`${project.client} — ${project.title}`}
    >
      <motion.div
        className="detail__bg"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 1 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 1.05, ease }}
        aria-hidden="true"
      />

      <header className="detail__top">
        <span className="detail__crumb">
          {project.id} · {project.year}
        </span>
        <button
          type="button"
          className="detail__close"
          onClick={onClose}
          data-cursor="hover"
          aria-label="Close project"
        >
          <span className="detail__close-x" aria-hidden="true">×</span>
          <span className="detail__close-rule" aria-hidden="true" />
          <span className="detail__close-label">Projects</span>
        </button>
        <span className="detail__top-spacer" aria-hidden="true" />
      </header>

      {/* Hero composition — picture centred in the viewport (same horizontal
          and vertical anchor as the project card view). The title is an
          absolutely-positioned overlay that sits BEHIND the picture and
          builds in left-to-right via a clip-path wipe — no layout fly-in
          from the card-view title. */}
      <div className="detail__main">
        <motion.div
          className="detail__title-wrap"
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          animate={{ clipPath: 'inset(0 0% 0 0)' }}
          exit={{ clipPath: 'inset(0 100% 0 0)' }}
          transition={{
            clipPath: { duration: 1.05, ease, delay: 0.18 },
          }}
          aria-hidden="true"
        >
          <MassiveTitle
            text={detailTitleText}
            ink={ink}
            animate={false}
          />
        </motion.div>

        <motion.figure
          className="detail__hero"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 1.05, ease }}
          style={heroRatio ? { aspectRatio: String(heroRatio) } : undefined}
        >
          {heroIsVideo ? (
            <video src={heroSrc} autoPlay muted loop playsInline preload="auto" />
          ) : (
            <img src={heroSrc} alt="" loading="eager" />
          )}
        </motion.figure>
      </div>

      {/* Scrollable image strip beneath the hero — every additional frame
          from THIS project, stacked vertically and full-width. Replaces the
          old right-rail thumbnails. */}
      {galleryItems.length > 1 ? (
        <motion.section
          className="detail__strip"
          aria-label="More frames from this project"
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 1.05, ease, delay: 0.18 }}
        >
          <p className="detail__strip-heading">Selected frames</p>
          <ul className="detail__strip-list">
            {galleryItems.slice(1).map((src, i) => {
              const itemIsVideo = isVideoSrc(src);
              return (
                <motion.li
                  key={`${src}-${i}`}
                  className="detail__strip-item"
                  initial={{ opacity: 0, y: 80 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.95, ease, delay: i * 0.05 }}
                >
                  <figure className="detail__strip-figure">
                    {itemIsVideo ? (
                      <video src={src} autoPlay muted loop playsInline preload="metadata" />
                    ) : (
                      <img src={src} alt="" loading="lazy" />
                    )}
                    <figcaption className="detail__strip-caption">
                      <span className="detail__strip-num">{String(i + 2).padStart(2, '0')}</span>
                      <span>{project.title}</span>
                    </figcaption>
                  </figure>
                </motion.li>
              );
            })}
          </ul>
        </motion.section>
      ) : null}

      <motion.footer
        className="detail__footer"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.95, ease, delay: 0.24 }}
      >
        <div className="detail__footer-left">
          <span>Independent Studio</span>
          <span className="detail__footer-muted">Available {new Date().getFullYear()}</span>
        </div>

        <dl className="detail__meta-grid">
          <div className="detail__meta-row">
            <dt>A</dt>
            <dd className="detail__meta-key">Completed</dd>
            <dd className="detail__meta-val">{project.year}</dd>
          </div>
          <div className="detail__meta-row">
            <dt>B</dt>
            <dd className="detail__meta-key">Type</dd>
            <dd className="detail__meta-val">{project.tags[0] || '—'}</dd>
          </div>
          <div className="detail__meta-row">
            <dt>C</dt>
            <dd className="detail__meta-key">Role</dd>
            <dd className="detail__meta-val">Visualisation &amp; Direction</dd>
          </div>
          <div className="detail__meta-row">
            <dt>D</dt>
            <dd className="detail__meta-key">Client</dd>
            <dd className="detail__meta-val">{project.client}</dd>
          </div>
        </dl>

        <div className="detail__footer-cta">
          <span aria-hidden="true" className="detail__footer-arrow">↗</span>
          <span className="detail__footer-cta-label">View Site</span>
        </div>

        <p className="detail__seo">
          {project.description}
          {project.location ? ` Located in ${project.location}.` : ''}
        </p>
      </motion.footer>
    </motion.section>
  );
}
