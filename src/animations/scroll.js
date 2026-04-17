/* ============================================================
   PROMÉTHÉE STUDIO — animations/scroll.js
   All ScrollTrigger-based animations
   ============================================================ */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ──────────────────────────────────────────────────────────
//  SECTION 2 — SCROLL STORY (horizontal pin + scrub)
// ──────────────────────────────────────────────────────────
export function initScrollStory() {
  const outer = document.getElementById('story-outer');
  const track = document.getElementById('story-track');
  if (!outer || !track) return;

  const panels     = track.querySelectorAll('.story-panel');
  const panelWidth = window.innerWidth;
  const totalSlide = panelWidth * (panels.length - 1);

  // Size the outer container so pin has room to scroll
  outer.style.height = `${100 + panels.length * 100}vh`;

  const mainST = ScrollTrigger.create({
    id: 'storyPin',
    trigger: outer,
    start:   'top top',
    end:     () => `+=${totalSlide + window.innerHeight}`,
    pin:     track,
    pinSpacing: false,
    anticipatePin: 1,
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      const x = -self.progress * totalSlide;
      gsap.set(track, { x });

      // Panel reveal logic based on which panel is "active"
      panels.forEach((panel, i) => {
        const panelProgress = gsap.utils.clamp(
          0, 1,
          (self.progress * (panels.length - 1)) - i + 1
        );
        const words = panel.querySelectorAll('.sp-word');
        words.forEach((w, wi) => {
          const wProg = gsap.utils.clamp(0, 1, (panelProgress - wi * 0.25) * 2);
          gsap.set(w, { clipPath: `inset(0 ${(1 - wProg) * 100}% 0 0)` });
        });

        const body = panel.querySelector('.sp-body');
        if (body) {
          const bProg = gsap.utils.clamp(0, 1, (panelProgress - 0.7) * 3);
          gsap.set(body, { opacity: bProg, y: (1 - bProg) * 12 });
        }
      });
    },
  });

  // Parallax decorations
  const decos = [
    { sel: '.deco-circle', speed: -0.18 },
    { sel: '.deco-lines',  speed:  0.3  },
    { sel: '.deco-ring',   speed: -0.1  },
  ];
  decos.forEach(({ sel, speed }) => {
    gsap.to(sel, {
      y: () => totalSlide * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: outer,
        start:   'top top',
        end:     () => `+=${totalSlide + window.innerHeight}`,
        scrub:   true,
      },
    });
  });

  // Refresh on resize
  window.addEventListener('resize', () => {
    outer.style.height = `${100 + panels.length * 100}vh`;
    ScrollTrigger.refresh();
  });
}

// ──────────────────────────────────────────────────────────
//  SECTION 3 — SHOWCASE ENTRY
// ──────────────────────────────────────────────────────────
export function initShowcaseScroll() {
  // Title lines
  gsap.to('.sc-line', {
    clipPath: 'inset(0 0% 0 0)',
    duration: 1.3,
    ease: 'power4.out',
    stagger: 0.16,
    scrollTrigger: {
      trigger: '#showcase',
      start:   'top 65%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.to('.sc-hint', {
    opacity: 1,
    duration: 0.8,
    delay: 0.6,
    scrollTrigger: {
      trigger: '#showcase',
      start:   'top 60%',
      toggleActions: 'play none none reverse',
    },
  });

  // Stats count-up
  document.querySelectorAll('.s-stat').forEach((stat) => {
    const numEl  = stat.querySelector('.s-num');
    const target = parseInt(stat.dataset.target, 10);
    const obj    = { v: 0 };

    gsap.to(numEl, {
      opacity: 1, y: 0,
      duration: 0.8, ease: 'power3.out',
      scrollTrigger: {
        trigger: stat, start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.to(obj, {
      v: target,
      duration: 2.2,
      ease: 'power2.out',
      onUpdate: () => { numEl.textContent = Math.round(obj.v); },
      scrollTrigger: {
        trigger: stat, start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
    });
  });
}

// ──────────────────────────────────────────────────────────
//  SECTION 4 — KINETIC TYPE
// ──────────────────────────────────────────────────────────
export function initKineticType() {
  // Headline entrance
  gsap.to('#k-headline', {
    opacity: 1,
    y: 0,
    duration: 1.3,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '#kinetic',
      start:   'top 70%',
      toggleActions: 'play none none reverse',
    },
  });

  // Mouse distortion on "impossible"
  const distort = document.getElementById('k-distort');
  if (distort) {
    let vx = 0;
    document.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      vx = nx;
      gsap.to(distort, {
        skewX:   nx * 12,
        scaleX:  1 + Math.abs(nx) * 0.18,
        filter:  `blur(${Math.abs(nx) * 3}px)`,
        duration: 0.35,
        ease:     'power2.out',
        overwrite: 'auto',
      });
    });
  }

  // Marquee speed modulation on scroll velocity
  const tracks = [
    document.querySelectorAll('#mq1 .mq-inner'),
    document.querySelectorAll('#mq2 .mq-inner'),
  ];

  let lastScroll = window.scrollY;
  let ticking    = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        const delta    = window.scrollY - lastScroll;
        lastScroll     = window.scrollY;
        const speedMod = 1 + Math.abs(delta) * 0.04;
        tracks.forEach((nodeList, idx) => {
          nodeList.forEach((el) => {
            const dir = idx === 1 ? -1 : 1;
            gsap.to(el, {
              timeScale: dir * speedMod,
              duration:  0.5,
              overwrite: 'auto',
            });
          });
        });
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ──────────────────────────────────────────────────────────
//  SECTION 5 — TIMELINE
// ──────────────────────────────────────────────────────────
export function initTimelineScroll() {
  // Title reveal
  gsap.to('.tl-title-inner', {
    y: '0%',
    duration: 1.4,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '.section--timeline',
      start:   'top 72%',
      toggleActions: 'play none none reverse',
    },
  });

  // Card stagger
  const items = gsap.utils.toArray('.tl-item');
  items.forEach((item, i) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: 'power3.out',
      delay: (i % 3) * 0.08,
      scrollTrigger: {
        trigger: item,
        start:   'top 88%',
        toggleActions: 'play none none reverse',
      },
    });
  });

  // Hover glow animation
  items.forEach((item) => {
    const card = item.querySelector('.tl-card');
    const glow = item.querySelector('.tl-glow');
    if (!card || !glow) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(232,73,30,0.12), transparent 55%)`;
    });
  });
}

// ──────────────────────────────────────────────────────────
//  SECTION 6 — FINALE
// ──────────────────────────────────────────────────────────
export function initFinaleScroll() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#finale',
      start:   'top 62%',
      toggleActions: 'play none none reverse',
    },
  });

  // Colour wipe in
  tl.to('#finale-wipe', {
    scaleX:          1,
    transformOrigin: 'left center',
    duration:        0.55,
    ease:            'power4.inOut',
  });

  // Wipe exit (reveal content beneath)
  tl.to('#finale-wipe', {
    scaleX:          0,
    transformOrigin: 'right center',
    duration:        0.5,
    ease:            'power4.inOut',
  });

  // Pre-label
  tl.to('.fin-pre', {
    opacity: 1,
    duration: 0.6,
  }, 0.4);

  // Title words clip reveal
  tl.to('.fin-w', {
    clipPath: 'inset(0 0 0% 0)',
    duration: 1.1,
    ease:     'power4.out',
    stagger:  0.1,
  }, '-=0.15');

  // CTA button
  tl.to('.btn-finale', {
    opacity: 1,
    y: 0,
    duration: 0.85,
    ease: 'power3.out',
  }, '-=0.35');

  // Footer
  tl.to('.fin-footer', {
    opacity: 1,
    duration: 0.7,
  }, '-=0.3');

  // ── Pinned finale counter / progress bar (bonus dramatics) ──
  gsap.to('.fin-title', {
    scale: 1.04,
    ease: 'none',
    scrollTrigger: {
      trigger:   '#finale',
      start:     'top top',
      end:       'bottom top',
      scrub:     1.5,
    },
  });
}
