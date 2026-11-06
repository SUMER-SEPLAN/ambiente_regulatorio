"use strict";

(() => {
  const themes = [
    ["arquitetura-institucional", "Arquitetura institucional e marco regulatório do setor elétrico"],
    ["direito-do-consumidor", "Direito do Consumidor de Energia"],
    ["inclusao-energetica", "Políticas e Mecanismos de Inclusão Energética"],
    ["tributacao-estadual", "Tributação Estadual do Setor Elétrico"],
    ["conexao-e-acesso-a-rede", "Conexão e Acesso à Rede"],
    ["geracao-distribuida", "Geração Distribuída"],
    ["comercializacao-de-energia", "Comercialização de Energia"],
    ["planejamento-energetico", "Planejamento Energético"],
    ["transicao-energetica", "Transição Energética e Novas tecnologias"],
    ["licenciamento-ambiental", "Licenciamento Ambiental"],
    ["participacao-publica", "Participação Pública"],
  ];

  const nav = document.querySelector(".reference-header__nav");
  if (!nav) return;

  const trigger = [...nav.children].find((item) => item.matches("[data-macrotemas-toggle]") || (item.matches("a") && item.getAttribute("href")?.includes("#macrotemas")));
  if (!trigger) return;

  const clickToggle = trigger.matches("[data-macrotemas-toggle]");

  const dropdown = document.createElement("div");
  dropdown.className = "reference-header__dropdown";

  const menu = document.createElement("div");
  menu.className = "reference-header__dropdown-menu";
  menu.id = "macrotemas-menu";
  menu.setAttribute("aria-hidden", "true");

  const list = document.createElement("div");
  list.className = "reference-header__dropdown-list";
  list.setAttribute("role", "menu");
  list.setAttribute("aria-label", "Páginas de temas");

  const insideThemesFolder = location.pathname.includes("/macrotemas/");
  const prefix = insideThemesFolder ? "" : "macrotemas/";
  const links = themes.map(([slug, label]) => {
    const link = document.createElement("a");
    link.href = `${prefix}${slug}.html`;
    link.textContent = label;
    link.setAttribute("role", "menuitem");
    link.tabIndex = -1;
    if (location.pathname.endsWith(`/${slug}.html`)) {
      link.classList.add("is-current");
      link.setAttribute("aria-current", "page");
    }
    list.append(link);
    return link;
  });

  menu.append(list);
  trigger.before(dropdown);
  dropdown.append(trigger, menu);
  trigger.classList.add("reference-header__dropdown-trigger");
  trigger.setAttribute("aria-haspopup", "menu");
  trigger.setAttribute("aria-controls", menu.id);
  trigger.setAttribute("aria-expanded", "false");

  let openTimer;
  let closeTimer;
  const open = () => {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
    dropdown.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    menu.setAttribute("aria-hidden", "false");
    links.forEach((link) => { link.tabIndex = 0; });
  };
  const close = () => {
    window.clearTimeout(openTimer);
    dropdown.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    menu.setAttribute("aria-hidden", "true");
    links.forEach((link) => { link.tabIndex = -1; });
  };
  const scheduleOpen = () => {
    window.clearTimeout(closeTimer);
    window.clearTimeout(openTimer);
    if (dropdown.classList.contains("is-open")) return;
    openTimer = window.setTimeout(open, 350);
  };
  const scheduleClose = () => {
    window.clearTimeout(openTimer);
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(close, 420);
  };

  if (!clickToggle) {
    dropdown.addEventListener("pointerenter", scheduleOpen);
    dropdown.addEventListener("pointerleave", scheduleClose);
    dropdown.addEventListener("focusin", open);
  }
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) close();
  });
  dropdown.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) close();
    });
  });

  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    if (!clickToggle) {
      open();
      return;
    }
    if (dropdown.classList.contains("is-open")) close(); else open();
  });
  links.forEach((link) => link.addEventListener("click", close));

  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      open();
      links[0]?.focus();
    }
  });

  list.addEventListener("keydown", (event) => {
    const current = links.indexOf(document.activeElement);
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      trigger.focus();
      return;
    }
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? 0
      : event.key === "End" ? links.length - 1
        : event.key === "ArrowDown" ? (current + 1) % links.length
          : (current - 1 + links.length) % links.length;
    links[next]?.focus();
  });
})();
