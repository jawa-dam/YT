/* V1.28 — Adam Objective Mastery & Checkpoints */
(() => {
  "use strict";

  const STORAGE_KEY = "geiAdamObjectiveMasteryV1";
  const CHECKPOINTS = Object.freeze({
    1: [
      ["What is the first condition described before light appears?", ["A dry land", "Darkness upon the deep", "A completed dam"], 1],
      ["In the GEI Day 1 model, what does light represent?", ["Released water", "A mountain", "A mill gear"], 0],
      ["What is the key engineering action established on Day 1?", ["Separation", "Harvesting", "Animal operation"], 0]
    ],
    2: [
      ["What does the firmament represent in the Day 2 model?", ["A dam wall", "A waterwheel", "Dry land"], 0],
      ["Why is separation important before controlled movement?", ["Structure must contain and direct flow", "Water must disappear", "The mill must be removed"], 0],
      ["What engineering role does Day 2 establish?", ["Structural containment", "Mechanical generation", "Final operation"], 0]
    ],
    3: [
      ["What appears when the waters are gathered in the Day 3 model?", ["Dry land", "A waterwheel", "A sluice gate"], 0],
      ["What does the gathered water function as in the blueprint?", ["A reservoir", "A gear", "A creature"], 0],
      ["What environment does Day 3 establish?", ["Working water storage and exposed dry land", "Final system operation", "Mill gearing"], 0]
    ],
    4: [
      ["What is the primary function of the lights in the Day 4 interpretation?", ["Functional markers", "Dam foundations", "Animal operators"], 0],
      ["What controls movement toward the mill in the model?", ["A controlled release", "Dry land", "Darkness"], 0],
      ["What becomes an operational control on Day 4?", ["Timing and flow", "Mountain height", "Animal size"], 0]
    ],
    5: [
      ["What do the great water creatures represent in the Day 5 model?", ["Water-driven mechanical activity", "Dry land", "A cement wall"], 0],
      ["What converts moving water into mechanical energy?", ["A waterwheel", "A reservoir wall", "A mountain"], 0],
      ["What does Day 5 represent?", ["System activation through water movement", "Initial separation", "Structural containment"], 0]
    ],
    6: [
      ["What does Day 6 represent in the six-stage GEI model?", ["The completed operating system", "The first separation", "The reservoir only"], 0],
      ["What should the learner connect across Days 1–6?", ["One engineered sequence", "Six unrelated events", "Only the animal imagery"], 0],
      ["What is the final learning objective of the sequence?", ["Summarize how the complete architecture operates", "Ignore the earlier stages", "Remove the water system"], 0]
    ]
  });

  let state = loadState();
  let activeDay = 1;
  let questionIndex = 0;

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const mastered = Array.isArray(parsed.mastered) ? [...new Set(parsed.mastered.map(String))] : [];
      return { mastered };
    } catch (_) { return { mastered: [] }; }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function key(day, index) { return `${day}-${index}`; }
  function isMastered(day, index) { return state.mastered.includes(key(day, index)); }
  function masteredCount(day) { return CHECKPOINTS[day].filter((_, i) => isMastered(day, i)).length; }

  function getDay() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return 1;
    const progress = api.getState() || {};
    const completed = Array.isArray(progress.completed) ? progress.completed.length : 0;
    return Math.min(6, Math.max(1, completed < 6 ? Number(api.getCurrentDay?.()) || 1 : 1));
  }

  function renderQuestion() {
    const host = document.getElementById("adam-mastery-question");
    if (!host) return;
    const items = CHECKPOINTS[activeDay];
    while (questionIndex < items.length && isMastered(activeDay, questionIndex)) questionIndex++;
    if (questionIndex >= items.length) {
      host.innerHTML = `<div class="adam-mastery-complete"><span class="adam-mastery-complete-icon">✓</span><div><strong>Day ${activeDay} mastery complete</strong><small>All ${items.length} objectives demonstrated.</small></div></div>`;
      return;
    }
    const [question, choices] = items[questionIndex];
    host.innerHTML = `<div class="adam-mastery-question-head"><span>CHECKPOINT ${questionIndex + 1} / ${items.length}</span><b>${masteredCount(activeDay)} MASTERED</b></div><h4>${question}</h4><div class="adam-mastery-choices">${choices.map((choice, i) => `<button type="button" data-choice="${i}">${choice}</button>`).join("")}</div><p class="adam-mastery-feedback" id="adam-mastery-feedback" aria-live="polite"></p>`;
    host.querySelectorAll("button[data-choice]").forEach((button) => button.addEventListener("click", () => answer(Number(button.dataset.choice))));
  }

  function answer(choice) {
    const item = CHECKPOINTS[activeDay][questionIndex];
    const feedback = document.getElementById("adam-mastery-feedback");
    const buttons = document.querySelectorAll("#adam-mastery-question button[data-choice]");
    buttons.forEach((button) => { button.disabled = true; });
    if (choice !== item[2]) {
      if (feedback) feedback.textContent = "Not quite. Adam says: look back at the objective, then try again.";
      buttons.forEach((button) => { button.disabled = false; });
      return;
    }
    state.mastered.push(key(activeDay, questionIndex));
    state.mastered = [...new Set(state.mastered)];
    saveState();
    window.GEI_PROGRESS?.addXP?.(15, "adam-objective-mastery");
    if (feedback) feedback.textContent = "Objective demonstrated! +15 XP";
    window.setTimeout(() => { questionIndex++; render(); }, 420);
  }

  function build() {
    const section = document.createElement("section");
    section.className = "adam-objective-mastery";
    section.setAttribute("aria-labelledby", "adam-mastery-title");
    section.innerHTML = `<div class="adam-mastery-head"><div><span class="adam-mastery-kicker">ADAM • OBJECTIVE MASTERY</span><h3 id="adam-mastery-title">Demonstrate what you learned</h3></div><span class="adam-mastery-badge">+15 XP EACH</span></div><p class="adam-mastery-copy">Answer three short checkpoints to demonstrate the Day ${activeDay} learning objectives.</p><div id="adam-mastery-question"></div>`;
    return section;
  }

  function render() {
    const academy = document.getElementById("screen-academy");
    const view = academy?.querySelector(".academy-view");
    const objectives = view?.querySelector(":scope > .adam-learning-objectives");
    if (!view || !objectives) return;
    const existing = view.querySelector(":scope > .adam-objective-mastery");
    if (existing) existing.remove();
    activeDay = getDay();
    const section = build();
    view.insertBefore(section, objectives.nextSibling);
    renderQuestion();
  }

  function ensureStyles() {
    if (document.getElementById("adam-objective-mastery-styles")) return;
    const style = document.createElement("style");
    style.id = "adam-objective-mastery-styles";
    style.textContent = `.adam-objective-mastery{position:relative;z-index:2;margin:0 0 12px;padding:14px;border:2px solid #155eef;border-radius:18px;background:#fff;box-shadow:0 14px 34px rgba(16,42,67,.10)}.adam-mastery-head{display:flex;align-items:flex-end;justify-content:space-between;gap:9px}.adam-mastery-kicker{display:block;color:#155eef;font-size:8px;font-weight:1000;letter-spacing:.13em}.adam-mastery-head h3{margin:4px 0 0;color:#102a43;font-size:17px;line-height:1.08}.adam-mastery-badge{padding:5px 7px;border-radius:8px;background:#eef3ff;color:#155eef;font-size:8px;font-weight:1000;white-space:nowrap}.adam-mastery-copy{margin:8px 0 11px;color:#526b82;font-size:11px;line-height:1.4}.adam-mastery-question-head{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;color:#60738f;font-size:8px;font-weight:1000;letter-spacing:.08em}.adam-mastery-question-head b{color:#155eef}.adam-mastery-question h4{margin:0 0 9px;color:#102a43;font-size:14px;line-height:1.3}.adam-mastery-choices{display:grid;gap:7px}.adam-mastery-choices button{width:100%;min-height:40px;padding:8px 10px;border:1px solid rgba(21,94,239,.25);border-radius:11px;background:#f7f9fc;color:#304963;text-align:left;font:inherit;font-size:11px;font-weight:700;cursor:pointer}.adam-mastery-choices button:disabled{opacity:.65;cursor:default}.adam-mastery-choices button:focus-visible{outline:3px solid #ff1493;outline-offset:2px}.adam-mastery-feedback{min-height:16px;margin:7px 0 0;color:#155eef;font-size:10px;font-weight:800}.adam-mastery-complete{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:#eef3ff;color:#102a43}.adam-mastery-complete-icon{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#155eef;color:#fff;font-weight:1000}.adam-mastery-complete strong,.adam-mastery-complete small{display:block}.adam-mastery-complete strong{font-size:12px}.adam-mastery-complete small{margin-top:2px;color:#526b82;font-size:10px}@media(max-width:360px){.adam-objective-mastery{padding:12px;border-radius:16px}.adam-mastery-head h3{font-size:15px}.adam-mastery-copy{font-size:10px}.adam-mastery-question h4{font-size:13px}.adam-mastery-choices button{font-size:10px;min-height:38px}.adam-mastery-kicker,.adam-mastery-badge,.adam-mastery-question-head{font-size:7px}}`;
    document.head.appendChild(style);
  }

  function init() {
    ensureStyles();
    render();
    ["gei:navigation","gei:progress-ready","gei:progress-updated"].forEach((name) => window.addEventListener(name, () => window.setTimeout(render, 40)));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
