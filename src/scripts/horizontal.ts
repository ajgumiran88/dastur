const scroller = document.querySelector<HTMLElement>('[data-horizontal-scroll]');

if (scroller) {
  const panels = Array.from(scroller.children).filter(
    (element): element is HTMLElement =>
      element instanceof HTMLElement && element.matches('section, footer'),
  );
  const prev = document.querySelector<HTMLButtonElement>('[data-journey-prev]');
  const next = document.querySelector<HTMLButtonElement>('[data-journey-next]');
  const current = document.querySelector<HTMLElement>('[data-journey-current]');
  const total = document.querySelector<HTMLElement>('[data-journey-total]');
  const progress = document.querySelector<HTMLElement>('[data-journey-progress]');
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-navlink]'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = 0;
  let wheelLocked = false;

  panels.forEach((panel, index) => {
    panel.dataset.panelIndex = String(index);
  });

  const moveTo = (index: number) => {
    const destination = Math.max(0, Math.min(index, panels.length - 1));
    panels[destination]?.scrollIntoView({
      behavior: reducedMotion.matches ? 'auto' : 'smooth',
      block: 'nearest',
      inline: 'start',
    });
  };

  const update = () => {
    const width = scroller.clientWidth || 1;
    activeIndex = Math.max(0, Math.min(Math.round(scroller.scrollLeft / width), panels.length - 1));
    if (current) current.textContent = String(activeIndex + 1).padStart(2, '0');
    if (total) total.textContent = String(panels.length).padStart(2, '0');
    if (progress) progress.style.transform = `scaleX(${(activeIndex + 1) / panels.length})`;
    if (prev) prev.disabled = activeIndex === 0;
    if (next) next.disabled = activeIndex === panels.length - 1;
    navLinks.forEach((link) => {
      if (link.dataset.navlink === panels[activeIndex]?.id) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  prev?.addEventListener('click', () => moveTo(activeIndex - 1));
  next?.addEventListener('click', () => moveTo(activeIndex + 1));

  scroller.addEventListener(
    'wheel',
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX) || wheelLocked) return;
      event.preventDefault();
      wheelLocked = true;
      moveTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
      window.setTimeout(() => {
        wheelLocked = false;
      }, reducedMotion.matches ? 120 : 700);
    },
    { passive: false },
  );

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight' || event.key === 'PageDown') moveTo(activeIndex + 1);
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') moveTo(activeIndex - 1);
    if (event.key === 'Home') moveTo(0);
    if (event.key === 'End') moveTo(panels.length - 1);
  });

  let ticking = false;
  scroller.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  }, { passive: true });

  update();
}
