document.addEventListener('DOMContentLoaded', () => {
  if (window.__energyTransitionPageInitialized) return;
  window.__energyTransitionPageInitialized = true;
  const tabs = [...document.querySelectorAll('[data-et-route]')];
  const panels = [...document.querySelectorAll('[data-et-panel]')];
  const activateRoute = (name, focus = false) => {
    tabs.forEach((tab) => {
      const active = tab.dataset.etRoute === name;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      if (active && focus) tab.focus();
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.etPanel !== name; });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateRoute(tab.dataset.etRoute));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      let next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1);
      next = (next + tabs.length) % tabs.length;
      activateRoute(tabs[next].dataset.etRoute, true);
    });
  });

  const policyContent = {
    pnmc: { kicker: 'Fundamento climático', title: 'Política Nacional sobre Mudança do Clima', summary: 'Estabelece a base climática que orienta a redução de emissões e a substituição tecnológica nas políticas setoriais, inclusive na área de energia.', norm: 'Instituída pela Lei nº 12.187/2009.' },
    pnte: { kicker: 'Política coordenadora', title: 'Política Nacional de Transição Energética', summary: 'Orienta e coordena políticas públicas para transformar a matriz energética brasileira, conciliando baixa emissão de carbono, segurança do abastecimento, desenvolvimento econômico e inclusão social.', norm: 'Instituída pela Resolução CNPE nº 5/2024.' },
    plante: { kicker: 'Planejamento e ação', title: 'Plano Nacional de Transição Energética', summary: 'Consolida programas governamentais, identifica medidas adicionais e organiza ações, investimentos, custos e responsabilidades em um horizonte de longo prazo.', norm: 'Instituído pela Resolução CNPE nº 5/2024.' },
    fonte: { kicker: 'Participação e acompanhamento', title: 'Fórum Nacional de Transição Energética', summary: 'É o fórum consultivo permanente que amplia o diálogo, produz recomendações e acompanha a formulação e a implementação da PNTE e do Plante.', norm: 'Instituído pela Resolução CNPE nº 5/2024.' },
    paten: { kicker: 'Mecanismo financeiro complementar', title: 'Programa de Aceleração da Transição Energética', summary: 'Criado por lei própria, atua fora da estrutura formal da PNTE e oferece garantias e instrumentos financeiros para aproximar projetos sustentáveis das fontes de financiamento.', norm: 'Instituído pela Lei nº 15.103/2025.' }
  };
  const policyNodes = [...document.querySelectorAll('[data-policy-node]')];
  const policyPanel = document.querySelector('#et-policy-detail');
  const policyOrganogram = document.querySelector('.et-policy-organogram');
  const policyFields = { kicker: document.querySelector('#et-policy-kicker'), title: document.querySelector('#et-policy-title'), summary: document.querySelector('#et-policy-summary'), norm: document.querySelector('#et-policy-norm') };
  let pinnedPolicy = null;
  let previewPolicy = null;
  let previewOpenTimer = null;
  let previewCloseTimer = null;
  const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)');
  const cancelPreviewClose = () => {
    if (!previewCloseTimer) return;
    window.clearTimeout(previewCloseTimer);
    previewCloseTimer = null;
  };
  const cancelPreviewOpen = () => {
    if (!previewOpenTimer) return;
    window.clearTimeout(previewOpenTimer);
    previewOpenTimer = null;
  };
  const setPolicyContent = (name, markActive = true) => {
    const content = policyContent[name];
    if (!content || !policyFields.title || !policyPanel) return;
    policyNodes.forEach((node) => {
      const active = markActive && node.dataset.policyNode === name;
      node.classList.toggle('is-active', active);
      node.setAttribute('aria-pressed', String(active));
    });
    Object.entries(policyFields).forEach(([key, field]) => { if (field) field.textContent = content[key]; });
  };
  const clearPolicy = (restoreFocus = false) => {
    if (!policyPanel) return;
    cancelPreviewOpen();
    cancelPreviewClose();
    const buttonToFocus = restoreFocus ? pinnedPolicy : null;
    policyNodes.forEach((node) => {
      node.classList.remove('is-active');
      node.setAttribute('aria-pressed', 'false');
    });
    pinnedPolicy = null;
    previewPolicy = null;
    policyPanel.hidden = true;
    policyPanel.querySelector('.et-policy-detail__close')?.remove();
    policyPanel.setAttribute('aria-hidden', 'true');
    policyOrganogram?.classList.remove('has-open-panel', 'is-preview');
    if (buttonToFocus) buttonToFocus.focus();
  };
  const schedulePreviewClose = () => {
    cancelPreviewClose();
    previewCloseTimer = window.setTimeout(() => {
      previewCloseTimer = null;
      if (!pinnedPolicy && previewPolicy) clearPolicy();
    }, 220);
  };
  const showPolicy = (node, preview) => {
    if (!policyPanel || !policyOrganogram) return;
    policyPanel.dataset.policyTopic = node.dataset.policyNode;
    setPolicyContent(node.dataset.policyNode, !preview);
    policyPanel.querySelector('.et-policy-detail__close')?.remove();
    if (!preview) {
      const closeButton = document.createElement('button');
      closeButton.className = 'et-policy-detail__close';
      closeButton.type = 'button';
      closeButton.setAttribute('aria-label', 'Fechar');
      closeButton.textContent = '×';
      closeButton.addEventListener('click', () => clearPolicy(true));
      policyPanel.prepend(closeButton);
    }
    policyPanel.hidden = false;
    policyPanel.setAttribute('aria-hidden', 'false');
    policyOrganogram.classList.toggle('has-open-panel', !preview);
    policyOrganogram.classList.toggle('is-preview', preview);
  };
  clearPolicy();
  policyNodes.forEach((node) => {
    node.addEventListener('pointerenter', (event) => {
      if (!hoverCapable.matches || event.pointerType === 'touch' || pinnedPolicy) return;
      cancelPreviewOpen();
      cancelPreviewClose();
      previewOpenTimer = window.setTimeout(() => {
        previewOpenTimer = null;
        if (pinnedPolicy) return;
        previewPolicy = node;
        showPolicy(node, true);
      }, 140);
    });
    node.addEventListener('pointerleave', () => {
      if (pinnedPolicy) return;
      cancelPreviewOpen();
      if (previewPolicy === node) schedulePreviewClose();
    });
    node.addEventListener('click', () => {
      cancelPreviewOpen();
      cancelPreviewClose();
      if (pinnedPolicy === node) {
        clearPolicy();
        return;
      }
      pinnedPolicy = node;
      previewPolicy = null;
      showPolicy(node, false);
    });
  });
  document.addEventListener('pointermove', (event) => {
    if (!hoverCapable.matches || event.pointerType === 'touch' || pinnedPolicy || !previewPolicy) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.et-policy-node')) {
      cancelPreviewClose();
      return;
    }
    if (!previewCloseTimer) schedulePreviewClose();
  }, { passive: true });
  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('.et-policy-node, .et-policy-detail')) return;
    if (pinnedPolicy || previewPolicy) clearPolicy();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (pinnedPolicy || previewPolicy)) clearPolicy();
  });

  const items = [...document.querySelectorAll('.et-reveal')];
  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12, rootMargin: '0px 0px -8%' });
  items.forEach((item) => observer.observe(item));
});
