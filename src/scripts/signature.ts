/* ============================================================================
   DASTUR — signature scroll animations (GSAP + ScrollTrigger).
   Bespoke, heavier motion for the four showpiece sections (Hero, Menu,
   Delivery, Packaging). Everything else keeps the plain reveal system in
   animations.ts. Desktop-enhanced only: on touch/narrow viewports and under
   prefers-reduced-motion, this module builds nothing and the baseline
   [data-animate] fade-up (already applied to the same elements) is what shows.
   ========================================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const desktop = matchMedia('(min-width: 900px)').matches;

if (!reduce && desktop) {
  gsap.registerPlugin(ScrollTrigger);
  heroCinematic();
  menuShowcase();
  deliveryCta();
  packagingReveal();
}

/** Elements this module drives may still be mid-flight through the baseline
 * `[data-animate]` on-load reveal (animations.ts defers its `.is-inview` add
 * via setTimeout, so it hasn't necessarily landed yet when this module runs).
 * Force the settled, visible end-state here before GSAP takes over the same
 * opacity/transform properties — otherwise we can freeze them mid-reveal
 * (invisible) and/or fight the leftover CSS transition on every scrub tick. */
function takeOverFromReveal(...els: Array<Element | NodeListOf<Element> | null | undefined>) {
  els.forEach((el) => {
    if (!el) return;
    const list = el instanceof NodeList ? Array.from(el) : [el];
    list.forEach((node) => {
      const style = (node as HTMLElement).style;
      style.transition = 'none';
      style.opacity = '1';
      style.transform = 'none';
    });
  });
}

/* --- Hero: pinned, scroll-scrubbed cinematic exit --------------------------
   Pins the hero for one viewport of scroll so the exit fully resolves
   (title/lead/CTA punched up and out, skyline pushed back and faded) before
   Menu cuts in — avoids a dead gap of emptied-out hero between the two. */
function heroCinematic() {
  const hero = document.querySelector<HTMLElement>('.hero');
  if (!hero) return;
  const title = hero.querySelector<HTMLElement>('.hero__title');
  const eyebrow = hero.querySelector<HTMLElement>('.hero__eyebrow');
  const lead = hero.querySelector<HTMLElement>('.hero__lead');
  const cta = hero.querySelector<HTMLElement>('.hero__cta');
  const skyline = hero.querySelector<HTMLElement>('.hero__skyline');
  const decos = hero.querySelectorAll<HTMLElement>('.hero__deco');
  const scrollCue = hero.querySelector<HTMLElement>('.hero__scroll');
  if (!title) return;

  takeOverFromReveal(eyebrow, title, lead, cta);

  gsap.timeline({
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: true,
      scrub: 0.5,
    },
  })
    .to(scrollCue, { opacity: 0, duration: 0.15, ease: 'none' }, 0)
    .to(eyebrow, { y: -140, opacity: 0, duration: 1, ease: 'none' }, 0)
    .to(title, { y: -170, scale: 1.06, opacity: 0, duration: 1, ease: 'none' }, 0)
    .to(lead, { y: -110, opacity: 0, duration: 0.95, ease: 'none' }, 0.05)
    .to(cta, { y: -70, opacity: 0, duration: 0.92, ease: 'none' }, 0.08)
    .to(skyline, { y: -30, scale: 1.12, opacity: 0, duration: 1, ease: 'none' }, 0)
    .to(decos, { y: -160, opacity: 0, duration: 1, ease: 'none' }, 0);
}

/* --- Menu: pinned, scroll-scrubbed category showcase ------------------------
   Panel switching stays owned by Menu.astro's own `select()` (the accessible
   tab/panel/hidden-attribute logic) — this only drives *which* index is
   selected as the section pins and the user scrolls, via the
   `__menuSelectByIndex` hook Menu.astro exposes for this purpose. */
function menuShowcase(retries = 5) {
  const section = document.querySelector<HTMLElement>('#menu');
  const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('#menu [role="tab"]'));
  const selectByIndex = (window as any).__menuSelectByIndex as ((i: number) => void) | undefined;
  if (!section || tabs.length < 2) return;
  if (!selectByIndex) {
    // Menu.astro's own module script sets this hook; document order should
    // make it available already, but retry briefly rather than assume.
    if (retries > 0) window.setTimeout(() => menuShowcase(retries - 1), 50);
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: 'top top+=76',
    end: () => `+=${tabs.length * 380}`,
    pin: true,
    pinSpacing: true,
    scrub: 0.4,
    snap: {
      snapTo: 1 / (tabs.length - 1),
      duration: 0.35,
      ease: 'power1.inOut',
    },
    onUpdate(self) {
      const i = Math.min(tabs.length - 1, Math.round(self.progress * (tabs.length - 1)));
      selectByIndex(i);
    },
  });
}

/* --- Delivery: bold weighted entrance on the order CTAs --------------------- */
function deliveryCta() {
  const paths = document.querySelectorAll<HTMLElement>('#delivery .path');
  if (!paths.length) return;
  gsap.set(paths, { transformOrigin: '50% 100%' });
  gsap.from(paths, {
    scrollTrigger: {
      trigger: '#delivery .del__paths',
      start: 'top 78%',
    },
    scale: 0.82,
    y: 46,
    opacity: 0,
    duration: 0.85,
    ease: 'back.out(1.6)',
    stagger: 0.12,
  });
}

/* --- Packaging: scroll-scrubbed 3D box reveal ------------------------------- */
function packagingReveal() {
  const main = document.querySelector<HTMLElement>('#packaging .pkg__main');
  const accents = document.querySelectorAll<HTMLElement>('#packaging .pkg__accent');
  if (!main) return;

  // .pkg__main has its own CSS hover-tilt `transition: transform` (see
  // Packaging.astro); suspend it for the scrub so the two don't fight, then
  // hand back off to CSS once the reveal finishes and pointer-tilt can take over.
  main.style.transition = 'none';
  gsap.set(main, { transformPerspective: 1200 });
  gsap.from(main, {
    scrollTrigger: {
      trigger: '#packaging .pkg__media',
      start: 'top 85%',
      end: 'top 40%',
      scrub: 0.5,
      onLeave: () => (main.style.transition = ''),
      onLeaveBack: () => (main.style.transition = ''),
    },
    rotateY: -22,
    rotateX: 10,
    y: 70,
    opacity: 0,
    ease: 'none',
  });
  gsap.from(accents, {
    scrollTrigger: {
      trigger: '#packaging .pkg__media',
      start: 'top 80%',
      end: 'top 35%',
      scrub: 0.5,
    },
    y: 40,
    opacity: 0,
    stagger: 0.1,
    ease: 'none',
  });
}
