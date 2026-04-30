import { useState } from 'react';
import { motion } from 'framer-motion';
import { projects } from '../data/projects';
import { SeoHead } from './SeoHead';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const ARROW = '→';
const COLLAPSED = 68;
const EXPANDED = 320;
const VIDEO_RE = /\.(mp4|mov|webm)$/i;

const SPRING = { type: 'spring', stiffness: 280, damping: 32, mass: 0.9 };
const EASE = [0.23, 1, 0.32, 1];

export function IndexView({ onSelect }) {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(null);

  const handleSelect = (project) => {
    if (onSelect) onSelect(project);
  };

  const handleKey = (e, project) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(project);
    }
  };

  return (
    <section className="view index" aria-label="Werkverzeichnis">
      <SeoHead
        title="UNGEBAUT — Werkverzeichnis"
        description="Vollständiges Werkverzeichnis von UNGEBAUT — ausgewählte Architekturvisualisierungen für Architekten, Entwickler und Marken in der Schweiz und Europa."
        path="/index"
      />
      <header>
        <p className="index__heading">Selected work — 2018 / 2024</p>
      </header>

      <ol className="index__list">
        {projects.map((project, i) => {
          const isHovered = hovered === i;
          const isOther = hovered !== null && !isHovered;
          const isVideo = VIDEO_RE.test(project.image || '');

          const rowAnim = reduced
            ? { opacity: isOther ? 0.55 : 1 }
            : {
                height: isHovered ? EXPANDED : COLLAPSED,
                opacity: isOther ? 0.38 : 1,
              };

          return (
            <motion.li
              key={project.id}
              className="index__row"
              style={{ '--row-accent': project.accent }}
              data-cursor="label"
              data-cursor-label="View"
              data-hovered={isHovered ? 'true' : 'false'}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(project)}
              onKeyDown={(e) => handleKey(e, project)}
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered((curr) => (curr === i ? null : curr))}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered((curr) => (curr === i ? null : curr))}
              initial={false}
              animate={rowAnim}
              transition={{
                height: SPRING,
                opacity: { duration: 0.22, ease: 'easeOut' },
              }}
            >
              <motion.div
                className="index__row-media"
                aria-hidden="true"
                initial={false}
                animate={
                  reduced
                    ? { opacity: isHovered ? 1 : 0 }
                    : {
                        opacity: isHovered ? 1 : 0,
                        scale: isHovered ? 1 : 1.06,
                      }
                }
                transition={{
                  opacity: { duration: 0.45, ease: EASE },
                  scale: { duration: 0.55, ease: EASE },
                }}
              >
                {isVideo ? (
                  <video
                    src={project.image}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    autoPlay={isHovered}
                  />
                ) : (
                  <img src={project.image} alt="" loading="lazy" decoding="async" />
                )}
                <span className="index__row-media-shade" />
              </motion.div>

              <span className="index__row-content">
                <span className="index__row-num">
                  {String(project.id).padStart(3, '0')}
                </span>
                <span className="index__row-client">{project.client}</span>
                <span className="index__row-title">{project.title}</span>
                <span className="index__row-year">
                  {project.year} <span aria-hidden="true">{ARROW}</span>
                </span>
              </span>

              {project.description ? (
                <motion.span
                  className="index__row-desc"
                  aria-hidden={!isHovered}
                  initial={false}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    x: reduced ? 0 : isHovered ? 0 : -8,
                  }}
                  transition={{
                    duration: 0.3,
                    delay: isHovered ? 0.12 : 0,
                    ease: 'easeOut',
                  }}
                >
                  — {project.description}
                </motion.span>
              ) : null}
            </motion.li>
          );
        })}
      </ol>
    </section>
  );
}
