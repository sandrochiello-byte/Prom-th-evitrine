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
//  SECTION 5 — TIMELINE (now archive list)
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

  // Archive rows stagger in
  const rows = gsap.utils.toArray('.archive-row');
  rows.forEach((row, i) => {
    gsap.fromTo(row,
      { opacity: 0, y: 22 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: row,
          start:   'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Row line expand on scroll (decorative)
  rows.forEach((row) => {
    const line = row.querySelector('.ar-line');
    if (!line) return;
    gsap.fromTo(line,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: row,
          start:   'top 90%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });

  // Hover: title slides right
  rows.forEach((row) => {
    const title = row.querySelector('.ar-title');
    if (!title) return;
    row.addEventListener('mouseenter', () => {
      gsap.to(title, { x: 8, color: 'var(--ember)', duration: 0.3, ease: 'power2.out' });
    });
    row.addEventListener('mouseleave', () => {
      gsap.to(title, { x: 0, color: 'var(--text)', duration: 0.4, ease: 'power2.out' });
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

  // CTA button — removed (now fin-declaration handles it)
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

// ──────────────────────────────────────────────────────────
//  CHAPTER NAVIGATION — dot activation + label reveals
// ──────────────────────────────────────────────────────────
export function initChapterNav() {
  const nav  = document.getElementById('ch-nav');
  const dots = document.querySelectorAll('.ch-dot');
  const sections = document.querySelectorAll('.section[data-chapter]');

  if (!nav) return;

  // Show nav after hero
  ScrollTrigger.create({
    trigger: '#story',
    start: 'top 80%',
    onEnter:      () => nav.classList.add('is-visible'),
    onLeaveBack:  () => nav.classList.remove('is-visible'),
  });

  // Activate dot per chapter
  sections.forEach((section, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 55%',
      end:   'bottom 55%',
      onEnter:     () => setActive(i),
      onEnterBack: () => setActive(i),
    });
  });

  function setActive(index) {
    dots.forEach((d, i) => d.classList.toggle('is-active', i === index));
  }

  // Smooth scroll on dot click
  dots.forEach((dot, i) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Chapter label visibility (in-section labels)
  document.querySelectorAll('.ch-label').forEach((label) => {
    const parent = label.closest('.section') || label.parentElement;
    ScrollTrigger.create({
      trigger: parent,
      start: 'top 70%',
      end:   'bottom top',
      onEnter:      () => label.classList.add('is-visible'),
      onLeave:      () => label.classList.remove('is-visible'),
      onEnterBack:  () => label.classList.add('is-visible'),
      onLeaveBack:  () => label.classList.remove('is-visible'),
    });
  });
}

// ──────────────────────────────────────────────────────────
//  SHOWCASE NOTE LINES (replaces stats)
// ──────────────────────────────────────────────────────────
export function initShowcaseNote() {
  gsap.to('.sc-note-line', {
    opacity: 1,
    x: 0,
    duration: 0.75,
    ease: 'power3.out',
    stagger: 0.18,
    scrollTrigger: {
      trigger: '#showcase',
      start:   'top 60%',
      toggleActions: 'play none none reverse',
    },
  });
}

// ──────────────────────────────────────────────────────────
//  KINETIC SUBTITLE
// ──────────────────────────────────────────────────────────
export function initKineticSub() {
  gsap.to('.k-sub', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
    delay: 0.4,
    scrollTrigger: {
      trigger: '#kinetic',
      start:   'top 65%',
      toggleActions: 'play none none reverse',
    },
  });
}

// ──────────────────────────────────────────────────────────
//  FINALE DECLARATION (replaces btn-finale animation)
// ──────────────────────────────────────────────────────────
export function initFinaleDeclaration() {
  gsap.to('.fin-declaration', {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#finale',
      start:   'top 60%',
      toggleActions: 'play none none reverse',
    },
  });
}
