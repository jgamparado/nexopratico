/* Arrastar, deslizar ou usar as setas. As imagens nunca abrem outra vista. */
(() => {
  const track = document.querySelector('.whatsapp-track');
  if (!track) return;
  const section = track.closest('.whatsapp-testimonials');
  const slides = [...track.querySelectorAll('.whatsapp-slide')];
  const previous = section.querySelector('[data-whatsapp-prev]');
  const next = section.querySelector('[data-whatsapp-next]');
  const count = section.querySelector('.whatsapp-current');
  const countRegion = section.querySelector('.whatsapp-count');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const step = () => slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth;
  const maxScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
  const go = (position) => track.scrollTo({ left: Math.max(0, Math.min(maxScroll(), position)), behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  previous.addEventListener('click', () => go(track.scrollLeft - step()));
  next.addEventListener('click', () => go(track.scrollLeft + step()));
  track.addEventListener('keydown', (event) => {
    if (event.target !== track) return;
    const positions = { ArrowLeft: track.scrollLeft - step(), ArrowRight: track.scrollLeft + step(), Home: 0, End: maxScroll() };
    if (!(event.key in positions)) return;
    event.preventDefault();
    go(positions[event.key]);
  });
  let framePending = false;
  const update = () => {
    const rect = track.getBoundingClientRect();
    const visible = slides.map((slide, index) => {
      const bounds = slide.getBoundingClientRect();
      const shown = Math.max(0, Math.min(bounds.right, rect.right) - Math.max(bounds.left, rect.left));
      return shown >= bounds.width * .65 ? index + 1 : null;
    }).filter(Boolean);
    if (visible.length) {
      const first = visible[0], last = visible[visible.length - 1];
      const text = first === last ? String(first).padStart(2, '0') : `${String(first).padStart(2, '0')}–${String(last).padStart(2, '0')}`;
      if (count.textContent !== text) count.textContent = text;
      countRegion.setAttribute('aria-label', first === last ? `Depoimento ${first} de ${slides.length}` : `Depoimentos ${first} a ${last} de ${slides.length}`);
    }
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= maxScroll() - 2;
    framePending = false;
  };
  const schedule = () => {
    if (!framePending) { framePending = true; requestAnimationFrame(update); }
  };
  track.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(track);
  // Touch uses native scrolling, preserving vertical page scrolling and pinch zoom.
  let drag = null;
  track.addEventListener('pointerdown', (event) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    drag = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, moved: false };
    track.setPointerCapture(event.pointerId);
  });
  track.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const distance = event.clientX - drag.x;
    if (Math.abs(distance) > 4) drag.moved = true;
    if (!drag.moved) return;
    event.preventDefault();
    track.classList.add('is-dragging');
    track.scrollLeft = drag.left - distance;
  });
  const endDrag = (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const moved = drag.moved;
    const position = track.scrollLeft;
    drag = null;
    track.classList.remove('is-dragging');
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (moved) go(Math.round(position / step()) * step());
  };
  track.addEventListener('pointerup', endDrag);
  track.addEventListener('pointercancel', endDrag);
  track.addEventListener('lostpointercapture', endDrag);
  section.querySelector('[data-whatsapp-controls]').hidden = false;
  update();
})();
