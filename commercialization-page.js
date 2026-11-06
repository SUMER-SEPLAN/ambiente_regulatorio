"use strict";
(() => {
  const storyLinks = [...document.querySelectorAll(".commerce-story__guide nav a")];
  const storyChapters = storyLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if (storyLinks.length && storyChapters.length && "IntersectionObserver" in window) {
    const storyObserver = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      storyLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-18% 0px -58% 0px", threshold: [0, .2, .5] });
    storyChapters.forEach((chapter) => storyObserver.observe(chapter));
    storyLinks[0].classList.add("is-active");
  }
  const tabs = [...document.querySelectorAll("[data-commerce-tab]")];
  const panels = [...document.querySelectorAll("[data-commerce-panel]")];
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    const target = tab.dataset.commerceTab;
    tabs.forEach((item) => { const active = item === tab; item.classList.toggle("is-active", active); item.setAttribute("aria-selected", String(active)); });
    panels.forEach((panel) => { const active = panel.dataset.commercePanel === target; panel.classList.toggle("is-active", active); panel.hidden = !active; });
  }));
  const journey = document.querySelector(".commerce-migration-flow");
  if (journey) {
    const steps = [...journey.querySelectorAll(":scope > li")];
    const reduceJourneyMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    journey.classList.add("is-journey-motion");
    if (reduceJourneyMotion || !("IntersectionObserver" in window)) {
      journey.style.setProperty("--journey-progress", "1");
      steps.forEach((step) => step.classList.add("is-marker-visible", "is-step-visible"));
    } else {
      let journeyFrame = 0;
      const revealStep = (step) => {
        step.classList.add("is-marker-visible");
        setTimeout(() => step.classList.add("is-step-visible"), 90);
      };
      const updateJourney = () => {
        journeyFrame = 0;
        const rect = journey.getBoundingClientRect();
        const guide = innerHeight * .84;
        const lineTop = 21;
        const drawable = Math.max(1, rect.height - 75);
        const painted = Math.max(0, Math.min(drawable, guide - rect.top - lineTop));
        journey.style.setProperty("--journey-progress", (painted / drawable).toFixed(4));
        steps.forEach((step, index) => {
          if (step.classList.contains("is-marker-visible")) return;
          const marker = step.querySelector(".commerce-migration-flow__marker");
          const markerRect = marker.getBoundingClientRect();
          const firstReady = index === 0 && rect.top <= innerHeight * .82;
          if (firstReady || markerRect.top + markerRect.height * .5 <= guide) revealStep(step);
        });
      };
      const scheduleJourney = () => {
        if (!journeyFrame) journeyFrame = requestAnimationFrame(updateJourney);
      };
      addEventListener("scroll", scheduleJourney, { passive: true });
      addEventListener("resize", scheduleJourney, { passive: true });
      scheduleJourney();
    }
  }
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll(".commerce-reveal").forEach((node) => node.classList.add("is-visible")); return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
  }), { threshold: .025, rootMargin: "0px 0px 14% 0px" });
  document.querySelectorAll(".commerce-reveal").forEach((node) => observer.observe(node));
})();
