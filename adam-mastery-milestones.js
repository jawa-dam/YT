/* V1.31 — Adam Mastery Milestones */
(() => {
  "use strict";

  const STORAGE_KEY = "geiAdamObjectiveMasteryV1";
  const MILESTONE_KEY = "geiAdamMasteryMilestonesV1";
  const DAYS = Object.freeze([1, 2, 3, 4, 5, 6]);
  const OBJECTIVES_PER_DAY = 3;
  const TOTAL = DAYS.length * OBJECTIVES_PER_DAY;

  function loadMastery() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      return Array.isArray(parsed.mastered) ? [...new Set(parsed.mastered.map(String))] : [];
    } catch (_) { return []; }
  }

  function loadMilestones() {
    try {
      const parsed = JSON.parse(localStorage.getItem(MILESTONE_KEY) || "{}");
      return {
        days: Array.isArray(parsed.days) ? [...new Set(parsed.days.map(Number).filter((d) => DAYS.includes(d)))] : [],
        allSix: parsed.allSix === true
      };
    } catch (_) { return { days: [], allSix: false }; }
  }

  function saveMilestones(state) {
    try { localStorage.setItem(MILESTONE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function masteredCount(mastered, day) {
    return mastered.filter((key) => key.startsWith(`${day}-`)).length;
  }

  function syncMilestones(mastered) {
    const state = loadMilestones();
    DAYS.forEach((day) => {
      if (masteredCount(mastered, day) >= OBJECTIVES_PER_DAY && !state.days.includes(day)) state.days.push(day);
    });
    state.days.sort((a, b) => a - b);
    if (state.days.length === DAYS.length && !state.allSix) state.allSix = true;
    saveMilestones(state);
    return state;
  }

  function build() {
    const section = document.createElement("section");
    section.className = "adam-mastery-milestones";
    section.setAttribute("aria-labelledby", "adam-milestones-title");
    section.innerHTML = `
      <div class="adam-milestones-head">
        <div>
          <span class="adam-milestones-kicker">ADAM • MASTERY MILESTONES</span>
          <h3 id="adam-milestones-title">Your mastery journey</h3>
        </div>
        <span class="adam-milestones-count" id="adam-milestones-count">0 / 6</span>
      </div>
      <div class="adam-milestones-grid" id="adam-milestones-grid" role="list" aria-label="Day mastery milestones"></div>
      <div class="adam-milestones-complete" id="adam-milestones-complete" hidden aria-live="polite">
        <span class="adam-milestones-trophy" aria-hidden="true">★</span>
        <div><strong>ALL SIX DAYS MASTERED</strong><small>18 of 18 checkpoints demonstrated. The complete GEI learning sequence is mastered.</small></div>
      </div>`;
    return section;
  }

  function render() {
    const academy = document.getElementById("screen-academy");
    const view = academy?.querySelector(".academy-view");
    const mastery = view?.querySelector(":scope > .adam-objective-mastery");
    if (!view || !mastery) return;

    let section = view.querySelector(":scope > .adam-mastery-milestones");
    if (!section) {
      section = build();
      view.insertBefore(section, mastery.nextSibling);
    }

    const mastered = loadMastery();
    const milestones = syncMilestones(mastered);
    const grid = section.querySelector("#adam-milestones-grid");
    const countNode = section.querySelector("#adam-milestones-count");
    const complete = section.querySelector("#adam-milestones-complete");
    const masteredDays = milestones.days.length;

    if (countNode) countNode.textContent = `${masteredDays} / ${DAYS.length}`;
    if (grid) {
      grid.innerHTML = DAYS.map((day) => {
        const count = Math.min(OBJECTIVES_PER_DAY, masteredCount(mastered, day));
        const done = count === OBJECTIVES_PER_DAY;
        return `<span class="adam-milestone-day${done ? " is-mastered" : ""}" data-milestone-day="${day}" role="listitem" aria-label="Day ${day}: ${count} of 3 checkpoints${done ? ", mastered" : ""}">
          <strong>D${day}</strong><span>${done ? "MASTERED" : `${count}/3`}</span><i aria-hidden="true">${done ? "✓" : "○"}</i>
        </span>`;
      }).join("");
    }
    if (complete) complete.hidden = !milestones.allSix;
  }

  function ensureStyles() {
    if (document.getElementById("adam-mastery-milestones-styles")) return;
    const style = document.createElement("style");
    style.id = "adam-mastery-milestones-styles";
    style.textContent = `
      .adam-mastery-milestones{position:relative;z-index:2;margin:0 0 12px;padding:14px;border:2px solid #ff1493;border-radius:18px;background:#fff;box-shadow:0 14px 34px rgba(16,42,67,.10);box-sizing:border-box}
      .adam-milestones-head{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}
      .adam-milestones-kicker{display:block;color:#ff1493;font-size:8px;font-weight:1000;letter-spacing:.13em}
      .adam-milestones-head h3{margin:4px 0 0;color:#102a43;font-size:17px;line-height:1.08}
      .adam-milestones-count{padding:5px 8px;border-radius:8px;background:#fff0f8;color:#d20d78;font-size:9px;font-weight:1000;white-space:nowrap}
      .adam-milestones-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:5px;margin-top:11px}
      .adam-milestone-day{position:relative;display:grid;justify-items:center;gap:3px;padding:8px 2px;border:1px solid #d7e0f1;border-radius:10px;background:#f8faff;color:#7890aa;box-sizing:border-box}
      .adam-milestone-day strong{font-size:10px;line-height:1;font-weight:1000}.adam-milestone-day span{font-size:7px;line-height:1;font-weight:1000;letter-spacing:.03em}.adam-milestone-day i{font-style:normal;font-size:14px;line-height:1;color:#a8b7ca}
      .adam-milestone-day.is-mastered{border-color:#ff1493;background:#fff0f8;color:#d20d78;box-shadow:0 0 0 1px rgba(255,20,147,.08)}.adam-milestone-day.is-mastered i{color:#ff1493;font-weight:1000}
      .adam-milestones-complete{display:flex;align-items:center;gap:10px;margin-top:10px;padding:10px;border-radius:12px;border:1px solid rgba(255,20,147,.28);background:linear-gradient(135deg,#fff0f8,#fff7fb)}
      .adam-milestones-complete[hidden]{display:none}.adam-milestones-trophy{display:grid;place-items:center;width:32px;height:32px;flex:0 0 32px;border-radius:50%;background:#ff1493;color:#fff;font-size:17px;font-weight:1000}.adam-milestones-complete strong{display:block;color:#d20d78;font-size:10px;letter-spacing:.06em}.adam-milestones-complete small{display:block;margin-top:3px;color:#70485f;font-size:9px;line-height:1.35}
      @media(max-width:360px){.adam-mastery-milestones{padding:12px}.adam-milestones-head h3{font-size:15px}.adam-milestones-grid{gap:4px}.adam-milestone-day{padding:7px 1px}.adam-milestone-day strong{font-size:9px}.adam-milestone-day span{font-size:6px}.adam-milestone-day i{font-size:12px}}
    `;
    document.head.appendChild(style);
  }

  function init() {
    ensureStyles();
    render();
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY || event.key === MILESTONE_KEY) render();
    });
    document.addEventListener("gei:navigation", render);
    document.addEventListener("gei:progress-ready", render);
    document.addEventListener("gei:progress-updated", render);
    window.setInterval(render, 900);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
