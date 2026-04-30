import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TextCascade } from './TextCascade';

const GalleryGL = lazy(() => import('./GalleryGL').then((m) => ({ default: m.GalleryGL })));
import { MassiveTitle } from './MassiveTitle';
import { projects, getProject } from '../data/projects';
import { SeoHead } from './SeoHead';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

const TICK_TOTAL = 32;
// Aristide's `o6` (expo-out) approximated as a cubic-bezier. Sharper start
// and a longer settle than the cubic-out we had — gives that "slammed in"
// feel on every show animation.
const EASE = [0.16, 1, 0.3, 1];

function pad(n) {
  return String(n).padStart(2, '0');
}

export function HomeView({ onSelect, onExplore, selectedId }) {
  const reduced = usePrefersReducedMotion();
  const [hoveredId, setHoveredId] = useState(null);
  const hovered = hoveredId ? getProject(hoveredId) : null;
  const selected = selectedId ? getProject(selectedId) : null;
  // Whichever project drives chrome (counter, metadata, description). When
  // a project is selected it wins; otherwise we follow the hover.
  const focused = selected || hovered;

  const stageRef = useRef(null);
  const previousSelectedIdRef = useRef(null);
  const isSwitchingSelected =
    Boolean(selectedId) &&
    Boolean(previousSelectedIdRef.current) &&
    previousSelectedIdRef.current !== selectedId;

  useEffect(() => {
    previousSelectedIdRef.current = selectedId;
  }, [selectedId]);

  // Browse-mode backdrop matches the new light theme; opening a project
  // briefly tints to that project's palette before reverting on close.
  const bgColor = selected ? selected.detailBg : '#f4f0e8';
  const selectedInk = selected ? selected.massiveInk || selected.detailInk : null;
  const fgInk = selectedInk || 'rgba(11, 11, 11, 0.85)';

  // Whole-page text recolour: when a project is open, push the project's ink
  // colour onto :root so Nav, Footer, counter, meta, hint, and any other
  // chrome that resolves `var(--fg)` flips with it. Reset on close so the
  // browse view goes back to off-white-on-black.
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
      // On unmount (route change), make sure we don't leak the override.
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

  return (
    <section
      className={`home${selected ? ' home--selected' : ''}`}
      ref={stageRef}
      aria-label="Gallery — selected work"
      style={{ '--home-bg': bgColor, '--home-ink': fgInk }}
    >
      <SeoHead
        title="UNGEBAUT — Architekturvisualisierung, Zürich"
        description="Architekturvisualisierungs-Studio in Zürich, gegründet 2021 von Philippos und Luna Theofanidis. Fotorealistische Renderings, 3D-Design, Animation, VR/AR und Drohnen-Dokumentation für Architekten, Entwickler und Marken in der Schweiz und Europa."
        path="/"
      />
      {/* Background lifts to the project's tint when selected so the page
          colour-shifts as a whole. Plain dark when nothing is open. */}
      <motion.div
        className="home__bg"
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 0.7, ease: EASE }}
        aria-hidden="true"
      />

      {/* WebGL stripes — the canvas itself does the expand: when selected,
          GalleryGL scales the chosen stripe to its photo's natural aspect
          ratio and pushes neighbours off-screen. We do NOT dim the canvas
          anymore — it IS the picture. */}
      <div className="home__gl" data-cursor={hovered ? 'gallery' : undefined}>
        <Suspense fallback={null}>
          <GalleryGL
            onSelect={onSelect}
            onHoverChange={setHoveredId}
            onExplore={onExplore}
            selectedId={selectedId}
            hoveredId={hoveredId}
          />
        </Suspense>
      </div>

      {/* Selected-state chrome — title cascade + close + explore CTA only.
          The image is now provided by the WebGL canvas behind, so we no
          longer render a separate <img> overlay. */}
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
            {/* Massive headline overlays the expanded canvas stripe.
                Keyed by project id so AnimatePresence runs the EXIT
                (opposite-direction slide) on the old title at the same
                time it runs the ENTER on the new one. The wrapper itself
                does NOT fade — fading the parent would hide the inner
                letter slides before they finish, which is exactly what
                made the old title look like it just "disappeared". */}
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={selected.id}
                className="home__expand-title-wrap"
                layoutId={`massive-title-${selected.id}`}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={{ clipPath: 'inset(0 0% 0 0)' }}
                exit={{ clipPath: 'inset(0 0 0 100%)' }}
                transition={{
                  clipPath: {
                    duration: isSwitchingSelected ? 1.05 : 1.15,
                    ease: EASE,
                    delay: isSwitchingSelected ? 0 : 0.24,
                  },
                  layout: { duration: 1.05, ease: EASE },
                }}
                aria-hidden="true"
              >
                <MassiveTitle
                  text={
                    selected.massiveTitle ||
                    (selected.client === 'UNGEBAUT'
                      ? selected.title.toUpperCase()
                      : selected.client.toUpperCase())
                  }
                  ink={selected.massiveInk || selected.detailInk}
                />
              </motion.div>
            </AnimatePresence>

            <motion.button
              type="button"
              className="home__close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.4 }}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(null);
              }}
              aria-label="Close project"
            >
              <span aria-hidden="true">×</span>
              <span className="home__close-label">Close</span>
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Top progress: counter + tick scrubber + (when something is in
          focus) the focused project's client name. The label is what gives
          phone users a "current project" indicator since touch has no hover. */}
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

      {/* Bottom strip — role on the left, project meta in the middle,
          description on the right. Visible whenever a card is in focus.
          When a project is selected the layout collapses to a centred cluster
          (Explore CTA on top of the meta + description) sitting under the
          focused image. */}
      <div className={`home__bottom${selected ? ' home__bottom--centered' : ''}`}>
        <div className="home__bottom-left">
          <span className="home__role">Architectural Visualisation</span>
          <span className="home__avail">Available {new Date().getFullYear()}</span>
        </div>

        {selected ? (
          <AnimatePresence mode="wait">
            <motion.dl
              key={focused?.id}
              className="home__meta"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <div className="home__meta-row">
                <dt>A · Completed</dt>
                <dd>{focused?.year}</dd>
              </div>
              <div className="home__meta-row">
                <dt>B · Type</dt>
                <dd>{focused?.tags?.[0] || '—'}</dd>
              </div>
              <div className="home__meta-row">
                <dt>C · Role</dt>
                <dd>Visualisation &amp; Direction</dd>
              </div>
              <div className="home__meta-row">
                <dt>D · Client</dt>
                <dd>{focused?.client}</dd>
              </div>
            </motion.dl>
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
                  <dd>Visualisation &amp; Direction</dd>
                </div>
                <div className="home__meta-row">
                  <dt>+ Client</dt>
                  <dd>{focused.client}</dd>
                </div>
              </motion.dl>
            ) : (
              <motion.p
                key="idle"
                className="home__hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <span>Scroll · Drag</span>
                <span className="home__hint-rule" />
                <span>Click a card</span>
              </motion.p>
            )}
          </AnimatePresence>
        )}

        {selected ? (
          <motion.div
            className="home__center-stack"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <button
              type="button"
              className="home__explore-cta"
              onClick={(event) => {
                event.stopPropagation();
                onExplore?.();
              }}
              style={{ pointerEvents: 'auto' }}
            >
              <span>Explore</span>
            </button>
            <span className="home__center-rule" aria-hidden="true" />
            <span className="home__center-plus" aria-hidden="true">
              +
            </span>
          </motion.div>
        ) : null}

        <AnimatePresence mode="wait">
          {focused ? (
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
                href="mailto:booking@ungebaut.ch"
                data-cursor="hover"
              >
                <span className="home__contact-label">E-Mail</span>
                <span className="home__contact-value">booking@ungebaut.ch</span>
              </a>
              <span className="home__contact-rule" aria-hidden="true" />
              <a className="home__contact-cta" href="tel:+41775210295" data-cursor="hover">
                <span className="home__contact-label">Telefon</span>
                <span className="home__contact-value">+41 77 521 02 95</span>
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* OPEN pill — follows the cursor while a stripe is hovered (only when
          nothing is selected yet). Clicking commits to the project. */}
      <AnimatePresence>
        {false ? (
          <motion.button
            key="open"
            type="button"
            className="home__open"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
            }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{
              opacity: { duration: 0.25, ease: EASE },
              scale: { duration: 0.35, ease: EASE },
              x: { type: 'spring', stiffness: 380, damping: 30 },
              y: { type: 'spring', stiffness: 380, damping: 30 },
            }}
            onClick={(event) => {
              event.stopPropagation();
              onSelect?.(hovered);
            }}
          >
            Open
          </motion.button>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Progress ticks
// ---------------------------------------------------------------------------

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
