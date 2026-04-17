/* ============================================================
   PROMÉTHÉE STUDIO — i18n.js
   EN / FR language toggle
   ============================================================ */

const T = {
  en: {
    'hero.eyebrow': 'Experimental Showcase',
    'hero.sub':     "This is a demonstration of what's possible.",
    'hero.cta':     'Begin the sequence',
    'hero.scroll':  'Scroll',

    'sp1.num': 'I /',
    'sp1.w1':  'Motion',
    'sp1.w2':  'as',
    'sp1.w3':  'language.',
    'sp1.body': 'Every frame carries meaning. Movement is the medium.',

    'sp2.num': 'II /',
    'sp2.w1':  'Time',
    'sp2.w2':  'is',
    'sp2.w3':  'material.',
    'sp2.body': 'Duration, delay, easing. The grammar of motion.',

    'sp3.num': 'III /',
    'sp3.w1':  'Scroll',
    'sp3.w2':  'as',
    'sp3.w3':  'narrative.',
    'sp3.body': 'The viewport becomes a stage. You are the director.',

    'sc.tag':   'WebGL · GLSL · Real-time',
    'sc.line1': 'Space',
    'sc.line2': 'without',
    'sc.line3': 'limits.',
    'sc.hint':  '← Move your cursor',
    'sc.note1': 'Custom GLSL shaders.',
    'sc.note2': 'Vertex displacement.',
    'sc.note3': 'Mouse-reactive camera.',

    'k.pre':     'Form follows',
    'k.distort': 'motion.',
    'k.sub':     'Typography as force. Letters as objects in space.',

    'tl.tag':   'Explorations',
    'tl.title': 'The Archive.',

    'e01.title': 'Signal & Identity',
    'e01.desc':  'Motion as brand language. How a system moves is what it says.',
    'e02.title': 'Spatial Web',
    'e02.desc':  'Immersive interface. Real-time 3D rendered inside the browser.',
    'e03.title': 'Interaction Grammar',
    'e03.desc':  'A vocabulary of micro-interactions. Rules for living UI.',
    'e04.title': 'Sonic Space',
    'e04.desc':  'Audio-reactive installation. Sound and image as a single surface.',
    'e05.title': 'Kinetic Portrait',
    'e05.desc':  'A moving image of a studio. What moves reveals what matters.',
    'e06.title': 'Augmented Surface',
    'e06.desc':  'AR as medium. Digital objects exist in physical space.',

    'fin.pre':     'End of sequence.',
    'fin.w1':      'What',
    'fin.w2':      'moves',
    'fin.w3':      'endures.',
    'fin.decl1':   'This is an experimental showcase.',
    'fin.decl2':   "A demonstration of what's possible.",
    'fin.footer1': 'Prométhée Studio — Experimental',
    'fin.footer2': 'Motion · Space · Interaction',

    'ch.0': 'Intention',
    'ch.1': 'Movement',
    'ch.2': 'Space',
    'ch.3': 'Rhythm',
    'ch.4': 'Sequence',
    'ch.5': 'Conclusion',
  },

  fr: {
    'hero.eyebrow': 'Vitrine Expérimentale',
    'hero.sub':     'Voilà ce qui est possible.',
    'hero.cta':     'Commencer',
    'hero.scroll':  'Défiler',

    'sp1.num': 'I /',
    'sp1.w1':  'Le mouvement',
    'sp1.w2':  'comme',
    'sp1.w3':  'langage.',
    'sp1.body': 'Chaque image porte un sens. Le mouvement est le médium.',

    'sp2.num': 'II /',
    'sp2.w1':  'Le temps',
    'sp2.w2':  'est',
    'sp2.w3':  'matière.',
    'sp2.body': 'Durée, délai, inertie. La grammaire du mouvement.',

    'sp3.num': 'III /',
    'sp3.w1':  'Le scroll',
    'sp3.w2':  'comme',
    'sp3.w3':  'récit.',
    'sp3.body': 'La fenêtre devient scène. Vous êtes le réalisateur.',

    'sc.tag':   'WebGL · GLSL · Temps réel',
    'sc.line1': "L'espace",
    'sc.line2': 'sans',
    'sc.line3': 'limites.',
    'sc.hint':  '← Déplacez le curseur',
    'sc.note1': 'Shaders GLSL personnalisés.',
    'sc.note2': 'Déplacement de vertex.',
    'sc.note3': 'Caméra réactive à la souris.',

    'k.pre':     'La forme suit',
    'k.distort': 'le mouvement.',
    'k.sub':     "La typographie comme force. Les lettres comme objets dans l'espace.",

    'tl.tag':   'Explorations',
    'tl.title': 'Les Archives.',

    'e01.title': 'Signal & Identité',
    'e01.desc':  "Le mouvement comme langage de marque. La façon dont un système bouge définit ce qu'il dit.",
    'e02.title': 'Web Spatial',
    'e02.desc':  'Interface immersive. Rendu 3D en temps réel dans le navigateur.',
    'e03.title': "Grammaire d'Interaction",
    'e03.desc':  'Un vocabulaire de micro-interactions. Règles pour une UI vivante.',
    'e04.title': 'Espace Sonique',
    'e04.desc':  'Installation audio-réactive. Son et image comme une seule surface.',
    'e05.title': 'Portrait Cinétique',
    'e05.desc':  'Une image animée d\'un studio. Ce qui bouge révèle ce qui compte.',
    'e06.title': 'Surface Augmentée',
    'e06.desc':  'La RA comme médium. Les objets numériques existent dans l\'espace physique.',

    'fin.pre':     'Fin de séquence.',
    'fin.w1':      'Ce qui',
    'fin.w2':      'bouge',
    'fin.w3':      'perdure.',
    'fin.decl1':   'Ceci est une vitrine expérimentale.',
    'fin.decl2':   'Une démonstration du possible.',
    'fin.footer1': 'Prométhée Studio — Expérimental',
    'fin.footer2': 'Mouvement · Espace · Interaction',

    'ch.0': 'Intention',
    'ch.1': 'Mouvement',
    'ch.2': 'Espace',
    'ch.3': 'Rythme',
    'ch.4': 'Séquence',
    'ch.5': 'Conclusion',
  },
};

let currentLang = 'en';

function applyLang(lang) {
  const dict = T[lang];
  if (!dict) return;
  currentLang = lang;

  // Update all [data-i18n] text nodes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) {
      el.textContent = dict[key];
    }
  });

  // Update chapter nav data-label attributes
  document.querySelectorAll('.ch-dot').forEach((dot) => {
    dot.dataset.label = dot.dataset[`label${lang.charAt(0).toUpperCase() + lang.slice(1)}`] || '';
  });

  // Update <html lang>
  document.documentElement.lang = lang;

  // Update toggle button visual
  const btn    = document.getElementById('lang-toggle');
  const active = btn?.querySelector('.lt-active');
  const other  = btn?.querySelector('.lt-inactive');
  if (active && other) {
    active.textContent  = lang.toUpperCase();
    other.textContent   = lang === 'en' ? 'FR' : 'EN';
  }
}

export function initI18n() {
  const btn = document.getElementById('lang-toggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const next = currentLang === 'en' ? 'fr' : 'en';
    applyLang(next);

    // Animate toggle
    import('gsap').then(({ default: gsap }) => {
      gsap.fromTo(btn, { y: -4, opacity: 0.5 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' });
    });
  });

  // Init with default language
  applyLang('en');
}
