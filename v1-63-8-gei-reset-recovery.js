/* V1.63.8 — GEI Reset Recovery Integrity
   Verifies that a Dam Reset survives navigation and reload without touching learner identity.
*/
(() => {
  "use strict";
  const MARKER = "geiDamResetRecoveryV1";
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

  function markerExists() {
    try { return !!localStorage.getItem(MARKER); } catch (_) { return false; }
  }

  function enforceCleanState() {
    RESET_KEYS.forEach((key) => {
      try { localStorage.removeItem(key); } catch (_) {}
    });

    // Re-establish the canonical zero state explicitly.
    try {
      localStorage.setItem("geiAcademyProgressV1", JSON.stringify({ completed: [], xp: 0 }));
      localStorage.setItem("geiDayCompletionV1", "{}");
      localStorage.setItem("geiDayAudioProgressV1", "{}");
      localStorage.setItem("geiAdamObjectiveMasteryV1", JSON.stringify({ mastered: [] }));
      localStorage.setItem("geiAcademyStreakV1", JSON.stringify({ streak: 0, best: 0, lastActivityDate: null, milestone: 0 }));
      localStorage.setItem("geiBadgeStateV1", JSON.stringify({ earned: [] }));
      localStorage.setItem("geiMasteryMilestonesV1", "[]");
    } catch (_) {}

    try { localStorage.removeItem(MARKER); } catch (_) {}

    window.dispatchEvent(new CustomEvent("gei:dam-reset-recovered", {
      detail: { completed: [], xp: 0, currentDay: 1, preservedIdentity: true, source: "v1.63.8" }
    }));
    window.dispatchEvent(new CustomEvent("gei:progress-updated", {
      detail: { completed: [], xp: 0, currentDay: 1, source: "dam-reset-recovery" }
    }));
    window.dispatchEvent(new CustomEvent("gei:badges-updated", {
      detail: { earned: [], total: 12, newlyEarned: 0, source: "dam-reset-recovery" }
    }));
  }

  function verify() {
    if (!markerExists()) return;
    enforceCleanState();
  }

  function init() {
    verify();
    window.GEI_DAM_RESET_RECOVERY = Object.freeze({
      version: "1.63.8",
      verify,
      isResetPending: markerExists
    });
    window.addEventListener("pageshow", verify);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();