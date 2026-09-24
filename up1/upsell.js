(() => {
  const config = window.NEXO_UPSELL || {};
  const configureLinks = (selector, value, allowInternal = false) => {
    if (typeof value !== 'string' || !value || value.includes('[')) return;
    const internal = allowInternal && /^(\/(?!\/)|\.\.?\/)/.test(value);
    let url;
    try { url = internal ? new URL(value, window.location.href) : new URL(value); } catch { return; }
    if (internal ? url.origin !== window.location.origin : url.protocol !== 'https:') return;
    document.querySelectorAll(selector).forEach((link) => {
      link.href = url.href;
      link.removeAttribute('aria-disabled');
    });
  };
  configureLinks('[data-accept]', config.acceptUrl);
  configureLinks('[data-decline]', config.declineUrl, true);
  const bar = document.querySelector('.mobile-purchase-bar');
  if (!bar) return;
  const mobile = window.matchMedia('(max-width: 760px)');
  let queued = false;
  const updateBar = () => {
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    bar.hidden = !mobile.matches || distance <= 0 || window.scrollY / distance < .4;
    queued = false;
  };
  const schedule = () => {
    if (!queued) { queued = true; window.requestAnimationFrame(updateBar); }
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  document.querySelectorAll('.upsell-faq details').forEach((item) => item.addEventListener('toggle', schedule));
  document.fonts?.ready.then(schedule);
  updateBar();
})();
