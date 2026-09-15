/* V1.27 — Adam Learning Objectives */
(() => {
  "use strict";

  const OBJECTIVES = Object.freeze({
    1: [
      "Identify the opening water conditions described in Genesis 1:1–5.",
      "Distinguish the figurative roles of darkness, deep, Spirit, and light.",
      "Explain how Day 1 establishes the first separation in the blueprint."
    ],
    2: [
      "Identify the firmament as the structural separation in the Day 2 model.",
      "Connect separation of waters to the dam-wall engineering analogy.",
      "Describe why structure must precede controlled water movement."
    ],
    3: [
      "Identify the gathered waters and the appearance of dry land.",
      "Connect the reservoir and dry-land relationship to the blueprint.",
      "Explain how Day 3 establishes the working water-storage environment."
    ],
    4: [
      "Identify the lights as functional markers within the Day 4 model.",
      "Connect controlled release to the sluice-and-mill interpretation.",
      "Explain how timing and flow become operational controls."
    ],
    5: [
      "Identify the great water creatures in the Day 5 interpretation.",
      "Connect moving water to mechanical energy in the waterwheel model.",
      "Explain how Day 5 represents system activation through water movement."
    ],
    6: [
      "Identify the living-system imagery used in the Day 6 interpretation.",
      "Connect the completed hydraulic architecture to system operation.",
      "Summarize how Days 1–6 function as one engineered sequence."
    ]
  });

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return { completed: [], currentDay: 1 };
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed)
      ? [...new Set(state.completed.map(Number).filter((id) => id >= 1 && id <= 6))].sort((a, b) => a - b)
      : [];
    return { completed, currentDay: Number(api.getCurrentDay?.()) || 1 };
  }

  function getDay() {
    const progress = getProgress();
    return Math.min(6, Math.max(1, progress.completed.length < 6 ? progress.currentDay : 1));
  }

  function buildObjectives(day) {
    const items = OBJECTIVES[day] || OBJECTIVES[1];
    const section = document.createElement("section");
    section.className = "adam-learning-objectives";
    section.dataset.objectivesDay = String(day);
    section.setAttribute("aria-labelledby", "adam-objectives-title");
    section.innerHTML = `
      <div class="adam-objectives-head">
        <div>
          <span class="adam-objectives-kicker">ADAM • LEARNING OBJECTIVES</span>
          <h3 id="adam-objectives-title">Day ${day} objectives</h3>
        </div>
        <span class="adam-objectives-count">${items.length} TARGETS</span>
      </div>
      <ol class="adam-objectives-list">
        ${items.map((item) => `<li><span class="adam-objective-marker" aria-hidden="true">✓</span><span>${item}</span></li>`).join("")}
      </ol>`;
    return section;
  }

  function render() {
    const academy = document.getElementById("screen-academy");
    if (!academy) return;
    const view = academy.querySelector(".academy-view");
    if (!view) return;

    const day = getDay();
    const existing = view.querySelector(":scope > .adam-learning-objectives");
    if (existing?.dataset.objectivesDay === String(day)) return;
    existing?.remove();

    const target = view.querySelector(":scope > .adam-context-launcher");
    if (!target) return;
    view.insertBefore(buildObjectives(day), target);
  }

  function ensureStyles() {
    if (document.getElementById("adam-learning-objectives-styles")) return;
    const style = document.createElement("style");
    style.id = "adam-learning-objectives-styles";
    style.textContent = `
      .adam-learning-objectives{position:relative;z-index:2;margin:0 0 10px;padding:14px 14px 12px;border:1px solid rgba(21,94,239,.24);border-radius:18px;background:rgba(255,255,255,.94);box-shadow:0 12px 30px rgba(16,42,67,.08)}
      .adam-objectives-head{display:flex;align-items:flex-end;justify-content:space-between;gap:10px;margin-bottom:9px}
      .adam-objectives-kicker{display:block;color:#155eef;font-size:8px;font-weight:1000;letter-spacing:.13em;text-transform:uppercase}
      .adam-objectives-head h3{margin:4px 0 0;color:#102a43;font-size:17px;line-height:1.05;letter-spacing:-.025em}
      .adam-objectives-count{color:#60738f;font-size:8px;font-weight:1000;letter-spacing:.1em;white-space:nowrap}
      .adam-objectives-list{display:grid;gap:7px;margin:0;padding:0;list-style:none}
      .adam-objectives-list li{display:grid;grid-template-columns:22px minmax(0,1fr);align-items:start;gap:8px;color:#304963;font-size:11px;line-height:1.38}
      .adam-objective-marker{display:grid;place-items:center;width:21px;height:21px;border-radius:50%;background:#eef3ff;color:#155eef;font-size:11px;font-weight:1000}
      @media(max-width:360px){.adam-learning-objectives{padding:12px 11px 10px;border-radius:16px}.adam-objectives-head h3{font-size:15px}.adam-objectives-kicker{font-size:7px}.adam-objectives-count{font-size:7px}.adam-objectives-list li{grid-template-columns:20px minmax(0,1fr);font-size:10px;gap:7px}.adam-objective-marker{width:19px;height:19px;font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    ensureStyles();
    render();
    ["gei:navigation","gei:progress-ready","gei:progress-updated"].forEach((name) => window.addEventListener(name, () => window.setTimeout(render, 30)));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
