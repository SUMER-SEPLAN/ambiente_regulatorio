"use strict";

const framingViewport = document.querySelector("[data-framing-viewport]");

if (framingViewport) {
  const controls = document.querySelectorAll("[data-framing-direction]");
  const track = framingViewport.querySelector(".connection-framing__track");
  const cards = [...framingViewport.querySelectorAll(".connection-framing__card")];
  const card = cards[0];
  const gap = 18;

  const setCardWidth = () => {
    const columns = window.matchMedia("(min-width: 980px)").matches ? 3 : 1;
    const available = Math.max(260, framingViewport.clientWidth - 2);
    const width = (available - gap * (columns - 1)) / columns;
    track?.style.setProperty("--framing-card-width", `${width}px`);
    track?.style.removeProperty("--framing-card-height");
    track?.style.removeProperty("--framing-basis-height");
    requestAnimationFrame(() => {
      const bases = cards.map((item) => item.querySelector(".connection-matrix__basis")).filter(Boolean);
      const basisHeight = Math.max(...bases.map((item) => item.offsetHeight));
      track?.style.setProperty("--framing-basis-height", `${basisHeight}px`);
      const height = Math.max(...cards.map((item) => item.offsetHeight));
      track?.style.setProperty("--framing-card-height", `${height}px`);
    });
  };

  setCardWidth();
  new ResizeObserver(setCardWidth).observe(framingViewport);

  const pageStops = () => {
    const max = framingViewport.scrollWidth - framingViewport.clientWidth;
    const stops = [];
    for (let index = 0; index < cards.length; index += 1) {
      stops.push(Math.min(index * (card.getBoundingClientRect().width + gap), max));
    }
    stops.push(max);
    return [...new Set(stops)].sort((a, b) => a - b);
  };

  const targetStop = (direction) => {
    const current = framingViewport.scrollLeft;
    const stops = pageStops();
    if (direction > 0) return stops.find((stop) => stop > current + 2) ?? stops.at(-1);
    return [...stops].reverse().find((stop) => stop < current - 2) ?? stops[0];
  };

  const move = (direction) => {
    framingViewport.scrollTo({ left: targetStop(direction), behavior: "smooth" });
  };

  controls.forEach((control) => {
    control.addEventListener("click", () => {
      move(control.dataset.framingDirection === "previous" ? -1 : 1);
    });
  });

  framingViewport.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "PageUp", "PageDown"].includes(event.key)) return;
    event.preventDefault();
    move(event.key === "ArrowLeft" || event.key === "PageUp" ? -1 : 1);
  });

  let dragging = false;
  let startX = 0;
  let startScroll = 0;

  framingViewport.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startScroll = framingViewport.scrollLeft;
    framingViewport.classList.add("is-dragging");
    framingViewport.setPointerCapture(event.pointerId);
  });

  framingViewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    framingViewport.scrollLeft = startScroll - (event.clientX - startX);
  });

  const finishDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    framingViewport.classList.remove("is-dragging");
    if (framingViewport.hasPointerCapture(event.pointerId)) framingViewport.releasePointerCapture(event.pointerId);
  };

  framingViewport.addEventListener("pointerup", finishDrag);
  framingViewport.addEventListener("pointercancel", finishDrag);
}

