"use strict";

const SVG_NS = "http://www.w3.org/2000/svg";
const THEME_ICONS = {
  landmark: [["path", { d: "M4 20.5h16M5.5 18.5h13M6.5 9v9.5M10.2 9v9.5M13.8 9v9.5M17.5 9v9.5M4.5 9h15L12 3.5 4.5 9Z" }], ["circle", { cx: "12", cy: "6.4", r: ".7" }]],
  consumer: [["circle", { cx: "9", cy: "7.2", r: "3" }], ["path", { d: "M3.5 20.5v-1.4a5.5 5.5 0 0 1 11 0v1.4M16 5a2.7 2.7 0 0 1 0 5.4M16.8 14a5 5 0 0 1 3.7 4.8v1.7" }]],
  access: [["circle", { cx: "12", cy: "7", r: "3" }], ["circle", { cx: "5.5", cy: "9", r: "2.2" }], ["circle", { cx: "18.5", cy: "9", r: "2.2" }], ["path", { d: "M6.5 20.5v-1.2a5.5 5.5 0 0 1 11 0v1.2M1.8 20v-.8a4 4 0 0 1 4-4M22.2 20v-.8a4 4 0 0 0-4-4" }]],
  coins: [["ellipse", { cx: "12", cy: "5.5", rx: "6", ry: "2.5" }], ["path", { d: "M6 5.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4M6 9.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4M6 13.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" }]],
  tower: [["path", { d: "M12 2.5 6 21M12 2.5 18 21M8.2 14h7.6M7 18h10M9.4 10h5.2M4 7h16M6 4.5 4 7l3 2.5M18 4.5 20 7l-3 2.5" }]],
  "home-energy": [["path", { d: "m3.5 10 8.5-7 8.5 7M5.5 9v11h13V9M9 20v-6h6v6" }], ["path", { d: "m13 7-2.2 4h2l-1.2 3 3.1-4.7h-2L14 7" }]],
  market: [["path", { d: "M4 20V5M4 20h16M8 17v-5h3v5M14 17V8h3v9M7 8.5l4-3 3 1.5 5-4" }], ["path", { d: "m16.5 3 2.5 0 0 2.5" }]],
  clipboard: [["rect", { x: "5", y: "4.5", width: "14", height: "17", rx: "2" }], ["path", { d: "M9 4.5V3h6v1.5M8.5 9h7M8.5 13h7M8.5 17h4.5" }]],
  "leaf-hand": [["path", { d: "M19.5 4.5C13 4.5 9 7.6 9 12c0 2.3 1.6 3.8 3.8 3.8 4.7 0 6.7-4.7 6.7-11.3Z" }], ["path", { d: "M7 19.5c3.2-4.5 5.9-7.1 9.2-8.8M3 18.5c2.2-.8 4.2-.4 5.8 1.2 1.5 1.5 3.5 1.7 5.2.4l2.5-1.9" }]],
  transition: [["path", { d: "M14 3.2 8.5 12h4.2l-1 8.8 5.8-10h-4.2L14 3.2Z" }], ["path", { d: "M6.2 7.4A7.5 7.5 0 0 1 18.6 6L20 8.2M20 4.8v3.4h-3.4M17.8 16.6A7.5 7.5 0 0 1 5.4 18L4 15.8M4 19.2v-3.4h3.4" }]],
  "file-check": [["path", { d: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" }], ["path", { d: "M14 3v6h6M8 15l2 2 5-5" }]],
  messages: [["path", { d: "M21 14a4 4 0 0 1-4 4H9l-5 3v-5a6 6 0 0 1-2-4V8a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4z" }], ["path", { d: "M7 9h10M7 13h6" }]],
};

const COLORS = ["#145fbc", "#24a064", "#f0a027", "#e4583e", "#5b82cf", "#8f70ca", "#d5b34c", "#2c9ec5", "#7d9b68", "#a86b9d", "#3d76b8"];

const state = { laws: [], filters: { search: "", theme: [], type: [], scope: [], year: [] }, catalogMode: null };
let timelineObserver = null;
let counterAnimationToken = 0;

// Widgets de seleção múltipla, indexados pelo nome do filtro.
const controls = {};

const elements = {
  themeGrid: document.querySelector("#theme-grid"),
  total: document.querySelector("#total-normas"),
  federal: document.querySelector("#total-federais"),
  state: document.querySelector("#total-estaduais"),
  consolidation: document.querySelector("#total-instrumentos"),
  donut: document.querySelector("#theme-donut"),
  donutChart: document.querySelector("#donut-chart"),
  donutTotal: document.querySelector("#donut-total"),
  donutAllRecords: document.querySelector("#donut-all-records"),
  chartTooltip: document.querySelector("#chart-tooltip"),
  themeLegend: document.querySelector("#theme-legend"),
  timelineChart: document.querySelector("#timeline-chart"),
  timelineSvg: document.querySelector("#timeline-svg"),
  timelineTooltip: document.querySelector("#timeline-tooltip"),
  timelineSummary: document.querySelector("#timeline-summary"),
  timelineNote: document.querySelector("#timeline-description"),
  form: document.querySelector("#filters"),
  search: document.querySelector("#search"),
  themeFilter: document.querySelector("#theme-filter"),
  typeFilter: document.querySelector("#type-filter"),
  scopeFilter: document.querySelector("#scope-filter"),
  yearFilter: document.querySelector("#year-filter"),
  resultsMeta: document.querySelector(".results-meta"),
  resultCount: document.querySelector("#results-count"),
  resultsTable: document.querySelector("#results-table"),
  catalogScrollbar: document.querySelector("#catalog-scrollbar"),
  catalogScrollbarThumb: document.querySelector("#catalog-scrollbar-thumb"),
  tableBody: document.querySelector("#laws-body"),
  clearFilters: document.querySelector("#clear-filters"),
  navToggle: document.querySelector(".nav-toggle"),
  nav: document.querySelector("#site-navigation"),
};

function option(select, value, label) {
  const item = document.createElement("option"); item.value = value; item.textContent = label; select.append(item);
}

/* O catálogo usa anos com quatro dígitos e, em três normas, a forma abreviada
   /21 ou /15. Registros sem ano explícito permanecem fora da série temporal. */
function getLawYear(law) {
  const value = String(law.number || "");
  const fullYear = value.match(/(?:19|20)\d{2}/);
  if (fullYear) return Number(fullYear[0]);
  const shortYear = value.match(/\/(\d{2})\s*$/);
  if (!shortYear) return null;
  const year = Number(shortYear[1]);
  return year <= 30 ? 2000 + year : 1900 + year;
}

/* A base atual não possui uma coluna de data completa. O catálogo usa o ano
   inscrito no número da norma e mantém a ordem original entre registros do
   mesmo ano. Normas sem ano identificado aparecem ao final. */
function compareLawsNewestFirst(first, second) {
  const firstYear = getLawYear(first);
  const secondYear = getLawYear(second);
  if (firstYear === secondYear) return 0;
  if (firstYear === null) return 1;
  if (secondYear === null) return -1;
  return secondYear - firstYear;
}

/* Identidade usada exclusivamente nos três cards de resumo. O catálogo,
   o anel, a linha do tempo e as conexões continuam trabalhando com todos
   os registros temáticos da base. */
function uniqueLawIdentity(law) {
  const type = normalize(law.type);
  const number = normalize(law.number);
  const fallbackName = !number || number === "-" ? normalize(law.name) : "";
  return `${type}|${number}|${fallbackName}`;
}

function closeAllMultiselects() {
  Object.values(controls).forEach((control) => control.close());
}

/* Substitui um <select> por um dropdown de checkboxes. O <select> nativo em
   modo multiple exige Ctrl+clique e não mostra o que está marcado. */
function createMultiselect(select, labelId) {
  const choices = [...select.options].slice(1).map((item) => ({ value: item.value, label: item.textContent }));
  const wrap = document.createElement("div");
  wrap.className = "multiselect";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "multiselect__toggle";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-labelledby", `${labelId} ${labelId}-value`);

  const text = document.createElement("span");
  text.className = "multiselect__text";
  text.id = `${labelId}-value`;
  const caret = document.createElement("span");
  caret.className = "multiselect__caret";
  caret.setAttribute("aria-hidden", "true");
  toggle.append(text, caret);

  const panel = document.createElement("div");
  panel.className = "multiselect__panel";
  panel.hidden = true;

  const allOption = document.createElement("label");
  allOption.className = "multiselect__option multiselect__option--all";
  const allBox = document.createElement("input");
  allBox.type = "checkbox";
  const allCaption = document.createElement("span");
  allCaption.textContent = "Todos";
  allOption.append(allBox, allCaption);
  panel.append(allOption);

  const boxes = choices.map(({ value, label }) => {
    const option = document.createElement("label");
    option.className = "multiselect__option";
    const box = document.createElement("input");
    box.type = "checkbox";
    box.value = value;
    const caption = document.createElement("span");
    caption.textContent = label;
    option.append(box, caption);
    panel.append(option);
    return box;
  });

  wrap.append(toggle, panel);
  select.replaceWith(wrap);

  const control = {
    onChange: null,
    get: () => boxes.filter((box) => box.checked).map((box) => box.value),
    set(values) {
      const wanted = new Set(values);
      boxes.forEach((box) => { box.checked = wanted.has(box.value); });
      control.refresh();
    },
    clear: () => control.set([]),
    refresh() {
      const chosen = boxes.filter((box) => box.checked);
      allBox.checked = chosen.length === boxes.length && boxes.length > 0;
      allBox.indeterminate = chosen.length > 0 && chosen.length < boxes.length;
      text.textContent = chosen.length === 0 ? "Selecionar"
        : chosen.length === boxes.length ? "Todos"
        : chosen.length === 1 ? chosen[0].nextElementSibling.textContent
        : `${chosen.length} selecionados`;
      wrap.classList.toggle("is-filled", chosen.length > 0);
      toggle.setAttribute("aria-label", `${chosen.length} de ${boxes.length} selecionados`);
    },
    close() {
      if (panel.hidden) return;
      panel.hidden = true;
      toggle.setAttribute("aria-expanded", "false");
    },
  };

  toggle.addEventListener("click", () => {
    const shouldOpen = panel.hidden;
    closeAllMultiselects();
    if (!shouldOpen) return;
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  });

  panel.addEventListener("change", (event) => {
    if (event.target === allBox) {
      boxes.forEach((box) => { box.checked = allBox.checked; });
    }
    control.refresh();
    if (control.onChange) control.onChange();
  });

  wrap.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || panel.hidden) return;
    control.close();
    toggle.focus();
  });

  control.refresh();
  return control;
}

function populateFilters() {
  THEMES.forEach((theme) => {
    option(elements.themeFilter, theme.name, theme.name);
  });
  [...new Set(state.laws.map((law) => law.type).filter(Boolean))].sort((a, b) => a.localeCompare(b, "pt-BR")).forEach((item) => option(elements.typeFilter, item, item));
  [...new Set(state.laws.map(getLawYear).filter(Boolean))].sort((a, b) => b - a).forEach((year) => option(elements.yearFilter, String(year), String(year)));

  controls.theme = createMultiselect(elements.themeFilter, "label-theme");
  controls.type = createMultiselect(elements.typeFilter, "label-type");
  controls.scope = createMultiselect(elements.scopeFilter, "label-scope");
  controls.year = createMultiselect(elements.yearFilter, "label-year");
}

function renderThemeCards() {
  const fragment = document.createDocumentFragment();
  /* A faixa usa diretamente a ordem canônica de THEMES, a mesma coleção que
     alimenta a cascata fixa do Brain e os demais seletores da Home. */
  const orderedThemes = [...THEMES];
  orderedThemes.forEach((theme, index) => {
    const card = document.createElement("a");
    card.className = "theme-card";
    card.href = theme.slug === "comercializacao-de-energia"
      ? `macrotemas/${theme.slug}.html?v=625`
      : theme.slug === "tributacao-estadual"
        ? `macrotemas/${theme.slug}.html?v=620`
        : theme.slug === "geracao-distribuida"
          ? `macrotemas/${theme.slug}.html?v=662`
        : theme.slug === "conexao-e-acesso-a-rede"
          ? `macrotemas/${theme.slug}.html?v=655`
        : `macrotemas/${theme.slug}.html`;
    card.style.setProperty("--theme-order", index);
    const icon = document.createElement("span"); icon.className = "theme-icon"; icon.append(createThemeIcon(theme.icon));
    const title = document.createElement("strong"); title.textContent = theme.name;
    const description = document.createElement("small"); description.textContent = theme.label;
    const arrow = document.createElement("em"); arrow.className = "theme-card__go"; arrow.textContent = "Ver o tema";
    card.append(icon, title, description, arrow);
    fragment.append(card);
  });
  elements.themeGrid.replaceChildren(fragment);
  setUpThemeCarousel();
}

function setUpThemeCarousel() {
  const track = elements.themeGrid;
  const previous = document.querySelector("[data-themes-prev]");
  const next = document.querySelector("[data-themes-next]");
  if (!track || !previous || !next) return;

  const cards = [...track.querySelectorAll(".theme-card")];
  const cardStep = () => {
    const card = cards[0];
    const gap = Number.parseFloat(getComputedStyle(track).gap) || 18;
    return card ? card.getBoundingClientRect().width + gap : track.clientWidth * .8;
  };
  const reveal = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { root: track, threshold: .22 });
  cards.forEach((card) => reveal.observe(card));

  let tracking = false;
  let dragging = false;
  let dragged = false;
  let startX = 0;
  let startScroll = 0;
  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    tracking = true;
    dragging = false;
    dragged = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
  });
  track.addEventListener("pointermove", (event) => {
    if (!tracking) return;
    if (event.buttons === 0) { tracking = false; return; }
    const distance = event.clientX - startX;
    if (!dragging && Math.abs(distance) > 10) {
      dragging = true;
      dragged = true;
      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    }
    if (!dragging) return;
    track.scrollLeft = startScroll - distance;
  });
  const finishDrag = (event) => {
    if (!tracking) return;
    tracking = false;
    if (!dragging) return;
    dragging = false;
    track.classList.remove("is-dragging");
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    /* Como na linha do tempo institucional, o arraste termina exatamente no
       ponto escolhido pelo usuário. As setas continuam avançando por card. */
  };
  track.addEventListener("pointerup", finishDrag);
  track.addEventListener("pointercancel", finishDrag);
  track.addEventListener("click", (event) => {
    if (!dragged) return;
    event.preventDefault();
    event.stopPropagation();
    dragged = false;
  }, true);

  const update = () => {
    const limit = Math.max(0, track.scrollWidth - track.clientWidth);
    const atStart = track.scrollLeft <= 8;
    const atEnd = track.scrollLeft >= limit - 2;
    previous.hidden = atStart;
    next.hidden = atEnd || limit <= 2;
    previous.disabled = atStart;
    next.disabled = atEnd || limit <= 2;
  };
  previous.addEventListener("click", () => track.scrollBy({ left: -cardStep(), behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: cardStep(), behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update, { passive: true });
  requestAnimationFrame(update);
}

function createThemeIcon(iconName) {
  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  /* Traço mais leve para acompanhar a hierarquia tipográfica dos cartões. */
  svg.setAttribute("stroke-width", "1.25");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");
  (THEME_ICONS[iconName] || []).forEach(([tag, attributes]) => {
    const shape = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([key, value]) => shape.setAttribute(key, value));
    svg.append(shape);
  });
  return svg;
}

function renderStats() {
  const totalRecords = state.laws.length;
  const uniqueLaws = [...new Map(state.laws.map((law) => [uniqueLawIdentity(law), law])).values()];
  const total = uniqueLaws.length;
  const federal = uniqueLaws.filter((law) => law.scope === "Federal").length;
  const stateCount = uniqueLaws.filter((law) => law.scope === "Estadual").length;
  const consolidation = uniqueLaws.filter(isSectorInstrument).length;
  [[elements.total, total], [elements.federal, federal], [elements.state, stateCount], [elements.consolidation, consolidation], [elements.donutTotal, totalRecords]].forEach(([element, value]) => {
    element.dataset.value = String(value);
    /* O valor real permanece visível mesmo antes de o anel entrar na tela. */
    element.textContent = String(value);
  });
  const counts = THEMES
    .map((theme) => ({ ...theme, count: state.laws.filter((law) => normalize(law.theme).includes(normalize(theme.name))).length }))
    .filter((item) => item.count > 0)
    .sort((first, second) => second.count - first.count || first.name.localeCompare(second.name, "pt-BR"));
  const maxCount = Math.max(...counts.map((item) => item.count));
  const segments = document.createElementNS(SVG_NS, "g");
  segments.classList.add("donut__segments");
  const legend = document.createDocumentFragment();
  let start = 0;
  counts.forEach((item) => {
    const portion = (item.count / totalRecords) * 100;
    const percentage = Math.round((item.count / totalRecords) * 100);
    const visiblePortion = Math.max(portion - .22, .12);
    const circle = document.createElementNS(SVG_NS, "circle");
    circle.setAttribute("class", "donut__segment"); circle.setAttribute("cx", "60"); circle.setAttribute("cy", "60"); circle.setAttribute("r", "46"); circle.setAttribute("pathLength", "100");
    circle.style.setProperty("--segment-start", String(start)); circle.style.setProperty("--segment-size", String(visiblePortion)); circle.style.setProperty("--segment-delay", `${0.1 + (start / 100) * 1}s`);
    const color = getChartColor(item.count, maxCount);
    circle.style.stroke = color;
    circle.setAttribute("tabindex", "0"); circle.setAttribute("role", "button"); circle.setAttribute("aria-label", `${item.name}: ${item.count} ${item.count === 1 ? "registro regulatório" : "registros regulatórios"}, ${percentage}% do acervo`);
    let button;
    const showTooltip = () => activateChartItem(circle, button, item, percentage, circle.style.stroke);
    circle.addEventListener("pointerenter", showTooltip); circle.addEventListener("focus", showTooltip);
    circle.addEventListener("pointerleave", hideChartTooltip); circle.addEventListener("blur", hideChartTooltip);
    circle.addEventListener("click", () => selectThemeAndShow(item.name));
    circle.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectThemeAndShow(item.name);
    });
    segments.append(circle); start += portion;

    button = document.createElement("button");
    button.type = "button";
    button.className = "donut-legend__item";
    button.setAttribute("aria-label", `${item.name}: ${item.count} ${item.count === 1 ? "registro regulatório" : "registros regulatórios"}, ${percentage}% do acervo. Filtrar o catálogo.`);
    const swatch = document.createElement("span"); swatch.className = "donut-legend__swatch"; swatch.style.backgroundColor = color; swatch.setAttribute("aria-hidden", "true");
    const label = document.createElement("span"); label.className = "donut-legend__label"; label.textContent = item.name;
    button.append(swatch, label);
    button.addEventListener("pointerenter", showTooltip); button.addEventListener("focus", showTooltip);
    button.addEventListener("pointerleave", hideChartTooltip); button.addEventListener("blur", hideChartTooltip);
    button.addEventListener("click", () => selectThemeAndShow(item.name));
    legend.append(button);
  });
  elements.donutChart.replaceChildren(segments);
  elements.themeLegend.replaceChildren(legend);
  renderTimeline();
}

function createSvgElement(tag, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
  return element;
}

function animateTimelineWhenVisible() {
  if (!elements.timelineChart) return;
  if (timelineObserver) timelineObserver.disconnect();
  elements.timelineChart.classList.remove("is-animated");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    elements.timelineChart.classList.add("is-animated");
    return;
  }
  let readyToPlay = true;
  timelineObserver = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= .3 && readyToPlay) {
      readyToPlay = false;
      elements.timelineChart.classList.remove("is-animated");
      void elements.timelineChart.offsetWidth;
      requestAnimationFrame(() => elements.timelineChart.classList.add("is-animated"));
      return;
    }
    if (entry.intersectionRatio <= .05 && !readyToPlay) {
      elements.timelineChart.classList.remove("is-animated");
      readyToPlay = true;
    }
  }, { threshold: [0, .06, .3] });
  timelineObserver.observe(elements.timelineChart);
}

function renderTimeline() {
  const lawsWithYear = state.laws
    .map((law) => ({ law, year: getLawYear(law) }))
    .filter((item) => item.year);
  const years = lawsWithYear.map((item) => item.year);
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  const grouped = new Map();
  lawsWithYear.forEach(({ law, year }) => {
    if (!grouped.has(year)) grouped.set(year, []);
    grouped.get(year).push(law);
  });

  const series = Array.from({ length: maxYear - minYear + 1 }, (_, index) => {
    const year = minYear + index;
    return { year, laws: grouped.get(year) || [], count: (grouped.get(year) || []).length };
  });
  const width = 1000;
  const height = 330;
  const margin = { top: 28, right: 30, bottom: 54, left: 58 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxCount = Math.max(...series.map((item) => item.count));
  const yMax = Math.max(5, Math.ceil(maxCount / 5) * 5);
  const x = (year) => margin.left + ((year - minYear) / (maxYear - minYear || 1)) * innerWidth;
  const y = (count) => margin.top + innerHeight - (count / yMax) * innerHeight;

  elements.timelineSvg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  elements.timelineSvg.replaceChildren();

  const defs = createSvgElement("defs");
  const gradient = createSvgElement("linearGradient", { id: "timeline-fill", x1: "0", y1: "0", x2: "0", y2: "1" });
  gradient.append(
    createSvgElement("stop", { offset: "0%", "stop-color": "#0b4a92", "stop-opacity": ".13" }),
    createSvgElement("stop", { offset: "100%", "stop-color": "#0b4a92", "stop-opacity": "0" }),
  );
  defs.append(gradient);
  elements.timelineSvg.append(defs);

  const grid = createSvgElement("g", { "aria-hidden": "true" });
  for (let value = 0; value <= yMax; value += 5) {
    const position = y(value);
    grid.append(createSvgElement("line", { class: "timeline-grid", x1: margin.left, y1: position, x2: width - margin.right, y2: position }));
    const label = createSvgElement("text", { class: "timeline-axis-label", x: margin.left - 12, y: position + 4, "text-anchor": "end" });
    label.textContent = String(value);
    grid.append(label);
  }
  const tickYears = [...new Set([minYear, 1980, 2000, 2010, 2020, maxYear].filter((year) => year >= minYear && year <= maxYear))];
  tickYears.forEach((year) => {
    const position = x(year);
    grid.append(createSvgElement("line", { class: "timeline-axis-tick", x1: position, y1: height - margin.bottom, x2: position, y2: height - margin.bottom + 6 }));
    const label = createSvgElement("text", { class: "timeline-axis-label", x: position, y: height - margin.bottom + 25, "text-anchor": "middle" });
    label.textContent = String(year);
    grid.append(label);
  });
  grid.append(createSvgElement("line", { class: "timeline-axis", x1: margin.left, y1: height - margin.bottom, x2: width - margin.right, y2: height - margin.bottom }));
  elements.timelineSvg.append(grid);

  const coordinates = series.map((item) => `${x(item.year).toFixed(2)},${y(item.count).toFixed(2)}`);
  const linePath = `M${coordinates.join(" L")}`;
  const areaPath = `${linePath} L${x(maxYear).toFixed(2)},${y(0).toFixed(2)} L${x(minYear).toFixed(2)},${y(0).toFixed(2)} Z`;
  elements.timelineSvg.append(
    createSvgElement("path", { class: "timeline-area", d: areaPath, "aria-hidden": "true" }),
    createSvgElement("path", { class: "timeline-line", d: linePath, pathLength: "1", "aria-hidden": "true" }),
  );

  const points = createSvgElement("g");
  series.filter((item) => item.count > 0).forEach((item, pointIndex) => {
    const point = createSvgElement("g", {
      class: "timeline-point",
      transform: `translate(${x(item.year).toFixed(2)} ${y(item.count).toFixed(2)})`,
      tabindex: "0",
      role: "button",
      "aria-label": `${item.year}: ${item.count} ${item.count === 1 ? "norma" : "normas"}. Filtrar o catálogo por este ano.`,
    });
    const content = createSvgElement("g", { class: "timeline-point__content" });
    content.style.setProperty("--point-delay", `${Math.round(160 + ((item.year - minYear) / (maxYear - minYear || 1)) * 1450)}ms`);
    content.append(
      createSvgElement("circle", { class: "timeline-point__hit", r: "18" }),
      createSvgElement("circle", { class: "timeline-point__mark", r: item.count >= 10 ? "7" : "5.5" }),
    );
    const labelY = item.count >= 5 || pointIndex % 2 === 0 ? -17 : -30;
    const labelWidth = item.count >= 10 ? 23 : 19;
    const valueLabel = createSvgElement("g", { class: "timeline-point__value-label", transform: `translate(0 ${labelY})` });
    valueLabel.append(createSvgElement("rect", {
      class: "timeline-point__value-bg",
      x: String(-labelWidth / 2),
      y: "-8",
      width: String(labelWidth),
      height: "16",
      rx: "8",
    }));
    const value = createSvgElement("text", { class: "timeline-point__value", x: "0", y: "3.5" });
    value.textContent = String(item.count);
    valueLabel.append(value);
    content.append(valueLabel);
    point.append(content);
    const showTooltip = () => showTimelineTooltip(item, point);
    point.addEventListener("pointerenter", showTooltip);
    point.addEventListener("focus", showTooltip);
    point.addEventListener("pointerleave", hideTimelineTooltip);
    point.addEventListener("blur", hideTimelineTooltip);
    point.addEventListener("click", () => selectYearAndShow(item.year));
    point.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectYearAndShow(item.year);
    });
    points.append(point);
  });
  elements.timelineSvg.append(points);

  elements.timelineSummary.textContent = "Clique nos pontos para consultar os registros.";
  elements.timelineNote.textContent = "Distribuição anual dos registros regulatórios do acervo com ano identificado.";
  animateTimelineWhenVisible();
}

function showTimelineTooltip(item, target) {
  const federal = item.laws.filter((law) => law.scope === "Federal").length;
  const stateCount = item.laws.filter((law) => law.scope === "Estadual").length;
  elements.timelineTooltip.replaceChildren();
  const year = document.createElement("strong"); year.textContent = String(item.year);
  const total = document.createElement("span"); total.textContent = `${item.count} ${item.count === 1 ? "norma" : "normas"}`;
  const detail = document.createElement("small"); detail.textContent = `${federal} ${federal === 1 ? "federal" : "federais"} · ${stateCount} ${stateCount === 1 ? "estadual" : "estaduais"}`;
  elements.timelineTooltip.append(year, total, detail);
  elements.timelineTooltip.hidden = false;
  elements.timelineTooltip.classList.remove("is-below");
  const targetRect = target.getBoundingClientRect();
  const chartRect = elements.timelineChart.getBoundingClientRect();
  const tooltipRect = elements.timelineTooltip.getBoundingClientRect();
  const scrollLeft = elements.timelineChart.scrollLeft;
  const scrollTop = elements.timelineChart.scrollTop;
  const center = targetRect.left - chartRect.left + scrollLeft + targetRect.width / 2;
  const minimumLeft = scrollLeft + tooltipRect.width / 2 + 10;
  const maximumLeft = scrollLeft + elements.timelineChart.clientWidth - tooltipRect.width / 2 - 10;
  elements.timelineTooltip.style.left = `${Math.max(minimumLeft, Math.min(maximumLeft, center))}px`;

  const aboveAnchor = targetRect.top - chartRect.top + scrollTop - 10;
  if (aboveAnchor - tooltipRect.height < scrollTop + 10) {
    elements.timelineTooltip.classList.add("is-below");
    elements.timelineTooltip.style.top = `${targetRect.bottom - chartRect.top + scrollTop + 10}px`;
  } else {
    elements.timelineTooltip.style.top = `${aboveAnchor}px`;
  }
}

function hideTimelineTooltip() { elements.timelineTooltip.hidden = true; }

function getChartColor(count, maxCount) {
  const scale = maxCount ? count / maxCount : 0;
  const strength = .22 + scale * .78;
  const base = [11, 74, 146];
  const channel = (value) => Math.round(255 - (255 - value) * strength);
  return `rgb(${channel(base[0])} ${channel(base[1])} ${channel(base[2])})`;
}

function showChartTooltip(item, percentage, color) {
  elements.chartTooltip.replaceChildren();
  const compactTooltipThemes = new Set([
    "Transição Energética e Novas tecnologias",
    "Arquitetura institucional e marco regulatório do setor elétrico",
    "Politicas e Mecanismos de Inclusão Energética",
  ]);
  elements.chartTooltip.toggleAttribute("data-compact", compactTooltipThemes.has(item.name));
  const name = document.createElement("strong"); name.textContent = item.name;
  const detail = document.createElement("span");
  detail.className = "chart-tooltip__detail";
  detail.append(`${item.count} ${item.count === 1 ? "registro regulatório" : "registros regulatórios"} · `);
  const percentageLabel = document.createElement("b");
  percentageLabel.className = "chart-tooltip__percentage";
  percentageLabel.textContent = `${percentage}%`;
  percentageLabel.style.setProperty("--chart-tooltip-accent", color);
  detail.append(percentageLabel);
  const dot = document.createElement("i"); dot.style.backgroundColor = color; dot.setAttribute("aria-hidden", "true");
  elements.chartTooltip.append(dot, name, detail); elements.chartTooltip.hidden = false;
}

function activateChartItem(circle, button, item, percentage, color) {
  elements.donut.classList.add("has-active");
  elements.donutChart.querySelectorAll(".donut__segment").forEach((segment) => segment.classList.toggle("is-active", segment === circle));
  elements.themeLegend.querySelectorAll(".donut-legend__item").forEach((legendItem) => legendItem.classList.toggle("is-active", legendItem === button));
  showChartTooltip(item, percentage, color);
}

function hideChartTooltip() {
  elements.chartTooltip.hidden = true;
  elements.donut.classList.remove("has-active");
  elements.donutChart.querySelectorAll(".donut__segment").forEach((segment) => segment.classList.remove("is-active"));
  elements.themeLegend.querySelectorAll(".donut-legend__item").forEach((legendItem) => legendItem.classList.remove("is-active"));
}

function animateCounters() {
  const counters = [elements.total, elements.federal, elements.state, elements.consolidation, elements.donutTotal];
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { counters.forEach((counter) => { counter.textContent = counter.dataset.value || "0"; }); return; }
  const animationToken = ++counterAnimationToken;
  counters.forEach((counter) => {
    const target = Number(counter.dataset.value || 0); const duration = 1550; const startTime = performance.now();
    const tick = (now) => { if (animationToken !== counterAnimationToken) return; const progress = Math.min((now - startTime) / duration, 1); const eased = -(Math.cos(Math.PI * progress) - 1) / 2; counter.textContent = String(Math.round(target * eased)); if (progress < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  });
}

function setUpStatsAnimation() {
  let readyToPlay = true;
  const counters = [elements.total, elements.federal, elements.state, elements.consolidation, elements.donutTotal];
  const play = () => {
    if (!readyToPlay) return;
    readyToPlay = false;
    elements.donut.classList.remove("is-animated");
    void elements.donut.offsetWidth;
    animateCounters();
    requestAnimationFrame(() => elements.donut.classList.add("is-animated"));
  };
  const prepareReplay = () => {
    if (readyToPlay) return;
    readyToPlay = true;
    counterAnimationToken += 1;
    elements.donut.classList.remove("is-animated");
    counters.forEach((counter) => { counter.textContent = counter.dataset.value || "0"; });
  };
  if (!("IntersectionObserver" in window)) { play(); return; }
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.intersectionRatio >= .34) play();
    else if (entry.intersectionRatio <= .06) prepareReplay();
  }, { threshold: [0, .06, .34] });
  observer.observe(elements.donut);
}

/* Marca na barra o item correspondente à seção visível. Ao clicar, o item
   clicado assume na hora e a rolagem suave não o sobrescreve no meio do
   caminho. */
function setUpNavHighlight() {
  const links = [...elements.nav.querySelectorAll("a[href^='#']")];
  const quickCards = [...document.querySelectorAll(".quick-card[id]")];
  const targets = links
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section)
    .sort((first, second) => first.section.offsetTop - second.section.offsetTop);
  if (!targets.length) return;

  let lockedUntil = 0;
  let pendingQuickTarget = "";
  let quickHighlightTimer = 0;
  const markActive = (active) => links.forEach((link) => link.classList.toggle("is-active", link === active));
  const emphasizeQuickCard = (targetId = "") => {
    quickCards.forEach((card) => card.classList.toggle("is-nav-emphasized", card.id === targetId));
  };
  const revealPendingQuickCard = () => {
    if (!pendingQuickTarget) return;
    const card = document.getElementById(pendingQuickTarget);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const headerBottom = document.querySelector(".reference-header__bar")?.getBoundingClientRect().bottom || 0;
    const isFramed = rect.top >= headerBottom + 10 && rect.bottom <= window.innerHeight - 18;
    if (!isFramed) return;
    emphasizeQuickCard(pendingQuickTarget);
    pendingQuickTarget = "";
  };
  const schedulePendingQuickCard = () => {
    window.clearTimeout(quickHighlightTimer);
    quickHighlightTimer = window.setTimeout(revealPendingQuickCard, 150);
  };

  const spy = () => {
    if (performance.now() < lockedUntil) return;
    const line = window.scrollY + elements.nav.getBoundingClientRect().height + 40;
    let current = targets[0];
    targets.forEach((item) => { if (item.section.offsetTop <= line) current = item; });
    markActive(current.link);
  };

  links.forEach((link) => link.addEventListener("click", () => {
    lockedUntil = performance.now() + 900;
    markActive(link);
    const targetId = link.getAttribute("href").slice(1);
    if (targetId === "instituicoes" || targetId === "atendimento") {
      pendingQuickTarget = targetId;
      emphasizeQuickCard();
      schedulePendingQuickCard();
    } else {
      pendingQuickTarget = "";
      emphasizeQuickCard();
    }
  }));

  quickCards.forEach((card) => card.addEventListener("click", () => {
    pendingQuickTarget = "";
    window.clearTimeout(quickHighlightTimer);
    const relatedLink = links.find((link) => link.getAttribute("href") === `#${card.id}`);
    if (relatedLink) markActive(relatedLink);
    emphasizeQuickCard(card.id);
  }));

  const initialTarget = location.hash.slice(1);
  if (initialTarget === "instituicoes" || initialTarget === "atendimento") {
    pendingQuickTarget = initialTarget;
    schedulePendingQuickCard();
  }

  window.addEventListener("scroll", () => { spy(); schedulePendingQuickCard(); }, { passive: true });
  window.addEventListener("scrollend", revealPendingQuickCard);
  window.addEventListener("resize", () => { spy(); revealPendingQuickCard(); });
  spy();
}

function getFilteredLaws() {
  const { search, theme, type, scope, year } = state.filters;
  return state.laws.filter((law) => {
    const searchable = [law.type, law.number, law.name, law.description, law.relation, law.competence, law.theme].join(" ");
    return (!search || normalize(searchable).includes(normalize(search)))
      && (!theme.length || theme.some((item) => normalize(law.theme) === normalize(item)))
      && (!type.length || type.includes(law.type))
      && (!scope.length || scope.includes(law.scope))
      && (!year.length || year.includes(String(getLawYear(law) || "")));
  });
}

function getUniqueLaws(laws = state.laws) {
  return [...new Map(laws.map((law) => [uniqueLawIdentity(law), law])).values()];
}

function getCatalogModeLaws() {
  if (state.catalogMode === "all-records") return state.laws;
  const uniqueLaws = getUniqueLaws();
  if (state.catalogMode === "unique-federal") return uniqueLaws.filter((law) => law.scope === "Federal");
  if (state.catalogMode === "unique-state") return uniqueLaws.filter((law) => law.scope === "Estadual");
  if (state.catalogMode === "consolidation") return uniqueLaws.filter(isSectorInstrument);
  if (state.catalogMode === "unique-all") return uniqueLaws;
  return null;
}

function sortCatalogLaws(laws) {
  if (state.catalogMode === "consolidation") {
    return [...laws].sort((first, second) => {
      const firstIsPdd = normalize(first.name).startsWith("pdd - plano de desenvolvimento da distribuicao");
      const secondIsPdd = normalize(second.name).startsWith("pdd - plano de desenvolvimento da distribuicao");
      return Number(firstIsPdd) - Number(secondIsPdd);
    });
  }
  return [...laws].sort(compareLawsNewestFirst);
}

function renderResults() {
  elements.resultsMeta.hidden = false;
  elements.resultsTable.hidden = false;
  elements.clearFilters.hidden = false;

  const laws = sortCatalogLaws(getCatalogModeLaws() || getFilteredLaws());
  const showingUniqueLaws = state.catalogMode?.startsWith("unique-");
  const statCardLabels = {
    "unique-all": "normas mapeadas",
    "unique-federal": "normas federais",
    "unique-state": "normas estaduais",
    consolidation: "instrumentos setoriais",
  };
  elements.resultCount.textContent = statCardLabels[state.catalogMode]
    ? `${laws.length} ${statCardLabels[state.catalogMode]}`
    : showingUniqueLaws
      ? `${laws.length} ${laws.length === 1 ? "norma encontrada" : "normas encontradas"}`
      : `${laws.length} ${laws.length === 1 ? "registro encontrado" : "registros encontrados"}`;
  const fragment = document.createDocumentFragment();
  if (!laws.length) { const row = document.createElement("tr"); const cell = document.createElement("td"); cell.colSpan = 6; cell.className = "empty-row"; cell.textContent = "Nenhum registro encontrado com os filtros selecionados."; row.append(cell); fragment.append(row); }
  laws.forEach((law) => {
    const row = document.createElement("tr");
    [law.type, law.number, law.name, law.description, law.competence].forEach((value, index) => {
      const cell = document.createElement("td");
      /* Replica o padrão das tabelas internas: os três campos de identificação
         acompanham a leitura enquanto a ementa extensa percorre a própria linha. */
      if (index < 3) {
        const stickyMeta = document.createElement("span");
        stickyMeta.className = "norma-sticky-meta";
        stickyMeta.textContent = value || "–";
        cell.append(stickyMeta);
      } else {
        cell.textContent = value || "–";
      }
      row.append(cell);
    });
    const linkCell = document.createElement("td"); const safeUrl = safeExternalUrl(law.url);
    if (safeUrl) { const link = document.createElement("a"); link.href = safeUrl; link.target = "_blank"; link.rel = "noopener noreferrer"; link.textContent = "Acessar"; linkCell.append(link); } else linkCell.textContent = "–";
    row.append(linkCell); fragment.append(row);
  });
  elements.tableBody.replaceChildren(fragment);
  requestAnimationFrame(syncCatalogScrollbar);
}

function syncCatalogScrollbar() {
  const viewport = elements.resultsTable;
  const track = elements.catalogScrollbar;
  const thumb = elements.catalogScrollbarThumb;
  if (!viewport || !track || !thumb) return;
  const overflow = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
  track.hidden = overflow < 2;
  if (track.hidden) return;
  const trackHeight = track.clientHeight;
  const thumbHeight = Math.max(52, trackHeight * viewport.clientHeight / viewport.scrollHeight);
  const travel = Math.max(0, trackHeight - thumbHeight);
  const progress = overflow ? viewport.scrollTop / overflow : 0;
  thumb.style.height = `${thumbHeight}px`;
  thumb.style.transform = `translateY(${travel * progress}px)`;
  track.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
}

function updateFiltersFromInputs() {
  state.catalogMode = null;
  state.filters = {
    search: elements.search.value.trim(),
    theme: controls.theme.get(),
    type: controls.type.get(),
    scope: controls.scope.get(),
    year: controls.year.get(),
  };
}

function showCatalogMode(mode) {
  hideChartTooltip();
  hideTimelineTooltip();
  closeAllMultiselects();
  elements.search.value = "";
  Object.values(controls).forEach((control) => control.clear());
  state.filters = { search: "", theme: [], type: [], scope: [], year: [] };
  state.catalogMode = mode;
  renderResults();
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
}

function showCatalogModeFromStatCard(mode) {
  hideChartTooltip();
  hideTimelineTooltip();
  closeAllMultiselects();
  elements.search.value = "";
  Object.values(controls).forEach((control) => control.clear());
  state.filters = { search: "", theme: [], type: [], scope: [], year: [] };
  state.catalogMode = mode;
  renderResults();
  elements.resultsTable.scrollTop = 0;
  requestAnimationFrame(() => {
    const headerHeight = document.querySelector(".reference-header__bar")?.getBoundingClientRect().height || 0;
    const destination = window.scrollY + elements.resultsMeta.getBoundingClientRect().top - headerHeight - 18;
    window.scrollTo({ top: Math.max(0, destination), behavior: "smooth" });
  });
}

function selectThemeAndShow(themeName) {
  hideChartTooltip();
  hideTimelineTooltip();
  closeAllMultiselects();
  elements.search.value = "";
  controls.theme.set([themeName]);
  [controls.type, controls.scope, controls.year].forEach((control) => control.clear());
  updateFiltersFromInputs(); renderResults(); document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectYearAndShow(year) {
  hideChartTooltip();
  hideTimelineTooltip();
  closeAllMultiselects();
  elements.search.value = "";
  controls.year.set([String(year)]);
  [controls.theme, controls.type, controls.scope].forEach((control) => control.clear());
  updateFiltersFromInputs(); renderResults(); document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
}

function selectLawAndShow(law) {
  hideChartTooltip();
  hideTimelineTooltip();
  closeAllMultiselects();
  elements.search.value = law.name || law.number;
  Object.values(controls).forEach((control) => control.clear());
  updateFiltersFromInputs();
  renderResults();
  document.querySelector("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
}

function bindInteractions() {
  const catalogShell = elements.resultsTable.closest(".catalog-table-shell");
  const catalogScrollStatus = document.querySelector("#catalog-scroll-status");
  let catalogScrollActive = false;
  const setCatalogScrollActive = (active) => {
    catalogScrollActive = active;
    catalogShell?.classList.toggle("is-scroll-active", active);
    elements.resultsTable.setAttribute("aria-label", active
      ? "Acervo com rolagem interna ativada. Clique em uma linha para sair."
      : "Acervo. Clique em uma linha para ativar a rolagem interna.");
    if (catalogScrollStatus) catalogScrollStatus.textContent = active
      ? "Rolagem interna do acervo ativada."
      : "Rolagem interna desativada. A página voltou a rolar normalmente.";
  };

  /* Sem seleção, a roda continua rolando a página. Depois de um clique em
     uma linha, a roda percorre o acervo até que outra linha seja clicada. */
  elements.resultsTable.addEventListener("wheel", (event) => {
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    event.preventDefault();
    if (!catalogScrollActive) {
      window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
      return;
    }
    const maximum = Math.max(0, elements.resultsTable.scrollHeight - elements.resultsTable.clientHeight);
    const atTop = elements.resultsTable.scrollTop <= 1;
    const atBottom = elements.resultsTable.scrollTop >= maximum - 1;
    const leavingAtTop = event.deltaY < 0 && atTop;
    const leavingAtBottom = event.deltaY > 0 && atBottom;
    if (leavingAtTop || leavingAtBottom) {
      setCatalogScrollActive(false);
      window.scrollBy({ top: event.deltaY, left: 0, behavior: "auto" });
      return;
    }
    elements.resultsTable.scrollTop += event.deltaY;
  }, { passive: false });

  let scrollbarDrag = null;
  const scrollFromTrackPointer = (clientY, grabOffset = null) => {
    const trackRect = elements.catalogScrollbar.getBoundingClientRect();
    const thumbRect = elements.catalogScrollbarThumb.getBoundingClientRect();
    const thumbHeight = thumbRect.height;
    const travel = Math.max(1, trackRect.height - thumbHeight);
    const offset = grabOffset === null ? thumbHeight / 2 : grabOffset;
    const thumbTop = Math.max(0, Math.min(travel, clientY - trackRect.top - offset));
    const overflow = Math.max(0, elements.resultsTable.scrollHeight - elements.resultsTable.clientHeight);
    elements.resultsTable.scrollTop = overflow * thumbTop / travel;
  };
  elements.catalogScrollbar.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    const thumbRect = elements.catalogScrollbarThumb.getBoundingClientRect();
    const onThumb = event.clientY >= thumbRect.top && event.clientY <= thumbRect.bottom;
    scrollbarDrag = { id: event.pointerId, offset: onThumb ? event.clientY - thumbRect.top : thumbRect.height / 2 };
    elements.catalogScrollbar.setPointerCapture(event.pointerId);
    elements.catalogScrollbar.classList.add("is-dragging");
    scrollFromTrackPointer(event.clientY, scrollbarDrag.offset);
    event.preventDefault();
  });
  elements.catalogScrollbar.addEventListener("pointermove", (event) => {
    if (!scrollbarDrag || scrollbarDrag.id !== event.pointerId) return;
    scrollFromTrackPointer(event.clientY, scrollbarDrag.offset);
    event.preventDefault();
  });
  const finishScrollbarDrag = (event) => {
    if (!scrollbarDrag || scrollbarDrag.id !== event.pointerId) return;
    scrollbarDrag = null;
    elements.catalogScrollbar.classList.remove("is-dragging");
  };
  elements.catalogScrollbar.addEventListener("pointerup", finishScrollbarDrag);
  elements.catalogScrollbar.addEventListener("pointercancel", finishScrollbarDrag);
  elements.catalogScrollbar.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const step = event.key.includes("Page") ? elements.resultsTable.clientHeight * .8 : 64;
    if (event.key === "Home") elements.resultsTable.scrollTop = 0;
    else if (event.key === "End") elements.resultsTable.scrollTop = elements.resultsTable.scrollHeight;
    else elements.resultsTable.scrollTop += event.key === "ArrowUp" || event.key === "PageUp" ? -step : step;
  });
  elements.resultsTable.addEventListener("scroll", syncCatalogScrollbar, { passive: true });
  window.addEventListener("resize", syncCatalogScrollbar);

  let tableDrag = null;
  let suppressTableClick = false;
  elements.resultsTable.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || !(event.target instanceof Element) || event.target.closest("a, button, input, select")) return;
    if (!event.target.closest("tbody tr")) return;
    tableDrag = { id: event.pointerId, y: event.clientY, scrollTop: elements.resultsTable.scrollTop, moved: false };
    elements.resultsTable.setPointerCapture(event.pointerId);
  });
  elements.resultsTable.addEventListener("pointermove", (event) => {
    if (!tableDrag || tableDrag.id !== event.pointerId) return;
    const distance = event.clientY - tableDrag.y;
    if (Math.abs(distance) > 5) tableDrag.moved = true;
    if (!tableDrag.moved) return;
    event.preventDefault();
    elements.resultsTable.classList.add("is-row-dragging");
    elements.resultsTable.scrollTop = tableDrag.scrollTop - distance;
  });
  const finishTableDrag = (event) => {
    if (!tableDrag || tableDrag.id !== event.pointerId) return;
    suppressTableClick = tableDrag.moved;
    if (!tableDrag.moved) setCatalogScrollActive(!catalogScrollActive);
    if (suppressTableClick) window.setTimeout(() => { suppressTableClick = false; }, 0);
    tableDrag = null;
    elements.resultsTable.classList.remove("is-row-dragging");
  };
  elements.resultsTable.addEventListener("pointerup", finishTableDrag);
  elements.resultsTable.addEventListener("pointercancel", finishTableDrag);
  elements.resultsTable.addEventListener("click", (event) => {
    if (suppressTableClick) {
      event.preventDefault();
      event.stopPropagation();
      suppressTableClick = false;
      return;
    }
  }, true);

  document.querySelectorAll("[data-catalog-mode]").forEach((card) => card.addEventListener("click", () => showCatalogModeFromStatCard(card.dataset.catalogMode)));
  elements.donutAllRecords.addEventListener("click", () => showCatalogMode("all-records"));
  elements.donut.addEventListener("pointerleave", hideChartTooltip);
  elements.donut.addEventListener("pointercancel", hideChartTooltip);
  document.addEventListener("pointermove", (event) => {
    const isChartTarget = event.target instanceof Element && event.target.closest(".donut__segment, .donut-legend__item");
    if (!isChartTarget) hideChartTooltip();
  });
  window.addEventListener("scroll", () => { hideChartTooltip(); hideTimelineTooltip(); }, { passive: true });
  elements.form.addEventListener("submit", (event) => { event.preventDefault(); updateFiltersFromInputs(); renderResults(); });
  elements.form.addEventListener("focusin", hideChartTooltip);
  elements.form.addEventListener("keydown", (event) => { if (event.key === "Enter") event.preventDefault(); });
  elements.search.addEventListener("input", () => { updateFiltersFromInputs(); renderResults(); });

  const apply = () => { updateFiltersFromInputs(); renderResults(); };
  [controls.theme, controls.type, controls.scope, controls.year].forEach((control) => { control.onChange = apply; });

  elements.clearFilters.addEventListener("click", () => {
    state.catalogMode = null;
    elements.form.reset();
    Object.values(controls).forEach((control) => control.clear());
    closeAllMultiselects();
    apply();
  });

  document.addEventListener("click", (event) => {
    const inside = event.target instanceof Element && event.target.closest(".multiselect");
    if (!inside) closeAllMultiselects();
  });
  elements.navToggle.addEventListener("click", () => { const open = elements.nav.classList.toggle("is-open"); elements.navToggle.setAttribute("aria-expanded", String(open)); });
  elements.nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { elements.nav.classList.remove("is-open"); elements.navToggle.setAttribute("aria-expanded", "false"); }));
  document.querySelectorAll("[data-dialog-target]").forEach((button) => button.addEventListener("click", () => { const dialog = document.querySelector(`#${button.dataset.dialogTarget}`); if (dialog) dialog.showModal(); }));
  document.querySelectorAll(".quick-dialog").forEach((dialog) => {
    dialog.querySelector("[data-dialog-close]").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  });
}

async function boot() {
  try {
    state.laws = await loadLaws("data/normas.csv?v=20261029-6");
    if (!state.laws.length) throw new Error("O catálogo não possui registros normativos.");
    populateFilters(); renderThemeCards(); renderStats(); renderResults(); bindInteractions(); setUpStatsAnimation(); setUpNavHighlight();
    if (window.initRegulatoryBrain) window.initRegulatoryBrain({ laws: state.laws, themes: THEMES, onLawClick: selectLawAndShow });

    /* A tabela é montada depois do primeiro posicionamento de uma âncora.
       Reaplicamos o destino quando o layout já está completo para evitar que
       links vindos de outras páginas parem na seção anterior. */
    const restoreInitialAnchor = () => {
      const targetId = decodeURIComponent(location.hash.slice(1));
      const target = targetId && document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: "auto", block: "start" });
    };
    requestAnimationFrame(() => requestAnimationFrame(restoreInitialAnchor));
    if (document.fonts?.ready) document.fonts.ready.then(restoreInitialAnchor);
  } catch (error) {
    elements.resultCount.textContent = "Não foi possível carregar o acervo de normas.";
    elements.tableBody.replaceChildren(); console.error(error);
  }
}

function setUpHomeSectionReveal() {
  const sections = document.querySelectorAll(
    "main > section:not(.hero):not(#numeros) > .container, #numeros .stats-layout, #numeros .timeline-panel"
  );
  if (!sections.length) return;

  sections.forEach((section) => section.classList.add("home-section-reveal"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .08, rootMargin: "0px 0px -5% 0px" });

  sections.forEach((section) => observer.observe(section));
}

setUpHomeSectionReveal();
boot();
