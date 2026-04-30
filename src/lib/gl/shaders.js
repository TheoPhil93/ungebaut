// Vertex shader — ported from Aristide Benoist's reference. The static
// cylindrical bend keeps the strip arched at rest. The scroll-driven wave is
// a bell-curve in Z — centre stripes are pushed FORWARD (toward the camera)
// while the user scrolls, so perspective makes them grow + brighten. Edges
// stay put. As the lerp settles, uLatencyX → 0 and stripes return flat.
export const stripeVertex = /* glsl */ `
attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float uGap;        // signed (target − current), world px (kept for legacy)
uniform vec2  uViewport;   // canvas size in css px
uniform float uIndex;      // stripe index 0..n-1
uniform vec2  uStripeSize; // stripe size, world px
uniform float uWaveRange;  // world px affected by scroll inertia
uniform float uLatencyX;   // 0..1 — scroll inertia magnitude

varying vec2  vUv;
varying float vDist;
varying float vWave;

// easeInOutQuad — same as Aristide's reference shader
float ease(float t) {
  return t < 0.5 ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
}

void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);

  float halfW = uViewport.x * 0.5;
  float distNorm = clamp(worldPos.x / halfW, -1.6, 1.6);
  vDist = distNorm;

  // Strip is FLAT at rest — no static cylindrical bend. The only Z motion
  // comes from the scroll wave below, so a paused gallery reads as a clean
  // horizontal row. Bell-curve push proportional to scroll speed: edges
  // stay flat, centre lifts toward the camera by ~waveRange * uLatencyX.
  // uLatencyX is gated by a threshold in JS so gentle scroll = no wave,
  // fast scroll = full wave.
  float waveRange = uWaveRange;
  float k = abs(worldPos.x);
  float waveZ = 0.0;
  if (k < waveRange) {
    waveZ = (waveRange - ease(k / waveRange) * waveRange) * uLatencyX;
  }
  vWave = waveZ;

  worldPos.z += waveZ;

  gl_Position = projectionMatrix * viewMatrix * worldPos;
  vUv = uv;
}
`;

// Fragment shader — cover-fit the texture, dim + desaturate by default,
// fade to full colour with hover OR with vWave (centre lifts during scroll).
export const stripeFragment = /* glsl */ `
precision highp float;

uniform sampler2D uTexture;
uniform vec2  uTextureSize;
uniform vec2  uStripeSize;
uniform float uHover;     // 0..1 smoothed
uniform float uDimmed;    // 0..1 smoothed (for non-selected stripes)
uniform float uTexLoaded; // 0 → use accent fallback, 1 → use texture
uniform float uPanY;      // 0..1 — texture V offset on hover (Aristide's pY)
uniform float uOpacity;   // 0..1 — entrance fade-in
uniform vec3  uAccent;
uniform vec3  uAccentSoft;
uniform vec3  uTint;      // page detailBg colour — overlays neighbours when sel
uniform float uTintStrength; // 0..1 — how strongly uTint covers this stripe

varying vec2  vUv;
varying float vDist;
varying float vWave;

void main() {
  vec2 ratio = vec2(
    min((uStripeSize.x / uStripeSize.y) / (uTextureSize.x / uTextureSize.y), 1.0),
    min((uStripeSize.y / uStripeSize.x) / (uTextureSize.y / uTextureSize.x), 1.0)
  );
  // uPanY shifts the V coordinate so the texture seems to pan inside its
  // frame on hover — mirrors Aristide's pY uniform.
  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5 + uPanY
  );

  vec4 tex = texture2D(uTexture, uv);

  vec3 fallback = mix(uAccentSoft, uAccent, vUv.y);
  vec3 src      = mix(fallback, tex.rgb, uTexLoaded);

  float gray = dot(src, vec3(0.299, 0.587, 0.114));
  vec3 bw    = vec3(gray) * 0.55;

  // Brightness lift = hover + scroll-wave brightness. Mirrors Aristide's
  // mix(grayscale, source, d + o) where d is the wave's Z push.
  float lift = clamp(uHover + min(vWave * 0.005, 0.7), 0.0, 1.0);
  vec3 col = mix(bw, src, lift);

  float bottomDim = smoothstep(0.45, 1.0, vUv.y) * (1.0 - uHover) * 0.55;
  col *= 1.0 - bottomDim;

  // Soft darken first (kept for browse-mode hover dim).
  col = mix(col, col * 0.55, uDimmed);

  // In-mode neighbour tint: blend toward the page BG colour so the side
  // cards read as colour-washed companions to the focused image, instead of
  // competing for attention.
  col = mix(col, uTint, clamp(uTintStrength, 0.0, 1.0));

  gl_FragColor = vec4(col, uOpacity);
}
`;
