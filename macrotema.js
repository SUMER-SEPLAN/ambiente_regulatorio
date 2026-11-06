"use strict";

/* Monta a lista de normas de um macrotema. O nome vem do atributo
   data-macrotema no <body>, e precisa bater com a coluna "Tema
   Relacionado" do catálogo. */

function addStandardTableScrollbar(tableWrap) {
  let shell = tableWrap.closest(".catalog-table-shell");
  if (shell?.querySelector(".catalog-scrollbar")) return;

  if (!shell) {
    shell = document.createElement("div");
    shell.className = "catalog-table-shell";
    tableWrap.before(shell);
    shell.append(tableWrap);
  }

  const scrollbar = document.createElement("div");
  scrollbar.className = "catalog-scrollbar";
  scrollbar.setAttribute("role", "scrollbar");
  scrollbar.setAttribute("aria-label", "Rolar as normas relacionadas");
  scrollbar.setAttribute("aria-controls", tableWrap.id);
  scrollbar.setAttribute("aria-orientation", "vertical");
  scrollbar.setAttribute("aria-valuemin", "0");
  scrollbar.setAttribute("aria-valuemax", "100");
  scrollbar.setAttribute("aria-valuenow", "0");
  scrollbar.tabIndex = 0;
  const thumb = document.createElement("span");
  thumb.className = "catalog-scrollbar__thumb";
  scrollbar.append(thumb);
  shell.append(scrollbar);

  const update = () => {
    const maximum = Math.max(0, tableWrap.scrollHeight - tableWrap.clientHeight);
    const track = scrollbar.clientHeight;
    const ratio = tableWrap.clientHeight / tableWrap.scrollHeight;
    const thumbHeight = Math.max(56, track * ratio);
    const travel = Math.max(0, track - thumbHeight);
    const position = maximum ? tableWrap.scrollTop / maximum * travel : 0;
    scrollbar.hidden = maximum <= 1;
    thumb.style.height = `${thumbHeight}px`;
    thumb.style.transform = `translateY(${position}px)`;
    scrollbar.setAttribute("aria-valuenow", String(maximum ? Math.round(tableWrap.scrollTop / maximum * 100) : 0));
  };

  let drag = null;
  const scrollFromPointer = (clientY, offset) => {
    const rect = scrollbar.getBoundingClientRect();
    const height = thumb.getBoundingClientRect().height;
    const travel = Math.max(1, rect.height - height);
    const position = Math.max(0, Math.min(travel, clientY - rect.top - offset));
    const maximum = Math.max(0, tableWrap.scrollHeight - tableWrap.clientHeight);
    tableWrap.scrollTop = position / travel * maximum;
  };
  scrollbar.addEventListener("pointerdown", (event) => {
    const rect = thumb.getBoundingClientRect();
    drag = { id: event.pointerId, offset: event.clientY >= rect.top && event.clientY <= rect.bottom ? event.clientY - rect.top : rect.height / 2 };
    scrollbar.setPointerCapture(event.pointerId);
    scrollFromPointer(event.clientY, drag.offset);
  });
  scrollbar.addEventListener("pointermove", (event) => {
    if (drag?.id === event.pointerId) scrollFromPointer(event.clientY, drag.offset);
  });
  const finish = (event) => { if (drag?.id === event.pointerId) drag = null; };
  scrollbar.addEventListener("pointerup", finish);
  scrollbar.addEventListener("pointercancel", finish);
  scrollbar.addEventListener("keydown", (event) => {
    if (!["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const step = event.key.startsWith("Page") ? tableWrap.clientHeight * .8 : 48;
    if (event.key === "Home") tableWrap.scrollTop = 0;
    else if (event.key === "End") tableWrap.scrollTop = tableWrap.scrollHeight;
    else tableWrap.scrollTop += event.key === "ArrowUp" || event.key === "PageUp" ? -step : step;
  });
  tableWrap.addEventListener("scroll", update, { passive: true });
  if ("ResizeObserver" in window) new ResizeObserver(update).observe(tableWrap);
  requestAnimationFrame(update);
}

async function boot() {
  const themeName = document.body.dataset.macrotema;
  const tableWrap = document.querySelector("#tema-normas");
  const body = document.querySelector("#tema-normas-body");
  const count = document.querySelector("#tema-normas-count");

  try {
    const laws = lawsOfTheme(await loadLaws("../data/normas.csv?v=20261103-1"), themeName);
    const linkedCount = laws.length === 1
      ? "1 norma vinculada a este tema."
      : `${laws.length} normas vinculadas a este tema.`;
    count.textContent = `${linkedCount} Para consultar o texto integral, use o botão Acessar na coluna de links.`;

    const fragment = document.createDocumentFragment();
    laws.forEach((law) => {
      const row = document.createElement("tr");
      const values = [law.type, law.number, law.name, law.description];
      values.push(law.competence);
      values.forEach((value, index) => {
        const cell = document.createElement("td");
        if (index < 3) {
          const stickyMeta = document.createElement("span");
          stickyMeta.className = "norma-sticky-meta";
          stickyMeta.textContent = value || "–";
          cell.append(stickyMeta);
        } else {
          cell.textContent = value || "–";
        }
        if (index === 3 && tableWrap.dataset.showRelation === "true" && law.relation) {
          const relation = document.createElement("p");
          relation.className = "theme-law-relation";
          const label = document.createElement("strong");
          label.textContent = tableWrap.dataset.relationLabel || "Relação com o setor elétrico:";
          relation.append(label, document.createTextNode(` ${law.relation}`));
          cell.append(relation);
        }
        row.append(cell);
      });
      const linkCell = document.createElement("td");
      const safeUrl = safeExternalUrl(law.url);
      if (safeUrl) {
        const link = document.createElement("a");
        link.href = safeUrl; link.target = "_blank"; link.rel = "noopener noreferrer";
        link.textContent = "Acessar";
        linkCell.append(link);
      } else linkCell.textContent = "–";
      row.append(linkCell);
      fragment.append(row);
    });
    body.replaceChildren(fragment);
    tableWrap.hidden = laws.length === 0;
    if (laws.length) addStandardTableScrollbar(tableWrap);
  } catch (error) {
    count.textContent = "Não foi possível carregar as normas deste tema.";
    tableWrap.hidden = true;
    console.error(error);
  }
}

function initMacrotemaReveal() {
  const items = document.querySelectorAll("main > section > .container:not(.inclusion-reveal)");
  if (!items.length) return;

  items.forEach((item) => item.classList.add("macrotema-reveal"));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!("IntersectionObserver" in window) || reduceMotion) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .1, rootMargin: "0px 0px -8% 0px" });

  items.forEach((item) => observer.observe(item));
}

initMacrotemaReveal();
boot();
