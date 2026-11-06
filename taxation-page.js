"use strict";

const taxationRevealItems = [...document.querySelectorAll(".taxation-reveal")];
const taxationReducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!taxationReducedMotion) document.body.classList.add("taxation-motion-ready");

if (taxationReducedMotion || !("IntersectionObserver" in window)) {
  taxationRevealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const taxationRevealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .02, rootMargin: "0px 0px 12% 0px" });

  requestAnimationFrame(() => {
    taxationRevealItems.forEach((item) => taxationRevealObserver.observe(item));
  });
}
