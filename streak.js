/* V1.12 — GEI Learning Streak & Momentum Intelligence */
(() => {
  "use strict";

  const STORAGE_KEY = "geiAcademyStreakV1";
  const DEFAULT_STATE = { streak: 0, best: 0, lastActivityDate: null, milestone: 0 };
  let state = loadState();

  function localDateKey(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function dateFromKey(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key || "")) return null;
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function dayGap(fromKey, toKey) {
    const from = dateFromKey(fromKey);
    const to = dateFromKey(toKey);
    if (!from || !to) return null;
    return Math.round((to - from) / 86400000);
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      return {
        streak: Math.max(0, Number(parsed.streak) || 0),
        best: Math.max(0, Number(parsed.best) || 0),
        lastActivityDate: typeof parsed.lastActivityDate === "string" ? parsed.lastActivityDate : null,
        milestone: Math.max(0, Number(parsed.milestone) || 0)
      };
    } catch (error) {
      return { ...DEFAULT_STATE };
    }
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) { /* storage may be unavailable */ }
  }

  function getStatus() {
    const today = localDateKey();
    const gap = state.lastActivityDate ? dayGap(state.lastActivityDate, today) : null;
    if (!state.streak) return "READY TO BUILD";
    if (gap === 0) return state.streak >= 5 ? "STRONG MOMENTUM" : (state.streak >= 2 ? "BUILDING MOMENTUM" : "STARTED");
    if (gap === 1) return "KEEP IT GOING";
    return "READY TO RESTART";
  }

  function recordActivity() {
    const today = localDateKey();
    if (state.lastActivityDate === today) return false;

    const gap = state.lastActivityDate ? dayGap(state.lastActivityDate, today) : null;
    state.streak = gap === 1 ? Math.max(1, state.streak + 1) : 1;
    state.best = Math.max(state.best, state.streak);
    state.lastActivityDate = today;
    const milestones = [2, 3, 5, 6];
    state.milestone = milestones.includes(state.streak) ? state.streak : state.milestone;
    saveState();
    render();
    const detail = { ...state, status: getStatus() };
    window.dispatchEvent(new CustomEvent("gei:streak-updated", { detail }));
    updateAdam(detail);
    return true;
  }

  function streakMarkup() {
    return `<section class="gei-streak-card" id="gei-streak-card" aria-labelledby="gei-streak-title">
      <div class="gei-streak-main">
        <span class="gei-streak-kicker">LEARNING MOMENTUM</span>
        <h2 id="gei-streak-title">0 Day Streak</h2>
        <p id="gei-streak-copy">Complete a GEI day today to start your learning rhythm.</p>
      </div>
      <div class="gei-streak-badge" aria-label="Current learning streak"><strong id="gei-streak-number">0</strong><span>DAYS</span></div>
      <div class="gei-streak-meta"><span id="gei-streak-momentum">READY TO BUILD</span><span id="gei-streak-best">BEST 0 DAYS</span></div>
    </section>`;
  }

  function ensureCard() {
    const screen = document.getElementById("screen-home");
    const stack = screen?.querySelector(".home-experience-stack");
    if (!stack || document.getElementById("gei-streak-card")) return;
    stack.insertAdjacentHTML("beforeend", streakMarkup());
  }

  function render() {
    ensureCard();
    const card = document.getElementById("gei-streak-card");
    if (!card) return;
    const today = localDateKey();
    const activeToday = state.lastActivityDate === today;
    const number = card.querySelector("#gei-streak-number");
    const title = card.querySelector("#gei-streak-title");
    const copy = card.querySelector("#gei-streak-copy");
    const momentum = card.querySelector("#gei-streak-momentum");
    const best = card.querySelector("#gei-streak-best");
    const status = getStatus();
    if (number) number.textContent = String(state.streak);
    if (title) title.textContent = `${state.streak} Day Streak`;
    if (momentum) momentum.textContent = status;
    if (best) best.textContent = `BEST ${state.best} ${state.best === 1 ? "DAY" : "DAYS"}`;
    if (copy) {
      if (!state.streak) copy.textContent = "Complete a GEI day today to start your learning rhythm.";
      else if (activeToday && state.streak >= 5) copy.textContent = "Strong momentum. Keep your learning rhythm moving forward.";
      else if (activeToday && state.streak >= 2) copy.textContent = `${state.streak} days in a row. Your learning rhythm is building.`;
      else if (activeToday) copy.textContent = "You've started your learning rhythm. Come back tomorrow to extend it.";
      else if (state.lastActivityDate && dayGap(state.lastActivityDate, today) === 1) copy.textContent = "Yesterday was your last learning day. Complete another day today to keep the streak alive.";
      else copy.textContent = "Your previous streak is ready for a fresh start. Complete a GEI day today.";
    }
    card.classList.toggle("is-active", activeToday);
    card.dataset.milestone = String(state.milestone || 0);
  }

  function updateAdam(detail) {
    const message = document.querySelector("#home-adam-assistant-message");
    if (!message) return;
    const status = detail.status;
    if (detail.streak >= 5 && status === "STRONG MOMENTUM") message.textContent = "Strong momentum. Keep your GEI learning rhythm moving forward.";
    else if (detail.streak >= 2 && status === "BUILDING MOMENTUM") message.textContent = `You're on a ${detail.streak}-day learning streak. Keep building your momentum.`;
    else if (status === "KEEP IT GOING") message.textContent = "Yesterday you learned. Complete another GEI day today to keep your streak alive.";
    else if (status === "READY TO RESTART") message.textContent = "Your learning rhythm is ready for a fresh start. Let's build it again.";
    else if (detail.streak === 1) message.textContent = "You've started your learning rhythm. Come back tomorrow and keep it going.";
  }

  function resetStreak() {
    state = { ...DEFAULT_STATE };
    saveState();
    render();
    window.dispatchEvent(new CustomEvent("gei:streak-updated", { detail: { ...state, status: getStatus() } }));
  }

  function init() {
    render();
    window.addEventListener("gei:progress-updated", (event) => {
      if (event.detail?.completedDay) window.setTimeout(recordActivity, 0);
    });
    window.addEventListener("gei:progress-ready", () => render());
    window.GEI_STREAK = Object.freeze({ getState: () => ({ ...state }), getStatus, recordActivity, resetStreak });
    window.dispatchEvent(new CustomEvent("gei:streak-ready", { detail: { ...state, status: getStatus() } }));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
