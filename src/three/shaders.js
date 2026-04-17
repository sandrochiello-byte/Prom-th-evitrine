/* ============================================================
   PROMÉTHÉE STUDIO — shaders.js  (Premium Blue Edition)
   ============================================================ */

// ── HERO PARTICLES — deep navy + electric blue + pale silver ──
export const heroParticleVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aRand;
  attribute float aPhase;
  attribute float aBand;
  varying float vAlpha;
  varying vec3  vColor;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  void main() {
    vec3 pos = position;
    float t = uTime * 0.35 + aPhase;
    pos.x += sin(t + pos.z * 0.4) * 0.32 * aRand;
    pos.y += cos(t * 0.7 + pos.x * 0.3) * 0.26 * aRand;
    pos.z += sin(t * 0.5 + pos.y * 0.5) * 0.18 * aRand;
    pos.y += sin(uTime * 0.1 + aBand * 3.14) * 0.5;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float dist = -mvPos.z;
    gl_PointSize = uSize * aRand / dist;
    gl_PointSize = clamp(gl_PointSize, 0.3, 7.0);

    /* Colour: deep navy → royal blue → pale ice white */
    float heat = fract(hash(vec2(aRand, aPhase)) + uTime * 0.02 * aBand);
    vec3 navy  = vec3(0.06, 0.12, 0.32);
    vec3 blue  = vec3(0.18, 0.42, 0.95);
    vec3 ice   = vec3(0.72, 0.86, 1.0);
    vColor = mix(mix(navy, blue, heat), ice, heat * heat * 0.6);
    vAlpha = aRand * 0.7;
  }
`;

export const heroParticleFrag = /* glsl */ `
  varying float vAlpha;
  varying vec3  vColor;
  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float soft = 1.0 - smoothstep(0.08, 0.5, dist);
    gl_FragColor = vec4(vColor, soft * vAlpha);
  }
`;

// ── SHOWCASE TORUS-KNOT — blue metallic with ice fresnel ──
export const showcaseVert = /* glsl */ `
  uniform float uTime;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vPos;
  varying float vNoise;

  float hash3(vec3 p) {
    p = fract(p * vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yxz + 19.19);
    return fract((p.x + p.y) * p.z);
  }
  float noise3(vec3 p) {
    vec3 i = floor(p); vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash3(i), hash3(i+vec3(1,0,0)), f.x),
          mix(hash3(i+vec3(0,1,0)), hash3(i+vec3(1,1,0)), f.x), f.y),
      mix(mix(hash3(i+vec3(0,0,1)), hash3(i+vec3(1,0,1)), f.x),
          mix(hash3(i+vec3(0,1,1)), hash3(i+vec3(1,1,1)), f.x), f.y), f.z);
  }

  void main() {
    vUv = uv; vNormal = normalize(normalMatrix * normal);
    float n = noise3(position * 2.0 + uTime * 0.2);
    float disp = n * 0.14;
    vec3 displaced = position + normal * disp;
    vPos = displaced; vNoise = n;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

export const showcaseFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3  uColorFire;
  uniform vec3  uColorEmber;
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vPos;
  varying float vNoise;

  void main() {
    vec3  viewDir = normalize(cameraPosition - vPos);
    float fresnel = 1.0 - abs(dot(vNormal, viewDir));
    fresnel = pow(fresnel, 2.0);

    vec3  light = normalize(vec3(0.8, 1.0, 0.7));
    float diff  = max(dot(vNormal, light), 0.0) * 0.65 + 0.35;

    /* Animated noise colour blend — deep navy to royal blue */
    float t   = vNoise * 1.1 + sin(uTime * 0.35 + vPos.y) * 0.12;
    vec3  col = mix(uColorFire, uColorEmber, clamp(t, 0.0, 1.0));

    /* Ice-white rim */
    col += fresnel * vec3(0.7, 0.88, 1.0) * 1.2;
    col *= diff;
    col  = mix(col * 0.3, col, clamp(fresnel * 2.0 + 0.35, 0.0, 1.0));

    gl_FragColor = vec4(col, 0.9);
  }
`;

// ── FINALE SPARKS — blue sparks rising upward ──
export const emberVert = /* glsl */ `
  uniform float uTime;
  attribute float aLife;
  attribute float aSpeed;
  attribute float aSide;
  varying float vAge;
  varying vec3  vCol;

  void main() {
    float t   = mod(uTime * aSpeed + aLife, 1.0);
    vec3 pos  = position;
    pos.y    += t * 4.5;
    pos.x    += aSide * sin(t * 3.14) * 1.1;
    pos.z    += sin(t * 6.28 + aLife * 10.0) * 0.25;
    vAge = t;

    /* Deep navy → electric blue → pale white */
    float heat = 1.0 - t;
    vec3 navy  = vec3(0.05, 0.1, 0.3);
    vec3 blue  = vec3(0.14, 0.4, 0.95);
    vec3 white = vec3(0.82, 0.92, 1.0);
    vCol = mix(mix(navy, blue, heat * 1.2), white, pow(heat, 2.8));

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;
    gl_PointSize = (1.0 - t) * 5.5 + 1.0;
    gl_PointSize = clamp(gl_PointSize / -mvPos.z * 5.0, 0.4, 7.0);
  }
`;

export const emberFrag = /* glsl */ `
  varying float vAge;
  varying vec3  vCol;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = (1.0 - vAge * 1.1) * (1.0 - d * 2.0);
    gl_FragColor = vec4(vCol, clamp(a, 0.0, 1.0));
  }
`;
