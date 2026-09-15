/* V1.24 — Adam Milestone Intelligence */
(() => {
  "use strict";

  const MILESTONES = Object.freeze({
    0: { label: "NEW LEARNER", title: "Blueprint Ready", message: "You're ready to begin. Day 1 starts the GEI blueprint and gives you the foundation for the journey." },
    1: { label: "FIRST STEP", title: "Foundation Started", message: "You've taken your first step into the blueprint. Day 2 is your next opportunity to build on that foundation." },
    2: { label: "FOUNDATION ESTABLISHED", title: "Foundation Established", message: "You've completed the first two days. Day 3 is next, and your blueprint is moving into its central learning stage." },
    3: { label: "MIDPOINT REACHED", title: "Midpoint Reached", message: "You've reached the midpoint of the six-day blueprint. Three days are complete and three remain." },
    4: { label: "SECOND HALF", title: "Second Half", message: "You're in the second half of the blueprint. Four days are complete, with Days 5 and 6 ahead." },
    5: { label: "FINAL STRETCH", title: "Final Stretch", message: "You're one day away from completing the six-day blueprint. Day 6 is your final learning step." },
    6: { label: "BLUEPRINT MASTER", title: "Blueprint Master", message: "You've completed all six days. The blueprint is complete—now review your path and explore what you've built." }
  });

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return { completed: [], xp: 0, currentDay: 1 };
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed)
      ? [...new Set(state.completed.map(Number).filter((id) => id >= 1 && id <= 6))].sort((a, b) => a - b)
      : [];
    return { completed, xp: Math.max(0, Number(state.xp) || 0), currentDay: Number(api.getCurrentDay?.()) || 1 };
  }

  function getMilestone() {
    const progress = getProgress();
    const count = progress.completed.length;
    return { ...MILESTONES[count], count, currentDay: count < 6 ? progress.currentDay : 6 };
  }

  function getMemory() {
    return window.GEI_ADAM_MEMORY?.getState?.() || null;
  }

  function getMessage(milestone) {
    const memory = getMemory();
    const last = Number(memory?.lastCompletedDay) || null;
    const count = milestone.count;
    if (count === 0 && last) return `Welcome back. I remember your last recorded milestone was Day ${last}. ${milestone.message}`;
    if (count > 0 && last && last < count) return `You completed Day ${last} previously. ${milestone.message}`;
    return milestone.message;
  }

  function refreshAssistant() {
    const assistant = document.getElementById("home-adam-assistant");
    if (!assistant) return;
    const milestone = getMilestone();
    const label = assistant.querySelector(".home-adam-assistant-next-label");
    const message = assistant.querySelector("#home-adam-assistant-message");
    const next = assistant.querySelector(".home-adam-assistant-next-value");
    if (label) label.textContent = milestone.label;
    if (message) message.textContent = getMessage(milestone);
    if (next) next.textContent = `DAY ${milestone.currentDay} • ${milestone.count}/6`;
    assistant.dataset.adamMilestone = milestone.count;
  }

  function loadChildScript(src, marker, onload) {
    if (document.querySelector(`script[data-gei-${marker}]`)) return;
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset[`gei${marker.charAt(0).toUpperCase()}${marker.slice(1)}`] = marker;
    if (typeof onload === "function") script.addEventListener("load", onload, { once: true });
    document.head.appendChild(script);
  }

  function loadAcademyFixStyles() {
    if (document.querySelector('link[data-gei-academy-fix="v1.26.3"]') || document.querySelector('link[href="v1-26-academy-fix.css"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "v1-26-academy-fix.css";
    link.dataset.geiAcademyFix = "v1.26.3";
    document.head.appendChild(link);
  }

  function init() {
    window.GEI_ADAM_MILESTONES = Object.freeze({ version: 1, getMilestone, getAll: () => Object.values(MILESTONES) });
    window.addEventListener("gei:progress-ready", refreshAssistant);
    window.addEventListener("gei:progress-updated", refreshAssistant);
    window.addEventListener("gei:xp-updated", refreshAssistant);
    window.addEventListener("gei:adam-memory-ready", refreshAssistant);
    window.addEventListener("gei:adam-memory-updated", refreshAssistant);
    window.setTimeout(refreshAssistant, 0);

    loadChildScript("adam-adaptive.js", "adaptive", null);
    loadChildScript("adam-mastery-milestones.js", "mastery-milestones", null);
    if (!document.querySelector('script[src="adam-context.js"]')) {
      loadChildScript("adam-context.js", "context", () => window.GEI_ADAM_CONTEXT?.refresh?.());
    }
    loadAcademyFixStyles();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
