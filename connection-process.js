"use strict";

const processRoutes = [...document.querySelectorAll(".connection-route")];

if (processRoutes.length) {
  const routeStates = new Map();
  const svgNamespace = "http://www.w3.org/2000/svg";

  const buildRouteLine = (route) => {
    const state = routeStates.get(route);
    const { steps, cards, paths } = state;
    if (!steps.clientWidth || !cards.length) return;
    const stepsRect = steps.getBoundingClientRect();
    const startX = 8;
    const boxes = cards.map((card) => {
      const left = card.offsetLeft;
      const top = card.offsetTop;
      return {
        left,
        right: left + card.offsetWidth,
        top,
        bottom: top + card.offsetHeight,
        y: top + card.offsetHeight / 2,
      };
    });

    boxes.forEach((box, index) => {
      let d;
      if (index === 0) {
        d = `M ${startX} 0 L ${startX} ${box.y} L ${box.left} ${box.y}`;
      } else if (index % 2 === 1) {
        const previous = boxes[index - 1];
        d = `M ${previous.right} ${previous.y} L ${box.left} ${box.y}`;
      } else {
        const previous = boxes[index - 1];
        const previousRowBottom = Math.max(boxes[index - 2].bottom, previous.bottom);
        const nextRowTop = Math.min(box.top, boxes[index + 1]?.top ?? box.top);
        const turnY = previousRowBottom + (nextRowTop - previousRowBottom) / 2;
        const outerRight = stepsRect.width - startX;
        d = `M ${previous.right} ${previous.y} L ${outerRight} ${previous.y} L ${outerRight} ${turnY} L ${startX} ${turnY} L ${startX} ${box.y} L ${box.left} ${box.y}`;
      }
      const path = paths[index];
      path.setAttribute("d", d);
      const length = path.getTotalLength();
      state.pathLengths[index] = length;
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = state.revealedCount > index ? "0" : `${length}`;
    });
  };

  processRoutes.forEach((route) => {
    const steps = route.querySelector(".connection-route__steps");
    const cards = [...steps.querySelectorAll(":scope > li")];
    const svg = document.createElementNS(svgNamespace, "svg");
    const paths = cards.map(() => {
      const path = document.createElementNS(svgNamespace, "path");
      svg.append(path);
      return path;
    });
    svg.classList.add("connection-route__process-line");
    svg.setAttribute("aria-hidden", "true");
    steps.prepend(svg);
    route.classList.add("is-process-sequence");
    routeStates.set(route, {
      steps,
      cards,
      paths,
      pathLengths: [],
      complete: false,
      revealedCount: 0,
    });
    requestAnimationFrame(() => buildRouteLine(route));
  });

  const clearRoute = (route) => {
    const state = routeStates.get(route);
    state.complete = false;
    state.revealedCount = 0;
    route.classList.remove("is-process-complete");
    state.cards.forEach((card) => card.classList.remove("is-revealed"));
    state.paths.forEach((path, index) => {
      path.style.transition = "none";
      path.style.strokeDashoffset = `${state.pathLengths[index] || 0}`;
    });
    requestAnimationFrame(() => state.paths.forEach((path) => path.style.removeProperty("transition")));
  };

  const revealThrough = (route, requestedCount) => {
    const state = routeStates.get(route);
    if (!state || state.complete) return;
    const count = Math.max(state.revealedCount, Math.min(requestedCount, state.cards.length));
    if (count === state.revealedCount) return;

    buildRouteLine(route);
    for (let index = state.revealedCount; index < count; index += 1) {
      state.paths[index].style.strokeDashoffset = "0";
      state.cards[index].classList.add("is-revealed");
    }
    state.revealedCount = count;

    if (count === state.cards.length) {
      state.complete = true;
      route.classList.add("is-process-complete");
    }
  };

  const revealCardsReachedByScroll = (route) => {
    const state = routeStates.get(route);
    if (!state || state.complete) return;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const stepsRect = state.steps.getBoundingClientRect();
    const stepsTop = stepsRect.top + window.scrollY;
    const revealPosition = window.scrollY + viewportHeight * 0.82;
    const cardCount = state.cards.length;
    const usableHeight = Math.max(
      stepsRect.height - Math.min(viewportHeight * 0.16, stepsRect.height * 0.14),
      viewportHeight * 0.62,
    );
    const cardInterval = cardCount > 1 ? usableHeight / (cardCount - 1) : usableHeight;
    const progress = revealPosition - stepsTop;
    const count = progress < 0 ? 0 : Math.min(cardCount, Math.floor(progress / cardInterval) + 1);
    revealThrough(route, count);
  };

  const processSection = processRoutes[0].closest(".connection-process");
  let replayArmed = false;
  let lastScrollY = window.scrollY;
  let scrollFrame = 0;

  const updateRoutes = () => {
    scrollFrame = 0;
    const currentScrollY = window.scrollY;
    const direction = currentScrollY - lastScrollY;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const sectionTop = processSection.getBoundingClientRect().top;

    if (direction < 0 && sectionTop >= -32) {
      replayArmed = true;
    }

    if (direction > 0) {
      if (replayArmed) {
        processRoutes.forEach(clearRoute);
        replayArmed = false;
      }
      processRoutes.forEach(revealCardsReachedByScroll);
    }

    lastScrollY = currentScrollY;
  };

  const refreshLines = () => processRoutes.forEach(buildRouteLine);
  const resizeObserver = new ResizeObserver(refreshLines);
  processRoutes.forEach((route) => resizeObserver.observe(route));

  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(updateRoutes);
  }, { passive: true });

  window.addEventListener("pageshow", () => {
    lastScrollY = window.scrollY;
    refreshLines();
    processRoutes.forEach(revealCardsReachedByScroll);
  });
}

