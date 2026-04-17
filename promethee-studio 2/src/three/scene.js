/* ============================================================
   PROMÉTHÉE STUDIO — scene.js
   Three.js scenes: hero particles, showcase 3D, finale embers
   ============================================================ */

import * as THREE from 'three';
import {
  heroParticleVert, heroParticleFrag,
  showcaseVert,     showcaseFrag,
  emberVert,        emberFrag,
} from './shaders.js';

// ──────────────────────────────────────────────────────────
//  Shared mouse state (updated once, read by all scenes)
// ──────────────────────────────────────────────────────────
const mouse = { x: 0, y: 0, nx: 0, ny: 0 };
window.addEventListener('mousemove', (e) => {
  mouse.x  = e.clientX;
  mouse.y  = e.clientY;
  mouse.nx = (e.clientX / window.innerWidth)  * 2 - 1;
  mouse.ny = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ──────────────────────────────────────────────────────────
//  SCENE 1 — HERO PARTICLES
// ──────────────────────────────────────────────────────────
export function initHeroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 6);

  // ── Particle geometry ──
  const TOTAL = 12000;
  const positions  = new Float32Array(TOTAL * 3);
  const rands      = new Float32Array(TOTAL);
  const phases     = new Float32Array(TOTAL);
  const bands      = new Float32Array(TOTAL);

  for (let i = 0; i < TOTAL; i++) {
    const i3  = i * 3;
    const r   = Math.pow(Math.random(), 0.6) * 10;
    const th  = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i3 + 0] = r * Math.sin(phi) * Math.cos(th) * 1.6;
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(th) * 0.55;
    positions[i3 + 2] = r * Math.cos(phi);

    rands[i]  = 0.3 + Math.random() * 0.7;
    phases[i] = Math.random() * Math.PI * 2;
    bands[i]  = Math.floor(Math.random() * 5) / 4;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('aRand',    new THREE.BufferAttribute(rands, 1));
  geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));
  geo.setAttribute('aBand',    new THREE.BufferAttribute(bands, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader:   heroParticleVert,
    fragmentShader: heroParticleFrag,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: 280 },
    },
    transparent:  true,
    depthWrite:   false,
    blending:     THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // ── Second ring (sparse outer halo) ──
  const HALO = 2000;
  const hPos = new Float32Array(HALO * 3);
  const hRnd = new Float32Array(HALO);
  const hPhs = new Float32Array(HALO);
  const hBnd = new Float32Array(HALO);
  for (let i = 0; i < HALO; i++) {
    const i3  = i * 3;
    const r   = 9 + Math.random() * 4;
    const th  = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    hPos[i3]     = r * Math.sin(phi) * Math.cos(th);
    hPos[i3 + 1] = r * Math.sin(phi) * Math.sin(th) * 0.2;
    hPos[i3 + 2] = r * Math.cos(phi);
    hRnd[i] = Math.random() * 0.4;
    hPhs[i] = Math.random() * Math.PI * 2;
    hBnd[i] = Math.random();
  }
  const hGeo = new THREE.BufferGeometry();
  hGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
  hGeo.setAttribute('aRand',    new THREE.BufferAttribute(hRnd, 1));
  hGeo.setAttribute('aPhase',   new THREE.BufferAttribute(hPhs, 1));
  hGeo.setAttribute('aBand',    new THREE.BufferAttribute(hBnd, 1));
  const hMat = new THREE.ShaderMaterial({
    vertexShader:   heroParticleVert,
    fragmentShader: heroParticleFrag,
    uniforms: { uTime: { value: 0 }, uSize: { value: 160 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(hGeo, hMat));

  // ── RAF ──
  let raf;
  const camTarget = new THREE.Vector3();
  function tick(t) {
    raf = requestAnimationFrame(tick);
    const elapsed = t * 0.001;
    mat.uniforms.uTime.value = elapsed;
    hMat.uniforms.uTime.value = elapsed;

    camTarget.set(mouse.nx * 1.2, mouse.ny * 0.7, 0);
    camera.position.lerp(new THREE.Vector3(camTarget.x, camTarget.y, 6), 0.025);
    camera.lookAt(0, 0, 0);

    points.rotation.y = elapsed * 0.04;
    renderer.render(scene, camera);
  }
  tick(0);

  // ── Resize ──
  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  return () => { cancelAnimationFrame(raf); renderer.dispose(); window.removeEventListener('resize', onResize); };
}

// ──────────────────────────────────────────────────────────
//  SCENE 2 — 3D SHOWCASE (Torus Knot)
// ──────────────────────────────────────────────────────────
export function initShowcaseScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 8);

  // ── Main mesh ──
  const geo = new THREE.TorusKnotGeometry(2.2, 0.65, 220, 30, 2, 3);
  const mat = new THREE.ShaderMaterial({
    vertexShader:   showcaseVert,
    fragmentShader: showcaseFrag,
    uniforms: {
      uTime:       { value: 0 },
      uColorFire:  { value: new THREE.Color(0x0d2a6e) },
      uColorEmber: { value: new THREE.Color(0x2563eb) },
    },
    transparent: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  // ── Wireframe overlay ──
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x3b82f6, wireframe: true,
    transparent: true, opacity: 0.06,
  });
  const wire = new THREE.Mesh(geo, wireMat);
  wire.scale.setScalar(1.018);
  scene.add(wire);

  // ── Orbit dust ring ──
  const DUST = 280;
  const dPos  = new Float32Array(DUST * 3);
  const dRand = new Float32Array(DUST);
  const dPhase = new Float32Array(DUST);
  const dBand  = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    const a = (i / DUST) * Math.PI * 2;
    const radius = 3.2 + (Math.random() - 0.5) * 0.6;
    dPos[i * 3]     = Math.cos(a) * radius;
    dPos[i * 3 + 1] = (Math.random() - 0.5) * 0.6;
    dPos[i * 3 + 2] = Math.sin(a) * radius;
    dRand[i]  = 0.3 + Math.random() * 0.4;
    dPhase[i] = a;
    dBand[i]  = 0.5;
  }
  const dGeo = new THREE.BufferGeometry();
  dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
  dGeo.setAttribute('aRand',    new THREE.BufferAttribute(dRand, 1));
  dGeo.setAttribute('aPhase',   new THREE.BufferAttribute(dPhase, 1));
  dGeo.setAttribute('aBand',    new THREE.BufferAttribute(dBand, 1));
  const dMat = new THREE.ShaderMaterial({
    vertexShader: heroParticleVert, fragmentShader: heroParticleFrag,
    uniforms: { uTime: { value: 0 }, uSize: { value: 200 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(dGeo, dMat));

  // ── Environment light (fake) ──
  scene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const pl = new THREE.PointLight(0x2563eb, 3.0, 18);
  pl.position.set(4, 3, 5);
  scene.add(pl);

  // ── Section visibility ──
  const section = canvas.closest('.section--showcase');
  let visible   = false;
  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  if (section) io.observe(section);

  // ── RAF ──
  let raf;
  const rotTarget = { x: 0, y: 0 };
  function tick(t) {
    raf = requestAnimationFrame(tick);
    if (!visible) return;

    const elapsed = t * 0.001;
    mat.uniforms.uTime.value = elapsed;
    dMat.uniforms.uTime.value = elapsed;

    rotTarget.x += (mouse.ny * 0.8 - rotTarget.x) * 0.06;
    rotTarget.y += (mouse.nx * 0.8 - rotTarget.y) * 0.06;

    mesh.rotation.x = elapsed * 0.22 + rotTarget.x * 0.55;
    mesh.rotation.y = elapsed * 0.18 + rotTarget.y * 0.55;
    wire.rotation.copy(mesh.rotation);

    pl.position.x = Math.sin(elapsed * 0.4) * 5 + mouse.nx * 2;
    pl.position.y = Math.cos(elapsed * 0.3) * 3 + mouse.ny * 1.5;

    renderer.render(scene, camera);
  }
  tick(0);

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  return () => { cancelAnimationFrame(raf); io.disconnect(); renderer.dispose(); window.removeEventListener('resize', onResize); };
}

// ──────────────────────────────────────────────────────────
//  SCENE 3 — FINALE EMBERS
// ──────────────────────────────────────────────────────────
export function initFinaleScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  const COUNT = 600;
  const pos   = new Float32Array(COUNT * 3);
  const life  = new Float32Array(COUNT);
  const speed = new Float32Array(COUNT);
  const side  = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3]     = (Math.random() - 0.5) * 6;
    pos[i * 3 + 1] = -2.5 + (Math.random() - 0.5) * 0.5;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 2;
    life[i]  = Math.random();
    speed[i] = 0.4 + Math.random() * 0.6;
    side[i]  = (Math.random() - 0.5) * 2;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aLife',    new THREE.BufferAttribute(life, 1));
  geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speed, 1));
  geo.setAttribute('aSide',    new THREE.BufferAttribute(side, 1));

  const mat = new THREE.ShaderMaterial({
    vertexShader: emberVert, fragmentShader: emberFrag,
    uniforms: { uTime: { value: 0 } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  scene.add(new THREE.Points(geo, mat));

  const section = canvas.closest('.section--finale');
  let visible   = false;
  const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; }, { threshold: 0.1 });
  if (section) io.observe(section);

  let raf;
  function tick(t) {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    mat.uniforms.uTime.value = t * 0.001;
    renderer.render(scene, camera);
  }
  tick(0);

  function onResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', onResize);

  return () => { cancelAnimationFrame(raf); io.disconnect(); renderer.dispose(); window.removeEventListener('resize', onResize); };
}
