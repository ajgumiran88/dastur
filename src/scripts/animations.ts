/* ============================================================================
   DASTUR — progressive-enhancement animation module.
   The site is fully usable without this file. Everything here is transform/
   opacity only, respects prefers-reduced-motion, and simplifies on touch.
   ========================================================================== */

const html = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

/** Reveal all `[data-animate]` immediately (used as a fallback / reduced-motion). */
function revealAll() {
  document.querySelectorAll('[data-animate]').forEach((el) => el.classList.add('is-inview'));
}

if (reduce || !('IntersectionObserver' in window)) {
  html.classList.remove('animate-ready');
  revealAll();
} else {
  // Signal the inline failsafe that the module booted.
  html.classList.add('animate-live');
  initReveals();
  initParallax();
  if (fine) {
    initMagnetic();
    initTilt();
  }
}

/* --- Scroll reveals (staggered) --------------------------------------------- */
function initReveals() {
  const items = Array.from(document.querySelectorAll<HTMLElement>('[data-animate]'));
  const io = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const delay = Number(el.dataset.animateDelay ?? 0);
        window.setTimeout(() => el.classList.add('is-inview'), delay);
        obs.unobserve(el);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );

  items.forEach((el) => {
    // Elements already within the first viewport reveal without waiting.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) {
      const delay = Number(el.dataset.animateDelay ?? 0);
      window.setTimeout(() => el.classList.add('is-inview'), Math.min(delay, 500));
    } else {
      io.observe(el);
    }
  });
}

/* --- Lightweight parallax (transform only, rAF-batched) --------------------- */
function initParallax() {
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'));
  if (!layers.length) return;
  // Skip parallax on small/touch screens for performance.
  if (window.innerWidth < 768) return;

  let ticking = false;
  const update = () => {
    const vh = window.innerHeight;
    layers.forEach((el) => {
      const speed = Number(el.dataset.parallaxSpeed ?? 0.2);
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const offset = (center - vh / 2) * speed * -1;
      el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
    });
    ticking = false;
  };
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
}

/* --- Magnetic buttons (desktop, fine pointer) ------------------------------- */
function initMagnetic() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  els.forEach((el) => {
    const strength = 0.28;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    };
    const reset = () => {
      el.style.transform = '';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
  });
}

/* --- Subtle 3D tilt on [data-tilt] (bounded, desktop only) ------------------ */
function initTilt() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
  els.forEach((el) => {
    const max = 6; // degrees
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg)`;
    };
    const reset = () => {
      el.style.transform = '';
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', reset);
  });
}
