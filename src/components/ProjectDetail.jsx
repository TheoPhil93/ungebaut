import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MassiveTitle } from './MassiveTitle';
import { Picture } from './Picture';
import { ProjectStrip } from './ProjectStrip';
import { ProjectFooterMeta } from './ProjectFooterMeta';
import { isVideoSrc, toWebVideo } from '../lib/image';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Aristide's `o6` (expo-out) approximated as cubic-bezier — see HomeView.
const ease = [0.16, 1, 0.3, 1];

export function ProjectDetail({ project, onClose }) {
  const reduced = usePrefersReducedMotion();
  // Mirrors `buildProjectGallery`'s ordering (gallery → detailImage → image)
  // so the hero matches strip frame #1 without depending on the strip helper.
  const heroSrc =
    (project.gallery && project.gallery[0]) || project.detailImage || project.image;
  const [heroRatio, setHeroRatio] = useState(null);
  const scrollRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ProjectDetail is a takeover view — without explicit focus management
  // keyboard users land on whatever was focused before, often hidden behind
  // the panel. Move focus to the close button on mount so Tab + Escape are
  // the natural exit. rAF gives the slide-in motion a frame to start before
  // the focus ring appears, which avoids a jarring focus-then-animate flicker.
  useEffect(() => {
    const id = requestAnimationFrame(() => closeRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, []);

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
          ref={closeRef}
          type="button"
          className="detail__close"
          onClick={onClose}
          data-cursor="hover"
          aria-label="Close project"
        >
          <span className="detail__close-x" aria-hidden="true">
            ×
          </span>
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
          initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }}
          animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0% 0 0)' }}
          exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }}
          transition={
            reduced
              ? { duration: 0.3, ease }
              : { clipPath: { duration: 1.05, ease, delay: 0.18 } }
          }
          aria-hidden="true"
        >
          <MassiveTitle text={detailTitleText} ink={ink} animate={false} />
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
            <video
              src={toWebVideo(heroSrc)}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
            />
          ) : (
            <Picture src={heroSrc} alt="" loading="eager" />
          )}
        </motion.figure>
      </div>

      <ProjectStrip project={project} />

      <ProjectFooterMeta project={project} />
    </motion.section>
  );
}
