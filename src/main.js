/* ============================================================
   PROMÉTHÉE STUDIO — main.js
   Entry point: init all systems
   ============================================================ */

import './styles.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Three.js scenes
import { initHeroScene, initShowcaseScene, initFinaleScene } from './three/scene.js';

// Animation modules
import {
  runLoader,
  initHeroEntrance,
  initMagnetic,
  initCursor,
  initGrain,
} from './animations/gsap.js';

import {
  initScrollStory,
  initShowcaseScroll,
  initKineticType,
  initTimelineScroll,
  initFinaleScroll,
  initChapterNav,
  initShowcaseNote,
  initKineticSub,
  initFinaleDeclaration,
} from './animations/scroll.js';

// ──────────────────────────────────────────────────────────
//  Register GSAP plugins
// ──────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────
//  Reduced-motion gate
// ──────────────────────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ──────────────────────────────────────────────────────────
//  Bootstrap
// ──────────────────────────────────────────────────────────
function bootstrap() {
  // ── Cursor & grain run immediately ──
  initCursor();
  initGrain();

  // ── Three.js scenes — start rendering immediately ──
  const heroCanvas     = document.getElementById('hero-canvas');
  const showcaseCanvas = document.getElementById('showcase-canvas');
  const finaleCanvas   = document.getElementById('finale-canvas');

  if (heroCanvas)     initHeroScene(heroCanvas);
  if (showcaseCanvas) initShowcaseScene(showcaseCanvas);
  if (finaleCanvas)   initFinaleScene(finaleCanvas);

  // ── ScrollTrigger defaults ──
  ScrollTrigger.defaults({ once: false });

  // ── Scroll-driven sections ──
  initScrollStory();
  initShowcaseScroll();
  initShowcaseNote();
  initKineticType();
  initKineticSub();
  initTimelineScroll();
  initFinaleScroll();
  initFinaleDeclaration();
  initChapterNav();

  // ── Magnetic buttons ──
  initMagnetic();

  // ── Loader → Hero entrance ──
  if (prefersReducedMotion) {
    // Skip loader, show content immediately
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
    initHeroEntrance();
  } else {
    runLoader(() => {
      initHeroEntrance();
    });
  }

  // ── Refresh ScrollTrigger after fonts / images settle ──
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });

  // ── matchMedia: desktop vs mobile ──
  const mm = gsap.matchMedia();

  mm.add('(min-width: 769px)', () => {
    // Desktop-only extras
    // Parallax hero title on scroll
    gsap.to('.hero-title', {
      y: -80,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start:   'top top',
        end:     'bottom top',
        scrub:   1.5,
      },
    });

    // Hero content slow-fade out
    gsap.to('.hero-content', {
      opacity: 0,
      y: -40,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start:   'center top',
        end:     'bottom top',
        scrub:   true,
      },
    });
  });

  mm.add('(max-width: 768px)', () => {
    // Mobile simplification — reduce animation complexity
    gsap.set('.tw', { clipPath: 'inset(0 0 0% 0)' });
  });
}

// Run on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
