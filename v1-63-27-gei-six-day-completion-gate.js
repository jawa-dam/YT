/* V1.63.27 — GEI Six-Day Completion Gate
   Establishes the persistent Dam Gate unlock.
   Eligibility: all six GEI days complete + 666 XP.
   This version NEVER consumes XP and NEVER clears learning history.
*/
(() => {
  "use strict";
  if (window.GEI_DAM_GATE) return;

  const STORAGE_KEY = "geiDamGateV1";
  const XP_KEY = "geiAcademyProgressV1";
  const COMPLETION_KEY = "geiDayCompletionV1";
  const MAX_XP = 666;

  const defaultState = Object.freeze({
    version: "1.63.27",
    unlocked: false,
    unlockedAt: null
  });

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function readXP() {
    const progress = readJSON(XP_KEY, {});
    return Math.min(MAX_XP, Math.max(0, Number(progress?.xp) || 0));
  }

  function readCompletedDays() {
    const ledger = readJSON(COMPLETION_KEY, {});
    const completed = new Set();

    for (let day = 1; day <= 6; day += 1) {
      if (ledger?.[day]?.completed === true &&
          Number(ledger?.[day]?.audioPercent || 0) >= 90) {
        completed.add(day);
      }
    }

    // Keep the canonical progress ledger as a second source of truth.
    const progress = readJSON(XP_KEY, {});
    if (Array.isArray(progress?.completed)) {
      progress.completed
        .map(Number)
        .filter((day) => day >= 1 && day <= 6)
        .forEach((day) => completed.add(day));
    }

    return completed;
  }

  function readState() {
    const stored = readJSON(STORAGE_KEY, {});
    return {
      version: "1.63.27",
      unlocked: stored?.unlocked === true,
      unlockedAt: stored?.unlockedAt || null
    };
  }

  function saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function eligibility() {
    const completed = readCompletedDays();
    const xp = readXP();
    return {
      completedCount: completed.size,
      allDaysComplete: completed.size >= 6,
      xp,
      hasRequiredXP: xp >= MAX_XP,
      eligible: completed.size >= 6 && xp >= MAX_XP
    };
  }

  function sync() {
    const current = readState();
    const check = eligibility();
    let next = current;

    if (!current.unlocked && check.eligible) {
      next = {
        version: "1.63.27",
        unlocked: true,
        unlockedAt: Date.now()
      };
      saveState(next);
      window.dispatchEvent(new CustomEvent("gei:dam-gate-unlocked", {
        detail: {
          ...next,
          completedCount: check.completedCount,
          xp: check.xp,
          source: "v1.63.27"
        }
      }));
    }

    const state = {
      ...next,
      ...check
    };

    window.GEI_DAM_GATE_STATE = state;
    return state;
  }

  function gateMarkup() {
    return `
      <section class="gei-dam-gate" id="gei-dam-gate" aria-labelledby="gei-dam-gate-title">
        <div class="gei-dam-gate-glow" aria-hidden="true"></div>
        <div class="gei-dam-gate-top">
          <div>
            <span class="academy-section-label">THE NEXT HYDRAULIC THRESHOLD</span>
            <h2 id="gei-dam-gate-title">The Dam Gate</h2>
          </div>
          <span class="gei-dam-gate-state" id="gei-dam-gate-state">LOCKED</span>
        </div>

        <div class="gei-dam-gate-body">
          <div class="gei-dam-gate-icon" aria-hidden="true">🚪</div>
          <div class="gei-dam-gate-copy">
            <strong id="gei-dam-gate-headline">Complete the six-day blueprint to approach the gate.</strong>
            <p id="gei-dam-gate-message">Finish Days 1–6 and reach 666 XP. Your learning record remains intact when the gate is later opened.</p>
          </div>
        </div>

        <div class="gei-dam-gate-checks" aria-label="Dam Gate requirements">
          <div class="gei-dam-gate-check" id="gei-dam-gate-days-check">
            <span aria-hidden="true">○</span>
            <span><b>SIX-DAY BLUEPRINT</b><small id="gei-dam-gate-days-value">0 / 6 DAYS</small></span>
          </div>
          <div class="gei-dam-gate-check" id="gei-dam-gate-xp-check">
            <span aria-hidden="true">○</span>
            <span><b>XP THRESHOLD</b><small id="gei-dam-gate-xp-value">0 / 666 XP</small></span>
          </div>
        </div>

        <div class="gei-dam-gate-next" id="gei-dam-gate-next">
          <span>V1.63.27</span>
          <strong>UNLOCK ESTABLISHED — OPENING CEREMONY COMES NEXT</strong>
        </div>
        <div class="gei-dam-gate-action-wrap" id="gei-dam-gate-action-wrap" hidden>
          <button class="gei-dam-gate-open" id="gei-dam-gate-open" type="button">
            <span>OPEN THE DAM</span><strong>666 XP</strong>
          </button>
        </div>
      </section>`;
  }

  function render() {
    const screen = document.getElementById("screen-academy");
    const path = screen?.querySelector(".academy-path");
    const status = screen?.querySelector("#gei-blueprint-status");
    if (!screen || !path || !status) return;

    let gate = screen.querySelector("#gei-dam-gate");
    if (!gate) {
      status.insertAdjacentHTML("afterend", gateMarkup());
      gate = screen.querySelector("#gei-dam-gate");
    }
    if (!gate) return;

    const state = sync();
    const daysCheck = gate.querySelector("#gei-dam-gate-days-check");
    const xpCheck = gate.querySelector("#gei-dam-gate-xp-check");
    const daysValue = gate.querySelector("#gei-dam-gate-days-value");
    const xpValue = gate.querySelector("#gei-dam-gate-xp-value");
    const stateEl = gate.querySelector("#gei-dam-gate-state");
    const headline = gate.querySelector("#gei-dam-gate-headline");
    const message = gate.querySelector("#gei-dam-gate-message");
    const next = gate.querySelector("#gei-dam-gate-next");
    const actionWrap = gate.querySelector("#gei-dam-gate-action-wrap");
    const openButton = gate.querySelector("#gei-dam-gate-open");

    const daysReady = state.allDaysComplete;
    const xpReady = state.hasRequiredXP;
    const unlocked = state.unlocked;
    const opened = Boolean(window.GEI_DAM_GATE_CEREMONY?.isOpened?.());
    if (actionWrap) actionWrap.hidden = !unlocked || opened;
    if (openButton) {
      openButton.disabled = !unlocked || opened;
      openButton.setAttribute("aria-disabled", String(!unlocked || opened));
    }

    daysCheck?.classList.toggle("is-ready", daysReady);
    xpCheck?.classList.toggle("is-ready", xpReady);
    if (daysValue) daysValue.textContent = `${Math.min(6, state.completedCount)} / 6 DAYS`;
    if (xpValue) xpValue.textContent = `${state.xp} / 666 XP`;

    gate.classList.toggle("is-unlocked", unlocked);
    gate.classList.toggle("is-eligible", !unlocked && state.eligible);

    if (stateEl) stateEl.textContent = unlocked ? "UNLOCKED" : state.eligible ? "READY" : "LOCKED";

    if (unlocked) {
      if (headline) headline.textContent = "The six-day blueprint has opened the Dam Gate.";
      if (message) message.textContent = "Your 666 XP threshold and six-day completion are verified. This version records the unlock only — XP has not been consumed.";
      if (next) {
        next.innerHTML = "<span>V1.63.27</span><strong>DAM GATE UNLOCKED • NEXT: OPEN THE DAM</strong>";
      }
    } else if (state.eligible) {
      if (headline) headline.textContent = "Eligibility verified. The Dam Gate is ready.";
      if (message) message.textContent = "Both requirements are complete. The persistent unlock is being established for the next gate ceremony.";
    } else if (daysReady) {
      if (headline) headline.textContent = "Blueprint complete. Now build the 666 XP threshold.";
      if (message) message.textContent = "All six hydraulic stages are complete. Continue earning XP until the Academy balance reaches 666.";
    } else if (xpReady) {
      if (headline) headline.textContent = "666 XP reached. Finish the six-day blueprint.";
      if (message) message.textContent = "Your XP threshold is ready, but the Dam Gate requires all six days to be completed first.";
    } else {
      if (headline) headline.textContent = "Complete the six-day blueprint to approach the gate.";
      if (message) message.textContent = "Finish Days 1–6 and reach 666 XP. Your learning record remains intact when the gate is later opened.";
    }

    if (openButton && openButton.dataset.bound !== "true") {
      openButton.dataset.bound = "true";
      openButton.addEventListener("click", () => window.GEI_DAM_GATE_CEREMONY?.confirm?.());
    }
    gate.setAttribute("data-gate-unlocked", String(unlocked));
    gate.setAttribute("data-gate-eligible", String(state.eligible));
  }

  function handleReset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
    window.GEI_DAM_GATE_STATE = { ...defaultState, ...eligibility() };
    window.dispatchEvent(new CustomEvent("gei:dam-gate-reset", {
      detail: { source: "v1.63.27" }
    }));
    render();
  }

  function init() {
    window.GEI_DAM_GATE = Object.freeze({
      version: "1.63.27",
      getState: () => ({ ...(window.GEI_DAM_GATE_STATE || sync()) }),
      isEligible: () => Boolean(sync().eligible),
      isUnlocked: () => Boolean(sync().unlocked),
      sync,
      render
    });

    render();

    [
      "gei:progress-ready",
      "gei:progress-updated",
      "gei:xp-updated",
      "gei:day-completion",
      "gei:badges-updated",
      "gei:dam-reset"
    ].forEach((eventName) => window.addEventListener(eventName, () => {
      if (eventName === "gei:dam-reset") handleReset();
      else render();
    }));

    window.addEventListener("storage", (event) => {
      if ([STORAGE_KEY, XP_KEY, COMPLETION_KEY].includes(event.key)) render();
    });

    window.addEventListener("gei:navigation", render);
    window.addEventListener("gei:academy-rendered", render);

    window.dispatchEvent(new CustomEvent("gei:dam-gate-ready", {
      detail: window.GEI_DAM_GATE.getState()
    }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();