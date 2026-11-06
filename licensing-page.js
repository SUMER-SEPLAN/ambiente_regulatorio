"use strict";

const licensingSteps = [...document.querySelectorAll(".licensing-step")];
const licensingDetail = document.querySelector("#licensing-flow-detail");
const licensingDetailTitle = document.querySelector("#licensing-flow-detail-title");
const licensingDetailText = document.querySelector("#licensing-flow-detail-text");

function activateLicensingStep(step) {
  licensingSteps.forEach((item) => {
    const active = item === step;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  const detailNumber = licensingDetailTitle.querySelector(".licensing-flow__detail-number");
  const detailLabel = licensingDetailTitle.querySelector(".licensing-flow__detail-label");
  detailNumber.textContent = String(step.dataset.stage).padStart(2, "0");
  detailLabel.textContent = step.dataset.title;
  licensingDetailText.innerHTML = step.dataset.detail;
  licensingDetail.dataset.stage = step.dataset.stage;
}

licensingSteps.forEach((step) => {
  step.addEventListener("click", () => activateLicensingStep(step));
  step.addEventListener("mouseenter", () => activateLicensingStep(step));
  step.addEventListener("focus", () => activateLicensingStep(step));
});

const revealItems = document.querySelectorAll(".licensing-reveal");
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  revealItems.forEach((item) => observer.observe(item));
} else revealItems.forEach((item) => item.classList.add("is-visible"));
