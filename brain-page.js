"use strict";

(async () => {
  const count = document.querySelector("#brain-record-count");
  const introCopy = document.querySelector(".brain-workspace-intro__copy");
  const introTitle = introCopy?.querySelector("h1");
  const toggle = document.querySelector(".reference-header__toggle");
  const nav = document.querySelector("#site-navigation");
  const analysisTrigger = document.querySelector("#brain-analysis-trigger");
  const analysisPanel = document.querySelector("#brain-analysis");
  const analysisChart = document.querySelector("#brain-analysis-chart");
  const analysisPopup = document.querySelector("#brain-analysis-popup");
  const analysisClose = document.querySelector("#brain-analysis-close");
  const brainRoot = document.querySelector("#regulatory-brain");

  if (introCopy && introTitle) {
    const syncIntroMeasure = () => introCopy.style.setProperty("--intro-title-width", `${Math.ceil(introTitle.getBoundingClientRect().width)}px`);
    new ResizeObserver(syncIntroMeasure).observe(introTitle);
    document.fonts?.ready.then(syncIntroMeasure);
    syncIntroMeasure();
  }

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  try {
    const laws = await loadLaws("data/normas.csv?v=20261029-6");
    const identities = new Map();
    laws.forEach((law) => {
      const key = `${normalize(law.type)}|${normalize(law.number)}|${law.number === "-" ? normalize(law.name) : ""}`;
      if (!identities.has(key)) identities.set(key, new Set());
      identities.get(key).add(normalize(law.theme));
    });
    const sharedActs = [...identities.values()].filter((themes) => themes.size > 1).length;
    const uniqueLaws = identities.size;
    const consolidationInstruments = new Set(
      laws
        .filter((law) => isSectorInstrument(law))
        .map((law) => `${normalize(law.type)}|${normalize(law.number)}|${law.number === "-" ? normalize(law.name) : ""}`),
    ).size;
    const filters = [
      ["themes", `${laws.length} registros regulatórios identificados nos ${THEMES.length} temas`],
      ["norms", `${uniqueLaws} normas`],
      ["shared", `${sharedActs} atos compartilhados`],
      ["instruments", `${consolidationInstruments} instrumentos setoriais`],
    ];
    const filterGroup = document.createElement("span");
    filterGroup.className = "brain-collection-filters";
    filterGroup.setAttribute("role", "group");
    filterGroup.setAttribute("aria-label", "Organizar o mapa por tipo de conteúdo");
    filters.forEach(([mode, label]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.brainCollection = mode;
      button.textContent = label;
      button.setAttribute("aria-pressed", "false");
      filterGroup.append(button);
    });
    count.replaceChildren(filterGroup);

    const recordsByTheme = new Map();
    laws.forEach((law) => {
      if (!recordsByTheme.has(law.theme)) recordsByTheme.set(law.theme, []);
      recordsByTheme.get(law.theme).push(law);
    });
    const chartRows = [...recordsByTheme.entries()]
      .map(([theme, records]) => [theme, records.length])
      .sort((first, second) => second[1] - first[1] || first[0].localeCompare(second[0], "pt-BR"));
    const maximum = Math.max(...chartRows.map(([, total]) => total), 1);
    let pinnedAnalysisTheme = "";
    let popupTimer = 0;
    const hideAnalysisPopup = (force = false) => {
      window.clearTimeout(popupTimer);
      if (!analysisPopup || (pinnedAnalysisTheme && !force)) return;
      analysisPopup.hidden = true;
    };
    const showAnalysisPopup = (theme, anchor, pin = false) => {
      if (!analysisPopup) return;
      window.clearTimeout(popupTimer);
      if (pin) pinnedAnalysisTheme = pinnedAnalysisTheme === theme ? "" : theme;
      if (pin && !pinnedAnalysisTheme) {
        hideAnalysisPopup(true);
        return;
      }
      const records = recordsByTheme.get(theme) || [];
      const heading = document.createElement("header");
      const title = document.createElement("strong");
      title.textContent = theme;
      const meta = document.createElement("span");
      meta.textContent = `${records.length} ${records.length === 1 ? "registro vinculado" : "registros vinculados"}`;
      heading.append(title, meta);
      const list = document.createElement("div");
      list.className = "brain-analysis-popup__list";
      records.forEach((law) => {
        const link = document.createElement("a");
        link.href = law.url || "#";
        if (law.url) {
          link.target = "_blank";
          link.rel = "noopener noreferrer";
        }
        const identification = law.number && law.number !== "-" ? `${law.type} ${law.number}` : law.name;
        link.textContent = identification;
        link.title = law.name || identification;
        list.append(link);
      });
      const hint = document.createElement("small");
      hint.textContent = pinnedAnalysisTheme === theme ? "Lista fixada · clique novamente no número para fechar" : "Clique no número para manter esta lista aberta";
      analysisPopup.replaceChildren(heading, list, hint);
      analysisPopup.hidden = false;
      if (anchor && analysisPanel) {
        const panelBounds = analysisPanel.getBoundingClientRect();
        const anchorBounds = anchor.closest(".brain-analysis__column")?.getBoundingClientRect() || anchor.getBoundingClientRect();
        const popupBounds = analysisPopup.getBoundingClientRect();
        let left = anchorBounds.right - panelBounds.left + 10;
        if (left + popupBounds.width > panelBounds.width - 12) left = anchorBounds.left - panelBounds.left - popupBounds.width - 10;
        const top = Math.max(82, Math.min(anchorBounds.top - panelBounds.top + 16, panelBounds.height - popupBounds.height - 12));
        analysisPopup.style.left = `${Math.max(12, left)}px`;
        analysisPopup.style.top = `${top}px`;
      }
    };
    analysisChart?.replaceChildren(...chartRows.map(([theme, total], index) => {
      const column = document.createElement("div");
      column.className = "brain-analysis__column";
      column.style.setProperty("--bar-size", `${(total / maximum) * 100}%`);
      column.style.setProperty("--bar-order", index);
      const value = document.createElement("button");
      value.type = "button";
      value.className = "brain-analysis__value";
      value.textContent = total;
      value.setAttribute("aria-label", `${total} registros em ${theme}. Mostrar registros vinculados.`);
      value.addEventListener("mouseenter", () => showAnalysisPopup(theme, value));
      value.addEventListener("focus", () => showAnalysisPopup(theme, value));
      value.addEventListener("mouseleave", () => {
        if (!pinnedAnalysisTheme) popupTimer = window.setTimeout(() => hideAnalysisPopup(), 140);
      });
      value.addEventListener("blur", () => {
        if (!pinnedAnalysisTheme) popupTimer = window.setTimeout(() => hideAnalysisPopup(), 140);
      });
      value.addEventListener("click", () => showAnalysisPopup(theme, value, true));
      const track = document.createElement("span");
      track.className = "brain-analysis__track";
      track.append(document.createElement("i"));
      const label = document.createElement("span");
      label.className = "brain-analysis__label";
      label.textContent = theme;
      column.append(value, track, label);
      return column;
    }));
    analysisPopup?.addEventListener("mouseenter", () => window.clearTimeout(popupTimer));
    analysisPopup?.addEventListener("mouseleave", () => {
      if (!pinnedAnalysisTheme) hideAnalysisPopup();
    });

    const setAnalysisOpen = (open) => {
      if (!analysisPanel || !brainRoot || !analysisTrigger) return;
      analysisPanel.hidden = !open;
      brainRoot.classList.toggle("is-analysis-open", open);
      analysisTrigger.setAttribute("aria-pressed", String(open));
      if (!open) {
        pinnedAnalysisTheme = "";
        hideAnalysisPopup(true);
      }
      if (open) {
        window.__regulatoryBrain?.setCollectionView("");
        filterGroup.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", "false"));
        document.querySelector("#mapa")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    analysisTrigger?.addEventListener("click", () => setAnalysisOpen(true));
    analysisClose?.addEventListener("click", () => setAnalysisOpen(false));

    window.initRegulatoryBrain({ laws, themes: THEMES });
    document.querySelector("#regulatory-brain")?.addEventListener("braincollectionchange", (event) => {
      const mode = event.detail?.mode || "";
      filterGroup.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item.dataset.brainCollection === mode)));
    });
    filterGroup.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-brain-collection]");
      if (!button || !window.__regulatoryBrain?.setCollectionView(button.dataset.brainCollection)) return;
      setAnalysisOpen(false);
      filterGroup.querySelectorAll("button").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
      document.querySelector("#mapa")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  } catch (error) {
    count.textContent = "Não foi possível carregar as conexões do acervo.";
    console.error(error);
  }
})();
