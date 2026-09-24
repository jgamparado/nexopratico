/* Interações de leitura: sem novas saídas nem ações de compra. */
(() => {
  const progress = document.querySelector('.reading-progress > span');
  let pending = false;
  const update = () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    pending = false;
  };
  const schedule = () => {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  document.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', schedule));
  document.fonts?.ready.then(schedule);
  update();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      if (!motion.matches && target.animate) {
        target.animate([{ opacity: .7, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 420, easing: 'ease-out' });
      }
      observer.unobserve(target);
    });
  }, { threshold: .12 });
  document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
})();
