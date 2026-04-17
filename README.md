# 🔥 Prométhée Studio — Motion Demo

A single-page, ultra-animated experience demonstrating the limits of GSAP + Three.js on the web.  
**This is a technical/creative demo. Performance is not a priority. Visual impact is.**

---

## Stack

| Layer       | Technology                          |
|-------------|-------------------------------------|
| Bundler     | Vite 5                              |
| Animation   | GSAP 3 + ScrollTrigger              |
| 3D / WebGL  | Three.js r163 (custom shaders)      |
| Language    | Vanilla JavaScript (ES modules)     |
| Styles      | Modern CSS (custom properties, clamp) |

---

## Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in a Chromium-based browser for best results.

### Build

```bash
npm run build
npm run preview
```

---

## Sections

1. **Hero** — particle shader background, animated split-text, magnetic CTA
2. **Scroll Story** — pinned horizontal panel, scrub-driven reveals, parallax deco
3. **3D Showcase** — TorusKnot with custom GLSL vertex displacement + fresnel rim, mouse-reactive camera
4. **Kinetic Type** — infinite marquees, mouse-reactive text distortion
5. **Timeline** — staggered card grid with cursor-tracked glow
6. **Finale** — full-screen colour wipe transition, ember particle system, animated CTA

---

## Architecture

```
src/
├── main.js                # Bootstrap — wires all modules
├── styles.css             # All CSS (variables, layout, animations)
├── animations/
│   ├── gsap.js            # Loader, hero entrance, cursor, magnetic, grain
│   └── scroll.js          # All ScrollTrigger scenes
└── three/
    ├── scene.js           # initHeroScene / initShowcaseScene / initFinaleScene
    └── shaders.js         # GLSL vertex + fragment shaders
```

---

## Notes

- Desktop-first. Mobile gets a graceful fallback (no custom cursor, simplified layout).
- `prefers-reduced-motion` is respected — animations are skipped for accessibility.
- No backend, no CMS, no framework dependencies.

---

© 2024 Prométhée Studio (Demo)
