"use strict";

/* A linha do tempo usa o mesmo catálogo que alimenta a tabela de normas.
   A Lei 10.848/2004 aparece duas vezes no CSV por apoiar CMSE e CCEE; aqui
   ela é reunida em um único marco, com as duas funções preservadas. */

const TIMELINE_COPY = {
  "Lei|3.782/1960": {
    title: "Criação do Ministério de Minas e Energia",
    summary: "Cria o MME e concentra no novo ministério a condução federal das políticas de minas e energia."
  },
  "Lei|9.427/1996": {
    title: "Instituição da ANEEL",
    summary: "Cria a agência reguladora e disciplina o regime das concessões dos serviços de energia elétrica."
  },
  "Lei|9.478/1997": {
    title: "Política Energética Nacional e CNPE",
    summary: "Define diretrizes da política energética nacional e institui o Conselho Nacional de Política Energética."
  },
  "Decreto|2.337/1997": {
    title: "Estruturação da ANEEL",
    summary: "Constitui a ANEEL como autarquia especial e aprova sua estrutura e suas funções de confiança."
  },
  "Lei|9.648/1998": {
    title: "Competências do ONS",
    summary: "Reorganiza o setor elétrico e estabelece a base legal para a atuação do Operador Nacional do Sistema."
  },
  "Decreto|3.520/2000": {
    title: "Funcionamento do CNPE",
    summary: "Regulamenta a estrutura, a composição e o funcionamento do conselho responsável pelas diretrizes energéticas."
  },
  "Lei|10.847/2004": {
    title: "Autorização para criar a EPE",
    summary: "Autoriza a empresa pública que produz estudos e pesquisas para apoiar o planejamento energético nacional."
  },
  "Lei|10.848/2004": {
    title: "Comercialização, CMSE e CCEE",
    summary: "Organiza a comercialização de energia e sustenta a criação do CMSE e da Câmara de Comercialização."
  },
  "Decreto|5.081/2004": {
    title: "Regulamentação do ONS",
    summary: "Detalha as atribuições do operador na coordenação e no controle do Sistema Interligado Nacional."
  },
  "Decreto|5.175/2004": {
    title: "Constituição do CMSE",
    summary: "Institui o comitê que monitora a continuidade e a segurança do suprimento eletroenergético."
  },
  "Decreto|5.177/2004": {
    title: "Competências da CCEE",
    summary: "Regulamenta a organização, as atribuições e o funcionamento da Câmara de Comercialização."
  },
  "Decreto|5.184/2004": {
    title: "Criação da EPE",
    summary: "Cria a Empresa de Pesquisa Energética e aprova seu estatuto social."
  },
  "Lei|15.269/2025": {
    title: "Modernização do marco regulatório",
    summary: "Atualiza regras para segurança energética, modicidade tarifária, contratação e armazenamento de energia."
  }
};

function timelineYear(number) {
  return Number(String(number).match(/(?:19|20)\d{2}/)?.[0] || 0);
}

function timelineOrder(law) {
  const orderedKeys = Object.keys(TIMELINE_COPY);
  return orderedKeys.indexOf(`${law.type}|${law.number}`);
}

function timelineItem(law, index) {
  const key = `${law.type}|${law.number}`;
  const copy = TIMELINE_COPY[key];
  const item = document.createElement("li");
  item.className = "arquitetura-timeline__item";

  const card = document.createElement("article");
  card.className = "arquitetura-timeline__card";
  const sequence = document.createElement("span");
  sequence.className = "arquitetura-timeline__sequence";
  sequence.setAttribute("aria-hidden", "true");
  sequence.textContent = String(index + 1).padStart(2, "0");
  const year = document.createElement("span");
  year.className = "arquitetura-timeline__year";
  year.textContent = String(timelineYear(law.number));
  const title = document.createElement("h3");
  title.textContent = `${law.type} nº ${law.number}`;
  const summary = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `${copy.title}. `;
  summary.append(strong, copy.summary);
  card.append(sequence, year, title, summary);

  const marker = document.createElement("span");
  marker.className = "arquitetura-timeline__marker";
  marker.setAttribute("aria-hidden", "true");
  item.append(card, marker);
  return item;
}

async function bootArchitectureTimeline() {
  const list = document.querySelector("#arquitetura-timeline-list");
  const viewport = document.querySelector(".arquitetura-timeline__viewport");
  if (!list || !viewport) return;

  try {
    const themeName = document.body.dataset.macrotema;
    const laws = lawsOfTheme(await loadLaws("../data/normas.csv?v=20261015-2"), themeName);
    const uniqueLaws = new Map();
    laws.forEach((law) => {
      const key = `${law.type}|${law.number}`;
      if (TIMELINE_COPY[key] && !uniqueLaws.has(key)) uniqueLaws.set(key, law);
    });
    const ordered = [...uniqueLaws.values()].sort((a, b) => timelineOrder(a) - timelineOrder(b));
    list.replaceChildren(...ordered.map(timelineItem));

    const previous = document.querySelector("[data-timeline-prev]");
    const next = document.querySelector("[data-timeline-next]");
    const mobile = window.matchMedia("(max-width: 760px)");
    let pageStops = [0];

    const closestStop = () => pageStops.reduce((closest, stop, index) => (
      Math.abs(stop - viewport.scrollLeft) < Math.abs(pageStops[closest] - viewport.scrollLeft)
        ? index
        : closest
    ), 0);

    const updateControls = () => {
      const position = closestStop();
      if (previous) previous.disabled = mobile.matches || position === 0;
      if (next) next.disabled = mobile.matches || position === pageStops.length - 1;
    };

    const setTimelineLayout = () => {
      if (mobile.matches) {
        list.style.removeProperty("--timeline-card-width");
        list.style.removeProperty("padding-right");
        [...list.children].forEach((item) => item.style.removeProperty("margin-inline-end"));
        viewport.scrollLeft = 0;
        pageStops = [0];
        updateControls();
        return;
      }

      const currentPage = closestStop();
      const available = viewport.clientWidth;
      const cardsPerView = available >= 1100 ? 4 : available >= 820 ? 3 : available >= 560 ? 2 : 1;
      const sidePadding = 32;
      const cardWidth = (available - sidePadding * 2) / cardsPerView;
      list.style.setProperty("--timeline-card-width", `${cardWidth}px`);
      viewport.style.setProperty("--timeline-side-padding", `${sidePadding}px`);

      const items = [...list.children];
      items.forEach((item, index) => {
        const endsPage = (index + 1) % cardsPerView === 0 && index < items.length - 1;
        item.style.marginInlineEnd = endsPage ? `${sidePadding * 2}px` : "0px";
      });
      const remainder = ordered.length % cardsPerView || cardsPerView;
      const missingCards = cardsPerView - remainder;
      list.style.paddingRight = `${sidePadding + missingCards * cardWidth}px`;

      const pageCount = Math.ceil(ordered.length / cardsPerView);
      pageStops = Array.from({ length: pageCount }, (_, index) => index * available);
      viewport.scrollTo({ left: pageStops[Math.min(currentPage, pageStops.length - 1)], behavior: "auto" });
      updateControls();
    };

    const scroll = (direction) => {
      const currentPage = closestStop();
      const nextPage = Math.max(0, Math.min(pageStops.length - 1, currentPage + direction));
      viewport.scrollTo({
        left: pageStops[nextPage],
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
      });
    };

    let controlFrame = 0;
    viewport.addEventListener("scroll", () => {
      cancelAnimationFrame(controlFrame);
      controlFrame = requestAnimationFrame(updateControls);
    }, { passive: true });
    previous?.addEventListener("click", () => scroll(-1));
    next?.addEventListener("click", () => scroll(1));

    let dragging = false;
    let moved = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    viewport.addEventListener("pointerdown", (event) => {
      if (mobile.matches || event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      moved = false;
      dragStartX = event.clientX;
      dragStartScroll = viewport.scrollLeft;
      viewport.classList.add("is-dragging");
      viewport.setPointerCapture(event.pointerId);
    });

    viewport.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const distance = event.clientX - dragStartX;
      if (Math.abs(distance) > 3) moved = true;
      viewport.scrollLeft = dragStartScroll - distance;
      if (moved) event.preventDefault();
    });

    const finishDragging = (event) => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove("is-dragging");
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      if (moved) {
        viewport.scrollTo({
          left: pageStops[closestStop()],
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
      }
    };

    viewport.addEventListener("pointerup", finishDragging);
    viewport.addEventListener("pointercancel", finishDragging);
    mobile.addEventListener("change", setTimelineLayout);
    new ResizeObserver(setTimelineLayout).observe(viewport);
    setTimelineLayout();
  } catch (error) {
    list.innerHTML = '<li class="arquitetura-timeline__loading">Não foi possível carregar a linha do tempo.</li>';
    console.error(error);
  }
}

bootArchitectureTimeline();
