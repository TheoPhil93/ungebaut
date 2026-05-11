import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const GalleryGL = lazy(() => import('./GalleryGL').then((m) => ({ default: m.GalleryGL })));
import { MassiveTitle } from './MassiveTitle';
import { ProjectStrip } from './ProjectStrip';
import { ProjectFooterMeta } from './ProjectFooterMeta';
import { projects, getProject } from '../data/projects';
import { SeoHead } from './SeoHead';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const TICK_TOTAL = 32;
const EASE = [0.16, 1, 0.3, 1];

const REVEAL_CONTAINER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};
const REVEAL_LINE = {
  hidden: { y: '-110%' },
  visible: { y: '0%', transition: { duration: 0.7, ease: EASE } },
  exit: { y: '-110%', transition: { duration: 0.35, ease: EASE } },
};

function pad(n) {
  return String(n).padStart(2, '0');
}

function splitDescLines(text) {
  if (!text) return [];
  const trimmed = text.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/(?<=[—,.])\s+/).filter(Boolean);
  if (parts.length <= 1) return [trimmed];
  if (parts.length <= 3) return parts;
  const groupSize = Math.ceil(parts.length / 3);
  const out = [];
  for (let i = 0; i < parts.length; i += groupSize) {
    out.push(parts.slice(i, i + groupSize).join(' '));
  }
  return out;
}

// Issue 04 will replace this inline helper with `splitTitleForMorph` from
// `src/lib/title.js`. For now, the de-spaced title at the top of Section 2
// renders as static text using the same regex ProjectDetail used.
// Strip plain spaces + non-breaking spaces from a title string. Written
// with \u escapes so ESLint's no-irregular-whitespace rule doesn't trip
// on a literal NBSP inside the regex character class.
function despaceTitle(text) {
  return (text || '').replace(/[ \u00a0]+/g, '');
}

export function HomeView({ onSelect, selectedId }) {
  const reduced = usePrefersReducedMotion();
  const [hoveredId, setHoveredId] = useState(null);
  const hovered = hoveredId ? getProject(hoveredId) : null;
  const selected = selectedId ? getProject(selectedId) : null;
  const focused = selected || hovered;

  const stageRef = useRef(null);
  const section2Ref = useRef(null);
  const stickyCloseRef = useRef(null);

  const [previousSelectedId, setPreviousSelectedId] = useState(selectedId);
  if (previousSelectedId !== selectedId) {
    setPreviousSelectedId(selectedId);
  }
  const isSwitchingSelected =
    Boolean(selectedId) && Boolean(previousSelectedId) && previousSelectedId !== selectedId;

  const bgColor = selected ? selected.detailBg : '#f4f0e8';
  const selectedInk = selected ? selected.massiveInk || selected.detailInk : null;
  const fgInk = selectedInk || 'rgba(11, 11, 11, 0.85)';

  // Whole-page text recolour when a project is open.
  useEffect(() => {
    const root = document.documentElement;
    if (selected) {
      root.style.setProperty('--fg', fgInk);
      root.style.setProperty('--muted', fgInk + 'aa');
      root.style.setProperty('--bg', selected.detailBg);
    } else {
      root.style.removeProperty('--fg');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--bg');
    }
    return () => {
      root.style.removeProperty('--fg');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--bg');
    };
  }, [fgInk, selected]);

  const focusedIndex = useMemo(() => {
    if (!focused) return -1;
    return projects.findIndex((p) => p.id === focused.id);
  }, [focused]);

  const displayIndex = focusedIndex >= 0 ? focusedIndex + 1 : 1;

  // Browse-mode keyboard activation (Enter/Space picks the hovered card).
  useEffect(() => {
    const onKey = (event) => {
      if (!hovered || selected) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onSelect?.(hovered);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hovered, onSelect, selected]);

  // Selection-mode close affordances — ESC, sticky × button, wheel-up at top.
  // Ported from the now-retired ProjectDetail panel + App.jsx ESC handler.
  useEffect(() => {
    if (!selected) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') onSelect?.(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, onSelect]);

  // Wheel-up at scrollY <= 1 closes the project (600ms cooldown to avoid
  // chained closes on a single inertial scroll). Listens on window since
  // the unified scroll stack uses native window scroll, not a panel.
  useEffect(() => {
    if (!selected) return undefined;
    let cooldown = false;
    const onWheel = (event) => {
      if (cooldown) return;
      const atTop = window.scrollY <= 1;
      if (atTop && event.deltaY < -28) {
        event.preventDefault();
        cooldown = true;
        onSelect?.(null);
        setTimeout(() => {
          cooldown = false;
        }, 600);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [selected, onSelect]);

  // Move focus to the sticky × on selection mount so Tab + Escape are the
  // natural exit (a11y commit 7bdeba2 for the prior panel).
  useEffect(() => {
    if (!selected) return undefined;
    const id = requestAnimationFrame(() => stickyCloseRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [selected]);

  // SEO meta — title + description while a project is open. Restored on
  // close. Consolidated from the prior App.jsx title effect and
  // ProjectDetail's meta-description effect.
  useEffect(() => {
    if (!selected) return undefined;
    const previousTitle = document.title;
    document.title = `${selected.client} — ${selected.title} · UNGEBAUT`;
    const meta = document.querySelector('meta[name="description"]');
    const previousMeta = meta?.getAttribute('content');
    const next = `${selected.client} — ${selected.title}. ${selected.description}`;
    if (meta) meta.setAttribute('content', next);
    return () => {
      document.title = previousTitle;
      if (meta && previousMeta != null) meta.setAttribute('content', previousMeta);
    };
  }, [selected]);

  // Reset window scroll on selection change so each newly-opened project
  // lands at Section 1's hero, not whatever scroll position the previous
  // one had reached.
  useEffect(() => {
    if (selected) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [selected]);

  const exploreSection2 = () => {
    section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const titleText = selected
    ? selected.massiveTitle ||
      (selected.client === 'UNGEBAUT'
        ? selected.title.toUpperCase()
        : selected.client.toUpperCase())
    : '';
  const despacedTitleText = despaceTitle(titleText);
  const sectionInk = selected ? selected.massiveInk || selected.detailInk : null;

  return (
    <section
      className={`home${selected ? ' home--selected home--scroll' : ''}`}
      ref={stageRef}
      aria-label="Gallery — selected work"
      style={{
        '--home-bg': bgColor,
        '--home-ink': fgInk,
        ...(selected
          ? {
              '--detail-bg': selected.detailBg,
              '--detail-ink': sectionInk,
              '--detail-accent': selected.accent,
            }
          : {}),
      }}
    >
      <SeoHead
        title="UNGEBAUT — Architekturvisualisierung, Zürich"
        description="Architekturvisualisierungs-Studio in Zürich, gegründet 2021 von Philippos und Luna Theofanidis. Fotorealistische Renderings, 3D-Design, Animation, VR/AR und Drohnen-Dokumentation für Architekten, Entwickler und Marken in der Schweiz und Europa."
        path="/"
      />

      <motion.div
        className="home__bg"
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 0.7, ease: EASE }}
        aria-hidden="true"
      />

      {/* Sticky chrome — counter, ticks, focused project label. The wrapper
          stays passive when idle (see CSS `display: contents`); when the
          .home--scroll mode is on it becomes a sticky strip that persists
          across both sections. */}
      <div className="home__sticky-chrome">
        <div className="home__top" aria-hidden="true">
          <div className="home__counter">
            <span>{pad(displayIndex)}</span>
            <span className="home__counter-frame" />
            <span className="home__counter-total">{pad(projects.length)}</span>
          </div>
          <ProgressTicks
            total={TICK_TOTAL}
            activeRatio={(displayIndex - 1) / Math.max(1, projects.length - 1)}
          />
          <span className="home__top-label">{focused ? focused.client : ''}</span>
        </div>
      </div>

      {/* Sticky × — visible only while a project is selected. Replaces the
          old in-section .home__close which is now retired. */}
      {selected ? (
        <button
          ref={stickyCloseRef}
          type="button"
          className="home__sticky-close"
          onClick={(event) => {
            event.stopPropagation();
            onSelect?.(null);
          }}
          aria-label="Close project"
          data-cursor="hover"
        >
          <span aria-hidden="true">×</span>
        </button>
      ) : null}

      <div className="home__section home__section--hero">
        <div className="home__gl" data-cursor={hovered ? 'gallery' : undefined}>
          <Suspense fallback={null}>
            <GalleryGL
              onSelect={onSelect}
              onHoverChange={setHoveredId}
              selectedId={selectedId}
              hoveredId={hoveredId}
            />
          </Suspense>
        </div>

        <AnimatePresence>
          {selected ? (
            <motion.div
              key="selected-layer"
              className="home__expand home__expand--lean"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              aria-hidden="true"
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={selected.id}
                  className="home__expand-title-wrap"
                  layoutId={`massive-title-${selected.id}`}
                  initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 100% 0 0)' }}
                  animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0% 0 0)' }}
                  exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 0 100%)' }}
                  transition={
                    reduced
                      ? { duration: 0.3, ease: EASE }
                      : {
                          clipPath: {
                            duration: isSwitchingSelected ? 1.05 : 1.15,
                            ease: EASE,
                            delay: isSwitchingSelected ? 0 : 0.24,
                          },
                          layout: { duration: 1.05, ease: EASE },
                        }
                  }
                  aria-hidden="true"
                >
                  <MassiveTitle text={titleText} ink={sectionInk} />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className={`home__bottom${selected ? ' home__bottom--centered' : ''}`}>
          <div className="home__bottom-left">
            <a
              className="home__contact-cta"
              href="mailto:booking@ungebaut.ch"
              data-cursor="hover"
            >
              <span className="home__contact-label">E-Mail</span>
              <span className="home__contact-value">booking@ungebaut.ch</span>
            </a>
          </div>

          {selected ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={focused?.id}
                className="home__meta home__meta--selected"
                variants={REVEAL_CONTAINER}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {[
                  ['A', 'Completed', focused?.year],
                  ['B', 'Type', focused?.tags?.[0] || '—'],
                  ['C', 'Role', focused?.role || 'Visualisation & Direction'],
                  ['D', 'Client', focused?.client],
                ].map(([letter, label, value]) => (
                  <span key={letter} className="home__meta-line">
                    <motion.span variants={REVEAL_LINE} className="home__meta-line-inner">
                      <span className="home__meta-key-group">
                        <span className="home__meta-key" aria-hidden="true">
                          {letter}
                        </span>
                        <span className="home__meta-label">{label}</span>
                      </span>
                      <span className="home__meta-val">{value}</span>
                    </motion.span>
                  </span>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : (
            <AnimatePresence mode="wait">
              {focused ? (
                <motion.dl
                  key={focused.id}
                  className="home__meta"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  <div className="home__meta-row">
                    <dt>+ Completed</dt>
                    <dd>{focused.year}</dd>
                  </div>
                  <div className="home__meta-row">
                    <dt>+ Type</dt>
                    <dd>{focused.tags[0] || '—'}</dd>
                  </div>
                  <div className="home__meta-row">
                    <dt>+ Role</dt>
                    <dd>{focused.role || 'Visualisation & Direction'}</dd>
                  </div>
                  <div className="home__meta-row">
                    <dt>+ Client</dt>
                    <dd>{focused.client}</dd>
                  </div>
                </motion.dl>
              ) : null}
            </AnimatePresence>
          )}

          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={`explore-${focused?.id}`}
                className="home__center-stack"
                variants={{
                  hidden: {},
                  visible: {
                    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
                  },
                  exit: {
                    transition: { staggerChildren: 0.06, staggerDirection: -1 },
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.button
                  type="button"
                  className="home__explore-cta"
                  onClick={(event) => {
                    event.stopPropagation();
                    exploreSection2();
                  }}
                  style={{ pointerEvents: 'auto' }}
                  variants={{
                    hidden: { opacity: 0, y: -60 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.6, ease: EASE },
                    },
                    exit: {
                      opacity: 0,
                      y: -30,
                      transition: { duration: 0.3, ease: EASE },
                    },
                  }}
                >
                  <span>Explore</span>
                </motion.button>
                <motion.span
                  className="home__center-rule"
                  aria-hidden="true"
                  variants={{
                    hidden: { opacity: 0, scaleY: 0, transformOrigin: 'top' },
                    visible: {
                      opacity: 1,
                      scaleY: 1,
                      transition: { duration: 0.55, ease: EASE },
                    },
                    exit: {
                      opacity: 0,
                      scaleY: 0,
                      transition: { duration: 0.3, ease: EASE },
                    },
                  }}
                />
                <motion.span
                  className="home__center-plus"
                  aria-hidden="true"
                  variants={{
                    hidden: { opacity: 0, y: -20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: EASE },
                    },
                    exit: {
                      opacity: 0,
                      y: -12,
                      transition: { duration: 0.3, ease: EASE },
                    },
                  }}
                >
                  +
                </motion.span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {focused && selected ? (
              <motion.div
                key={`${focused.id}-desc-sel`}
                className="home__desc home__desc--selected"
                variants={REVEAL_CONTAINER}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {splitDescLines(focused.description).map((line, i) => (
                  <span key={i} className="home__desc-line">
                    <motion.span variants={REVEAL_LINE} className="home__desc-line-inner">
                      {line}
                    </motion.span>
                  </span>
                ))}
              </motion.div>
            ) : focused ? (
              <motion.p
                key={`${focused.id}-desc`}
                className="home__desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.05 }}
              >
                {focused.description}
              </motion.p>
            ) : (
              <motion.div
                key="idle-ctas"
                className="home__contact"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <a
                  className="home__contact-cta"
                  href="tel:+41775210295"
                  data-cursor="hover"
                >
                  <span className="home__contact-label">Telefon</span>
                  <span className="home__contact-value">+41 77 521 02 95</span>
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Section 2: strip + footer (only when selected). Hosts the de-spaced
          massive title at its top — Issue 04 will swap that static render
          for a scroll-driven counter-direction wipe via <MorphingTitle />. */}
      {selected ? (
        <div className="home__section home__section--strip" ref={section2Ref}>
          <div className="home__section-title" aria-hidden="true">
            <MassiveTitle text={despacedTitleText} ink={sectionInk} animate={false} />
          </div>
          <ProjectStrip project={selected} />
          <ProjectFooterMeta project={selected} />
        </div>
      ) : null}
    </section>
  );
}

function ProgressTicks({ total, activeRatio }) {
  const activeIndex = Math.round(activeRatio * (total - 1));
  return (
    <div className="ticks" aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => {
        const dist = Math.abs(i - activeIndex);
        const active = dist <= 1;
        return (
          <span key={i} className={`ticks__bar${active ? ' ticks__bar--active' : ''}`} />
        );
      })}
    </div>
  );
}
