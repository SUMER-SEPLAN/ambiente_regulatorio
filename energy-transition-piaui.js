document.addEventListener('DOMContentLoaded', () => {
  const interactive = document.querySelector('.et-piaui__interactive');
  if (!interactive) return;
  const subtitle = document.querySelector('.et-piaui__mast > p');
  if (subtitle) subtitle.textContent = 'Quatro frentes regulatórias mostram como o Piauí articula política climática, novas tecnologias, instrumentos econômicos e regras locais de implantação na transição energética.';
  const resilienceTitle = interactive.querySelector('[data-piaui-detail="resilience"] h3');
  if (resilienceTitle) resilienceTitle.textContent = 'Prepara cidades, infraestruturas e atividades econômicas.';
  const donut = interactive.querySelector('.et-piaui__donut');
  if (donut && !donut.querySelector('.et-piaui__arc-label')) {
    const labels = [
      { topic: 'climate', x: 336, y: 96, anchor: 'start', lines: ['Política climática', 'e ativos ambientais'] },
      { topic: 'hydrogen', x: 336, y: 288, anchor: 'start', lines: ['Hidrogênio verde', 'e licenciamento'] },
      { topic: 'mobility', x: 24, y: 288, anchor: 'end', lines: ['Mobilidade elétrica', 'e recarga'] },
      { topic: 'resilience', x: 24, y: 96, anchor: 'end', lines: ['Adaptação e', 'resiliência climática'] }
    ];
    labels.forEach(({ topic, x, y, anchor, lines }) => {
      const guide = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      guide.setAttribute('class', 'et-piaui__arc-guide');
      guide.setAttribute('data-piaui-label', topic);
      guide.setAttribute('x1', anchor === 'start' ? '312' : '48');
      guide.setAttribute('x2', anchor === 'start' ? '328' : '32');
      guide.setAttribute('y1', String(y));
      guide.setAttribute('y2', String(y));
      donut.appendChild(guide);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('class', 'et-piaui__arc-label');
      text.setAttribute('data-piaui-label', topic);
      text.setAttribute('x', String(x));
      text.setAttribute('y', String(y));
      text.setAttribute('text-anchor', anchor);
      lines.forEach((line, index) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', String(x));
        tspan.setAttribute('dy', index === 0 ? '-5.5' : '11');
        tspan.textContent = line;
        text.appendChild(tspan);
      });
      donut.appendChild(text);
    });
  }
  const triggers = [...interactive.querySelectorAll('[data-piaui-topic]')];
  const details = [...interactive.querySelectorAll('[data-piaui-detail]')];
  const arcLabels = [...interactive.querySelectorAll('[data-piaui-label]')];
  const placeholder = interactive.querySelector('.et-piaui__placeholder');
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const defaultTopic = 'climate';
  let pinnedTopic = null;
  let closeTimer = null;
  let demoTimer = null;
  let switchTimer = null;
  let sectionIsActive = false;

  const cancelClose = () => {
    if (!closeTimer) return;
    window.clearTimeout(closeTimer);
    closeTimer = null;
  };
  const clear = () => {
    cancelClose();
    pinnedTopic = null;
    triggers.forEach((trigger) => {
      trigger.classList.toggle('is-active', trigger.dataset.piauiTopic === defaultTopic);
      trigger.setAttribute('aria-pressed', 'false');
    });
    details.forEach((detail) => { detail.hidden = detail.dataset.piauiDetail !== defaultTopic; });
    arcLabels.forEach((label) => label.classList.toggle('is-active', label.dataset.piauiLabel === defaultTopic));
    if (placeholder) placeholder.hidden = true;
    interactive.classList.add('has-detail');
    interactive.classList.remove('is-pinned');
  };
  const show = (topic, pinned = false) => {
    cancelClose();
    triggers.forEach((trigger) => {
      const active = trigger.dataset.piauiTopic === topic;
      trigger.classList.toggle('is-active', active);
      trigger.setAttribute('aria-pressed', String(pinned && active));
    });
    details.forEach((detail) => { detail.hidden = detail.dataset.piauiDetail !== topic; });
    arcLabels.forEach((label) => label.classList.toggle('is-active', label.dataset.piauiLabel === topic));
    if (placeholder) placeholder.hidden = true;
    interactive.classList.add('has-detail');
    interactive.classList.toggle('is-pinned', pinned);
    interactive.classList.remove('is-switching');
    window.clearTimeout(switchTimer);
    window.requestAnimationFrame(() => {
      interactive.classList.add('is-switching');
      switchTimer = window.setTimeout(() => interactive.classList.remove('is-switching'), 360);
    });
  };
  const scheduleClose = () => {
    if (pinnedTopic) return;
    cancelClose();
    closeTimer = window.setTimeout(() => {
      closeTimer = null;
      if (!pinnedTopic) clear();
    }, 170);
  };

  const stopDemo = () => {
    if (demoTimer) window.clearTimeout(demoTimer);
    demoTimer = null;
    interactive.classList.remove('is-demonstrating');
  };
  const runDemo = () => {
    if (reducedMotion.matches || pinnedTopic) return;
    stopDemo();
    const topics = ['climate', 'hydrogen', 'mobility', 'resilience'];
    let step = 0;
    interactive.classList.add('is-demonstrating');
    const advance = () => {
      if (!sectionIsActive || pinnedTopic) {
        stopDemo();
        return;
      }
      show(topics[step], false);
      step = (step + 1) % topics.length;
      demoTimer = window.setTimeout(advance, 940);
    };
    advance();
  };
  const cancelDemoForUser = () => {
    if (interactive.classList.contains('is-demonstrating')) stopDemo();
  };

  clear();
  triggers.forEach((trigger) => {
    trigger.addEventListener('pointerenter', (event) => {
      if (!hoverCapable.matches || event.pointerType === 'touch' || pinnedTopic) return;
      if (interactive.classList.contains('is-demonstrating')) return;
      show(trigger.dataset.piauiTopic, false);
    });
    trigger.addEventListener('click', () => {
      cancelDemoForUser();
      const topic = trigger.dataset.piauiTopic;
      if (pinnedTopic === topic) {
        clear();
        return;
      }
      pinnedTopic = topic;
      show(topic, true);
    });
    trigger.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      trigger.click();
    });
  });
  interactive.addEventListener('pointerenter', cancelClose);
  interactive.addEventListener('pointerleave', scheduleClose);
  const panel = interactive.querySelector('.et-piaui__panel');
  if (panel) {
    panel.addEventListener('click', () => {
      if (!interactive.classList.contains('is-demonstrating')) return;
      const activeTrigger = triggers.find((trigger) => trigger.classList.contains('is-active'));
      stopDemo();
      if (!activeTrigger) return;
      pinnedTopic = activeTrigger.dataset.piauiTopic;
      show(pinnedTopic, true);
    });
  }
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (pinnedTopic || interactive.classList.contains('has-detail'))) clear();
  });

  const section = interactive.closest('.et-piaui');
  if (section && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!sectionIsActive && entry.isIntersecting) {
        sectionIsActive = true;
        runDemo();
      } else if (sectionIsActive && !entry.isIntersecting) {
        sectionIsActive = false;
        stopDemo();
        pinnedTopic = null;
        clear();
      }
    }, { threshold: 0, rootMargin: '0px 0px -12% 0px' });
    observer.observe(section);
  }
});
