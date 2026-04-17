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
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loader-fill');
  const label  = document.getElementById('loader-label');

  if (!loader) { onComplete?.(); return; }

  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 6) + 2;
    if (count >= 100) { count = 100; clearInterval(interval); }
    fill.style.width = count + '%';
    label.textContent = String(count).padStart(3, '0');
  }, 28);

  const check = setInterval(() => {
    if (count >= 100) {
      clearInterval(check);
      setTimeout(() => {
        gsap.timeline({ onComplete }).to(loader, {
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

  tl.to('.hero-logo', { opacity: 1, duration: 1.0, ease: 'power2.out' });

  tl.to('.tw', {
    clipPath: 'inset(0 0 0% 0)',
    duration: 1.3,
    ease: 'power4.out',
    stagger: { amount: 0.5 },
  });

  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.7');
  tl.to('.hero-sub em',  { y: '0%',   duration: 1,   ease: 'power3.out' }, '-=0.5');
  tl.to('#btn-hero',     { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4');
  tl.to('.hero-scroll-hint', { opacity: 1, duration: 1, ease: 'none' }, '-=0.2');

  // ── "Begin the sequence" scrolls to #story ──────────────
  document.getElementById('btn-hero')?.addEventListener('click', () => {
    document.getElementById('story')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  return tl;
}

// ──────────────────────────────────────────────────────────
//  MAGNETIC BUTTONS
//  KEY FIX: we move [data-mag] which is .btn-inner, NOT the
//  <button> itself. The click target never moves.
// ──────────────────────────────────────────────────────────
export function initMagnetic() {
  document.querySelectorAll('[data-mag]').forEach((inner) => {
    // The magnetic zone is the closest ancestor button/a, or the element itself
    const zone = inner.closest('button, a') || inner;

    zone.addEventListener('mousemove', (e) => {
      // Recalculate bounds on every move → prevents stale-position jump
      const b  = zone.getBoundingClientRect();
      const cx = b.left + b.width  / 2;
      const cy = b.top  + b.height / 2;
      const dx = (e.clientX - cx) * 0.28;
      const dy = (e.clientY - cy) * 0.28;
      // Move only the inner content element, zone stays fixed
      gsap.to(inner, { x: dx, y: dy, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    });

    zone.addEventListener('mouseleave', () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
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
    gsap.set(dot, { x: mx, y: my });
  });

  (function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    gsap.set(ring, { x: rx, y: ry });
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('button, a, [data-mag]').forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
  });
}

// ──────────────────────────────────────────────────────────
//  ANIMATED GRAIN
// ──────────────────────────────────────────────────────────
export function initGrain() {
  const canvas = document.getElementById('grain-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let last = 0;
  function tick(ts) {
    if (ts - last > 40) {
      last = ts;
      const img  = ctx.createImageData(w, h);
      const data = img.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
