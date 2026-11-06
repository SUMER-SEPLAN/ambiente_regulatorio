"use strict";

/* Organograma: mostra uma prévia ao passar o mouse e fixa o painel por clique.
   As linhas são redesenhadas a partir da posição real das caixas. */

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function setUpOrganograma(root) {
  const svg = root.querySelector(".organograma__linhas");
  const workspace = root.closest(".organograma__workspace");
  const panel = workspace?.querySelector(".organograma__painel");
  const boxes = new Map([...root.querySelectorAll(".orgao")].map((item) => [item.dataset.org, item]));
  const links = (root.dataset.ligacoes || "").split(/\s+/).filter(Boolean)
    .map((pair) => pair.split(">"))
    .filter(([from, to]) => boxes.has(from) && boxes.has(to));

  function draw() {
    const area = root.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${area.width} ${area.height}`);
    const connections = links.map(([from, to]) => {
      const start = boxes.get(from).querySelector(".orgao__botao").getBoundingClientRect();
      const end = boxes.get(to).querySelector(".orgao__botao").getBoundingClientRect();
      const x1 = start.left - area.left + start.width / 2;
      const y1 = start.bottom - area.top;
      const x2 = end.left - area.left + end.width / 2;
      const y2 = end.top - area.top;
      return { x1, y1, x2, y2 };
    });

    /* Conexões que atravessam o mesmo intervalo vertical compartilham uma
       única barra horizontal. Isso evita a sobreposição de vários paths no
       mesmo ponto, que produzia pequenos desencontros visuais nas junções. */
    const bands = new Map();
    connections.forEach((connection) => {
      const key = `${connection.y1.toFixed(2)}:${connection.y2.toFixed(2)}`;
      if (!bands.has(key)) bands.set(key, []);
      bands.get(key).push(connection);
    });

    const shapes = [...bands.values()].map((band) => {
      const { y1, y2 } = band[0];
      const middle = y1 + (y2 - y1) / 2;
      const starts = [...new Set(band.map(({ x1 }) => x1))];
      const ends = [...new Set(band.map(({ x2 }) => x2))];
      const allX = [...starts, ...ends];
      const segments = [
        ...starts.map((x) => `M${x} ${y1} V${middle}`),
        `M${Math.min(...allX)} ${middle} H${Math.max(...allX)}`,
        ...ends.map((x) => `M${x} ${middle} V${y2}`),
      ];
      const path = document.createElementNS(SVG_NAMESPACE, "path");
      path.setAttribute("class", "organograma__linha");
      path.setAttribute("d", segments.join(" "));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", "#b9cbe4");
      path.setAttribute("stroke-width", "2");
      path.setAttribute("stroke-linecap", "square");
      path.setAttribute("stroke-linejoin", "round");
      return path;
    });
    svg.replaceChildren(...shapes);
  }

  let activeButton = null;
  let pinnedButton = null;
  let previewButton = null;
  const hoverCapable = window.matchMedia("(hover: hover) and (pointer: fine)");

  function clearPanel() {
    root.querySelectorAll(".orgao__botao").forEach((button) => {
      button.setAttribute("aria-expanded", "false");
    });
    activeButton = null;
    previewButton = null;
    pinnedButton = null;
    if (panel) {
      panel.hidden = true;
      panel.replaceChildren();
    }
    workspace?.classList.remove("has-open-panel", "is-preview", "is-agents-preview");
    requestAnimationFrame(draw);
  }

  function showPanel(button, preview) {
    if (!panel) return;
    const balloon = root.querySelector(`#${button.dataset.balloonId}`);
    if (!balloon) return;

    root.querySelectorAll(".orgao__botao").forEach((item) => {
      item.setAttribute("aria-expanded", String(item === button));
    });
    activeButton = button;
    const content = [...balloon.children]
      .filter((element) => !element.classList.contains("orgao__fechar"))
      .map((element) => element.cloneNode(true));
    const elements = [...content];

    if (!preview) {
      const closeButton = document.createElement("button");
      closeButton.className = "orgao__fechar";
      closeButton.type = "button";
      closeButton.setAttribute("aria-label", "Fechar");
      closeButton.textContent = "×";
      closeButton.addEventListener("click", () => {
        clearPanel();
        button.focus();
      });
      elements.unshift(closeButton);
    }

    panel.replaceChildren(...elements);
    panel.hidden = false;
    workspace.classList.add("has-open-panel");
    workspace.classList.toggle("is-preview", preview);
    workspace.classList.toggle("is-agents-preview", preview && button.closest(".orgao")?.dataset.org === "agentes");
    requestAnimationFrame(() => requestAnimationFrame(draw));
  }

  root.querySelectorAll(".orgao__botao").forEach((button) => {
    button.dataset.balloonId = button.getAttribute("aria-controls");
    button.setAttribute("aria-controls", panel?.id || button.getAttribute("aria-controls"));

    button.addEventListener("pointerenter", (event) => {
      if (!hoverCapable.matches || event.pointerType === "touch" || pinnedButton) return;
      previewButton = button;
      showPanel(button, true);
    });

    button.addEventListener("pointerleave", () => {
      if (previewButton !== button || pinnedButton) return;
      clearPanel();
    });

    button.addEventListener("click", () => {
      if (pinnedButton === button) {
        clearPanel();
        return;
      }
      pinnedButton = button;
      previewButton = null;
      showPanel(button, false);
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest(".orgao, .organograma__painel")) return;
    clearPanel();
  });

  document.addEventListener("keydown", (event) => { if (event.key === "Escape") clearPanel(); });

  draw();
  window.addEventListener("resize", draw);
  if (document.fonts) document.fonts.ready.then(draw);
}

document.querySelectorAll(".organograma").forEach(setUpOrganograma);
