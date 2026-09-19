/* V1.28/V1.29/V1.30 — Adam Objective Mastery, Progress UX & Ledger */
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

  const DAYS = Object.freeze([1, 2, 3, 4, 5, 6]);
  const TOTAL_CHECKPOINTS = DAYS.reduce((sum, day) => sum + CHECKPOINTS[day].length, 0);

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
  function totalMastered() { return DAYS.reduce((sum, day) => sum + masteredCount(day), 0); }

  function getDay() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return 1;
    const progress = api.getState() || {};
    const completed = Array.isArray(progress.completed) ? progress.completed.length : 0;
    return Math.min(6, Math.max(1, completed < 6 ? Number(api.getCurrentDay?.()) || 1 : 1));
  }

  function updateTrack() {
    const track = document.getElementById("adam-mastery-track");
    if (!track) return;
    const count = masteredCount(activeDay);
    track.setAttribute("aria-label", `Day ${activeDay}: ${count} of 3 checkpoints mastered`);
    const fill = track.querySelector(".adam-mastery-track-fill");
    if (fill) fill.style.width = `${Math.round((count / CHECKPOINTS[activeDay].length) * 100)}%`;
    track.querySelectorAll(".adam-mastery-step").forEach((step, index) => {
      const mastered = isMastered(activeDay, index);
      step.classList.toggle("is-mastered", mastered);
      step.setAttribute("aria-label", `Checkpoint ${index + 1}${mastered ? ": mastered" : ": not mastered"}`);
    });
    const countNode = document.getElementById("adam-mastery-progress-count");
    if (countNode) countNode.textContent = `${count} / 3`;
  }

  function updateLedger() {
    const totalNode = document.getElementById("adam-mastery-total-count");
    if (totalNode) totalNode.textContent = `${totalMastered()} / ${TOTAL_CHECKPOINTS}`;
    const ledger = document.getElementById("adam-mastery-ledger");
    if (!ledger) return;
    DAYS.forEach((day) => {
      const item = ledger.querySelector(`[data-ledger-day="${day}"]`);
      if (!item) return;
      const count = masteredCount(day);
      const complete = count === CHECKPOINTS[day].length;
      item.classList.toggle("is-mastered", complete);
      item.classList.toggle("is-current", day === activeDay);
      item.setAttribute("aria-label", `Day ${day}: ${count} of 3 mastered${complete ? ", complete" : ""}`);
      const countNode = item.querySelector("b");
      if (countNode) countNode.textContent = `${count}/3`;
    });
  }

  function renderQuestion() {
    const host = document.getElementById("adam-mastery-question");
    if (!host) return;
    const items = CHECKPOINTS[activeDay];
    while (questionIndex < items.length && isMastered(activeDay, questionIndex)) questionIndex++;
    updateTrack();
    updateLedger();
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
    if (!item) return;
    const feedback = document.getElementById("adam-mastery-feedback");
    const buttons = document.querySelectorAll("#adam-mastery-question button[data-choice]");
    buttons.forEach((button) => { button.disabled = true; });
    if (choice !== item[2]) {
      if (feedback) feedback.textContent = "Not quite. Adam says: look back at the objective, then try again.";
      buttons.forEach((button) => { button.disabled = false; });
      return;
    }
    const masteryKey = key(activeDay, questionIndex);
    if (!state.mastered.includes(masteryKey)) {
      state.mastered.push(masteryKey);
      state.mastered = [...new Set(state.mastered)];
      saveState();
      window.GEI_PROGRESS?.addXP?.(15, "adam-objective-mastery");
    }
    updateTrack();
    updateLedger();
    if (feedback) feedback.textContent = "Objective demonstrated! +15 XP";
    window.setTimeout(() => { questionIndex++; render(); }, 420);
  }

  function build() {
    const section = document.createElement("section");
    section.className = "adam-objective-mastery";
    section.setAttribute("aria-labelledby", "adam-mastery-title");
    section.innerHTML = `<div class="adam-mastery-head"><div><span class="adam-mastery-kicker">ADAM • OBJECTIVE MASTERY</span><h3 id="adam-mastery-title">Demonstrate what you learned</h3></div><span class="adam-mastery-badge">+15 XP EACH</span></div><p class="adam-mastery-copy">Answer three short checkpoints to demonstrate the Day ${activeDay} learning objectives.</p><div class="adam-mastery-ledger-wrap"><div class="adam-mastery-ledger-head"><span>6-DAY MASTERY LEDGER</span><b id="adam-mastery-total-count">${totalMastered()} / ${TOTAL_CHECKPOINTS}</b></div><div class="adam-mastery-ledger" id="adam-mastery-ledger" role="group" aria-label="Six-day mastery status">${DAYS.map((day) => `<span class="adam-mastery-ledger-day" data-ledger-day="${day}" aria-label="Day ${day}: ${masteredCount(day)} of 3 mastered"><strong>D${day}</strong><b>${masteredCount(day)}/3</b></span>`).join("")}</div></div><div class="adam-mastery-progress"><div class="adam-mastery-progress-label"><span>DAY ${activeDay} MASTERY</span><b id="adam-mastery-progress-count">${masteredCount(activeDay)} / 3</b></div><div class="adam-mastery-track" id="adam-mastery-track" role="group" aria-label="Day ${activeDay}: ${masteredCount(activeDay)} of 3 checkpoints mastered"><div class="adam-mastery-track-line"><span class="adam-mastery-track-fill"></span></div><div class="adam-mastery-steps"><span class="adam-mastery-step" aria-label="Checkpoint 1"></span><span class="adam-mastery-step" aria-label="Checkpoint 2"></span><span class="adam-mastery-step" aria-label="Checkpoint 3"></span></div></div></div><div id="adam-mastery-question"></div>`;
    return section;
  }

  function render() {
    const academy = document.getElementById("screen-academy");
    const view = academy?.querySelector(".academy-view");
    const objectives = view?.querySelector(":scope > .adam-learning-objectives");
    if (!view || !objectives) return;
    const nextDay = getDay();
    if (nextDay !== activeDay) questionIndex = 0;
    activeDay = nextDay;
    const existing = view.querySelector(":scope > .adam-objective-mastery");
    if (existing) existing.remove();
    const section = build();
    view.insertBefore(section, objectives.nextSibling);
    renderQuestion();
  }

  function ensureStyles() {
    if (document.getElementById("adam-objective-mastery-styles")) return;
    const style = document.createElement("style");
    style.id = "adam-objective-mastery-styles";
    style.textContent = `.adam-objective-mastery{position:relative;z-index:2;margin:0 0 12px;padding:14px;border:2px solid #155eef;border-radius:18px;background:#fff;box-shadow:0 14px 34px rgba(16,42,67,.10)}.adam-mastery-head{display:flex;align-items:flex-end;justify-content:space-between;gap:9px}.adam-mastery-kicker{display:block;color:#155eef;font-size:14px;font-weight:1000;letter-spacing:.13em}.adam-mastery-head h3{margin:4px 0 0;color:#102a43;font-size:17px;line-height:1.08}.adam-mastery-badge{padding:5px 7px;border-radius:8px;background:#eef3ff;color:#155eef;font-size:8px;font-weight:1000;white-space:nowrap}.adam-mastery-copy{margin:8px 0 10px;color:#526b82;font-size:11px;line-height:1.4}.adam-mastery-ledger-wrap{margin:0 0 11px;padding:9px 10px;border-radius:12px;background:#f8faff;border:1px solid rgba(21,94,239,.12)}.adam-mastery-ledger-head{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;color:#60738f;font-size:8px;font-weight:1000;letter-spacing:.08em}.adam-mastery-ledger-head b{color:#155eef}.adam-mastery-ledger{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px}.adam-mastery-ledger-day{display:grid;justify-items:center;gap:2px;padding:5px 2px;border:1px solid #d7e0f1;border-radius:9px;background:#fff;color:#7890aa;transition:.2s ease}.adam-mastery-ledger-day strong{font-size:9px;line-height:1}.adam-mastery-ledger-day b{font-size:7px;line-height:1;font-weight:1000}.adam-mastery-ledger-day.is-current{border-color:#155eef;box-shadow:0 0 0 1px rgba(21,94,239,.12)}.adam-mastery-ledger-day.is-mastered{border-color:#ff1493;background:#fff0f8;color:#d20d78}.adam-mastery-progress{margin:0 0 11px;padding:9px 10px;border-radius:12px;background:#f5f8ff;border:1px solid rgba(21,94,239,.12)}.adam-mastery-progress-label{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;color:#60738f;font-size:8px;font-weight:1000;letter-spacing:.08em}.adam-mastery-progress-label b{color:#155eef}.adam-mastery-track{position:relative;height:22px}.adam-mastery-track-line{position:absolute;left:8px;right:8px;top:8px;height:5px;border-radius:99px;background:#dfe7f7;overflow:hidden}.adam-mastery-track-fill{display:block;width:0;height:100%;border-radius:99px;background:#155eef;transition:width .28s ease}.adam-mastery-steps{position:absolute;inset:0;display:flex;justify-content:space-between;align-items:flex-start}.adam-mastery-step{width:21px;height:21px;border-radius:50%;box-sizing:border-box;border:2px solid #b9c8e5;background:#fff;box-shadow:0 1px 4px rgba(16,42,67,.08)}.adam-mastery-step.is-mastered{border-color:#155eef;background:#155eef;position:relative}.adam-mastery-step.is-mastered::after{content:"✓";position:absolute;inset:0;display:grid;place-items:center;color:#fff;font-size:11px;font-weight:1000}.adam-mastery-question-head{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;color:#60738f;font-size:8px;font-weight:1000;letter-spacing:.08em}.adam-mastery-question-head b{color:#155eef}.adam-mastery-question h4{margin:0 0 9px;color:#102a43;font-size:14px;line-height:1.3}.adam-mastery-choices{display:grid;gap:7px}.adam-mastery-choices button{width:100%;min-height:40px;padding:8px 10px;border:1px solid rgba(21,94,239,.25);border-radius:11px;background:#f7f9fc;color:#304963;text-align:left;font:inherit;font-size:11px;font-weight:700;cursor:pointer}.adam-mastery-choices button:disabled{opacity:.65;cursor:default}.adam-mastery-choices button:focus-visible{outline:3px solid #ff1493;outline-offset:2px}.adam-mastery-feedback{min-height:16px;margin:7px 0 0;color:#155eef;font-size:10px;font-weight:800}.adam-mastery-complete{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:#eef3ff;color:#102a43}.adam-mastery-complete-icon{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#155eef;color:#fff;font-weight:1000}.adam-mastery-complete strong,.adam-mastery-complete small{display:block}.adam-mastery-complete strong{font-size:12px}.adam-mastery-complete small{margin-top:2px;color:#526b82;font-size:10px}@media(max-width:360px){.adam-objective-mastery{padding:12px;border-radius:16px}.adam-mastery-head h3{font-size:15px}.adam-mastery-copy{font-size:10px}.adam-mastery-question h4{font-size:13px}.adam-mastery-choices button{font-size:10px;min-height:38px}.adam-mastery-kicker{font-size:12px}.adam-mastery-badge,.adam-mastery-question-head,.adam-mastery-progress-label,.adam-mastery-ledger-head{font-size:9px}.adam-mastery-ledger{gap:3px}.adam-mastery-ledger-day{padding:5px 1px}.adam-mastery-ledger-day strong{font-size:8px}.adam-mastery-ledger-day b{font-size:6px}}`;
    document.head.appendChild(style);
  }

  function init() {
    ensureStyles();
    render();
    ["gei:navigation","gei:progress-ready","gei:progress-updated"].forEach((name) => window.addEventListener(name, () => window.setTimeout(render, 40)));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
