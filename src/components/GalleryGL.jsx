import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Plane, Mesh, Program, Texture } from 'ogl';
import { projects } from '../data/projects';
import { stripeVertex, stripeFragment } from '../lib/gl/shaders';
import { hexToRgb } from '../lib/gl/hexToRgb';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

// Geometry — slightly squat verticals arranged as a flat row at rest. The
// wave-induced Z push is the only source of asymmetry while scrolling.
const STRIPE_WIDTH = 110;
const STRIPE_HEIGHT = 380;
const STRIPE_GAP = 22;
const CAMERA_Z = 700;
const FRAME_MS = 1000 / 60;
const SCROLL_LERP = 0.08;
const LATENCY_LERP_OUT = 0.08;
const LATENCY_LERP_IN = 0.3;
const DRAG_SENSITIVITY = 1.2;

// Mirror the vertex-shader bend math on the CPU so we hit-test against the
// pixel that's actually under the cursor, not the un-bent stripe. Keep the
// constants in lockstep with shaders.js — divergence makes hover targets drift
// off the visible quad edges.
// CPU mirror of the bell-curve scroll wave so hover hit-tests track the
// stripe's actual on-screen size while it's pushed forward by the wave.
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

function damp(a, b, ease, dt) {
  const frameRatio = dt / FRAME_MS;
  return lerp(a, b, 1 - Math.exp(Math.log(1 - ease) * frameRatio));
}

function clamp(v, mn, mx) {
  return v < mn ? mn : v > mx ? mx : v;
}

function projectStripe(stripe, current, viewportW, latencyX, waveRange) {
  const worldX = stripe.x - current + stripe.offsetX;

  const k = Math.abs(worldX);
  const waveZ =
    k < waveRange
      ? (waveRange - easeInOutQuad(k / waveRange) * waveRange) * latencyX
      : 0;

  const proj = CAMERA_Z / (CAMERA_Z - waveZ);
  // viewportW only mattered for the (now-removed) cylindrical bend.
  void viewportW;
  return {
    screenX: worldX * proj,
    screenY: 0,
    halfW: (stripe.width / 2) * proj,
    halfH: (stripe.height / 2) * proj,
  };
}

export function GalleryGL({
  onSelect,
  onHoverChange,
  onExplore,
  selectedId,
  hoveredId,
}) {
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef(null);
  const canvasRef = useRef(null);

  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHoverChange);
  const onExploreRef = useRef(onExplore);
  const selectedIdRef = useRef(selectedId);
  const hoveredIdRef = useRef(hoveredId);
  const reducedRef = useRef(reduced);

  useEffect(() => {
    onSelectRef.current = onSelect;
    onHoverRef.current = onHoverChange;
    onExploreRef.current = onExplore;
    selectedIdRef.current = selectedId;
    hoveredIdRef.current = hoveredId;
    reducedRef.current = reduced;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return undefined;

    const renderer = new Renderer({
      canvas,
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
      preserveDrawingBuffer: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const scene = new Transform();
    // ogl's Camera defaults to near 0.1 / far 100. We sit the camera at
    // z = 700 looking at the origin, so the default frustum slices the entire
    // scene off — pushing far out to 4000 keeps every stripe (and its bent z
    // displacement) inside the view.
    const camera = new Camera(gl, { near: 1, far: 4000 });
    camera.position.z = CAMERA_Z;

    // `fit` is the rest-state scale applied to every stripe so that all of
    // them fit in the viewport at once, with PAD breathing room on either
    // side. Recomputed on every resize. fit < 1 = shrunk to fit, fit = 1 =
    // natural size (only on viewports wider than the natural strip).
    let fit = 1;
    // No scrolling is needed once everything fits — minScroll/maxScroll stay
    // at 0. Kept as variables so the wheel/drag handlers' clamp(...) still
    // resolves correctly without behavior changes.
    let minScroll = 0;
    let maxScroll = 0;
    let scrollStep = STRIPE_WIDTH + STRIPE_GAP;
    let originX = 0;
    let waveRange = 300;
    // Entrance animation is disabled for now — every stripe starts at its
    // final position with full opacity. Re-enable by setting
    // ENTRANCE_DISABLED to false; the slide/fade choreography downstream is
    // already wired up.
    const ENTRANCE_DISABLED = true;
    const ENTRANCE_DURATION_MS = 900;
    const ENTRANCE_PER_STRIPE_MS = 55;
    const ENTRANCE_OFFSET_X = 1800;
    const entranceStart = performance.now();

    const stripes = projects.map((project, i) => {
      // Initial position assumes natural size — overwritten by resize() on
      // the first frame once the actual viewport is known.
      const x = i * (STRIPE_WIDTH + STRIPE_GAP);

      const geometry = new Plane(gl, {
        width: STRIPE_WIDTH,
        height: STRIPE_HEIGHT,
        widthSegments: 1,
        heightSegments: 24,
      });

      const isVideo = project.mediaType === 'video';
      const texture = new Texture(gl, {
        minFilter: isVideo ? gl.LINEAR : gl.LINEAR_MIPMAP_LINEAR,
        magFilter: gl.LINEAR,
        wrapS: gl.CLAMP_TO_EDGE,
        wrapT: gl.CLAMP_TO_EDGE,
        generateMipmaps: !isVideo,
      });

      const accent = hexToRgb(project.accent);
      const accentSoft = hexToRgb(project.accentSoft);

      const program = new Program(gl, {
        vertex: stripeVertex,
        fragment: stripeFragment,
        uniforms: {
          uTexture: { value: texture },
          uTextureSize: { value: [STRIPE_WIDTH, STRIPE_HEIGHT] },
          uStripeSize: { value: [STRIPE_WIDTH, STRIPE_HEIGHT] },
          uViewport: { value: [1, 1] },
          uGap: { value: 0 },
          uIndex: { value: i },
          uHover: { value: 0 },
          uDimmed: { value: 0 },
          uTexLoaded: { value: 0 },
          uPanY: { value: 0 },
          uOpacity: { value: 1 },
          uAccent: { value: accent },
          uAccentSoft: { value: accentSoft },
          uTint: { value: [1, 1, 1] },
          uTintStrength: { value: 0 },
          uLatencyX: { value: 0 },
          uWaveRange: { value: waveRange },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });
      mesh.position.x = x;
      mesh.setParent(scene);

      // Media loading is deferred — see loadStripeMedia() below. Stripes
      // outside the preload window keep an empty texture and won't fetch
      // their hero asset until the camera scrolls them into range. Cuts
      // first-paint payload from ~290 MB to a handful of nearby assets.
      return {
        project,
        index: i,
        x,
        width: STRIPE_WIDTH,
        height: STRIPE_HEIGHT,
        mesh,
        program,
        texture,
        isVideo,
        video: null,
        mediaLoaded: false,
        mediaLoading: false,
        hasNewVideoFrame: false,
        hover: 0,
        targetHover: 0,
        dimmed: 0,
        targetDimmed: 0,
        // Image's natural aspect ratio (width / height) — set once the
        // <Image> finishes loading. Default to the geometry's portrait
        // ratio so first frames look right pre-load.
        imageAspect: STRIPE_WIDTH / STRIPE_HEIGHT,
        // Phase 3 — IN-mode layout: when this stripe is selected we lerp
        // scaleX/scaleY toward a target that PRESERVES the image's natural
        // aspect ratio (no stretch). Neighbours lerp `offsetX` clear off the
        // viewport so they don't crowd the expanded centre.
        scaleX: 1,
        targetScaleX: 1,
        scaleY: 1,
        targetScaleY: 1,
        offsetX: 0,
        targetOffsetX: 0,
        // Per-stripe entrance opacity — kept at 1 while the entrance
        // animation is disabled. When re-enabled this should reset to 0 so
        // the fade-in choreography in tick() takes over.
        opacity: 1,
        // Phase 2 — texture pan: hover-driven V offset (Aristide's pY).
        panY: 0,
        targetPanY: 0,
      };
    });

    // Lazy media loader. Idempotent — safe to call every frame; subsequent
    // calls bail at the mediaLoading/mediaLoaded check. We only kick this
    // off for stripes within ~1.5 viewport widths of camera centre, so the
    // home page no longer downloads all 36 hero assets up front.
    const loadStripeMedia = (s) => {
      if (s.mediaLoaded || s.mediaLoading) return;
      s.mediaLoading = true;
      const { project, texture, program, isVideo } = s;

      if (isVideo) {
        // Step 1: paint the poster JPEG (~100 KB, generated by ffmpeg next
        // to the source video) as the initial texture. This gives every
        // video stripe an instantly-visible frame even when the body of
        // the .mp4 hasn't been requested yet. The video frame replaces it
        // once playback starts.
        const posterPath = project.image.replace(/[^/]+$/, 'poster.jpg');
        const posterImg = new Image();
        posterImg.crossOrigin = 'anonymous';
        posterImg.onload = () => {
          // Don't clobber the live video frame if the video has already
          // started uploading frames to this texture.
          if (s.videoActive) return;
          texture.image = posterImg;
          texture.needsUpdate = true;
          program.uniforms.uTextureSize.value = [posterImg.width, posterImg.height];
          program.uniforms.uTexLoaded.value = 1;
          s.imageAspect = posterImg.width / posterImg.height;
        };
        posterImg.onerror = () => {};
        posterImg.src = posterPath;

        // Step 2: create the video element. preload='metadata' means the
        // body isn't downloaded until we call play(), which the visibility
        // check in tick() does only when the stripe enters videoPlayRange.
        const video = document.createElement('video');
        video.src = project.video || project.image;
        video.crossOrigin = 'anonymous';
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = 'metadata';
        // Browsers throttle videos that aren't in the DOM. Park it in a 1×1
        // off-screen wrapper so playback runs at the file's true frame rate.
        video.style.position = 'fixed';
        video.style.top = '0';
        video.style.left = '0';
        video.style.width = '1px';
        video.style.height = '1px';
        video.style.opacity = '0.0001';
        video.style.pointerEvents = 'none';
        video.style.zIndex = '-1';
        document.body.appendChild(video);

        const onVideoReady = () => {
          texture.image = video;
          texture.needsUpdate = true;
          s.videoActive = true;
          s.hasNewVideoFrame = true;
          const vw = video.videoWidth || STRIPE_WIDTH;
          const vh = video.videoHeight || STRIPE_HEIGHT;
          program.uniforms.uTextureSize.value = [vw, vh];
          program.uniforms.uTexLoaded.value = 1;
          s.imageAspect = vw / vh;
        };
        video.addEventListener('loadeddata', onVideoReady, { once: true });

        // requestVideoFrameCallback fires per decoded frame, so we re-upload
        // to the GPU at video framerate, not render-loop framerate. Falls
        // back to per-tick upload in tick() when the API is missing.
        if (typeof video.requestVideoFrameCallback === 'function') {
          const pump = () => {
            s.hasNewVideoFrame = true;
            video.requestVideoFrameCallback(pump);
          };
          video.requestVideoFrameCallback(pump);
        }

        s.video = video;
        // Mark as loaded once both the poster fetch and the video shell are
        // in place. The play/pause gate in tick() reads s.mediaLoaded, and
        // calling play() on a metadata-only-preloaded video is what triggers
        // the body fetch — so we don't want to wait for loadeddata here.
        s.mediaLoaded = true;
        // Don't call play() here — the visibility check in tick() will start
        // playback only when the stripe is actually within the play window,
        // and pause it again when it scrolls away.
      } else {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          texture.image = img;
          texture.needsUpdate = true;
          program.uniforms.uTextureSize.value = [img.width, img.height];
          program.uniforms.uTexLoaded.value = 1;
          s.imageAspect = img.width / img.height;
          s.mediaLoaded = true;
        };
        img.onerror = () => {};
        img.src = project.image;
      }
    };

    // World-space distance thresholds for visibility-gated work. Both are
    // derived from viewport width and recomputed on resize.
    let preloadRange = 800;
    let videoPlayRange = 600;

    // Autoplay-blocked videos retry inside tick() — the play/pause check
    // calls play() every frame for in-range paused videos, so the first
    // user gesture (any pointer event hits the rAF loop) succeeds without
    // a dedicated handler.

    // With every stripe fitted into the viewport, scroll always stays at 0.
    // The variables remain so wheel/drag clamp logic keeps working unchanged.
    let target = 0;
    let current = target;
    let currentLatency = target;
    let initialised = false;
    // Mirrors Aristide Benoist's `latency.x` — rises 0→1 while the lerp is
    // catching up to a fast scroll, decays back to 0 once it settles. Drives
    // the bell-curve Z push in the vertex shader.
    let latencyX = 0;
    let latency = 0;
    // Mirrors his `latency.rotate` — signed scroll velocity, clamped ±2.
    // Applied as Y-axis rotation on each stripe's mesh so the row tilts into
    // the scroll direction.
    let latencyR = 0;

    let mouseX = -99999;
    let mouseY = -99999;
    let hoveredIndex = -1;
    let lastEmittedHoverId = null;

    let dragging = false;
    let dragStartX = 0;
    let dragMoved = false;
    let dragLastX = 0;
    // Snapshot of the hover at mousedown — the rAF loop pauses hit-tests while
    // dragging is true, so by mouseup hoveredIndex is already -1. We need the
    // value from the moment the user pressed.
    let pressedIndex = -1;

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      if (w <= 0 || h <= 0) return;
      renderer.setSize(w, h);
      const fov = (2 * Math.atan(h / 2 / CAMERA_Z) * 180) / Math.PI;
      camera.perspective({ aspect: w / h, fov, near: 1, far: 4000 });

      // Compute a single fit-factor that shrinks every stripe just enough so
      // the entire row (PAD + 27 stripes + 26 gaps + PAD) lands inside the
      // viewport. fit > 1 is clamped — on viewports wider than the natural
      // strip we render at full size and centre the row.
      fit = Math.min(1.06, Math.max(0.68, (h * 0.62) / STRIPE_HEIGHT));

      const effW = STRIPE_WIDTH * fit;
      const effG = STRIPE_GAP * fit;
      scrollStep = effW + effG;
      originX = -w * 0.1;
      waveRange = clamp(w * 0.22, 180, 360);

      // Re-place every stripe at the effective spacing and update its
      // hit-test footprint. Mesh scale is lerped to `fit` in tick(), so
      // we only update positions here.
      stripes.forEach((s, i) => {
        s.x = originX + i * scrollStep;
        s.width = effW;
        s.height = STRIPE_HEIGHT * fit;
        s.program.uniforms.uViewport.value = [w, h];
        s.program.uniforms.uWaveRange.value = waveRange;
      });

      // Whole strip fits — no scrolling needed. minScroll/maxScroll pin
      // both to 0 so wheel/drag inputs become no-ops while still going
      // through clamp() unchanged.
      minScroll = 0;
      maxScroll = Math.max(0, (projects.length - 1) * scrollStep);

      if (!initialised) {
        target = clamp(scrollStep * 0.85, minScroll, maxScroll);
        current = target;
        currentLatency = target;
        initialised = true;
        // Snap every stripe directly to the fit-scale on first paint so
        // there's no visible shrink animation from the natural-size init.
        stripes.forEach((s) => {
          s.scaleX = fit;
          s.targetScaleX = fit;
          s.scaleY = fit;
          s.targetScaleY = fit;
          s.mesh.scale.x = fit;
          s.mesh.scale.y = fit;
          s.mesh.position.x = s.x - current;
        });
      } else {
        target = clamp(target, minScroll, maxScroll);
        current = clamp(current, minScroll, maxScroll);
        currentLatency = clamp(currentLatency, minScroll, maxScroll);
      }

      // Distance windows scale with viewport — preload anything within ~1.5
      // viewport widths of camera centre, only play videos within ~0.6.
      preloadRange = w * 1.5;
      videoPlayRange = w * 0.6;

      // Kick off initial preloads for stripes near the starting camera
      // position. Without this the first paint waits a frame for the rAF
      // loop to start fetching.
      stripes.forEach((s) => {
        if (Math.abs(s.x - target) <= preloadRange) loadStripeMedia(s);
      });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    const onWheel = (event) => {
      const dy =
        Math.abs(event.deltaY) > Math.abs(event.deltaX)
          ? event.deltaY
          : event.deltaX;
      if (dy === 0) return;
      event.preventDefault();
      // While a project is open, scroll-down opens the deeper detail view
      // (Aristide-style page takeover) and scroll-up closes the selection.
      // Browse-mode scrolling keeps panning the row.
      if (selectedIdRef.current) {
        if (dy > 30 && onExploreRef.current) {
          onExploreRef.current();
        } else if (dy < -30) {
          onSelectRef.current?.(null);
        }
        return;
      }
      const viewportW = stage.clientWidth || window.innerWidth || 1;
      const wheelFactor = viewportW < 640 ? 0.18 : 0.556;
      const wheelDelta = clamp(dy * wheelFactor, -scrollStep * 1.15, scrollStep * 1.15);
      target = clamp(target + wheelDelta, minScroll, maxScroll);
    };

    const onPointerMove = (event) => {
      const rect = stage.getBoundingClientRect();
      mouseX = event.clientX - rect.left - rect.width / 2;
      mouseY = -(event.clientY - rect.top - rect.height / 2);
      if (dragging) {
        const dx = (event.clientX - dragLastX) * DRAG_SENSITIVITY;
        // Tap-vs-drag threshold. Touch input slides slightly on tap, so use a
        // larger threshold for `pointerType === 'touch'` to prevent every tap
        // from being misclassified as a drag.
        const dragThreshold = event.pointerType === 'touch' ? 8 : 4;
        if (Math.abs(event.clientX - dragStartX) > dragThreshold)
          dragMoved = true;
        target = clamp(target - dx, minScroll, maxScroll);
        dragLastX = event.clientX;
      }
    };

    // Synchronous hit-test using the latest tick's `current`/`latencyX`/
    // `waveRange`. Needed so a touch tap (which has no preceding hover) can
    // still resolve to the stripe under the finger — without this, every
    // touch tap was missing because `hoveredIndex` stayed -1 between
    // pointerleave and the next rAF tick.
    const hitTestAt = (clientX, clientY) => {
      const rect = stage.getBoundingClientRect();
      const localX = clientX - rect.left - rect.width / 2;
      const localY = -(clientY - rect.top - rect.height / 2);
      const sel = selectedIdRef.current;
      for (let i = stripes.length - 1; i >= 0; i--) {
        const s = stripes[i];
        const p = projectStripe(s, current, stage.clientWidth, latencyX, waveRange);
        if (
          (!sel || s.project.id !== sel) &&
          localX >= p.screenX - p.halfW &&
          localX <= p.screenX + p.halfW &&
          localY >= p.screenY - p.halfH &&
          localY <= p.screenY + p.halfH
        ) {
          return i;
        }
      }
      return -1;
    };

    const onPointerDown = (event) => {
      dragging = true;
      dragMoved = false;
      dragStartX = event.clientX;
      dragLastX = event.clientX;
      // Update mouseX/Y so the next render tick's hover system also sees the
      // finger position immediately.
      const rect = stage.getBoundingClientRect();
      mouseX = event.clientX - rect.left - rect.width / 2;
      mouseY = -(event.clientY - rect.top - rect.height / 2);
      // Capture which stripe sits under the pointer RIGHT NOW. For mouse this
      // matches `hoveredIndex` (already kept fresh by hover); for touch we
      // fall back to a synchronous hit-test because there is no hover prior
      // to the tap.
      pressedIndex = hoveredIndex >= 0 ? hoveredIndex : hitTestAt(event.clientX, event.clientY);
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // best-effort — context may already be gone
      }
    };

    const onPointerUp = (event) => {
      const wasDragging = dragging;
      dragging = false;
      const clickedIndex = pressedIndex;
      pressedIndex = -1;
      try {
        canvas.releasePointerCapture(event.pointerId);
      } catch {
        // best-effort — context may already be gone
      }
      if (wasDragging && !dragMoved && clickedIndex >= 0) {
        const project = stripes[clickedIndex].project;
        onSelectRef.current?.(project);
      }
    };

    const onPointerLeave = () => {
      dragging = false;
      mouseX = -99999;
      mouseY = -99999;
      if (lastEmittedHoverId !== null) {
        lastEmittedHoverId = null;
        onHoverRef.current?.(null);
      }
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointercancel', onPointerLeave);

    let raf = 0;
    let lastFrame = performance.now();
    let lastSelectedId = selectedIdRef.current;
    let openProgress = lastSelectedId ? 1 : 0;
    const tick = (now = performance.now()) => {
      const dt = Math.min(64, Math.max(1, now - lastFrame));
      lastFrame = now;
      const w = stage.clientWidth;
      const sel = selectedIdRef.current;
      if (sel !== lastSelectedId) {
        lastSelectedId = sel;
        openProgress = sel ? 0 : 1;
      }
      openProgress = damp(openProgress, sel ? 1 : 0, 0.085, dt);
      const openEase = 1 - Math.pow(1 - clamp(openProgress, 0, 1), 3);
      const neighbourEase = Math.max(0, (openEase - 0.08) / 0.92);

      // Phase 3 — when a project is selected, snap the scroll target so the
      // selected stripe's centre lands at world x = 0 (centre of viewport).
      // No clamping while a project is selected — the first/last stripe sits
      // at originX = -w*0.1 / +(n-1)*scrollStep which is outside [minScroll,
      // maxScroll], so clamping there would prevent edge stripes from
      // centering properly. Drag/wheel handlers still clamp normally.
      if (sel) {
        const selStripe = stripes.find((s) => s.project.id === sel);
        if (selStripe) target = selStripe.x;
      }

      // Phase 4 — latency lerp jumps from 0.08 (browsing) to 0.30 (selected)
      // so the wave/rotation settle quickly when a card is open. Matches
      // Aristide's `lerp.latency.in: 0.30`.
      const latencyLerp = sel ? LATENCY_LERP_IN : LATENCY_LERP_OUT;

      if (reducedRef.current) {
        current = target;
        currentLatency = target;
        latency = 0;
        latencyX = 0;
        latencyR = 0;
      } else {
        current = damp(current, target, SCROLL_LERP, dt);
        if (Math.abs(target - current) < 0.4) current = target;
        currentLatency = damp(currentLatency, target, latencyLerp, dt);
        const latencySource = sel ? 0 : target - currentLatency;
        latency = damp(latency, latencySource, latencyLerp, dt);
        latencyX = clamp(Math.abs(latency) / 850, 0, 1);
        latencyR = clamp(latency / (850 / 1.0), -1.0, 1.0);
      }
      const gap = target - current;

      // Entrance choreography — disabled for now. When ENTRANCE_DISABLED is
      // true every stripe starts at its final on-screen position with full
      // opacity, and `entranceActive` stays false from the first frame.
      const elapsed = performance.now() - entranceStart;
      const entranceActive =
        !ENTRANCE_DISABLED &&
        elapsed < ENTRANCE_DURATION_MS + stripes.length * ENTRANCE_PER_STRIPE_MS;
      if (entranceActive) {
        target = minScroll;
        current = minScroll;
        currentLatency = minScroll;
      }
      // Threshold + range so the wave only activates with deliberate scroll.
      // Below 120px lag → completely flat; rises to full strength at +480px
      // additional lag. The smoothing keeps the ramp gentle.
      

      // Phase 2 — signed scroll velocity drives stripe Y-rotation. Clamp to
      // ±2 (Aristide's hard cap) and lerp toward the target so quick flicks
      // don't snap the row.
      
      const externalHoverId = hoveredIdRef.current;
      hoveredIndex = -1;
      if (!dragging) {
        for (let i = stripes.length - 1; i >= 0; i--) {
          const s = stripes[i];
          const p = projectStripe(s, current, w, latencyX, waveRange);
          if (
            (!sel || s.project.id !== sel) &&
            mouseX >= p.screenX - p.halfW &&
            mouseX <= p.screenX + p.halfW &&
            mouseY >= p.screenY - p.halfH &&
            mouseY <= p.screenY + p.halfH
          ) {
            hoveredIndex = i;
            break;
          }
        }
      }

      // Bridge hover state to React. Only emit on edges to avoid spam.
      const newHoverId =
        hoveredIndex >= 0 ? stripes[hoveredIndex].project.id : null;
      if (newHoverId !== lastEmittedHoverId) {
        lastEmittedHoverId = newHoverId;
        onHoverRef.current?.(newHoverId);
      }

      const anyHover = hoveredIndex >= 0 || !!externalHoverId;

      for (let i = 0; i < stripes.length; i++) {
        const s = stripes[i];

        // Entrance: each stripe slides in from +1800 px (off-screen right)
        // AND fades in from opacity 0. Normal stagger order (stripe[0]
        // first) so the LEFTMOST card lands first — the user sees the
        // visible portion fill in immediately rather than waiting for the
        // right-side off-screen stripes to play out their slide before the
        // left edge populates.
        if (entranceActive) {
          const localT =
            (elapsed - i * ENTRANCE_PER_STRIPE_MS) / ENTRANCE_DURATION_MS;
          const phase = Math.max(0, Math.min(1, localT));
          const eased = 1 - Math.pow(1 - phase, 4); // easeOutQuart
          s.mesh.position.x = s.x - current + (1 - eased) * ENTRANCE_OFFSET_X;
          s.opacity = eased;
        } else {
          const nextX = s.x - current + s.offsetX;
          if (s.mesh.position.x !== nextX) s.mesh.position.x = nextX;
          s.opacity = 1;
        }

        const isHovered =
          i === hoveredIndex || s.project.id === externalHoverId;
        s.targetHover = isHovered ? 1 : 0;

        // The neighbours of the focused card take a HEAVY wash of the
        // selected project's BG colour so the eye stays on the chosen
        // image. While merely hovering (no selection yet), the
        // neighbours of the hovered card also pick up a softer tint of
        // the hovered project's BG — so the colour-shift starts the
        // moment the cursor lands on a card.
        let targetTint = 0;
        if (sel) {
          if (s.project.id === sel) {
            s.targetHover = 1;
            s.targetDimmed = 0;
            targetTint = 0;
          } else {
            // Heavy wash with the focused project's BG colour, but not
            // 100% — the neighbour image stays faintly visible underneath
            // so the row still reads as a row of photos, not coloured
            // panels. Only kicks in on CLICK, not on hover.
            s.targetHover = 0;
            s.targetDimmed = 0;
            targetTint = 0.82 * openEase;
          }
        } else if (anyHover) {
          // Browse-mode hover: only the OTHER stripes dim. No colour
          // wash — that's reserved for the click-selected state.
          s.targetDimmed = isHovered ? 0 : 0.7;
        } else {
          s.targetDimmed = 0;
        }
        s.hover += (s.targetHover - s.hover) * 0.14;
        s.dimmed += (s.targetDimmed - s.dimmed) * 0.14;
        s.tintStrength =
          (s.tintStrength || 0) + (targetTint - (s.tintStrength || 0)) * 0.14;
        // Tint colour follows the SELECTED (or hovered) project's BG.
        const tintSourceId = sel || externalHoverId;
        const tintSource = tintSourceId
          ? stripes.find((t) => t.project.id === tintSourceId)
          : null;
        const tintRgb = tintSource
          ? hexToRgb(tintSource.project.detailOverlay || tintSource.project.detailBg)
          : hexToRgb(s.project.detailBg);
        s.program.uniforms.uTint.value = tintRgb;
        s.program.uniforms.uTintStrength.value = s.tintStrength;

        // Phase 3 — IN-mode layout. When a project is selected:
        //   • Selected stripe blooms to its photo's natural aspect ratio,
        //     fitted to ~78% of viewport height. No stretch.
        //   • Neighbours ALSO expand, but progressively smaller with distance:
        //     ±1 = 55% of selected, ±2 = 35%, ±3+ = 22%. Sized down so
        //     they read as "around" the selected one rather than competing.
        //   • Cumulative offset positions each at the edge of the previous
        //     one, so the row reads as a centered cluster.
        if (sel) {
          // Neighbours adopt the SAME size as the selected stripe — the BG
          // tint is what isolates the focused card now, not a size falloff.
          const selStripe = stripes.find((t) => t.project.id === sel);
          const distance = selStripe ? i - selStripe.index : 0;
          const sign = Math.sign(distance) || 0;
          const dist = Math.abs(distance);

          const baseAspect = selStripe ? selStripe.imageAspect : s.imageAspect;
          // Phone + tablet + landscape phone all get a much wider width cap
          // so the selected photo dominates the viewport — desktop stays at
          // ~46% so the row reads as a row, not a single overpowering card.
          // 900px covers iPad portrait and landscape phones (667/812 wide);
          // above that we treat as desktop.
          const isNarrow = w < 900;
          const heightCap = Math.min(
            stage.clientHeight * (isNarrow ? 0.58 : 0.62),
            720,
          );
          const widthCap = w * (isNarrow ? 0.86 : 0.46);
          let baseW;
          let baseH;
          if (heightCap * baseAspect <= widthCap) {
            baseH = heightCap;
            baseW = baseH * baseAspect;
          } else {
            baseW = widthCap;
            baseH = baseW / baseAspect;
          }

          const expandedScaleX = baseW / STRIPE_WIDTH;
          const expandedScaleY = baseH / STRIPE_HEIGHT;
          const foldedScaleX = dist === 0 ? Math.min(fit, expandedScaleX * 0.22) : fit;
          const foldedScaleY = dist === 0 ? Math.min(fit, expandedScaleY * 0.92) : fit;
          s.targetScaleX = lerp(foldedScaleX, expandedScaleX, openEase);
          s.targetScaleY = lerp(foldedScaleY, expandedScaleY, openEase);

          // Offset = uniform card width per step. Symmetric on both sides.
          if (dist === 0) {
            s.targetOffsetX = 0;
          } else {
            const GAP_BETWEEN = STRIPE_GAP * 1.4;
            const off = dist * (baseW + GAP_BETWEEN);
            s.targetOffsetX = sign * off * neighbourEase;
          }
        } else {
          // At rest: lerp toward the responsive `fit` scale so every stripe
          // stays within the viewport regardless of width.
          s.targetScaleX = fit;
          s.targetScaleY = fit;
          s.targetOffsetX = 0;
        }
        const layoutLerp = sel ? 0.078 : 0.09;
        s.scaleX += (s.targetScaleX - s.scaleX) * layoutLerp;
        s.scaleY += (s.targetScaleY - s.scaleY) * layoutLerp;
        s.offsetX += (s.targetOffsetX - s.offsetX) * layoutLerp;
        s.mesh.scale.x = s.scaleX;
        s.mesh.scale.y = s.scaleY;
        // Update the shader's stripeSize uniform so the cover-fit math sees
        // the actual rendered shape. Without this, growing scaleX/scaleY
        // asymmetrically while the uniform stays at the original [110, 380]
        // makes the texture appear stretched.
        const renderedW = STRIPE_WIDTH * s.scaleX;
        const renderedH = STRIPE_HEIGHT * s.scaleY;
        s.width = renderedW;
        s.height = renderedH;
        s.program.uniforms.uStripeSize.value = [renderedW, renderedH];
        // mesh.position.x is set by the entrance choreography above; here we
        // add the IN-mode offset on top so they compose. The entrance is
        // long-finished by the time anyone clicks, so this is additive only.
        if (!entranceActive) {
          s.mesh.position.x = s.x - current + s.offsetX;
        }

        // Phase 2 — Y-axis tilt around stripe centre. Mesh local rotation
        // pivots about the stripe's own origin (Plane is centred), which
        // matches Aristide's `translate(centre) ⇒ rotateY ⇒ translate(-centre)`
        // dance.
        s.mesh.rotation.y = -0.4 * latencyR;

        // Phase 2 — texture pan: a tiny V offset on hover to give the image
        // a "settling into frame" feel.
        s.targetPanY = isHovered ? 0.025 : 0;
        s.panY += (s.targetPanY - s.panY) * 0.1;

        s.program.uniforms.uGap.value = gap;
        s.program.uniforms.uHover.value = s.hover;
        s.program.uniforms.uDimmed.value = s.dimmed;
        s.program.uniforms.uLatencyX.value = latencyX;
        s.program.uniforms.uPanY.value = s.panY;
        s.program.uniforms.uOpacity.value = s.opacity;
        // Visibility-gated media work. World-space distance from camera
        // centre, including the IN-mode offset so neighbours of an open
        // card stay considered visible.
        const worldDist = Math.abs(s.x - current + s.offsetX);
        if (worldDist <= preloadRange) {
          loadStripeMedia(s);
        }
        if (s.video && s.mediaLoaded) {
          if (worldDist <= videoPlayRange) {
            if (s.video.paused) s.video.play().catch(() => {});
          } else if (!s.video.paused) {
            s.video.pause();
          }
        }
        if (s.video && s.video.readyState >= s.video.HAVE_CURRENT_DATA) {
          // Only re-upload when the decoder reports a fresh frame
          // (rVFC). When the API isn't available, fall back to per-tick
          // upload so the video still animates.
          if (typeof s.video.requestVideoFrameCallback === 'function') {
            if (s.hasNewVideoFrame) {
              s.texture.needsUpdate = true;
              s.hasNewVideoFrame = false;
            }
          } else {
            s.texture.needsUpdate = true;
          }
        }
      }

      // Custom dot cursor (Cursor.jsx) reads data-cursor on the canvas to
      // decide whether to grow. Toggle the attribute as hover state changes.
      if (hoveredIndex >= 0 && !canvas.dataset.cursor) {
        canvas.dataset.cursor = 'hover';
      } else if (hoveredIndex < 0 && canvas.dataset.cursor) {
        delete canvas.dataset.cursor;
      }

      renderer.render({ scene, camera });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointercancel', onPointerLeave);
      stripes.forEach((s) => {
        try {
          s.mesh.geometry.remove?.();
          s.program.remove?.();
          if (s.video) {
            s.video.pause();
            s.video.removeAttribute('src');
            s.video.load();
            s.video.parentNode?.removeChild(s.video);
          }
        } catch {
        // best-effort — context may already be gone
      }
      });
      // Intentionally NOT calling WEBGL_lose_context here — under React
      // StrictMode the effect mounts → cleans up → re-mounts immediately, and
      // killing the context made the second mount's shader compile fail
      // silently (visible as an empty canvas).
    };
  }, []);

  return (
    <div className="gallery-gl__stage" ref={stageRef}>
      <canvas ref={canvasRef} className="gallery-gl__canvas" />
    </div>
  );
}
