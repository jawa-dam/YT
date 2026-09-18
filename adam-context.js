/* V1.50 — Adam All-in-One Context Provider */
(() => {
  "use strict";

  const ACADEMY_CONTEXT = Object.freeze({
    label: "ACADEMY",
    title: "Your learning space",
    message: "You're in GEI Academy. Adam is the all-in-one guide for your blueprint progress, next lesson and GEI guidance.",
    action: "Open next day",
    actionType: "day"
  });

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return { completed: [], xp: 0, currentDay: 1 };
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed)
      ? [...new Set(state.completed.map(Number).filter((id) => id >= 1 && id <= 6))].sort((a, b) => a - b)
      : [];
    return {
      completed,
      xp: Math.max(0, Number(state.xp) || 0),
      currentDay: Number(api.getCurrentDay?.()) || 1
    };
  }

  function getContext() {
    const progress = getProgress();
    const count = progress.completed.length;
    return Object.freeze({
      ...ACADEMY_CONTEXT,
      screenId: "screen-academy",
      count,
      currentDay: count < 6 ? progress.currentDay : 1,
      xp: progress.xp,
      version: 1.6
    });
  }

  function refresh() {
    // V1.50: visual Adam UI is owned by the Academy mascot itself.
    // This compatibility API intentionally does not create a launcher or panel.
    window.dispatchEvent(new CustomEvent("gei:adam-context-ready", { detail: getContext() }));
  }

  window.GEI_ADAM_CONTEXT = Object.freeze({
    version: 1.6,
    getContext,
    refresh
  });

  // Remove any stale V1.26 launcher/panel left by cached markup or an older script.
  document.querySelectorAll(".adam-context-launcher,.adam-context-panel").forEach((el) => el.remove());
  window.addEventListener("gei:navigation", refresh);
  window.addEventListener("gei:progress-updated", refresh);
  window.addEventListener("gei:day-completion", refresh);
})();
