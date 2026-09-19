/* V1.63.7 — GEI Dam Reset Engine
   Resets the six-day learning system without deleting learner identity.
*/
(() => {
  "use strict";
  if (window.GEI_DAM_RESET) return;

  const RESET_KEYS = [
    "geiAcademyProgressV1",
    "geiDayCompletionV1",
    "geiDayAudioProgressV1",
    "geiAdamObjectiveMasteryV1",
    "geiObjectiveXPRewardsV1",
    "geiMasteryMilestonesV1",
    "geiAcademyStreakV1",
    "geiBadgeStateV1",
    "geiAcademyAchievementsV1"
  ];

  function playFloodWarning() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.22, now + 0.04);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.7);
      master.connect(ctx.destination);

      [220, 165, 110].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(freq, now + i * 0.12);
        osc.frequency.exponentialRampToValueAtTime(Math.max(55, freq * 0.48), now + 0.72 + i * 0.12);
        gain.gain.setValueAtTime(0.0001, now + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.16, now + 0.16 + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.78 + i * 0.12);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now + i * 0.12);
        osc.stop(now + 0.9 + i * 0.12);
      });

      const siren = ctx.createOscillator();
      const sirenGain = ctx.createGain();
      siren.type = "square";
      siren.frequency.setValueAtTime(620, now);
      siren.frequency.linearRampToValueAtTime(920, now + 0.32);
      siren.frequency.linearRampToValueAtTime(620, now + 0.64);
      sirenGain.gain.setValueAtTime(0.0001, now);
      sirenGain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
      sirenGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.82);
      siren.connect(sirenGain);
      sirenGain.connect(master);
      siren.start(now);
      siren.stop(now + 0.9);

      window.setTimeout(() => ctx.close().catch(() => {}), 2200);
    } catch (_) {}
  }

  function createEffect() {
    const old = document.getElementById("gei-dam-reset-effect");
    old?.remove();
    const effect = document.createElement("div");
    effect.id = "gei-dam-reset-effect";
    effect.className = "gei-dam-reset-effect";
    effect.setAttribute("aria-live", "assertive");
    effect.innerHTML =
      '<div class="gei-reset-crack gei-reset-crack-a"></div>' +
      '<div class="gei-reset-crack gei-reset-crack-b"></div>' +
      '<div class="gei-reset-water gei-reset-water-a"></div>' +
      '<div class="gei-reset-water gei-reset-water-b"></div>' +
      '<div class="gei-reset-warning"><span>⚠️ DAM BREAK</span><strong>THE DAM RESETS</strong><small>GEI BLUEPRINT RETURNING TO DAY 1</small></div>';
    document.body.appendChild(effect);
    window.setTimeout(() => effect.remove(), 2400);
  }

  function resetData() {
    RESET_KEYS.forEach((key) => {
      try { localStorage.removeItem(key); } catch (_) {}
    });

    // Preserve the learner's Dam Name, avatar and profile identity.
    window.GEI_PROGRESS?.resetProgress?.();

    // resetProgress() intentionally owns the canonical XP/completion state.
    // Clear auxiliary progress again after its event so no stale ledger survives.
    try {
      localStorage.removeItem("geiDayCompletionV1");
      localStorage.removeItem("geiDayAudioProgressV1");
      localStorage.removeItem("geiAdamObjectiveMasteryV1");
      localStorage.removeItem("geiObjectiveXPRewardsV1");
      localStorage.removeItem("geiMasteryMilestonesV1");
      localStorage.removeItem("geiAcademyStreakV1");
      localStorage.removeItem("geiBadgeStateV1");
      localStorage.removeItem("geiAcademyAchievementsV1");
    } catch (_) {}

    window.dispatchEvent(new CustomEvent("gei:dam-reset", {
      detail: { completed: [], xp: 0, preservedIdentity: true, source: "v1.63.7" }
    }));
    window.dispatchEvent(new CustomEvent("gei:progress-updated", {
      detail: { completed: [], xp: 0, currentDay: 1, source: "dam-reset" }
    }));
    window.dispatchEvent(new CustomEvent("gei:badges-updated", {
      detail: { earned: [], total: 12, newlyEarned: 0, source: "dam-reset" }
    }));
  }

  function confirmReset() {
    if (document.querySelector(".gei-reset-confirm")) return;

    const backdrop = document.createElement("div");
    backdrop.className = "gei-reset-confirm";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-labelledby", "gei-reset-title");
    backdrop.innerHTML =
      '<div class="gei-reset-dialog">' +
      '<span class="gei-reset-dialog-icon" aria-hidden="true">⚠️</span>' +
      '<span class="gei-reset-dialog-kicker">DAM RESET</span>' +
      '<h2 id="gei-reset-title">Break the Dam?</h2>' +
      '<p>This resets Days 1–6, XP, mastery, badges, audio progress and streaks back to the beginning.</p>' +
      '<strong>Your Dam Name and learner identity stay safe.</strong>' +
      '<div class="gei-reset-actions"><button type="button" class="gei-reset-cancel">KEEP THE DAM</button><button type="button" class="gei-reset-confirm-action">BREAK THE DAM</button></div>' +
      '</div>';

    document.body.appendChild(backdrop);
    const cancel = backdrop.querySelector(".gei-reset-cancel");
    const confirm = backdrop.querySelector(".gei-reset-confirm-action");
    const close = () => backdrop.remove();
    cancel.addEventListener("click", close);
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) close(); });
    confirm.addEventListener("click", () => {
      close();
      playFloodWarning();
      createEffect();
      resetData();
    });
    cancel.focus();
  }

  function install() {
    const button = document.querySelector('[data-gei-reset-dam]');
    if (!button || button.dataset.geiResetBound === "true") return;
    button.dataset.geiResetBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      confirmReset();
    });
  }

  function init() {
    install();
    window.GEI_DAM_RESET = Object.freeze({
      version: "1.63.7",
      reset: resetData,
      confirm: confirmReset
    });
    window.addEventListener("gei:navigation", install);
    window.addEventListener("gei:progress-ready", install);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();