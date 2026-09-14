/* V1.10 — GEI Guided Entry & Progress Experience */
(() => {
  "use strict";

  const STORAGE_KEY = "geiAcademyProgressV1";
  const DAYS = [
    { id: 1, title: "Day 1", url: "https://www.yalltoo.com/genesis-engineered-day-1" },
    { id: 2, title: "Day 2", url: "https://www.yalltoo.com/genesis-engineered-day-2-firmament-dam-wall" },
    { id: 3, title: "Day 3", url: "https://www.yalltoo.com/genesis-engineered-day-3-waters-land" },
    { id: 4, title: "Day 4", url: "https://www.yalltoo.com/day-4-mill-of-the-dam" },
    { id: 5, title: "Day 5", url: "https://www.yalltoo.com/day-5-mill-activation" },
    { id: 6, title: "Day 6", url: "https://www.yalltoo.com/genesis-engineered-day-6-final-operator" }
  ];

  const DEFAULT_STATE = { completed: [], xp: 0 };
  let state = loadState();

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      const completed = Array.isArray(parsed.completed) ? parsed.completed.map(Number).filter((id) => id >= 1 && id <= 6) : [];
      return { completed: [...new Set(completed)].sort((a, b) => a - b), xp: Math.max(0, Number(parsed.xp) || 0) };
    } catch (error) {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* localStorage may be unavailable */ }
  }

  function completedCount() { return state.completed.length; }
  function currentDayId() { return DAYS.find((day) => !state.completed.includes(day.id))?.id || 6; }
  function isComplete(id) { return state.completed.includes(id); }
  function isUnlocked(id) { return id === 1 || state.completed.includes(id - 1); }

  function completeDay(id) {
    if (id < 1 || id > 6 || isComplete(id)) return;
    state.completed.push(id);
    state.completed = [...new Set(state.completed)].sort((a, b) => a - b);
    state.xp += 100;
    saveState();
    renderAll();
    window.dispatchEvent(new CustomEvent("gei:progress-updated", { detail: { ...state, currentDay: currentDayId() } }));
  }

  function resetProgress() {
    state = { ...DEFAULT_STATE };
    saveState();
    renderAll();
    window.dispatchEvent(new CustomEvent("gei:progress-updated", { detail: { ...state, currentDay: currentDayId() } }));
  }

  function journeyMarkup() {
    return `<section class="gei-journey-card" id="gei-journey-card" aria-labelledby="gei-journey-title">
      <div class="gei-journey-top">
        <div><span class="gei-journey-kicker">GEI PROGRESS</span><h2 class="gei-journey-title" id="gei-journey-title">Continue Your Journey</h2></div>
        <span class="gei-journey-count" id="gei-journey-count">0 / 6</span>
      </div>
      <p class="gei-journey-copy" id="gei-journey-copy">You're ready for Day 1. Start with the source, water, engineering and interpretation.</p>
      <div class="gei-journey-track" role="progressbar" aria-label="GEI learning progress" aria-valuemin="0" aria-valuemax="6" aria-valuenow="0"><span class="gei-journey-fill" id="gei-journey-fill"></span></div>
      <div class="gei-journey-milestone" id="gei-journey-milestone"><span id="gei-journey-milestone-text">DAY 1 COMPLETE</span><span class="gei-journey-xp" id="gei-journey-xp">+100 XP</span></div>
      <div class="gei-journey-actions"><a class="gei-journey-primary" id="gei-journey-primary" href="${DAYS[0].url}" target="_blank" rel="noopener noreferrer">START DAY 1 →</a><button class="gei-journey-complete" id="gei-journey-complete" type="button">MARK COMPLETE</button></div>
    </section>`;
  }

  function ensureJourneyCard() {
    const screen = document.getElementById("screen-home");
    const stack = screen?.querySelector(".home-experience-stack");
    if (!stack || document.getElementById("gei-journey-card")) return;
    stack.insertAdjacentHTML("afterbegin", journeyMarkup());
    document.getElementById("gei-journey-complete")?.addEventListener("click", () => completeDay(currentDayId()));
  }

  function updateJourney() {
    const card = document.getElementById("gei-journey-card");
    if (!card) return;
    const count = completedCount();
    const current = currentDayId();
    const day = DAYS[current - 1];
    const previous = current > 1 ? DAYS[current - 2] : null;
    const countEl = document.getElementById("gei-journey-count");
    const copyEl = document.getElementById("gei-journey-copy");
    const fill = document.getElementById("gei-journey-fill");
    const primary = document.getElementById("gei-journey-primary");
    const complete = document.getElementById("gei-journey-complete");
    const milestone = document.getElementById("gei-journey-milestone");
    const milestoneText = document.getElementById("gei-journey-milestone-text");
    const xp = document.getElementById("gei-journey-xp");
    if (countEl) countEl.textContent = `${count} / 6`;
    if (fill) fill.style.width = `${(count / 6) * 100}%`;
    const track = card.querySelector(".gei-journey-track");
    if (track) track.setAttribute("aria-valuenow", String(count));

    if (count === 0) {
      if (copyEl) copyEl.textContent = "You're ready for Day 1. Start with the source, water, engineering and interpretation.";
      if (primary) { primary.textContent = "START DAY 1 →"; primary.href = DAYS[0].url; }
      if (complete) { complete.textContent = "MARK DAY 1 COMPLETE"; complete.classList.remove("is-done"); }
      milestone?.classList.remove("is-visible");
    } else if (count < 6) {
      if (copyEl) copyEl.textContent = `Welcome back. ${day.title} is unlocked and ready when you are.`;
      if (primary) { primary.textContent = `CONTINUE ${day.title.toUpperCase()} →`; primary.href = day.url; }
      if (complete) { complete.textContent = `MARK ${day.title.toUpperCase()} COMPLETE`; complete.classList.remove("is-done"); }
      if (milestoneText) milestoneText.textContent = `${previous?.title.toUpperCase() || "DAY 1"} COMPLETE`;
      if (xp) xp.textContent = `+${count * 100} XP TOTAL`;
      milestone?.classList.add("is-visible");
    } else {
      if (copyEl) copyEl.textContent = "You've completed the six-day GEI blueprint. Your full learning path is complete.";
      if (primary) { primary.textContent = "REVIEW DAY 1 →"; primary.href = DAYS[0].url; }
      if (complete) { complete.textContent = "6 / 6 COMPLETE"; complete.classList.add("is-done"); }
      if (milestoneText) milestoneText.textContent = "BLUEPRINT COMPLETE";
      if (xp) xp.textContent = `+${state.xp} XP`;
      milestone?.classList.add("is-visible");
    }
  }

  function updateAcademy() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;
    const count = completedCount();
    const current = currentDayId();
    const pathCount = screen.querySelector(".academy-path-count");
    if (pathCount) pathCount.textContent = `${String(Math.min(current, 6)).padStart(2, "0")} / 06`;
    const progressChip = screen.querySelector(".academy-progress-chip span");
    if (progressChip) progressChip.textContent = `${count}/6`;
    const cards = screen.querySelectorAll(".academy-day-card");
    cards.forEach((card) => {
      const id = Number(card.dataset.day);
      const unlocked = isUnlocked(id);
      const done = isComplete(id);
      card.classList.toggle("is-completed", done);
      card.classList.toggle("is-current", id === current && !done);
      card.classList.toggle("is-locked", !unlocked);
      card.setAttribute("aria-disabled", unlocked ? "false" : "true");
      const status = card.querySelector(".academy-day-status");
      if (status) status.textContent = done ? "COMPLETE ✓" : (id === current ? "READY" : (unlocked ? "UNLOCKED" : "LOCKED"));
      if (!unlocked) card.setAttribute("tabindex", "-1"); else card.removeAttribute("tabindex");
    });
    const heroAction = screen.querySelector(".academy-primary-action");
    if (heroAction) {
      const day = DAYS[current - 1];
      heroAction.href = day.url;
      heroAction.querySelector("span")?.replaceChildren(document.createTextNode(`Continue ${day.title}`));
    }
  }

  function guardLockedAcademyLinks(event) {
    const card = event.target.closest?.(".academy-day-card");
    if (!card || !card.classList.contains("is-locked")) return;
    event.preventDefault();
    event.stopPropagation();
  }

  function renderAll() {
    ensureJourneyCard();
    updateJourney();
    updateAcademy();
  }

  function init() {
    renderAll();
    document.addEventListener("click", guardLockedAcademyLinks, true);
    window.GEI_PROGRESS = Object.freeze({ getState: () => ({ ...state }), getCurrentDay: currentDayId, completeDay, resetProgress });
    window.dispatchEvent(new CustomEvent("gei:progress-ready", { detail: { ...state, currentDay: currentDayId() } }));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
