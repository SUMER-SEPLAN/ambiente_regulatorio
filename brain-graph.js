"use strict";

(function () {
  const GRAPH_COLORS = {
    theme: "#0b4a92",
    law: "#7cc6ea",
    shared: "#39c993",
    active: "#0b4a92",
    edge: "#78a8cd",
  };
  const SHORT_NAMES = {
    "arquitetura institucional e marco regulatorio do setor eletrico": "Arquitetura institucional",
    "direito do consumidor de energia": "Direito do Consumidor",
    "politicas e mecanismos de inclusao energetica": "Inclusão Energética",
    "tributacao estadual do setor eletrico": "Tributação Estadual",
    "conexao e acesso a rede": "Conexão e Acesso",
    "geracao distribuida": "Geração Distribuída",
    "comercializacao de energia": "Comercialização",
    "planejamento energetico": "Planejamento Energético",
    "transicao energetica e novas tecnologias": "Transição Energética",
    "licenciamento ambiental": "Licenciamento Ambiental",
    "participacao publica": "Participação Pública",
  };
  /* O lado do painel é uma propriedade editorial do macrotema, não uma
     consequência momentânea do espaço livre. Isso mantém a leitura idêntica
     nas coleções, nos atos correlatos e nas aberturas individuais. */
  const POPUP_RIGHT_THEMES = new Set([
    "arquitetura-institucional",
    "direito-do-consumidor",
    "planejamento-energetico",
    "comercializacao-de-energia",
    "conexao-e-acesso-a-rede",
    "geracao-distribuida",
  ]);

  function normalise(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  }

  function lawIdentity(law) {
    const number = normalise(law.number);
    return `${normalise(law.type)}|${number}|${number === "-" ? normalise(law.name) : ""}`;
  }

  function clamp(value, minimum, maximum) { return Math.max(minimum, Math.min(maximum, value)); }

  window.initRegulatoryBrain = function initRegulatoryBrain({ laws, themes, onLawClick }) {
    const root = document.querySelector("#regulatory-brain");
    let canvas = document.querySelector("#brain-canvas");
    const tooltip = document.querySelector("#brain-tooltip");
    if (!root || !canvas || !tooltip || !laws?.length || !themes?.length) return;
    /* Uma reinicialização substitui o canvas para retirar listeners da
       instância anterior e remove qualquer painel flutuante remanescente. */
    if (window.__regulatoryBrain?.destroy) {
      window.__regulatoryBrain.destroy();
      const cleanCanvas = canvas.cloneNode(true);
      canvas.replaceWith(cleanCanvas);
      canvas = cleanCanvas;
    }
    root.querySelectorAll(":scope > .regulatory-brain__shared-popup").forEach((item) => item.remove());

    const context = canvas.getContext("2d");
    const workspaceMode = root.classList.contains("regulatory-brain--workspace");
    const pageMode = root.classList.contains("regulatory-brain--page");
    const homeMode = Boolean(root.closest(".hero"));
    const separatedGestures = pageMode || homeMode;
    const world = workspaceMode ? { width: 760, height: 980 } : { width: 640, height: 420 };
    const graphCenter = { x: world.width / 2, y: workspaceMode ? 260 : world.height / 2 };
    const defaultViewScale = pageMode ? .84 : 1;
    const view = { scale: defaultViewScale, rotation: 0 };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pixelRatio = 1;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let baseScale = 1;
    let graphTopInset = 0;
    let graphBottomInset = 0;
    let graphViewportHeight = 0;
    let heat = 1;
    let resetTransition = null;
    let returningToInitial = false;
    let hovered = null;
    let hoverFocus = null;
    let lockedFocus = null;
    const expandedThemes = new Set();
    const visibleLawLabelThemes = new Set();
    const connectedThemes = new Set();
    const positionedThemes = new Set();
    const collapsingThemes = new Set();
    let directSelection = null;
    let directLabelsCollapsed = false;
    let focusNodes = new Set();
    let focusEdges = new Set();
    let collectionBaseNodes = new Set();
    let collectionBaseEdges = new Set();
    let labelCollisionBounds = [];
    let themeLabelHitboxes = [];
    let lawLabelHitboxes = [];
    let pointer = null;
    let draggedNode = null;
    let rotating = false;
    let moved = false;
    let dragWorkspaceActive = false;
    let hoverTimer = 0;
    let hoverCandidate = null;
    let suppressHoverUntilLeave = null;
    let tiltX = 0;
    let tiltY = 0;
    let tiltSettleTimer = 0;
    let commandTiltTimer = 0;
    let clickTimer = 0;
    let pendingClickTheme = null;
    let lastConnectionToggleNode = null;
    let lastConnectionToggleTime = 0;
    let lastPointer = null;
    let dragOrigin = null;
    let destroyed = false;
    let pageOverviewPristine = pageMode;
    let collectionView = "";
    const themeColumnPositions = new Map();
    const homeConnectionPeers = new Set();
    const resetControl = root.querySelector('[data-brain-action="reset"]');

    function syncResetControl() {
      if (!resetControl) return;
      const label = pageMode ? "Voltar ao Brain inicial" : "Reorganizar o mapa";
      resetControl.setAttribute("aria-label", label);
      resetControl.dataset.tooltip = label;
    }

    const sharedPopup = document.createElement("aside");
    sharedPopup.className = "regulatory-brain__shared-popup";
    sharedPopup.hidden = true;
    sharedPopup.setAttribute("role", "tooltip");
    sharedPopup.setAttribute("aria-live", "polite");
    root.append(sharedPopup);
    let sharedPopupNode = null;
    let sharedPopupSide = "right";

    /* Composição editorial exclusiva da Home. Os macrotemas que compartilham
       atos formam o núcleo da rede; os demais permanecem próximos, mas com
       respiro suficiente para que o conjunto seja lido como mapa — não anel. */
    const homeLayout = {
      "arquitetura-institucional": [220, 92],
      "direito-do-consumidor": [350, 105],
      "planejamento-energetico": [214, 214],
      "comercializacao-de-energia": [296, 260],
      "conexao-e-acesso-a-rede": [362, 231],
      "geracao-distribuida": [322, 333],
      "inclusao-energetica": [490, 105],
      "tributacao-estadual": [520, 172],
      "transicao-energetica": [482, 246],
      "participacao-publica": [544, 268],
      "licenciamento-ambiental": [466, 306],
    };

    const themeByName = new Map();
    const nodes = themes.map((theme, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / themes.length;
      const radiusX = workspaceMode ? 250 : 170;
      const radiusY = workspaceMode ? 190 : 140;
      const homePosition = (homeMode || pageMode) ? homeLayout[theme.slug] : null;
      const pageCenterOffsetX = pageMode ? -58 : 0;
      const anchorX = homePosition ? homePosition[0] + pageCenterOffsetX : graphCenter.x + Math.cos(angle) * radiusX;
      const anchorY = homePosition?.[1] ?? graphCenter.y + Math.sin(angle) * radiusY;
      const node = {
        id: `theme-${theme.slug}`,
        kind: "theme",
        theme,
        shortName: SHORT_NAMES[normalise(theme.name)] || theme.name,
        color: GRAPH_COLORS.theme,
        index,
        count: 0,
        x: anchorX,
        y: anchorY,
        anchorX,
        anchorY,
        vx: 0,
        vy: 0,
        radius: 11,
        mass: 4,
        pinned: false,
      };
      node.anchorX = node.x;
      node.anchorY = node.y;
      themeByName.set(normalise(theme.name), node);
      return node;
    });

    const themeNodes = [...nodes];
    const lawNodes = [];
    const edges = [];
    const lawsByTheme = new Map(themeNodes.map((node) => [node.id, []]));
    const graphOccurrenceByKey = new Map();

    laws.forEach((law, index) => {
      const themeNode = themeByName.get(normalise(law.theme)) || themeNodes[0];
      const identity = lawIdentity(law);
      const occurrenceKey = `${themeNode.id}|${identity}`;
      const existingOccurrence = graphOccurrenceByKey.get(occurrenceKey);
      if (existingOccurrence) {
        existingOccurrence.occurrenceRecords.push(law);
        return;
      }
      const localIndex = lawsByTheme.get(themeNode.id).length;
      const layer = Math.floor(localIndex / 7);
      const spread = ((localIndex % 7) - 3) * .18;
      const angle = Math.atan2(themeNode.y - graphCenter.y, themeNode.x - graphCenter.x) + spread;
      const distance = 34 + layer * 17 + (index % 3) * 4;
      const node = {
        id: `law-${index}`,
        kind: "law",
        law,
        recordIndex: index,
        themeNode,
        color: GRAPH_COLORS.law,
        identity,
        occurrenceRecords: [law],
        x: themeNode.x + Math.cos(angle) * distance + ((index * 17) % 13 - 6),
        y: themeNode.y + Math.sin(angle) * distance + ((index * 11) % 15 - 7),
        vx: 0,
        vy: 0,
        radius: 2.8,
        mass: 1,
        shared: false,
        pinned: false,
      };
      node.anchorX = node.x;
      node.anchorY = node.y;
      themeNode.count += 1;
      lawNodes.push(node);
      graphOccurrenceByKey.set(occurrenceKey, node);
      nodes.push(node);
      lawsByTheme.get(themeNode.id).push(node);
      edges.push({ source: themeNode, target: node, kind: "theme", color: GRAPH_COLORS.edge, length: 39 + layer * 3, phase: (index * .137) % 1 });
    });

    const identityGroups = new Map();
    lawNodes.forEach((node) => {
      if (!identityGroups.has(node.identity)) identityGroups.set(node.identity, []);
      identityGroups.get(node.identity).push(node);
    });
    const sharedGroups = [...identityGroups.values()].filter((group) => new Set(group.map((node) => node.themeNode.id)).size > 1);
    sharedGroups.forEach((group, groupIndex) => {
      group.forEach((node) => { node.shared = true; });
      for (let index = 1; index < group.length; index += 1) {
        edges.push({ source: group[0], target: group[index], kind: "shared", color: GRAPH_COLORS.shared, length: 92, phase: (groupIndex * .211 + index * .173) % 1 });
      }
    });

    /* Assim como em redes de conhecimento, o tamanho codifica relevância:
       macrotemas com mais referências aparecem maiores, sem mudar de cor. */
    themeNodes.forEach((node) => { node.radius = 8.5 + Math.sqrt(node.count) * 1.12; });
    const largestThemeRadius = Math.max(...themeNodes.map((node) => node.radius));
    function displayRadius(node) {
      return pageMode && collectionView === "shared" && node.kind === "theme" ? largestThemeRadius : node.radius;
    }

    function collectFocus(rootNode, nextNodes) {
      const relatedLaws = [];
      nextNodes.add(rootNode);

      if (rootNode.kind === "theme") {
        edges.filter((edge) => edge.kind === "theme" && edge.source === rootNode).forEach((edge) => {
          nextNodes.add(edge.target);
          relatedLaws.push(edge.target);
        });
      } else {
        nextNodes.add(rootNode.themeNode);
        relatedLaws.push(rootNode);
      }

      relatedLaws.forEach((lawNode) => {
        const group = identityGroups.get(lawNode.identity) || [];
        if (new Set(group.map((node) => node.themeNode.id)).size < 2) return;
        group.forEach((sharedNode) => {
          nextNodes.add(sharedNode);
          nextNodes.add(sharedNode.themeNode);
        });
      });
    }

    function applyFocus(roots) {
      const nextNodes = new Set();
      roots.forEach((rootNode) => collectFocus(rootNode, nextNodes));
      const nextEdges = new Set(edges.filter((edge) => nextNodes.has(edge.source) && nextNodes.has(edge.target)));
      focusNodes = nextNodes;
      focusEdges = nextEdges;
    }

    function buildFocus(rootNode) { applyFocus([rootNode]); }
    function rebuildExpandedFocus() { applyFocus([...expandedThemes]); }

    function buildDirectFocus() {
      const directEdges = edges.filter((edge) => edge.kind === "theme" && expandedThemes.has(edge.source));
      focusNodes = new Set([...expandedThemes, ...directEdges.map((edge) => edge.target)]);
      focusEdges = new Set(directEdges);
    }

    function rebuildPageFocus() {
      const nextNodes = new Set();
      const nextEdges = new Set();
      edges.filter((edge) => edge.kind === "theme" && expandedThemes.has(edge.source)).forEach((edge) => {
        /* O clique simples apresenta apenas os atos próprios em lista. Os atos
           compartilhados entram quando as conexões são abertas. Se o macrotema
           não possuir nenhum ato exclusivo, seus compartilhados são exibidos
           já no primeiro clique para que a seleção nunca apareça vazia. */
        const themeLaws = lawsByTheme.get(edge.source.id) || [];
        const hasExclusiveActs = themeLaws.some((lawNode) => !lawNode.shared);
        if (pageMode && edge.target.shared && hasExclusiveActs && !connectedThemes.has(edge.source)) return;
        nextNodes.add(edge.source);
        nextNodes.add(edge.target);
        nextEdges.add(edge);
      });

      if (connectedThemes.size) {
        const connectionNodes = new Set();
        connectedThemes.forEach((node) => collectFocus(node, connectionNodes));
        connectionNodes.forEach((node) => nextNodes.add(node));
        edges.forEach((edge) => {
          if (connectionNodes.has(edge.source) && connectionNodes.has(edge.target)) nextEdges.add(edge);
        });
      }

      focusNodes = nextNodes;
      focusEdges = nextEdges;
    }

    function setHoverFocus(node) {
      hoverFocus = node;
      /* Nos modos de consulta fixa, o repouso do cursor serve apenas para
         abrir o painel explicativo. A seleção organizada da coleção não deve
         ser substituída nem ampliada por relações temporárias. */
      if (collectionView) {
        focusNodes = new Set(collectionBaseNodes);
        focusEdges = new Set(collectionBaseEdges);
        return;
      }
      if (separatedGestures && (connectedThemes.size || expandedThemes.size)) {
        rebuildPageFocus();
        return;
      }
      if (node) buildFocus(node);
      else if (separatedGestures) rebuildPageFocus();
      else if (!expandedThemes.size) { focusNodes = new Set(); focusEdges = new Set(); }
    }

    function clearHoverDelay() {
      window.clearTimeout(hoverTimer);
      hoverTimer = 0;
      hoverCandidate = null;
    }

    function requestHoverFocus(node) {
      clearHoverDelay();
      if (!node) {
        setHoverFocus(null);
        return;
      }
      if (node === suppressHoverUntilLeave) return;
      if (!separatedGestures || node.kind !== "theme") {
        setHoverFocus(node);
        return;
      }
      hoverCandidate = node;
      hoverTimer = window.setTimeout(() => {
        if (hovered === hoverCandidate && pointer === null && (separatedGestures || !expandedThemes.size)) setHoverFocus(hoverCandidate);
        clearHoverDelay();
      }, 420);
    }

    function renderDetail(titleText, metaText, hintText) {
      tooltip.replaceChildren();
      const title = document.createElement("strong");
      const meta = document.createElement("span");
      const hint = document.createElement("small");
      title.textContent = titleText;
      meta.textContent = metaText;
      hint.textContent = hintText;
      tooltip.append(title, meta, hint);
      tooltip.hidden = false;
    }

    function conciseRelation(law) {
      const source = String(law.relation || law.description || law.name || "").replace(/\s+/g, " ").trim();
      if (!source) return "Registro relacionado a este tema no acervo regulatório.";
      const sentences = source.match(/[^.!?]+[.!?]?/g) || [source];
      const summary = sentences.slice(0, 2).join(" ").trim();
      return summary.length > 230 ? `${summary.slice(0, 226).replace(/\s+\S*$/, "")}…` : summary;
    }

    function hideSharedPopup() {
      sharedPopupNode = null;
      sharedPopup.hidden = true;
      sharedPopup.replaceChildren();
    }

    function positionSharedPopup(node) {
      if (!node || sharedPopup.hidden) return;
      const point = worldToScreen(node);
      const canvasBounds = canvas.getBoundingClientRect();
      const rootBounds = root.getBoundingClientRect();
      const instrumentPopup = collectionView === "instruments";
      const popupLimit = instrumentPopup ? 360 : 420;
      const popupWidth = Math.min(popupLimit, Math.max(280, rootBounds.width - 32));
      const canvasOffsetX = canvasBounds.left - rootBounds.left;
      const canvasOffsetY = canvasBounds.top - rootBounds.top;
      const pointInRootX = canvasOffsetX + point.x;
      const pointInRootY = canvasOffsetY + point.y;
      /* O limite ocupado considera todas as caixas de texto do mesmo
         macrotema, não apenas a bolinha sob o cursor. O painel é então
         colocado depois dessa faixa; pode cruzar outro agrupamento, mas nunca
         esconde os atos da coluna que o usuário está consultando. */
      const themeLabels = lawLabelHitboxes.filter((item) => item.node.themeNode === node.themeNode);
      const occupiedLeft = themeLabels.length
        ? canvasBounds.left - rootBounds.left + Math.min(...themeLabels.map((item) => item.left))
        : pointInRootX - 12;
      const occupiedRight = themeLabels.length
        ? canvasBounds.left - rootBounds.left + Math.max(...themeLabels.map((item) => item.right))
        : pointInRootX + 12;
      const occupiedTop = themeLabels.length
        ? canvasOffsetY + Math.min(...themeLabels.map((item) => item.top))
        : pointInRootY - 12;
      const occupiedBottom = themeLabels.length
        ? canvasOffsetY + Math.max(...themeLabels.map((item) => item.bottom))
        : pointInRootY + 12;
      const horizontalGap = instrumentPopup ? 24 : 18;
      sharedPopup.style.width = `${popupWidth}px`;
      const measuredHeight = sharedPopup.offsetHeight || 220;
      const edge = 16;
      const preferredSide = POPUP_RIGHT_THEMES.has(node.themeNode.theme.slug) ? "right" : "left";
      const oppositeSide = preferredSide === "right" ? "left" : "right";
      const preferredLeft = preferredSide === "right"
        ? occupiedRight + horizontalGap
        : occupiedLeft - popupWidth - horizontalGap;
      const oppositeLeft = oppositeSide === "right"
        ? occupiedRight + horizontalGap
        : occupiedLeft - popupWidth - horizontalGap;
      const candidates = [
        { side: preferredSide, left: preferredLeft, top: pointInRootY - measuredHeight / 2 },
        { side: preferredSide, left: preferredLeft, top: occupiedTop - measuredHeight - horizontalGap },
        { side: preferredSide, left: preferredLeft, top: occupiedBottom + horizontalGap },
        { side: oppositeSide, left: oppositeLeft, top: pointInRootY - measuredHeight / 2 },
        { side: oppositeSide, left: oppositeLeft, top: occupiedTop - measuredHeight - horizontalGap },
        { side: oppositeSide, left: oppositeLeft, top: occupiedBottom + horizontalGap },
      ];
      const controlsBounds = root.querySelector(".regulatory-brain__heading")?.getBoundingClientRect();
      const protectedAreas = [
        ...themeLabelHitboxes.map((item) => ({
          left: canvasOffsetX + item.left, right: canvasOffsetX + item.right,
          top: canvasOffsetY + item.top, bottom: canvasOffsetY + item.bottom,
          weight: item.node === node.themeNode ? 14 : .35,
        })),
        ...lawLabelHitboxes.map((item) => ({
          left: canvasOffsetX + item.left, right: canvasOffsetX + item.right,
          top: canvasOffsetY + item.top, bottom: canvasOffsetY + item.bottom,
          weight: item.node.themeNode === node.themeNode ? 18 : .25,
        })),
        ...themeNodes.map((themeNode) => {
          const center = worldToScreen(themeNode);
          const radius = displayRadius(themeNode) * baseScale * view.scale + 12;
          return {
            left: canvasOffsetX + center.x - radius, right: canvasOffsetX + center.x + radius,
            top: canvasOffsetY + center.y - radius, bottom: canvasOffsetY + center.y + radius,
            weight: themeNode === node.themeNode ? 20 : .4,
          };
        }),
        ...(controlsBounds ? [{
          left: controlsBounds.left - rootBounds.left - 10,
          right: controlsBounds.right - rootBounds.left + 10,
          top: controlsBounds.top - rootBounds.top - 10,
          bottom: controlsBounds.bottom - rootBounds.top + 10,
          weight: 24,
        }] : []),
      ];
      /* O painel pertence à área do canvas. O rodapé contém a legenda e o
         resumo dinâmico, portanto nunca pode ser usado como espaço livre. */
      const safeTop = canvasOffsetY + 14;
      const safeBottom = canvasOffsetY + canvasBounds.height - 14;
      sharedPopup.style.maxHeight = `${Math.max(180, canvasBounds.height - 28)}px`;
      if (instrumentPopup && rootBounds.width >= 900) {
        const rightPanelLeft = clamp(
          occupiedRight + 32,
          edge,
          rootBounds.width - popupWidth - edge,
        );
        const rightPanelTop = clamp(
          pointInRootY - measuredHeight / 2,
          safeTop,
          Math.max(safeTop, safeBottom - measuredHeight),
        );
        sharedPopupSide = "right";
        sharedPopup.dataset.side = sharedPopupSide;
        sharedPopup.style.left = `${rightPanelLeft}px`;
        sharedPopup.style.top = `${rightPanelTop}px`;
        return;
      }
      if (pageMode && rootBounds.width >= 900) {
        const availableRight = rootBounds.width - edge - occupiedRight - horizontalGap;
        const availableLeft = occupiedLeft - horizontalGap - edge;
        const popupSide = availableRight >= popupWidth
          ? "right"
          : availableLeft >= popupWidth
            ? "left"
            : availableRight >= availableLeft ? "right" : "left";
        const adjacentLeft = popupSide === "right"
          ? occupiedRight + horizontalGap
          : occupiedLeft - popupWidth - horizontalGap;
        const adjacentTop = clamp(
          pointInRootY - measuredHeight / 2,
          safeTop,
          Math.max(safeTop, safeBottom - measuredHeight),
        );
        sharedPopupSide = popupSide;
        sharedPopup.dataset.side = sharedPopupSide;
        sharedPopup.style.left = `${clamp(adjacentLeft, edge, rootBounds.width - popupWidth - edge)}px`;
        sharedPopup.style.top = `${adjacentTop}px`;
        return;
      }
      const scored = candidates.map((candidate, index) => {
        const left = clamp(candidate.left, edge, rootBounds.width - popupWidth - edge);
        const top = clamp(candidate.top, safeTop, Math.max(safeTop, safeBottom - measuredHeight));
        const rect = { left, right: left + popupWidth, top, bottom: top + measuredHeight };
        const overlap = protectedAreas.reduce((total, area) => {
          const width = Math.max(0, Math.min(rect.right, area.right) - Math.max(rect.left, area.left));
          const height = Math.max(0, Math.min(rect.bottom, area.bottom) - Math.max(rect.top, area.top));
          return total + width * height * area.weight;
        }, 0);
        const closestX = clamp(pointInRootX, rect.left, rect.right);
        const closestY = clamp(pointInRootY, rect.top, rect.bottom);
        const proximity = Math.hypot(pointInRootX - closestX, pointInRootY - closestY);
        const clampDistance = Math.abs(left - candidate.left) + Math.abs(top - candidate.top);
        return { ...candidate, left, top, score: overlap + proximity * 700 + clampDistance * 40 + index };
      }).sort((first, second) => first.score - second.score);
      const placement = scored[0];
      sharedPopupSide = placement.side;
      sharedPopup.dataset.side = sharedPopupSide;
      sharedPopup.style.left = `${placement.left}px`;
      sharedPopup.style.top = `${placement.top}px`;
    }

    function showSharedPopup(node) {
      if (!pageMode || node.kind !== "law") {
        hideSharedPopup();
        return;
      }
      const needsPlacement = sharedPopupNode !== node;
      if (needsPlacement) {
        const showAsShared = node.shared;
        const group = identityGroups.get(node.identity) || [node];
        const recordsByTheme = new Map();
        group.forEach((item) => {
          const themeName = item.themeNode.theme.name;
          if (!recordsByTheme.has(themeName)) recordsByTheme.set(themeName, []);
          recordsByTheme.get(themeName).push(...(item.occurrenceRecords || [item.law]));
        });

        const heading = document.createElement("div");
        heading.className = "regulatory-brain__shared-popup-heading";
        const badge = document.createElement("span");
        badge.textContent = showAsShared ? "ATO COMPARTILHADO" : "REGISTRO REGULATÓRIO";
        const title = document.createElement("strong");
        title.textContent = `${node.law.type} ${node.law.number}`.trim();
        const name = document.createElement("p");
        name.textContent = node.law.name;
        heading.append(badge, title, name);

        const intro = document.createElement("p");
        intro.className = "regulatory-brain__shared-popup-intro";
        intro.textContent = showAsShared
          ? `Esta norma aparece em ${recordsByTheme.size} temas porque disciplina aspectos diferentes do setor:`
          : `Veja como este ato se relaciona com o tema ${node.themeNode.theme.name}:`;

        const list = document.createElement("div");
        list.className = "regulatory-brain__shared-popup-relations";
        recordsByTheme.forEach((records, themeName) => {
          const item = document.createElement("section");
          const itemTitle = document.createElement("strong");
          const itemText = document.createElement("p");
          itemTitle.textContent = themeName;
          itemText.textContent = conciseRelation(records.find((record) => record.relation) || records[0]);
          item.append(itemTitle, itemText);
          list.append(item);
        });

        const hint = document.createElement("small");
        hint.textContent = showAsShared
          ? "Clique na bolinha verde para abrir a fonte oficial."
          : "Clique na bolinha azul para abrir a fonte oficial.";
        sharedPopup.replaceChildren(heading, intro, list, hint);
        sharedPopupNode = node;
      }
      sharedPopup.dataset.kind = node.shared ? "shared" : "single";
      sharedPopup.hidden = false;
      /* A posição permanece estável durante o hover. Recalculá-la em cada
         quadro alterava o lado dos rótulos, que por sua vez mudava a escolha
         do próprio painel e produzia a vibração visual. */
      if (needsPlacement) positionSharedPopup(node);
    }

    function showDefaultDetails() {
      if (pageMode) {
        renderDetail(
          "Organize sua leitura regulatória",
          "Um clique abre normas e alterna seus nomes · dois cliques alternam conexões",
          "Repouse o cursor para ver conexões temporariamente e use ↻ para voltar ao Brain inicial."
        );
        return;
      }
      if (separatedGestures) {
        renderDetail(
          "Explore a rede regulatória",
          "Um clique abre normas e alterna seus nomes · dois cliques alternam conexões",
          "Arraste para posicionar. Repouse o cursor para destacar conexões e use ↻ para restaurar o mapa."
        );
        return;
      }
      if (workspaceMode) {
        renderDetail(
          "Crie seu mapa regulatório",
          "Clique para abrir normas · arraste para fixar temas e revelar conexões",
          "Arraste normas para modelar a rede e arraste o fundo para girar em profundidade. Use ↻ para reiniciar."
        );
        return;
      }
      renderDetail(
        "Explore a rede regulatória",
        "Passe o cursor sobre um ponto para ler seus dados",
        "Clique para consultar. Arraste os pontos para organizar e use ↻ para reiniciar."
      );
    }

    function showCollectionThemeDetails(node) {
      const visibleItems = lawNodes.filter((lawNode) => lawNode.themeNode === node && focusNodes.has(lawNode)).length;
      const plural = visibleItems === 1 ? "" : "s";
      if (collectionView === "themes") {
        const connectionsOpen = connectedThemes.has(node);
        renderDetail(
          node.theme.name,
          `${visibleItems} ${visibleItems === 1 ? "registro diretamente vinculado" : "registros diretamente vinculados"} · conexões compartilhadas ${connectionsOpen ? "exibidas" : "recolhidas"}`,
          `Clique no tema para ${connectionsOpen ? "recolher" : "mostrar"} as conexões com outros temas. Clique em uma norma para abrir a fonte oficial.`
        );
        return;
      }
      if (collectionView === "norms") {
        renderDetail(
          node.theme.name,
          `${visibleItems} ${visibleItems === 1 ? "norma distinta exibida" : "normas distintas exibidas"} neste tema`,
          "Nesta visão, cada norma aparece uma única vez e as conexões entre temas ficam ocultas. Clique em uma norma para abrir a fonte oficial."
        );
        return;
      }
      if (collectionView === "instruments") {
        renderDetail(
          node.theme.name,
          `${visibleItems} instrumento${plural} de consolidação exibido${plural} neste tema`,
          `Clique em ${visibleItems === 1 ? "o instrumento" : "um instrumento"} para abrir a fonte oficial. O tema funciona apenas como agrupador nesta visão.`
        );
        return;
      }
      if (collectionView === "shared") {
        renderDetail(
          node.theme.name,
          `${visibleItems} ${visibleItems === 1 ? "ato compartilhado exibido" : "atos compartilhados exibidos"} neste tema`,
          "As linhas verdes ligam ocorrências do mesmo ato em temas diferentes. Clique em um ato para abrir a fonte oficial."
        );
      }
    }

    function showLockedDetails(node) {
      if (collectionView) {
        showCollectionThemeDetails(node);
        return;
      }
      if (directSelection && expandedThemes.has(node)) {
        const labelsVisible = visibleLawLabelThemes.has(node);
        renderDetail(
          node.theme.name,
          `${node.count} ${node.count === 1 ? "norma diretamente vinculada" : "normas diretamente vinculadas"}`,
          labelsVisible
            ? `${expandedThemes.size} ${expandedThemes.size === 1 ? "tema aberto" : "temas abertos"} · clique para recolher os nomes destas normas.`
            : "Nomes recolhidos · clique novamente para mostrá-los sem fechar os demais temas."
        );
        return;
      }
      const relatedThemeIds = new Set();
      let sharedActs = 0;
      (lawsByTheme.get(node.id) || []).forEach((lawNode) => {
        const group = identityGroups.get(lawNode.identity) || [];
        const otherThemes = new Set(group.map((item) => item.themeNode.id).filter((id) => id !== node.id));
        if (otherThemes.size) sharedActs += 1;
        otherThemes.forEach((id) => relatedThemeIds.add(id));
      });
      const relation = relatedThemeIds.size
        ? `${node.count} normas · ${sharedActs} atos compartilhados · ${relatedThemeIds.size} temas relacionados`
        : `${node.count} ${node.count === 1 ? "norma vinculada" : "normas vinculadas"}`;
      const openCount = expandedThemes.size;
      const labelAction = visibleLawLabelThemes.has(node) ? "recolher" : "mostrar";
      if (separatedGestures) {
        const singleClickAction = expandedThemes.has(node)
          ? `Clique para ${visibleLawLabelThemes.has(node) ? "recolher" : "mostrar"} os nomes das normas`
          : "Clique para abrir as normas";
        renderDetail(
          node.theme.name,
          `${node.count} ${node.count === 1 ? "norma diretamente vinculada" : "normas diretamente vinculadas"}${connectedThemes.has(node) ? " · conexões abertas" : ""}`,
          `${singleClickAction} · clique duas vezes para ${connectedThemes.has(node) ? "recolher" : "mostrar"} conexões.`
        );
        return;
      }
      renderDetail(
        node.theme.name,
        relation,
        `${openCount} ${openCount === 1 ? "tema organizado" : "temas organizados"} · clique para ${labelAction} os nomes; use ↻ para reiniciar.`
      );
    }

    function intersectionArea(first, second) {
      const width = Math.max(0, Math.min(first.right, second.right) - Math.max(first.left, second.left));
      const height = Math.max(0, Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top));
      return width * height;
    }

    function setScrollablePageHeight(worldHeight, desktopMinimum = 950) {
      const widthScale = canvasWidth > 0 ? (canvasWidth / world.width) * .96 : 2.18;
      const visualScale = Math.min(2.18, Math.max(.58, widthScale));
      const minimum = canvasWidth > 0 && canvasWidth < 700 ? 620 : desktopMinimum;
      root.style.setProperty("--brain-page-height", `${Math.max(minimum, Math.ceil(worldHeight * visualScale))}px`);
    }

    function layoutThemeLaws(node) {
      const themeLaws = lawsByTheme.get(node.id) || [];
      const hasExclusiveActs = themeLaws.some((lawNode) => !lawNode.shared);
      const directLaws = themeLaws
        .filter((lawNode) => !pageMode || connectedThemes.has(node) || !lawNode.shared || !hasExclusiveActs);
      if (homeMode) {
        /* A margem vertical mantém toda a lista abaixo da legenda. O nó fica
           dentro de uma faixa segura para que o título caiba à esquerda e os
           atos, com seus rótulos, possam crescer à direita. */
        world.height = Math.max(420, 340 + Math.max(0, directLaws.length - 1) * 46);
        node.x = clamp(node.x, 180, world.width - 190);
        node.vx = 0;
      }
      /* Na Home, a lista nunca é quebrada em uma segunda coluna. O passo é
         calculado pela quantidade atual de registros, portanto continua válido
         quando atos ou macrotemas forem acrescentados ou removidos. */
      const rowsPerColumn = homeMode ? Math.max(1, directLaws.length) : 10;
      const rowStep = homeMode ? 46 : 19;
      const preferredDirections = homeMode
        ? ["right"]
        : node.x > world.width * .58
        ? ["left", "down", "up", "right"]
        : ["right", "down", "up", "left"];
      const directions = (homeMode ? [
        { key: "right", dx: 1, dy: 0 },
      ] : [
        { key: "right", dx: 1, dy: 0 },
        { key: "left", dx: -1, dy: 0 },
        { key: "down", dx: 0, dy: 1 },
        { key: "up", dx: 0, dy: -1 },
      ]);
      const otherBounds = [...expandedThemes].filter((themeNode) => themeNode !== node && themeNode.clusterBounds).map((themeNode) => themeNode.clusterBounds);

      const candidates = directions.map((direction) => {
        const positions = [];
        let overflow = 0;
        let alignedThemeY = node.y;
        directLaws.forEach((lawNode, index) => {
          const column = Math.floor(index / rowsPerColumn);
          const row = index % rowsPerColumn;
          const rowsInColumn = Math.min(rowsPerColumn, directLaws.length - column * rowsPerColumn);
          const span = (rowsInColumn - 1) * rowStep;
          let rawX;
          let rawY;
          let angle;
          if (direction.dx) {
            /* Na Home, o macrotema ocupa o centro vertical da lista: o nó e o
               título funcionam como a referência visual de todo o conjunto,
               como um colchete implícito, sem acrescentar outro elemento. */
            const listGap = homeMode ? 0 : 8;
            const startY = homeMode
              ? clamp((world.height - span) / 2, 54, world.height - 54 - span)
              : clamp(node.y, 54, world.height - 58 - span - listGap) + listGap;
            const themeY = homeMode ? startY + span / 2 : startY - listGap;
            alignedThemeY = themeY;
            rawX = node.x + direction.dx * (72 + column * 116);
            rawY = startY + row * rowStep;
            angle = column === 0 ? (direction.dx > 0 ? 0 : Math.PI) : -Math.PI / 2;
          } else {
            const centerX = clamp(node.x, 68 + span / 2, world.width - 68 - span / 2);
            rawX = centerX + (row - (rowsInColumn - 1) / 2) * 30;
            rawY = node.y + direction.dy * (48 + column * 68);
            angle = rawX < node.x ? Math.PI : 0;
          }
          overflow += Math.max(0, 55 - rawX) + Math.max(0, rawX - (world.width - 55));
          overflow += Math.max(0, 42 - rawY) + Math.max(0, rawY - (world.height - 42));
          positions.push({ node: lawNode, x: clamp(rawX, 55, world.width - 55), y: clamp(rawY, 42, world.height - 42), angle });
        });
        const xs = positions.map((item) => item.x);
        const ys = positions.map((item) => item.y);
        const bounds = {
          left: Math.min(node.x, ...xs) - 68,
          right: Math.max(node.x, ...xs) + 68,
          top: Math.min(node.y, ...ys) - 18,
          bottom: Math.max(node.y, ...ys) + 18,
        };
        const overlap = otherBounds.reduce((total, other) => total + intersectionArea(bounds, other), 0);
        const stability = collectionView !== "themes" && node.layoutDirection === direction.key ? -3500 : 0;
        /* A leitura lateral mantém números e linhas em uma lista estável. As
           alternativas verticais ficam disponíveis apenas quando as laterais
           realmente não comportam o agrupamento. */
        const directionPreference = preferredDirections.indexOf(direction.key)
          * (collectionView === "themes" ? 2600 : 1800);
        const overlapWeight = collectionView === "themes" ? 4 : 1.5;
        return {
          direction,
          positions,
          bounds,
          alignedThemeY,
          score: overflow * 450 + overlap * overlapWeight + directionPreference + stability,
        };
      });

      candidates.sort((first, second) => first.score - second.score);
      const selected = candidates[0];
      node.layoutDirection = selected.direction.key;
      if (selected.direction.dx) {
        node.y = selected.alignedThemeY;
        node.vy = 0;
      }
      node.clusterBounds = selected.bounds;
      selected.positions.forEach((position) => {
        position.node.focusX = position.x;
        position.node.focusY = position.y;
        position.node.focusAngle = position.angle;
        position.node.focusDirect = true;
      });
    }

    function relayoutCollectionThemes() {
      if (collectionView !== "themes") return;
      const opened = [...expandedThemes].sort((first, second) => themeNodes.indexOf(first) - themeNodes.indexOf(second));
      opened.forEach(clearThemeLawLayout);

      const layoutListToRight = (themeNode, top, fixedAnchor = false) => {
        const laws = lawsByTheme.get(themeNode.id) || [];
        const rowsPerColumn = 10;
        const columns = Math.max(1, Math.ceil(laws.length / rowsPerColumn));
        const blockHeight = Math.max(82, Math.min(rowsPerColumn, laws.length) * 19 + 26);
        if (!fixedAnchor) themeNode.y = top + blockHeight / 2;
        laws.forEach((lawNode, index) => {
          const column = Math.floor(index / rowsPerColumn);
          const row = index % rowsPerColumn;
          lawNode.focusX = themeNode.x + 54 + column * 116;
          lawNode.focusY = fixedAnchor
            ? themeNode.y - blockHeight / 2 + 18 + row * 19
            : top + 18 + row * 19;
          lawNode.focusAngle = 0;
          lawNode.focusDirect = true;
          lawNode.vx = 0;
          lawNode.vy = 0;
        });
        themeNode.layoutDirection = "right";
        themeNode.clusterBounds = {
          left: themeNode.x - 34,
          right: themeNode.x + 74 + columns * 116,
          top: fixedAnchor ? themeNode.y - blockHeight / 2 : top,
          bottom: fixedAnchor ? themeNode.y + blockHeight / 2 : top + blockHeight,
        };
        return blockHeight;
      };

      if (opened.length === 1) {
        world.height = 420;
        root.style.removeProperty("--brain-page-height");
        layoutListToRight(opened[0], opened[0].y - 70, true);
        return;
      }

      if (opened.length > 1) {
        const laneBottoms = [44, 44];
        opened.forEach((themeNode) => {
          const lane = laneBottoms[0] <= laneBottoms[1] ? 0 : 1;
          const top = laneBottoms[lane];
          themeNode.x = lane === 0 ? 48 : 368;
          themeNode.pinned = true;
          const height = layoutListToRight(themeNode, top);
          laneBottoms[lane] += height + 28;
        });
        const neededWorldHeight = Math.max(420, ...laneBottoms) + 18;
        world.height = neededWorldHeight;
        setScrollablePageHeight(neededWorldHeight, 720);
      } else {
        world.height = 420;
        root.style.removeProperty("--brain-page-height");
      }
    }

    function lockTheme(node, shouldRelayout = true) {
      directSelection = null;
      directLabelsCollapsed = false;
      const wasExpanded = expandedThemes.has(node);
      expandedThemes.add(node);
      visibleLawLabelThemes.add(node);
      lockedFocus = node;
      hoverFocus = null;
      node.pinned = true;
      rebuildExpandedFocus();
      if (!wasExpanded || shouldRelayout) layoutThemeLaws(node);
      view.scale = Math.max(view.scale, 1.02);
      showLockedDetails(node);
      heat = Math.max(heat, .52);
    }

    function clearThemeLawLayout(node) {
      (lawsByTheme.get(node.id) || []).forEach((lawNode) => {
        if (!lawNode.pinned) {
          delete lawNode.focusX;
          delete lawNode.focusY;
          delete lawNode.focusAngle;
          delete lawNode.focusDirect;
        }
      });
      delete node.clusterBounds;
      delete node.layoutDirection;
    }

    function syncGestureState(lastGesture = "") {
      root.dataset.expandedThemes = String(expandedThemes.size);
      root.dataset.connectedThemes = String(connectedThemes.size);
      root.dataset.positionedThemes = String(positionedThemes.size);
      if (lastGesture) root.dataset.lastGesture = lastGesture;
    }

    function openPageTheme(node, keepPosition = false) {
      pageOverviewPristine = false;
      suppressHoverUntilLeave = node;
      expandedThemes.add(node);
      visibleLawLabelThemes.add(node);
      lockedFocus = node;
      hoverFocus = null;
      /* O primeiro clique também fixa a âncora do macrotema. Sem isso, a lista
         ficava parada enquanto a simulação deslocava o título e seu nó. */
      positionedThemes.add(node);
      node.pinned = true;
      if (collectionView === "themes") relayoutCollectionThemes();
      else layoutThemeLaws(node);
      if (homeMode) resize();
      (lawsByTheme.get(node.id) || []).forEach((lawNode) => {
        lawNode.vx = 0;
        lawNode.vy = 0;
      });
      rebuildPageFocus();
      showLockedDetails(node);
      syncGestureState("normas-abertas");
    }

    function closePageTheme(node) {
      if (collapsingThemes.has(node)) return;
      collapsingThemes.add(node);
      visibleLawLabelThemes.delete(node);
      connectedThemes.delete(node);
      lockedFocus = node;
      hoverFocus = null;
      (lawsByTheme.get(node.id) || []).forEach((lawNode) => {
        if (lawNode.pinned) return;
        lawNode.focusX = node.x;
        lawNode.focusY = node.y;
        lawNode.focusDirect = true;
        lawNode.vx = 0;
        lawNode.vy = 0;
      });
      rebuildPageFocus();
      renderDetail(node.theme.name, "Recolhendo normas e conexões", "O tema retornará à visão geral.");
      heat = Math.max(heat, .72);
      window.setTimeout(() => {
        expandedThemes.delete(node);
        collapsingThemes.delete(node);
        clearThemeLawLayout(node);
        if (homeMode && !expandedThemes.size) {
          world.height = 420;
          resize();
        }
        if (collectionView === "themes" && themeColumnPositions.has(node)) {
          const columnPosition = themeColumnPositions.get(node);
          const returnedToColumn = Math.hypot(node.x - columnPosition.x, node.y - columnPosition.y) < 58;
          if (!positionedThemes.has(node) || returnedToColumn) {
            node.x = columnPosition.x;
            node.y = columnPosition.y;
            node.vx = 0;
            node.vy = 0;
            node.pinned = true;
            positionedThemes.delete(node);
          } else node.pinned = true;
        } else node.pinned = positionedThemes.has(node);
        relayoutCollectionThemes();
        lockedFocus = [...expandedThemes].at(-1) || [...connectedThemes].at(-1) || null;
        rebuildPageFocus();
        if (lockedFocus) showLockedDetails(lockedFocus);
        else showDefaultDetails();
        syncGestureState("normas-recolhidas");
        heat = Math.max(heat, .34);
      }, reducedMotion ? 0 : 360);
    }

    function togglePageTheme(node) {
      suppressHoverUntilLeave = node;
      if (collectionView && collectionView !== "themes") {
        showTooltip(node);
        return;
      }
      if (collectionView === "themes") {
        togglePageConnections(node);
        return;
      }
      if (!expandedThemes.has(node)) {
        openPageTheme(node, positionedThemes.has(node));
        return;
      }
      closePageTheme(node);
    }

    function layoutHomeConnections(node) {
      const ownLaws = lawsByTheme.get(node.id) || [];
      world.height = Math.max(420, 190 + Math.max(0, ownLaws.length - 1) * 46);
      node.x = 82;
      node.y = 120;
      node.pinned = true;
      node.vx = 0;
      node.vy = 0;
      const sourceByIdentity = new Map();
      ownLaws.forEach((lawNode, index) => {
        lawNode.focusX = 210;
        lawNode.focusY = 142 + index * 46;
        lawNode.focusAngle = 0;
        lawNode.focusDirect = true;
        lawNode.vx = 0;
        lawNode.vy = 0;
        sourceByIdentity.set(lawNode.identity, lawNode);
      });

      const relatedThemes = [...new Set(
        [...focusNodes]
          .filter((item) => item.kind === "law" && item.themeNode !== node && sourceByIdentity.has(item.identity))
          .map((item) => item.themeNode),
      )];
      const desiredRows = relatedThemes.map((themeNode) => {
        const peers = (lawsByTheme.get(themeNode.id) || [])
          .filter((lawNode) => focusNodes.has(lawNode) && sourceByIdentity.has(lawNode.identity));
        const desiredY = peers.reduce((sum, lawNode) => sum + sourceByIdentity.get(lawNode.identity).focusY, 0) / Math.max(peers.length, 1);
        return { themeNode, peers, desiredY };
      }).sort((first, second) => first.desiredY - second.desiredY);

      let previousY = 72;
      desiredRows.forEach(({ themeNode, peers, desiredY }) => {
        const themeY = clamp(Math.max(desiredY, previousY + 64), 72, world.height - 52);
        previousY = themeY;
        themeNode.x = 558;
        themeNode.y = themeY;
        themeNode.pinned = true;
        homeConnectionPeers.add(themeNode);
        themeNode.vx = 0;
        themeNode.vy = 0;
        peers.forEach((lawNode) => {
          lawNode.focusX = 480;
          lawNode.focusY = sourceByIdentity.get(lawNode.identity).focusY;
          lawNode.focusAngle = Math.PI;
          lawNode.focusDirect = true;
          lawNode.vx = 0;
          lawNode.vy = 0;
        });
      });
      node.clusterBounds = { left: 42, right: 512, top: 86, bottom: world.height - 24 };
      resize();
    }

    function clearHomeConnectionLayout(preservePositions = false) {
      homeConnectionPeers.forEach((themeNode) => {
        if (!preservePositions) {
          themeNode.x = themeNode.anchorX;
          themeNode.y = themeNode.anchorY;
        }
        themeNode.vx = 0;
        themeNode.vy = 0;
        themeNode.pinned = positionedThemes.has(themeNode);
        (lawsByTheme.get(themeNode.id) || []).forEach((lawNode) => {
          if (lawNode.pinned) return;
          delete lawNode.focusX;
          delete lawNode.focusY;
          delete lawNode.focusAngle;
          delete lawNode.focusDirect;
        });
      });
      homeConnectionPeers.clear();
    }

    function togglePageConnections(node) {
      if (collectionView && collectionView !== "themes") {
        showTooltip(node);
        return;
      }
      const preserveInitialFraming = pageMode && pageOverviewPristine
        && !expandedThemes.size && !collectionView;
      pageOverviewPristine = preserveInitialFraming;
      clearHoverDelay();
      suppressHoverUntilLeave = node;
      hoverFocus = null;
      lockedFocus = node;
      const opening = !connectedThemes.has(node);
      if (opening) {
        if (homeMode) {
          clearHomeConnectionLayout();
          connectedThemes.clear();
          [...expandedThemes].filter((themeNode) => themeNode !== node).forEach((themeNode) => {
            expandedThemes.delete(themeNode);
            visibleLawLabelThemes.delete(themeNode);
            clearThemeLawLayout(themeNode);
            themeNode.x = themeNode.anchorX;
            themeNode.y = themeNode.anchorY;
            themeNode.pinned = false;
          });
        }
        connectedThemes.add(node);
        expandedThemes.add(node);
        visibleLawLabelThemes.add(node);
        positionedThemes.add(node);
        node.pinned = true;
      }
      else connectedThemes.delete(node);
      rebuildPageFocus();
      if (homeMode) {
        if (opening) layoutHomeConnections(node);
        else {
          clearHomeConnectionLayout();
          layoutThemeLaws(node);
          resize();
        }
      }
      showLockedDetails(node);
      syncGestureState(connectedThemes.has(node) ? "conexoes-abertas" : "conexoes-recolhidas");
    }

    function selectThemeDirect(node) {
      if (!directSelection) resetFocus(false);
      directSelection = node;
      directLabelsCollapsed = false;
      expandedThemes.add(node);
      visibleLawLabelThemes.add(node);
      lockedFocus = node;
      node.pinned = true;
      buildDirectFocus();
      layoutThemeLaws(node);
      view.scale = Math.max(view.scale, 1.02);
      showLockedDetails(node);
      heat = Math.max(heat, .52);
    }

    function collapseDirectTheme(node) {
      const directLaws = lawsByTheme.get(node.id) || [];
      directLabelsCollapsed = true;
      visibleLawLabelThemes.delete(node);
      directLaws.forEach((lawNode, index) => {
        const ring = Math.floor(index / 10);
        const start = ring * 10;
        const itemsInRing = Math.min(10, directLaws.length - start);
        const position = index - start;
        const angle = -Math.PI / 2 + (Math.PI * 2 * position) / Math.max(itemsInRing, 1);
        const radius = 49 + ring * 27;
        lawNode.focusX = clamp(node.x + Math.cos(angle) * radius, 38, world.width - 38);
        lawNode.focusY = clamp(node.y + Math.sin(angle) * radius, 34, world.height - 34);
        lawNode.focusAngle = angle;
        lawNode.focusDirect = true;
      });
      node.clusterBounds = {
        left: node.x - 88,
        right: node.x + 88,
        top: node.y - 88,
        bottom: node.y + 88,
      };
      showLockedDetails(node);
      heat = Math.max(heat, .62);
    }

    function expandDirectTheme(node) {
      directSelection = node;
      directLabelsCollapsed = false;
      lockedFocus = node;
      visibleLawLabelThemes.add(node);
      layoutThemeLaws(node);
      buildDirectFocus();
      showLockedDetails(node);
      heat = Math.max(heat, .48);
    }

    function toggleDraggedThemeLabels(node) {
      lockedFocus = node;
      hoverFocus = null;
      if (visibleLawLabelThemes.has(node)) visibleLawLabelThemes.delete(node);
      else visibleLawLabelThemes.add(node);
      showLockedDetails(node);
      heat = Math.max(heat, .22);
    }

    function resetFocus(animate = true) {
      const shouldAnimate = animate && !reducedMotion;
      clearHoverDelay();
      clearHomeConnectionLayout(shouldAnimate);
      themeNodes.forEach((node) => {
        const targetX = homeMode && Number.isFinite(node.resetX) ? node.resetX : node.anchorX;
        const targetY = homeMode && Number.isFinite(node.resetY) ? node.resetY : node.anchorY;
        node.pinned = false;
        if (!shouldAnimate) {
          node.x = targetX;
          node.y = targetY;
        }
        node.vx = 0;
        node.vy = 0;
        delete node.clusterBounds;
        delete node.layoutDirection;
      });
      lawNodes.forEach((node) => {
        const targetX = homeMode && Number.isFinite(node.resetX) ? node.resetX : node.anchorX;
        const targetY = homeMode && Number.isFinite(node.resetY) ? node.resetY : node.anchorY;
        node.pinned = false;
        if (!shouldAnimate) {
          node.x = targetX;
          node.y = targetY;
        }
        node.vx = 0;
        node.vy = 0;
        delete node.focusX;
        delete node.focusY;
        delete node.focusAngle;
        delete node.focusDirect;
      });
      expandedThemes.clear();
      visibleLawLabelThemes.clear();
      connectedThemes.clear();
      positionedThemes.clear();
      directSelection = null;
      directLabelsCollapsed = false;
      lockedFocus = null;
      hoverFocus = null;
      hovered = null;
      focusNodes = new Set();
      focusEdges = new Set();
      collectionBaseNodes = new Set();
      collectionBaseEdges = new Set();
      if (homeMode) world.height = 420;
      dragWorkspaceActive = false;
      collectionView = "";
      themeColumnPositions.clear();
      world.height = 420;
      root.style.removeProperty("--brain-page-height");
      delete root.dataset.collectionView;
      syncResetControl();
      window.clearTimeout(clickTimer);
      clickTimer = 0;
      pendingClickTheme = null;
      tiltX = 0;
      tiltY = 0;
      root.style.setProperty("--brain-tilt-x", "0deg");
      root.style.setProperty("--brain-tilt-y", "0deg");
      root.classList.remove("is-tilting", "is-settling");
      if (pageMode) pageOverviewPristine = true;
      view.scale = defaultViewScale;
      if (pageMode) root.scrollTop = 0;
      showDefaultDetails();
      resetTransition = null;
      returningToInitial = shouldAnimate;
      if (shouldAnimate) {
        nodes.forEach((node, index) => {
          const amplitude = node.kind === "theme" ? .88 : .32;
          node.vx += Math.cos(index * 1.71) * amplitude;
          node.vy += Math.sin(index * 1.37) * amplitude;
        });
      }
      heat = shouldAnimate ? 1.08 : 0;
      resize();
      syncGestureState("mapa-reorganizado");
      root.dispatchEvent(new CustomEvent("braincollectionchange", { detail: { mode: "" } }));
    }

    function updateResetTransition(time) {
      if (!resetTransition) return false;
      const progress = clamp((time - resetTransition.start) / resetTransition.duration, 0, 1);
      const eased = .5 - Math.cos(Math.PI * progress) / 2;
      nodes.forEach((node, index) => {
        const targetX = homeMode && Number.isFinite(node.resetX) ? node.resetX : node.anchorX;
        const targetY = homeMode && Number.isFinite(node.resetY) ? node.resetY : node.anchorY;
        const origin = resetTransition.from.get(node) || { x: targetX, y: targetY };
        const flourish = Math.sin(Math.PI * progress);
        const phase = index * 2.399963;
        const sway = homeMode ? (node.kind === "theme" ? 4.2 : 2.4) : (node.kind === "theme" ? 3 : 1.6);
        const lift = homeMode ? (node.kind === "theme" ? 13 : 7) : (node.kind === "theme" ? 5 : 2.5);
        node.x = origin.x + (targetX - origin.x) * eased + Math.cos(phase) * sway * flourish;
        node.y = origin.y + (targetY - origin.y) * eased - lift * flourish;
        node.vx = 0;
        node.vy = 0;
      });
      if (progress < 1) return true;
      nodes.forEach((node) => {
        node.x = homeMode && Number.isFinite(node.resetX) ? node.resetX : node.anchorX;
        node.y = homeMode && Number.isFinite(node.resetY) ? node.resetY : node.anchorY;
        node.pinned = false;
      });
      resetTransition = null;
      return false;
    }

    function layoutCollectionView(mode) {
      resetFocus(false);
      pageOverviewPristine = false;
      collectionView = mode;
      root.dataset.collectionView = mode;
      syncResetControl();
      view.scale = mode === "themes" ? 1 : .94;
      view.rotation = 0;

      const seenNormIdentities = new Set();
      const seenSharedThemeIdentities = new Set();
      const selectedLaws = lawNodes.filter((node) => {
        if (mode === "themes") return true;
        if (mode === "norms") {
          if (seenNormIdentities.has(node.identity)) return false;
          seenNormIdentities.add(node.identity);
          return true;
        }
        if (mode === "instruments") {
          if (!isSectorInstrument(node.law) || seenNormIdentities.has(node.identity)) return false;
          seenNormIdentities.add(node.identity);
          return true;
        }
        if (mode === "shared") {
          if (!node.shared) return false;
          const occurrence = `${node.themeNode.id}|${node.identity}`;
          if (seenSharedThemeIdentities.has(occurrence)) return false;
          seenSharedThemeIdentities.add(occurrence);
          return true;
        }
        return false;
      });
      const selectedSet = new Set(selectedLaws);
      const activeThemes = themeNodes.filter((themeNode) => selectedLaws.some((node) => node.themeNode === themeNode));
      activeThemes.forEach((node) => {
        expandedThemes.add(node);
        visibleLawLabelThemes.add(node);
        node.pinned = true;
      });
      focusNodes = new Set([...activeThemes, ...selectedLaws]);
      focusEdges = new Set(edges.filter((edge) => focusNodes.has(edge.source) && focusNodes.has(edge.target)
        && (edge.kind !== "theme" || selectedSet.has(edge.target))
        && (!["themes", "norms"].includes(mode) || edge.kind === "theme")));
      collectionBaseNodes = new Set(focusNodes);
      collectionBaseEdges = new Set(focusEdges);

      let arrangedHeight = 360;
      if (mode === "shared") {
        /* Cada identidade compartilhada ocupa uma única faixa horizontal.
           Assim, as duas pontas da linha verde sempre exibem o mesmo ato e a
           ligação chega diretamente às bolinhas correspondentes. */
        const identities = [...new Set(selectedLaws.map((node) => node.identity))];
        const rowByIdentity = new Map(identities.map((identity, index) => [identity, 78 + index * 36]));
        const columnWidth = world.width / Math.max(activeThemes.length, 1);
        activeThemes.forEach((themeNode, index) => {
          const centerX = columnWidth * index + columnWidth / 2;
          const columnAdjustment = themeNode.theme.slug === "planejamento-energetico"
            ? 8
            : themeNode.theme.slug === "licenciamento-ambiental"
              ? 26
              : 0;
          const adjustedCenterX = centerX + columnAdjustment;
          const groupLaws = selectedLaws.filter((node) => node.themeNode === themeNode);
          const ys = groupLaws.map((node) => rowByIdentity.get(node.identity));
          themeNode.x = adjustedCenterX - Math.min(24, columnWidth * .18);
          themeNode.y = 34;
          themeNode.clusterBounds = {
            left: index * columnWidth + 4,
            right: (index + 1) * columnWidth - 4,
            top: 18,
            bottom: Math.max(96, ...ys) + 24,
          };
          groupLaws.forEach((lawNode) => {
            lawNode.focusX = adjustedCenterX + Math.min(10, columnWidth * .08);
            lawNode.focusY = rowByIdentity.get(lawNode.identity);
            lawNode.focusAngle = 0;
            lawNode.focusDirect = true;
            lawNode.vx = 0;
            lawNode.vy = 0;
          });
        });
        arrangedHeight = Math.max(360, 118 + identities.length * 36);
      } else {
        /* Demais coleções mantêm blocos balanceados por macrotema. */
        const columns = mode === "instruments" && activeThemes.length === 1
          ? 1
          : mode === "norms" || mode === "instruments" ? 2 : 4;
        const columnWidth = world.width / columns;
        const columnBottoms = Array(columns).fill(36);
        activeThemes
          .map((themeNode) => ({ themeNode, laws: selectedLaws.filter((node) => node.themeNode === themeNode) }))
          .sort((first, second) => second.laws.length - first.laws.length)
          .forEach(({ themeNode, laws: groupLaws }) => {
            const blockHeight = 48 + groupLaws.length * 24;
            const column = columnBottoms.indexOf(Math.min(...columnBottoms));
            const singleInstrumentColumn = mode === "instruments" && activeThemes.length === 1;
            const centerX = singleInstrumentColumn ? world.width * .32 : columnWidth * column + columnWidth / 2;
            const top = singleInstrumentColumn ? 78 : columnBottoms[column];
            themeNode.x = centerX - Math.min(54, columnWidth * .28);
            themeNode.y = top + (singleInstrumentColumn ? 18 : 14);
            themeNode.clusterBounds = { left: column * columnWidth + 8, right: (column + 1) * columnWidth - 8, top, bottom: top + blockHeight };
            groupLaws.forEach((lawNode, index) => {
              lawNode.focusX = centerX - 18;
              lawNode.focusY = top + (singleInstrumentColumn ? 58 : 46) + index * 24;
              lawNode.focusAngle = 0;
              lawNode.focusDirect = true;
              lawNode.vx = 0;
              lawNode.vy = 0;
            });
            columnBottoms[column] = top + blockHeight + 18;
          });
        arrangedHeight = Math.max(360, Math.max(...columnBottoms) + 18);
      }

      world.height = arrangedHeight;
      if (mode === "instruments" && activeThemes.length === 1) view.scale = 1.12;
      const collectionMinimum = mode === "instruments" ? 560 : mode === "shared" ? 640 : 720;
      setScrollablePageHeight(world.height, collectionMinimum);

      const uniqueLawCount = new Set(lawNodes.map((node) => node.identity)).size;
      const repeatedOccurrences = Math.max(0, laws.length - uniqueLawCount);
      const consolidationCount = new Set(
        lawNodes.filter((node) => isSectorInstrument(node.law)).map((node) => node.identity)
      ).size;
      const descriptions = {
        themes: ["Temas e registros", `${activeThemes.length} temas com seus atos vinculados`],
        norms: [`${uniqueLawCount} normas distintas`, `Os ${laws.length} registros contabilizam ${repeatedOccurrences} ocorrências repetidas entre temas; esta visão apresenta cada norma uma única vez, sem conexões.`],
        instruments: ["Instrumentos setoriais", `${consolidationCount} instrumentos e seus temas relacionados`],
        shared: ["Atos compartilhados", `${sharedGroups.length} atos e as conexões entre seus temas`],
      };
      const [title, subtitle] = descriptions[mode] || ["Acervo", "Registros organizados por tema"];
      const instructions = {
        themes: "Clique em um tema para mostrar ou recolher suas conexões compartilhadas. Clique em uma norma para abrir a fonte oficial.",
        norms: "Cada norma aparece uma única vez e sem conexões. Passe o cursor para identificar o tema e clique na norma para abrir a fonte oficial.",
        instruments: "Os instrumentos estão agrupados pelos temas relacionados. Clique em um instrumento para abrir a fonte oficial.",
        shared: "As linhas verdes unem ocorrências do mesmo ato em temas diferentes. Clique em um ato para abrir a fonte oficial.",
      };
      renderDetail(title, subtitle, instructions[mode] || "Passe o cursor para consultar a relação e clique em um registro para abrir sua fonte.");
      syncGestureState(`colecao-${mode}`);
      /* A coleção pode exigir uma densidade de canvas diferente. Recalcule
         imediatamente para que a nitidez não dependa de redimensionar a janela. */
      resize();
      root.dispatchEvent(new CustomEvent("braincollectionchange", { detail: { mode } }));
      heat = Math.max(heat, .72);
    }

    function resize() {
      const bounds = canvas.getBoundingClientRect();
      const deviceScale = window.devicePixelRatio || 1;
      pixelRatio = pageMode && collectionView === "instruments"
        ? Math.min(Math.max(deviceScale * 1.5, 3), 4)
        : Math.min(deviceScale, 2);
      canvasWidth = Math.max(1, bounds.width);
      canvasHeight = Math.max(1, bounds.height);
      /* No mapa em página própria, a faixa superior fica reservada para os
         controles. O conteúdo é dimensionado dentro da área restante, sem
         empurrar os últimos atos para a legenda. */
      graphTopInset = pageMode ? 74 : 0;
      graphBottomInset = pageMode ? 22 : 0;
      graphViewportHeight = Math.max(1, canvasHeight - graphTopInset - graphBottomInset);
      canvas.width = Math.round(canvasWidth * pixelRatio);
      canvas.height = Math.round(canvasHeight * pixelRatio);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      baseScale = Math.min(canvasWidth / world.width, graphViewportHeight / world.height) * .98;
      draw(performance.now());
      if (sharedPopupNode && !sharedPopup.hidden) positionSharedPopup(sharedPopupNode);
    }

    function pageGraphOffset() {
      return {
        x: pageMode
          ? collectionView === "instruments"
            ? Math.min(220, canvasWidth * .105)
            : collectionView === "shared"
              ? Math.min(100, canvasWidth * .048)
            : Math.min(18, canvasWidth * .009)
          : 0,
        y: pageMode
          ? collectionView === "instruments"
            ? 0
            : collectionView === "shared"
              ? Math.min(48, canvasHeight * .04)
            : Math.min(112, canvasHeight * .085)
          : 0,
      };
    }

    function worldToScreen(node) {
      const x = node.x - world.width / 2;
      const y = node.y - world.height / 2;
      const cosine = Math.cos(view.rotation);
      const sine = Math.sin(view.rotation);
      const offset = pageGraphOffset();
      return {
        x: canvasWidth / 2 + (x * cosine - y * sine) * baseScale * view.scale - offset.x,
        y: graphTopInset + graphViewportHeight / 2 + (x * sine + y * cosine) * baseScale * view.scale - offset.y,
      };
    }

    function screenToWorld(clientX, clientY) {
      const bounds = canvas.getBoundingClientRect();
      const offset = pageGraphOffset();
      const x = (clientX - bounds.left - canvasWidth / 2 + offset.x) / (baseScale * view.scale);
      const y = (clientY - bounds.top - graphTopInset - graphViewportHeight / 2 + offset.y) / (baseScale * view.scale);
      const cosine = Math.cos(-view.rotation);
      const sine = Math.sin(-view.rotation);
      return {
        x: world.width / 2 + x * cosine - y * sine,
        y: world.height / 2 + x * sine + y * cosine,
      };
    }

    function graphTransform() {
      const offset = pageGraphOffset();
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.translate(canvasWidth / 2 - offset.x, graphTopInset + graphViewportHeight / 2 - offset.y);
      context.scale(baseScale * view.scale, baseScale * view.scale);
      context.rotate(view.rotation);
      context.translate(-world.width / 2, -world.height / 2);
    }

    function drawEdge(edge, time) {
      const hasFocus = focusNodes.size > 0;
      const active = focusEdges.has(edge);
      if (pageMode && !pageOverviewPristine && (!hasFocus || !active)) return;
      const dimmed = hasFocus && !active;
      if (collectionView) {
        const highlightedShared = collectionView === "shared" && hovered?.kind === "law"
          && edge.target?.identity === hovered.identity;
        const pulse = highlightedShared ? (Math.sin(time / 180) + 1) / 2 : 0;
        context.beginPath();
        context.moveTo(edge.source.x, edge.source.y);
        const elbowY = edge.kind === "theme" ? edge.target.y : (edge.source.y + edge.target.y) / 2;
        context.lineTo(edge.source.x, elbowY);
        context.lineTo(edge.target.x, elbowY);
        context.lineTo(edge.target.x, edge.target.y);
        context.setLineDash([]);
        context.strokeStyle = edge.kind === "shared"
          ? `rgba(22,143,104,${highlightedShared ? .78 + pulse * .22 : .68})`
          : "rgba(40,103,166,.48)";
        context.lineWidth = edge.kind === "shared" ? (highlightedShared ? 2 + pulse * .7 : 1.45) : 1.05;
        context.shadowColor = highlightedShared ? GRAPH_COLORS.shared : "transparent";
        context.shadowBlur = highlightedShared ? 8 + pulse * 8 : 0;
        context.stroke();
        return;
      }
      context.beginPath();
      context.moveTo(edge.source.x, edge.source.y);
      context.lineTo(edge.target.x, edge.target.y);
      if (edge.kind === "shared") {
        context.setLineDash([3, 5]);
        context.strokeStyle = dimmed ? (lockedFocus ? "rgba(8,40,83,.004)" : "rgba(8,40,83,.025)") : active ? "rgba(22,143,104,.98)" : "rgba(22,143,104,.64)";
        context.lineWidth = active ? 1.8 : 1.05;
        context.shadowColor = GRAPH_COLORS.shared;
        context.shadowBlur = active ? 13 : 5;
      } else {
        context.setLineDash(active ? [2, 3.5] : []);
        context.strokeStyle = dimmed ? (lockedFocus ? "rgba(8,40,83,.004)" : "rgba(8,40,83,.025)") : active ? GRAPH_COLORS.active : "rgba(83,135,177,.54)";
        context.lineWidth = active ? 1.55 : .75;
        context.shadowColor = active ? GRAPH_COLORS.active : "transparent";
        context.shadowBlur = active ? 10 : 0;
      }
      context.stroke();
      context.setLineDash([]);
      context.shadowBlur = 0;

      if (reducedMotion || dimmed || (edge.kind !== "shared" && !active && edges.indexOf(edge) % 4 !== 0)) return;
      const speed = edge.kind === "shared" ? .00016 : .00011;
      const cycle = (time * speed + edge.phase) % 2;
      const progress = cycle <= 1 ? cycle : 2 - cycle;
      const particleProgresses = edge.kind === "shared" || active ? [progress, 1 - progress] : [progress];
      particleProgresses.forEach((particleProgress) => {
        const x = edge.source.x + (edge.target.x - edge.source.x) * particleProgress;
        const y = edge.source.y + (edge.target.y - edge.source.y) * particleProgress;
        context.beginPath();
        context.arc(x, y, edge.kind === "shared" ? 1.9 : 1.45, 0, Math.PI * 2);
        context.fillStyle = edge.kind === "shared" ? GRAPH_COLORS.shared : active ? GRAPH_COLORS.active : "#4b95c7";
        context.shadowColor = context.fillStyle;
        context.shadowBlur = active ? 13 : 10;
        context.fill();
        context.shadowBlur = 0;
      });
    }

    function drawNode(node) {
      const hasFocus = focusNodes.size > 0;
      const active = focusNodes.has(node);
      if (collectionView && node.kind === "theme" && !active) return;
      if (pageMode && !pageOverviewPristine && node.kind !== "theme" && (!hasFocus || !active)) return;
      const dimmed = hasFocus && !active;
      const radius = displayRadius(node) + (node === hovered || (lockedFocus && active) ? (node.kind === "theme" ? 2 : 1.5) : 0);
      context.globalAlpha = dimmed
        ? (node.kind === "theme" ? (directSelection ? .48 : lockedFocus ? .18 : .3) : (lockedFocus ? .012 : .07))
        : 1;
      context.beginPath();
      context.arc(node.x, node.y, radius, 0, Math.PI * 2);
      if (node.kind === "theme") {
        const gradient = context.createRadialGradient(node.x - 3, node.y - 4, 1, node.x, node.y, radius + 4);
        gradient.addColorStop(0, "#ffffff");
        gradient.addColorStop(.26, node.color);
        gradient.addColorStop(1, "#063665");
        context.fillStyle = gradient;
        context.strokeStyle = "rgba(239,252,255,.9)";
        context.lineWidth = 1.2;
        context.shadowColor = node.color;
        context.shadowBlur = node === hovered || (lockedFocus && active) ? 22 : 13;
      } else {
        const showAsShared = node.shared;
        context.fillStyle = showAsShared ? GRAPH_COLORS.shared : node.color;
        context.strokeStyle = showAsShared ? "#d9fff0" : "#e6f7ff";
        context.lineWidth = showAsShared ? 1.25 : .65;
        context.shadowColor = showAsShared ? GRAPH_COLORS.shared : node.color;
        context.shadowBlur = showAsShared || (lockedFocus && active) ? 12 : node === hovered ? 13 : 5;
      }
      context.fill();
      context.stroke();
      context.shadowBlur = 0;
      context.globalAlpha = 1;
    }

    function drawThemeLabels() {
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const featuredInstrumentCollection = collectionView === "instruments" && expandedThemes.size === 1;
      const sharedCollection = pageMode && collectionView === "shared";
      const alignedSharedHeadings = sharedCollection && canvasWidth >= 900;
      context.font = `${featuredInstrumentCollection ? "700 17px" : sharedCollection ? "700 11px" : pageMode ? "700 11.5px" : "700 10.5px"} "Plus Jakarta Sans", sans-serif`;
      context.textBaseline = "middle";
      const occupiedLabels = labelCollisionBounds;
      themeNodes.forEach((node) => {
        const dimmed = focusNodes.size > 0 && !focusNodes.has(node);
        if (collectionView && dimmed) return;
        const interactionTheme = hoverFocus
          ? (hoverFocus.kind === "theme" ? hoverFocus : hoverFocus.themeNode)
          : lockedFocus;
        const hasThemeInteraction = separatedGestures && Boolean(interactionTheme)
          && !(pageMode && pageOverviewPristine)
          && (Boolean(hoverFocus) || expandedThemes.size > 0 || connectedThemes.size > 0);
        if (hasThemeInteraction && node !== interactionTheme && !focusNodes.has(node)) return;
        if (dimmed && !directSelection && !separatedGestures) return;
        const position = worldToScreen(node);
        const collectionThemeList = collectionView === "themes";
        const homeOverviewPlacement = homeMode && !expandedThemes.size && !collectionView
          ? {
              "arquitetura-institucional": "above",
              "direito-do-consumidor": "above",
              "inclusao-energetica": "right",
            }[node.theme.slug]
          : "";
        const direction = collectionThemeList ? 1 : homeOverviewPlacement === "right" ? 1 : position.x < 125 ? 1 : position.x > canvasWidth - 125 ? -1 : position.x < canvasWidth / 2 ? -1 : 1;
        const nearVertical = !homeOverviewPlacement && !collectionThemeList && Math.abs(position.x - canvasWidth / 2) < 55;
        const isLockedTheme = expandedThemes.has(node);
        const homeOpenTheme = homeMode && isLockedTheme && !connectedThemes.has(node);
        const centeredAbove = homeOverviewPlacement === "above";
        const homeConsumerTitle = homeMode && !expandedThemes.size && !collectionView && node.theme.slug === "direito-do-consumidor";
        const openLabelDirection = node.layoutDirection === "left" ? 1 : -1;
        context.textAlign = homeOpenTheme
          ? (openLabelDirection < 0 ? "right" : "left")
          : isLockedTheme || nearVertical || centeredAbove ? "center" : direction < 0 ? "right" : "left";
        const screenRadius = displayRadius(node) * baseScale * view.scale;
        const labelGap = screenRadius + (pageMode ? 10 : 6);
        const aboveClearance = featuredInstrumentCollection ? 18 : pageMode ? 5 : homeConsumerTitle ? 4 : 4;
        let labelX = homeOpenTheme
          ? position.x + openLabelDirection * labelGap
          : position.x + (isLockedTheme || nearVertical || centeredAbove ? 0 : direction * labelGap);
        if (homeConsumerTitle) labelX += 30;
        let labelY = homeOpenTheme
          ? position.y
          : isLockedTheme || centeredAbove
            ? position.y - labelGap - aboveClearance
            : position.y + (nearVertical ? (position.y < canvasHeight / 2 ? -labelGap - aboveClearance : labelGap) : 0);
        const width = context.measureText(node.shortName).width;
        const pad = 5;
        const labelHalfHeight = featuredInstrumentCollection ? 11 : 8;
        const backgroundX = context.textAlign === "center" ? labelX - width / 2 - pad : context.textAlign === "right" ? labelX - width - pad : labelX - pad;
        const verticalStep = alignedSharedHeadings || homeConsumerTitle ? -18 : position.y < canvasHeight / 2 ? 18 : -18;
        let attempts = 0;
        let bounds = { left: backgroundX, right: backgroundX + width + pad * 2, top: labelY - labelHalfHeight, bottom: labelY + labelHalfHeight };
        while (!alignedSharedHeadings && !homeConsumerTitle && attempts < 4 && occupiedLabels.some((item) => bounds.left < item.right + 3 && bounds.right > item.left - 3 && bounds.top < item.bottom + 3 && bounds.bottom > item.top - 3)) {
          labelY = clamp(labelY + verticalStep, 10, canvasHeight - 10);
          bounds = { left: backgroundX, right: backgroundX + width + pad * 2, top: labelY - labelHalfHeight, bottom: labelY + labelHalfHeight };
          attempts += 1;
        }
        occupiedLabels.push(bounds);
        themeLabelHitboxes.push({ node, ...bounds });
        context.globalAlpha = dimmed ? .56 : 1;
        if (!pageMode) {
          context.fillStyle = "rgba(5,28,62,.8)";
          context.fillRect(backgroundX, labelY - 8, width + pad * 2, 16);
        }
        context.fillStyle = pageMode ? (node === hovered ? "#0b4a92" : "#173d67") : (node === hovered ? "#ffffff" : "rgba(235,249,255,.9)");
        context.shadowColor = pageMode ? "rgba(255,255,255,.98)" : node.color;
        context.shadowBlur = pageMode ? 4 : node === hovered ? 8 : 0;
        context.fillText(node.shortName, labelX, labelY);
        context.shadowBlur = 0;
        context.globalAlpha = 1;
      });
    }

    function lawNumberLabel(node) {
      const type = normalise(node.law.type);
      const prefixes = {
        "lei": "Lei n.",
        "decreto": "Dec. n.",
        "resolucao normativa": "REN n.",
        "resolucao conjunta": "Res. Conj. n.",
        "ato normativo": "Ato n.",
        "portaria": "Port. n.",
        "portaria conjunta": "Port. Conj. n.",
        "instrucao normativa": "IN n.",
        "instrumento setorial": "Inst. set.",
      };
      const number = String(node.law.number || "").replace(/^n[º°o]?\.?\s*/i, "").trim();
      if (number && number !== "-") return `${prefixes[type] || `${node.law.type} n.`} ${number}`;
      const acronym = String(node.law.name || "").split("-")[0].trim();
      return acronym ? acronym.slice(0, 18) : node.law.type;
    }

    function drawFocusedLawLabels() {
      if (!expandedThemes.size) return;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      const featuredInstrumentCollection = collectionView === "instruments" && expandedThemes.size === 1;
      const sharedLawCollection = pageMode && collectionView === "shared";
      context.font = `${featuredInstrumentCollection ? "700 13px" : sharedLawCollection ? "700 9.5px" : pageMode ? "700 10.5px" : "700 8.5px"} "Plus Jakarta Sans", sans-serif`;
      context.textBaseline = "middle";
      const occupiedLawLabels = [...labelCollisionBounds];
      const labelThemes = [...visibleLawLabelThemes]
        .filter((themeNode) => expandedThemes.has(themeNode))
        .sort((first, second) => Number(second === lockedFocus) - Number(first === lockedFocus));
      const labelThemeSet = new Set(labelThemes);
      /* Cada agrupamento arrastado conserva seus rótulos. A lista de colisões
         é compartilhada entre todos eles para deslocar caixas concorrentes. */
      lawNodes
        .filter((node) => focusNodes.has(node) && labelThemeSet.has(node.themeNode))
        .sort((first, second) => Number(second.themeNode === lockedFocus) - Number(first.themeNode === lockedFocus))
        .forEach((node) => {
          const position = worldToScreen(node);
          const label = lawNumberLabel(node);
          const width = context.measureText(label).width;
          const angle = Number.isFinite(node.focusAngle) ? node.focusAngle + view.rotation : -Math.PI / 2;
          let horizontal = Math.cos(angle);
          let vertical = Math.sin(angle);
          if (sharedPopupNode === node) {
            horizontal = sharedPopupSide === "right" ? -1 : 1;
            vertical = 0;
          }
          context.textAlign = Math.abs(horizontal) < .2 ? "center" : horizontal > 0 ? "left" : "right";
          const labelOffset = featuredInstrumentCollection ? 14 : pageMode ? 12 : 11;
          const labelHeight = featuredInstrumentCollection ? 18 : pageMode ? 16 : 14;
          const labelHalfHeight = labelHeight / 2;
          const labelX = position.x + horizontal * labelOffset;
          const baseLabelY = position.y + vertical * labelOffset;
          let labelY = baseLabelY;
          const backgroundX = context.textAlign === "center" ? labelX - width / 2 - 3 : context.textAlign === "right" ? labelX - width - 3 : labelX - 3;
          let attempts = 0;
          let bounds = { left: backgroundX, right: backgroundX + width + 6, top: labelY - labelHalfHeight, bottom: labelY + labelHalfHeight };
          while (!homeMode && collectionView !== "shared" && attempts < 28 && occupiedLawLabels.some((item) => bounds.left < item.right + 2 && bounds.right > item.left - 2 && bounds.top < item.bottom + 2 && bounds.bottom > item.top - 2)) {
            attempts += 1;
            const band = Math.ceil(attempts / 2);
            const direction = attempts % 2 ? 1 : -1;
            labelY = clamp(baseLabelY + direction * band * 15, 8, canvasHeight - 8);
            bounds = { left: backgroundX, right: backgroundX + width + 6, top: labelY - labelHalfHeight, bottom: labelY + labelHalfHeight };
          }
          occupiedLawLabels.push(bounds);
          lawLabelHitboxes.push({ node, ...bounds });
          context.fillStyle = "rgba(46,91,137,.9)";
          context.fillRect(backgroundX, labelY - labelHalfHeight, width + 6, labelHeight);
          context.fillStyle = "#f1fbff";
          context.fillText(label, labelX, labelY);
        });
    }

    function drawHoveredSharedLabel() {
      if (!hovered || hovered.kind !== "law" || expandedThemes.has(hovered.themeNode)) return;
      const position = worldToScreen(hovered);
      const label = lawNumberLabel(hovered);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.font = '700 9px "Plus Jakarta Sans", sans-serif';
      context.textBaseline = "middle";
      const width = context.measureText(label).width;
      /* Com o balão aberto, o identificador curto permanece no lado oposto.
         Assim os dois elementos nunca disputam a mesma área visual. */
      const placeLeft = sharedPopupNode === hovered
        ? sharedPopupSide === "right"
        : position.x > canvasWidth - width - 28;
      context.textAlign = placeLeft ? "right" : "left";
      const labelX = position.x + (placeLeft ? -11 : 11);
      const labelY = clamp(position.y - 10, 8, canvasHeight - 8);
      const backgroundX = placeLeft ? labelX - width - 4 : labelX - 4;
      lawLabelHitboxes.push({ node: hovered, left: backgroundX, right: backgroundX + width + 8, top: labelY - 7, bottom: labelY + 7 });
      context.fillStyle = "rgba(46,91,137,.94)";
      context.fillRect(backgroundX, labelY - 7, width + 8, 14);
      context.fillStyle = "#f4fcff";
      context.fillText(label, labelX, labelY);
    }

    function draw(time) {
      if (!canvasWidth || !canvasHeight) return;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, canvas.width, canvas.height);
      graphTransform();
      edges.forEach((edge) => drawEdge(edge, time));
      lawNodes.forEach(drawNode);
      themeNodes.forEach(drawNode);
      labelCollisionBounds = [];
      themeLabelHitboxes = [];
      lawLabelHitboxes = [];
      drawThemeLabels();
      drawFocusedLawLabels();
      drawHoveredSharedLabel();
      /* O painel é posicionado na entrada do hover e só volta a ser medido
         quando o canvas muda de tamanho. */
    }

    function settleExpandedLaws() {
      lawNodes.forEach((node) => {
        if (!expandedThemes.has(node.themeNode) || !Number.isFinite(node.focusX) || !Number.isFinite(node.focusY)) return;
        const deltaX = node.focusX - node.x;
        const deltaY = node.focusY - node.y;
        if (Math.abs(deltaX) < .04 && Math.abs(deltaY) < .04) {
          node.x = node.focusX;
          node.y = node.focusY;
        } else {
          node.x += deltaX * .18;
          node.y += deltaY * .18;
        }
        node.vx = 0;
        node.vy = 0;
      });
    }

    function simulate() {
      if (draggedNode) return;
      settleExpandedLaws();
      if (heat < .012) {
        if (returningToInitial) {
          nodes.forEach((node) => {
            node.x = homeMode && Number.isFinite(node.resetX) ? node.resetX : node.anchorX;
            node.y = homeMode && Number.isFinite(node.resetY) ? node.resetY : node.anchorY;
            node.vx = 0;
            node.vy = 0;
          });
          returningToInitial = false;
        }
        return;
      }
      for (let first = 0; first < nodes.length; first += 1) {
        for (let second = first + 1; second < nodes.length; second += 1) {
          const a = nodes[first];
          const b = nodes[second];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let distanceSquared = dx * dx + dy * dy;
          if (distanceSquared < .5) { dx = .7; dy = -.7; distanceSquared = 1; }
          if (distanceSquared > 4600) continue;
          const distance = Math.sqrt(distanceSquared);
          const strength = ((a.kind === "theme" || b.kind === "theme") ? 25 : 9) * heat / distanceSquared;
          const forceX = (dx / distance) * strength;
          const forceY = (dy / distance) * strength;
          a.vx -= forceX / a.mass;
          a.vy -= forceY / a.mass;
          b.vx += forceX / b.mass;
          b.vy += forceY / b.mass;
        }
      }

      edges.forEach((edge) => {
        if (expandedThemes.has(edge.source) && edge.kind === "theme" && Number.isFinite(edge.target.focusX)) return;
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const pull = (distance - edge.length) * (edge.kind === "shared" ? .0018 : .0055) * heat;
        const forceX = (dx / distance) * pull;
        const forceY = (dy / distance) * pull;
        edge.source.vx += forceX / edge.source.mass;
        edge.source.vy += forceY / edge.source.mass;
        edge.target.vx -= forceX / edge.target.mass;
        edge.target.vy -= forceY / edge.target.mass;
      });

      themeNodes.forEach((node) => {
        if (node.pinned) return;
        const targetX = returningToInitial && homeMode && Number.isFinite(node.resetX) ? node.resetX : node.anchorX;
        const targetY = returningToInitial && homeMode && Number.isFinite(node.resetY) ? node.resetY : node.anchorY;
        const returnStrength = returningToInitial ? .0058 : .0065;
        node.vx += (targetX - node.x) * returnStrength * heat;
        node.vy += (targetY - node.y) * returnStrength * heat;
      });

      if (returningToInitial) {
        lawNodes.forEach((node) => {
          if (node.pinned) return;
          const targetX = homeMode && Number.isFinite(node.resetX) ? node.resetX : node.anchorX;
          const targetY = homeMode && Number.isFinite(node.resetY) ? node.resetY : node.anchorY;
          node.vx += (targetX - node.x) * .002 * heat;
          node.vy += (targetY - node.y) * .002 * heat;
        });
      }

      nodes.forEach((node) => {
        if (node.pinned) { node.vx = 0; node.vy = 0; return; }
        if (expandedThemes.size && Number.isFinite(node.focusX) && Number.isFinite(node.focusY)) {
          node.vx = 0;
          node.vy = 0;
          return;
        }
        node.vx += (world.width / 2 - node.x) * .00007 * heat;
        node.vy += (world.height / 2 - node.y) * .00007 * heat;
        const damping = returningToInitial ? .91 : .89;
        node.vx *= damping;
        node.vy *= damping;
        node.x = clamp(node.x + node.vx, 34, world.width - 34);
        node.y = clamp(node.y + node.vy, 34, world.height - 34);
      });
      heat *= reducedMotion ? .91 : returningToInitial ? .989 : .988;
    }

    function frame(time) {
      if (destroyed) return;
      if (!updateResetTransition(time)) simulate();
      draw(time);
      requestAnimationFrame(frame);
    }

    function hitTest(clientX, clientY) {
      const bounds = canvas.getBoundingClientRect();
      const screenX = clientX - bounds.left;
      const screenY = clientY - bounds.top;
      for (let index = themeLabelHitboxes.length - 1; index >= 0; index -= 1) {
        const label = themeLabelHitboxes[index];
        if (screenX >= label.left && screenX <= label.right && screenY >= label.top && screenY <= label.bottom) return label.node;
      }
      for (let index = lawLabelHitboxes.length - 1; index >= 0; index -= 1) {
        const label = lawLabelHitboxes[index];
        if (screenX >= label.left && screenX <= label.right && screenY >= label.top && screenY <= label.bottom) return label.node;
      }
      const point = screenToWorld(clientX, clientY);
      let result = null;
      let bestDistance = Infinity;
      for (let index = nodes.length - 1; index >= 0; index -= 1) {
        const node = nodes[index];
        if (expandedThemes.size && !focusNodes.has(node) && node.kind !== "theme") continue;
        const distance = Math.hypot(point.x - node.x, point.y - node.y);
        const hitRadius = Math.max(displayRadius(node) + 5, 8 / (baseScale * view.scale));
        if (distance <= hitRadius && distance < bestDistance) { result = node; bestDistance = distance; }
      }
      return result;
    }

    function showTooltip(node) {
      if (!node || node.kind !== "law") hideSharedPopup();
      if (!node) {
        if ((expandedThemes.size || connectedThemes.size) && lockedFocus) showLockedDetails(lockedFocus);
        else showDefaultDetails();
        return;
      }
      if (node.kind === "theme") {
        if (collectionView) {
          showCollectionThemeDetails(node);
          return;
        }
        if (separatedGestures) {
          const singleClickAction = expandedThemes.has(node)
            ? `Clique para ${visibleLawLabelThemes.has(node) ? "recolher" : "mostrar"} os nomes`
            : "Clique para abrir as normas";
          renderDetail(
            node.theme.name,
            `${node.count} ${node.count === 1 ? "norma vinculada" : "normas vinculadas"}`,
            `${singleClickAction} · clique duas vezes para ${connectedThemes.has(node) ? "recolher" : "mostrar"} conexões.`
          );
          return;
        }
        if (expandedThemes.has(node)) {
          showLockedDetails(node);
          return;
        }
        if (expandedThemes.size && !directSelection) {
          renderDetail(
            node.theme.name,
            `${node.count} ${node.count === 1 ? "norma vinculada" : "normas vinculadas"}`,
            "Clique ou arraste para acrescentar este tema sem desfazer a organização atual."
          );
          return;
        }
        renderDetail(
          node.theme.name,
          `${node.count} ${node.count === 1 ? "norma vinculada" : "normas vinculadas"}`,
          "Clique para abrir as normas diretas; clique novamente para recolher seus nomes."
        );
      } else {
        const showAsShared = node.shared;
        renderDetail(
          node.law.name,
          `${node.law.type} ${node.law.number}`.trim(),
          showAsShared ? "Ato presente em mais de um tema · clique para abrir a fonte oficial." : "Clique para abrir a fonte oficial desta norma."
        );
        showSharedPopup(node);
      }
    }

    function activate(node) {
      if (!node) return;
      if (node.kind === "theme") {
        if (separatedGestures) {
          togglePageTheme(node);
          return;
        }
        if (directSelection && expandedThemes.has(node)) {
          directSelection = node;
          lockedFocus = node;
          if (visibleLawLabelThemes.has(node)) collapseDirectTheme(node);
          else expandDirectTheme(node);
        } else if (directSelection) {
          selectThemeDirect(node);
        } else if (expandedThemes.has(node)) toggleDraggedThemeLabels(node);
        else if (expandedThemes.size && !directSelection) lockTheme(node);
        else selectThemeDirect(node);
      } else if (node.law.url) {
        window.open(node.law.url, "_blank", "noopener,noreferrer");
      } else if (typeof onLawClick === "function") {
        onLawClick(node.law);
      }
    }

    canvas.addEventListener("pointerdown", (event) => {
      clearHoverDelay();
      pointer = event.pointerId;
      lastPointer = { x: event.clientX, y: event.clientY };
      dragOrigin = { x: event.clientX, y: event.clientY };
      draggedNode = hitTest(event.clientX, event.clientY);
      rotating = !draggedNode && !pageMode;
      if (!separatedGestures && !draggedNode && expandedThemes.size && !dragWorkspaceActive) resetFocus();
      else if (!draggedNode && hoverFocus) setHoverFocus(null);
      moved = false;
      canvas.classList.add("is-dragging");
      canvas.setPointerCapture(pointer);
    });

    canvas.addEventListener("pointermove", (event) => {
      if (pointer === event.pointerId && lastPointer) {
        const deltaX = event.clientX - lastPointer.x;
        const deltaY = event.clientY - lastPointer.y;
        if (dragOrigin && Math.hypot(event.clientX - dragOrigin.x, event.clientY - dragOrigin.y) > 6) moved = true;
        if (draggedNode && moved && !pageMode) {
          const point = screenToWorld(event.clientX, event.clientY);
          draggedNode.x = clamp(point.x, 28, world.width - 28);
          draggedNode.y = clamp(point.y, 28, world.height - 28);
          draggedNode.vx = 0;
          draggedNode.vy = 0;
          if (!(separatedGestures && draggedNode.kind === "theme")) heat = Math.max(heat, .28);
          if (moved) dragWorkspaceActive = true;
          if (draggedNode.kind === "theme" && moved && separatedGestures) {
            draggedNode.pinned = true;
            positionedThemes.add(draggedNode);
          } else if (draggedNode.kind === "theme" && moved) lockTheme(draggedNode);
          else if (draggedNode.kind === "law" && moved) draggedNode.pinned = true;
          else if (!expandedThemes.size) { setHoverFocus(draggedNode); showTooltip(draggedNode); }
          else showTooltip(draggedNode);
        } else if (rotating && moved) {
          view.rotation += deltaX * (workspaceMode ? .0055 : .008) + deltaY * .002;
          if (workspaceMode) {
            tiltX = clamp(tiltX - deltaY * .12, -9, 9);
            tiltY = clamp(tiltY + deltaX * .12, -12, 12);
            root.style.setProperty("--brain-tilt-x", `${tiltX}deg`);
            root.style.setProperty("--brain-tilt-y", `${tiltY}deg`);
            root.classList.remove("is-settling");
            root.classList.add("is-tilting");
          }
          showTooltip(null);
        }
        lastPointer = { x: event.clientX, y: event.clientY };
        return;
      }
      const next = hitTest(event.clientX, event.clientY);
      if (next !== hovered) {
        if (next !== suppressHoverUntilLeave) suppressHoverUntilLeave = null;
        hovered = next;
        if (next) {
          if (separatedGestures && next.kind === "theme") requestHoverFocus(next);
          else if (!expandedThemes.size && (!hoverFocus || !focusNodes.has(next))) requestHoverFocus(next);
          showTooltip(next);
        } else {
          hideSharedPopup();
          requestHoverFocus(null);
          showTooltip(null);
        }
      } else if (next?.kind === "law") {
        /* Outros ajustes de foco podem redesenhar o mapa sem que o alvo sob o
           cursor mude. Reafirmar o balão aqui evita que ele desapareça enquanto
           o usuário continua sobre uma bolinha azul ou verde. */
        showSharedPopup(next);
      }
      canvas.style.cursor = hovered ? "pointer" : "grab";
    });

    function release(event) {
      if (pointer !== event.pointerId) return;
      const selected = draggedNode;
      if (!moved && selected) {
        if (!(separatedGestures && selected.kind === "theme")) activate(selected);
      }
      if (moved && selected?.kind === "theme" && !pageMode) {
        dragWorkspaceActive = true;
        if (pageMode && pageOverviewPristine && !expandedThemes.size && !connectedThemes.size && !collectionView) {
          selected.pinned = true;
          positionedThemes.add(selected);
          focusNodes = new Set();
          focusEdges = new Set();
          showDefaultDetails();
          syncGestureState("macrotema-posicionado");
        } else if (separatedGestures) openPageTheme(selected, true);
        else lockTheme(selected);
      }
      if (moved && selected?.kind === "law" && !pageMode) {
        dragWorkspaceActive = true;
        selected.pinned = true;
      }
      if (workspaceMode && rotating) {
        window.clearTimeout(tiltSettleTimer);
        root.classList.remove("is-tilting");
        root.classList.add("is-settling");
        tiltX = 0;
        tiltY = 0;
        root.style.setProperty("--brain-tilt-x", "0deg");
        root.style.setProperty("--brain-tilt-y", "0deg");
        tiltSettleTimer = window.setTimeout(() => root.classList.remove("is-settling"), 460);
      }
      pointer = null;
      draggedNode = null;
      rotating = false;
      lastPointer = null;
      dragOrigin = null;
      canvas.classList.remove("is-dragging");
    }

    canvas.addEventListener("pointerup", release);
    canvas.addEventListener("pointercancel", release);
    function commitConnectionToggle(selected) {
      const now = performance.now();
      if (lastConnectionToggleNode === selected && now - lastConnectionToggleTime < 180) return;
      lastConnectionToggleNode = selected;
      lastConnectionToggleTime = now;
      window.clearTimeout(clickTimer);
      clickTimer = 0;
      pendingClickTheme = null;
      togglePageConnections(selected);
    }

    canvas.addEventListener("click", (event) => {
      if (!separatedGestures) return;
      if (moved) return;
      const selected = hitTest(event.clientX, event.clientY);
      if (!selected || selected.kind !== "theme") return;
      window.clearTimeout(clickTimer);
      if (event.detail >= 2) {
        event.preventDefault();
        commitConnectionToggle(selected);
        return;
      }
      pendingClickTheme = selected;
      clickTimer = window.setTimeout(() => {
        if (pendingClickTheme) activate(pendingClickTheme);
        pendingClickTheme = null;
        clickTimer = 0;
      }, 340);
    });
    canvas.addEventListener("dblclick", (event) => {
      if (!separatedGestures) return;
      const selected = hitTest(event.clientX, event.clientY);
      if (!selected || selected.kind !== "theme") return;
      event.preventDefault();
      commitConnectionToggle(selected);
    });
    canvas.addEventListener("pointerleave", () => {
      if (pointer !== null) return;
      clearHoverDelay();
      hovered = null;
      hideSharedPopup();
      suppressHoverUntilLeave = null;
      if (hoverFocus) setHoverFocus(null);
      showTooltip(null);
    });
    canvas.addEventListener("keydown", (event) => {
      if (event.key === "+" || event.key === "=") view.scale = clamp(view.scale * 1.1, .68, 1.75);
      else if (event.key === "-") view.scale = clamp(view.scale * .9, .68, 1.75);
      else if (event.key === "ArrowLeft" && !pageMode) view.rotation -= .12;
      else if (event.key === "ArrowRight" && !pageMode) view.rotation += .12;
      else if (event.key === "Home") {
        view.scale = defaultViewScale;
        view.rotation = 0;
        resetFocus(true);
      }
      else return;
      event.preventDefault();
      showTooltip(null);
    });

    root.querySelectorAll("[data-brain-action]").forEach((button) => button.addEventListener("click", () => {
      const action = button.dataset.brainAction;
      if (action === "zoom-in") view.scale = clamp(view.scale * 1.13, .68, 1.75);
      if (action === "zoom-out") view.scale = clamp(view.scale * .88, .68, 1.75);
      if (action === "rotate") {
        view.rotation += Math.PI / 8;
        if (workspaceMode) {
          window.clearTimeout(commandTiltTimer);
          root.classList.remove("is-command-rotating");
          void root.offsetWidth;
          root.classList.add("is-command-rotating");
          commandTiltTimer = window.setTimeout(() => root.classList.remove("is-command-rotating"), 820);
        }
      }
      if (action === "reset") {
        view.scale = defaultViewScale;
        view.rotation = 0;
        resetFocus(true);
      }
      showTooltip(null);
      canvas.focus({ preventScroll: true });
    }));

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    showDefaultDetails();
    syncGestureState("visao-inicial");
    /* A Home nasce de uma simulação curta. O estado já estabilizado é a
       composição que o usuário reconhece como inicial e passa a ser também o
       destino oficial do botão de reorganização. */
    if (homeMode) {
      for (let step = 0; step < 320; step += 1) simulate();
      nodes.forEach((node) => {
        node.resetX = node.x;
        node.resetY = node.y;
        node.vx = 0;
        node.vy = 0;
      });
      heat = 0;
    }
    resize();
    requestAnimationFrame(frame);

    window.__regulatoryBrain = {
      destroy() {
        destroyed = true;
        window.clearTimeout(clickTimer);
        observer.disconnect();
        sharedPopup.remove();
      },
      nodes,
      edges,
      sharedGroups,
      resetFocus,
      setCollectionView(mode) {
        if (!["themes", "norms", "instruments", "shared"].includes(mode)) return false;
        layoutCollectionView(mode);
        return true;
      },
      focusTheme(slug) {
        const node = themeNodes.find((item) => item.theme.slug === slug);
        if (!node) return false;
        openPageTheme(node, positionedThemes.has(node));
        return true;
      },
      resetView() {
        if (collectionView) layoutCollectionView(collectionView);
        else {
          view.scale = defaultViewScale;
          view.rotation = 0;
          resetFocus();
        }
      },
      refresh() {
        resize();
      },
      getState() {
        return {
          expandedThemes: [...expandedThemes].map((node) => node.shortName),
          connectedThemes: [...connectedThemes].map((node) => node.shortName),
          positionedThemes: [...positionedThemes].map((node) => node.shortName),
        };
      },
    };
  };
}());
