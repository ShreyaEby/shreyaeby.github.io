// ---------------------------------------------------------
// Mobile nav toggle
// ---------------------------------------------------------
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('nav-list');

if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navList.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---------------------------------------------------------
// Scroll reveal — adds .reveal to sections, flips visible
// ---------------------------------------------------------
const revealTargets = document.querySelectorAll(
  '.focus-card, .exp-item, .timeline-item, .lead-card, .media-card, .award-list li'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('is-visible'));
}

// ---------------------------------------------------------
// Hero waveform — voice signal morphing toward a steadier
// "sentiment line" the further right it travels, echoing the
// site's thesis: raw signal becoming legible insight.
// ---------------------------------------------------------
(function drawWave() {
  const path = document.getElementById('wavePath');
  if (!path) return;

  const width = 1200;
  const height = 220;
  const midY = height / 2;
  const points = 140;

  let t = 0;

  function amplitudeAt(x) {
    // Chaotic on the left (raw signal), settles into a calmer,
    // gently rising line by the right edge (captured insight).
    const progress = x / width;
    const chaos = 1 - progress * 0.82;
    return 46 * chaos + 4;
  }

  function baselineAt(x) {
    const progress = x / width;
    return midY - progress * 30; // gentle upward drift = "engagement rising"
  }

  function render() {
    let d = '';
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const amp = amplitudeAt(x);
      const freq = 0.045 + (x / width) * 0.02;
      const y = baselineAt(x)
        + Math.sin(x * freq + t) * amp
        + Math.sin(x * freq * 2.3 + t * 1.4) * (amp * 0.28);
      d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    path.setAttribute('d', d.trim());
  }

  function loop() {
    t += 0.012;
    render();
    if (!prefersReducedMotion) {
      requestAnimationFrame(loop);
    }
  }

  render();
  if (!prefersReducedMotion) {
    requestAnimationFrame(loop);
  }
})();
