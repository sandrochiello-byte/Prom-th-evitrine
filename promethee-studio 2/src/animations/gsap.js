/* ============================================================
   PROMÉTHÉE STUDIO — animations/gsap.js
   Hero entrance, cursor, magnetic buttons, grain canvas
   ============================================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────
//  LOADER  → HERO ENTRANCE
// ──────────────────────────────────────────────────────────
export function runLoader(onComplete) {
  const loader   = document.getElementById('loader');
  const fill     = document.getElementById('loader-fill');
  const label    = document.getElementById('loader-label');

  if (!loader) { onComplete?.(); return; }

  let count = 0;
  const target = 100;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 6) + 2;
    if (count >= target) { count = target; clearInterval(interval); }
    fill.style.width = count + '%';
    label.textContent = String(count).padStart(3, '0');
  }, 28);

  // When count reaches 100 the interval clears; fire exit after short pause
  const check = setInterval(() => {
    if (count >= 100) {
      clearInterval(check);
      setTimeout(() => {
        const tl = gsap.timeline({ onComplete });
        tl.to(loader, {
          yPercent: -100,
          duration: 1.1,
          ease: 'power4.inOut',
        });
      }, 200);
    }
  }, 30);
}

// ──────────────────────────────────────────────────────────
//  HERO ENTRANCE TIMELINE
// ──────────────────────────────────────────────────────────
export function initHeroEntrance() {
  const tl = gsap.timeline({ delay: 0.15 });

  // Logo fade in
  tl.to('.hero-logo', {
    opacity: 1,
    duration: 1.0,
    ease: 'power2.out',
  });

  // Title words: clip-path reveal (inset bottom → 0)
  tl.to('.tw', {
    clipPath: 'inset(0 0 0% 0)',
    duration: 1.3,
    ease: 'power4.out',
    stagger: { amount: 0.5 },
  });

  // Eyebrow fade up
  tl.to('.hero-eyebrow', {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power3.out',
  }, '-=0.7');

  // Subtitle slide up from inside overflow
  tl.to('.hero-sub em', {
    y: '0%',
    duration: 1,
    ease: 'power3.out',
  }, '-=0.5');

  // CTA
  tl.to('#btn-hero', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.4');

  // Scroll hint
  tl.to('.hero-scroll-hint', {
    opacity: 1,
    duration: 1,
    ease: 'none',
  }, '-=0.2');

  return tl;
}

// ──────────────────────────────────────────────────────────
//  MAGNETIC BUTTONS
// ──────────────────────────────────────────────────────────
export function initMagnetic() {
  document.querySelectorAll('[data-mag]').forEach((el) => {
    let bounds = {};

    const refresh = () => { bounds = el.getBoundingClientRect(); };
    refresh();
    window.addEventListener('resize', refresh);

    el.addEventListener('mousemove', (e) => {
      const cx = bounds.left + bounds.width  / 2;
      const cy = bounds.top  + bounds.height / 2;
      const dx = (e.clientX - cx) * 0.38;
      const dy = (e.clientY - cy) * 0.38;
      gsap.to(el, { x: dx, y: dy, duration: 0.55, ease: 'power3.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)' });
    });
  });
}

// ──────────────────────────────────────────────────────────
//  CUSTOM CURSOR
// ──────────────────────────────────────────────────────────
export function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor || window.matchMedia('(max-width:768px)').matches) return;

  const dot  = cursor.querySelector('.cursor-dot');
  const ring = cursor.querySelector('.cursor-ring');

  let rx = 0, ry = 0, mx = 0, my = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    // dot snaps instantly
    gsap.set(dot,    { x: mx, y: my });
  });

  // Ring lags behind
  (function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(animateRing);
  })();

  // Hover classes
  document.querySelectorAll('button, a, [data-mag]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

// ──────────────────────────────────────────────────────────
//  ANIMATED GRAIN (canvas-based, no SVG filter needed)
// ──────────────────────────────────────────────────────────
export function initGrain() {
  const canvas = document.getElementById('grain-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h, patternData;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function drawGrain() {
    requestAnimationFrame(drawGrain);

    const imageData = ctx.createImageData(w, h);
    const data      = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      data[i]     = v;
      data[i + 1] = v;
      data[i + 2] = v;
      data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  // Run at reduced rate for performance
  let last = 0;
  function throttledGrain(ts) {
    if (ts - last > 40) { // ~25 fps grain flicker
      last = ts;
      const imageData = ctx.createImageData(w, h);
      const data      = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
    }
    requestAnimationFrame(throttledGrain);
  }
  requestAnimationFrame(throttledGrain);
}
