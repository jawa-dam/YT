/* V1.25 — Adam Adaptive Guidance Engine */
(() => {
  "use strict";

  const GUIDANCE = Object.freeze({
    0: { recommendation: "Start Day 1", action: "continue", reason: "Day 1 establishes the starting point for the six-day GEI blueprint.", message: "You're ready to begin. I recommend Day 1 because it establishes the starting point for the six-day GEI blueprint." },
    1: { recommendation: "Continue Day 2", action: "continue", reason: "Day 2 builds directly on the foundation you started in Day 1.", message: "You've started the foundation. I recommend Day 2 because it builds directly on what you established in Day 1." },
    2: { recommendation: "Continue Day 3", action: "continue", reason: "Day 3 moves the blueprint into its central waters-and-land learning stage.", message: "You've established the foundation. I recommend Day 3 because the blueprint now moves into its central waters-and-land learning stage." },
    3: { recommendation: "Continue Day 4", action: "continue", reason: "Day 4 begins the second half and introduces the mill stage of the blueprint.", message: "You've reached the midpoint. I recommend Day 4 because it begins the second half and introduces the mill stage." },
    4: { recommendation: "Continue Day 5", action: "continue", reason: "Day 5 carries the second-half progression forward toward activation.", message: "You're in the second half. I recommend Day 5 because it carries the blueprint forward toward activation." },
    5: { recommendation: "Complete Day 6", action: "continue", reason: "Day 6 is the final learning step and completes the six-stage blueprint.", message: "You're in the final stretch. I recommend Day 6 because it is the final learning step and completes the six-stage blueprint." },
    6: { recommendation: "Review Day 1", action: "review", reason: "Reviewing the beginning gives you a clean way to revisit the full six-day path from its starting point.", message: "You've completed the blueprint. I recommend reviewing Day 1 first so you can revisit the full six-day path from its starting point." }
  });

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return { completed: [], currentDay: 1 };
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed) ? [...new Set(state.completed.map(Number).filter((id) => id >= 1 && id <= 6))].sort((a, b) => a - b) : [];
    return { completed, currentDay: Number(api.getCurrentDay?.()) || 1 };
  }

  function getAdaptiveGuidance() {
    const progress = getProgress();
    const count = progress.completed.length;
    const base = GUIDANCE[count] || GUIDANCE[0];
    return Object.freeze({ ...base, count, currentDay: count < 6 ? progress.currentDay : 1, version: 1 });
  }

  function refreshAssistant() {
    const assistant = document.getElementById("home-adam-assistant");
    if (!assistant) return;
    const guidance = getAdaptiveGuidance();
    const message = assistant.querySelector("#home-adam-assistant-message");
    const primary = assistant.querySelector('[data-adam-action="continue"], [data-adam-action="review"]');
    const next = assistant.querySelector(".home-adam-assistant-next-value");
    if (message) message.textContent = guidance.message;
    if (next) next.textContent = `DAY ${guidance.currentDay} • ${guidance.count}/6`;
    if (primary) { primary.dataset.adamAction = guidance.action; primary.textContent = `📖 ${guidance.recommendation}`; }

    let reason = assistant.querySelector(".home-adam-adaptive-reason");
    if (!reason) {
      reason = document.createElement("div");
      reason.className = "home-adam-adaptive-reason";
      const choices = assistant.querySelector(".home-adam-assistant-choices");
      if (choices?.parentElement) choices.parentElement.insertBefore(reason, choices);
    }
    reason.innerHTML = `<span class="home-adam-adaptive-reason-label">ADAM RECOMMENDS</span><strong>${guidance.recommendation}</strong><span>${guidance.reason}</span>`;
    assistant.dataset.adamAdaptive = String(guidance.count);
  }

  function ensureStyles() {
    if (document.getElementById("adam-adaptive-styles")) return;
    const style = document.createElement("style");
    style.id = "adam-adaptive-styles";
    style.textContent = `
      .home-adam-adaptive-reason{display:grid;grid-template-columns:auto auto;gap:3px 7px;margin:0 2px 7px;padding:9px 11px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 28%,transparent);border-radius:13px;background:color-mix(in srgb,var(--skin-accent,#2fd2ff) 7%,var(--skin-surface,#fff));color:var(--skin-text,#102a43)}
      .home-adam-adaptive-reason-label{grid-column:1/-1;color:var(--skin-accent,#2fd2ff);font-size:9px;font-weight:900;letter-spacing:.11em;text-transform:uppercase}
      .home-adam-adaptive-reason strong{font-size:13px;line-height:1.25}
      .home-adam-adaptive-reason>span:last-child{grid-column:1/-1;color:var(--skin-muted,#526b82);font-size:11px;line-height:1.3}
      @media(max-width:360px){.home-adam-adaptive-reason{padding:8px 9px}.home-adam-adaptive-reason strong{font-size:12px}.home-adam-adaptive-reason>span:last-child{font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    ensureStyles();
    window.GEI_ADAM_ADAPTIVE = Object.freeze({ version: 1, getGuidance, getAll: () => Object.values(GUIDANCE) });
    window.addEventListener("gei:progress-ready", refreshAssistant);
    window.addEventListener("gei:progress-updated", refreshAssistant);
    window.addEventListener("gei:xp-updated", refreshAssistant);
    window.addEventListener("gei:adam-memory-ready", refreshAssistant);
    window.addEventListener("gei:adam-memory-updated", refreshAssistant);
    window.setTimeout(refreshAssistant, 0);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
