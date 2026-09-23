/* Interações locais da página — sem bibliotecas nem rastreadores. */
document.addEventListener('DOMContentLoaded', () => {
  const countdown = document.querySelector('[data-countdown]');
  const deadline = Date.now() + (2 * 60 * 60 * 1000);

  const updateCountdown = () => {
    const remaining = Math.max(0, deadline - Date.now());
    const hours = Math.floor(remaining / 3600000);
    const minutes = Math.floor((remaining % 3600000) / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    if (countdown) countdown.textContent = [hours, minutes, seconds]
      .map((value) => String(value).padStart(2, '0'))
      .join(':');
  };
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  const answers = [
    'Assim que a compra for aprovada, recebe um e-mail com a ligação de acesso ao material digital. Todo o conteúdo é disponibilizado de imediato.',
    'O material foi pensado para psicólogos, terapeutas, estudantes e outros profissionais que conduzem sessões individuais ou em grupo.',
    'Sim. As dinâmicas são práticas e adaptáveis, podendo ser usadas em diferentes linhas e contextos terapêuticos.',
    'Sim. Pode partilhar e adaptar as atividades em consultas presenciais ou online, conforme a necessidade de cada paciente.',
    'O certificado é um comprovativo digital de conclusão do material. Confirme os critérios da sua entidade profissional caso precise de reconhecimento formal.',
    'Sim. Depois da compra, o acesso ao material é vitalício, sem pagamentos mensais.',
    'Sim. Os seis bónus são incluídos no plano Premium sem custo adicional.'
  ];

  const faqCards = Array.from(document.querySelectorAll('.faq-list > .faq-item'));
  faqCards.forEach((card, index) => {
    const button = card.querySelector('button');
    const icon = card.querySelector('svg');
    let answer = card.querySelector('button + div');
    if (!button) return;

    button.type = 'button';
    button.id = `faq-question-${index}`;
    button.setAttribute('aria-controls', `faq-answer-${index}`);
    button.setAttribute('aria-expanded', index === 0 ? 'true' : 'false');
    if (!answer) {
      answer = document.createElement('div');
      answer.className = 'px-6 pb-5 text-sm text-foreground/75 leading-relaxed';
      answer.textContent = answers[index];
      answer.hidden = true;
      card.append(answer);
    }
    answer.id = `faq-answer-${index}`;
    answer.setAttribute('role', 'region');
    answer.setAttribute('aria-labelledby', button.id);
    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      answer.hidden = isOpen;
      icon?.classList.toggle('rotate-180', !isOpen);
    });
  });

  const dialog = document.querySelector('.preview-dialog');
  const expanded = dialog?.querySelector('img');
  const close = dialog?.querySelector('.preview-close');
  let opener;
  document.querySelectorAll('[data-preview]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (!dialog?.showModal) return;
      event.preventDefault();
      opener = link;
      expanded.src = link.href;
      expanded.alt = link.querySelector('img').alt;
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('preview-open');
      close.focus();
    });
  });
  close?.addEventListener('click', () => dialog.close());
  dialog?.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog?.addEventListener('close', () => {
    document.body.classList.remove('preview-open');
    opener?.focus();
  });
  const upgrade = document.querySelector('#upgrade-dialog');
  const basicTrigger = document.querySelector('[data-open-upgrade]');
  const upgradeClose = upgrade?.querySelector('.upgrade-close');
  basicTrigger?.addEventListener('click', () => {
    if (!upgrade || upgrade.open) return;
    upgrade.showModal();
    upgrade.scrollTop = 0;
    document.body.classList.add('upgrade-open');
    upgradeClose.focus({ preventScroll: true });
  });
  upgradeClose?.addEventListener('click', () => upgrade.close());
  upgrade?.addEventListener('click', (event) => {
    if (event.target !== upgrade) return;
    const rect = upgrade.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) upgrade.close();
  });
  upgrade?.addEventListener('close', () => {
    document.body.classList.remove('upgrade-open');
    basicTrigger?.focus({ preventScroll: true });
  });
  upgrade?.querySelectorAll('[data-upgrade-checkout]').forEach((button) => {
    const target = window.NEXO_CHECKOUTS?.[button.dataset.upgradeCheckout];
    let checkout;
    try {
      checkout = new URL(target);
      if (checkout.protocol !== 'https:') return;
    } catch { return; }
    button.disabled = false;
    button.addEventListener('click', () => window.location.assign(checkout.href));
  });

  const gallery = document.querySelector('.preview-gallery');
  if (gallery) {
    const controls = document.createElement('div');
    controls.className = 'gallery-controls';
    [-1, 1].forEach((direction) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-label', direction < 0 ? 'Páginas anteriores' : 'Páginas seguintes');
      button.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="${direction < 0 ? 'm14 6-6 6 6 6' : 'm10 6 6 6-6 6'}"/></svg>`;
      button.addEventListener('click', () => gallery.scrollBy({ left: direction * gallery.clientWidth * .8, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }));
      controls.append(button);
    });
    gallery.before(controls);
  }
});

/* Cada situação revela uma dinâmica real da biblioteca. */
document.addEventListener('DOMContentLoaded', () => {
  const scenarios = [...document.querySelectorAll('[data-scenario]')];
  const example = document.querySelector('.session-example');
  if (!example || !scenarios.length) return;
  const image = example.querySelector('img');
  const link = example.querySelector('[data-preview]');
  scenarios.forEach((scenario) => {
    scenario.addEventListener('toggle', () => {
      if (!scenario.open) return;
      scenarios.forEach((other) => { if (other !== scenario) other.open = false; });
      image.src = scenario.dataset.image;
      image.alt = scenario.dataset.title;
      link.href = scenario.dataset.image;
      example.querySelector('[data-example-title]').textContent = scenario.dataset.title;
      example.querySelector('[data-example-caption]').textContent = scenario.dataset.caption;
      example.querySelector('[data-example-counter]').textContent = `${scenario.dataset.scenario} / 03`;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        image.animate([{ opacity: .45 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
      }
    });
  });
});
