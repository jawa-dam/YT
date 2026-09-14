/* V1.13 — GEI Learning Streak Rewards & Achievement Intelligence */
(() => {
  "use strict";
  const STORAGE_KEY = "geiAcademyAchievementsV1";
  const ACHIEVEMENTS = [
    { days: 2, name: "First Spark", icon: "✦", reward: 25, message: "Two learning days in a row." },
    { days: 3, name: "Flow Builder", icon: "💧", reward: 50, message: "Three days of GEI momentum." },
    { days: 5, name: "Dam Builder", icon: "⚙", reward: 75, message: "Five days of sustained learning." },
    { days: 6, name: "Blueprint Master", icon: "🏆", reward: 100, message: "The full six-day rhythm achieved." }
  ];
  const DEFAULT_STATE = { earned: [], totalRewards: 0, lastEarned: null };
  let state = loadState();
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return { ...DEFAULT_STATE };
      const parsed = JSON.parse(raw);
      return { earned: Array.isArray(parsed.earned) ? parsed.earned.map(Number).filter((n) => ACHIEVEMENTS.some((a) => a.days === n)) : [], totalRewards: Math.max(0, Number(parsed.totalRewards) || 0), lastEarned: Number(parsed.lastEarned) || null };
    } catch (error) { return { ...DEFAULT_STATE }; }
  }
  function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) {} }
  function markup() {
    return `<section class="gei-achievement-card" id="gei-achievement-card" aria-labelledby="gei-achievement-title"><div class="gei-achievement-top"><div><span class="gei-achievement-kicker">STREAK ACHIEVEMENTS</span><h2 class="gei-achievement-title" id="gei-achievement-title">Learning Rewards</h2></div><span class="gei-achievement-count" id="gei-achievement-count">0 / 4</span></div><div class="gei-achievement-grid" aria-label="GEI streak achievements">${ACHIEVEMENTS.map((a) => `<div class="gei-achievement" data-achievement-days="${a.days}"><span class="gei-achievement-icon" aria-hidden="true">${a.icon}</span><span class="gei-achievement-name">${a.days}-DAY ${a.name}</span><span class="gei-achievement-reward">+${a.reward} XP</span></div>`).join("")}</div><p class="gei-achievement-status" id="gei-achievement-status">Build your streak to unlock your first reward.</p><div class="gei-achievement-toast" id="gei-achievement-toast" role="status" aria-live="polite"><span class="gei-achievement-toast-icon" id="gei-achievement-toast-icon">🏆</span><span class="gei-achievement-toast-copy"><strong id="gei-achievement-toast-title">Achievement earned!</strong><span id="gei-achievement-toast-message"></span></span><span class="gei-achievement-toast-xp" id="gei-achievement-toast-xp"></span></div></section>`;
  }
  function ensureCard() {
    const screen = document.getElementById("screen-home");
    const stack = screen?.querySelector(".home-experience-stack") || screen?.querySelector(".dashboard-main");
    if (!stack || document.getElementById("gei-achievement-card")) return;
    stack.insertAdjacentHTML("beforeend", markup());
  }
  function render() {
    ensureCard(); const card = document.getElementById("gei-achievement-card"); if (!card) return;
    const earned = new Set(state.earned); card.querySelectorAll(".gei-achievement").forEach((el) => el.classList.toggle("is-earned", earned.has(Number(el.dataset.achievementDays))));
    const count = card.querySelector("#gei-achievement-count"); if (count) count.textContent = `${state.earned.length} / ${ACHIEVEMENTS.length}`;
    const status = card.querySelector("#gei-achievement-status"); if (status) status.textContent = state.earned.length ? `${state.earned.length} achievement${state.earned.length === 1 ? "" : "s"} earned • ${state.totalRewards} XP from streak rewards.` : "Build your streak to unlock your first reward.";
  }
  function showToast(achievement) {
    const toast = document.getElementById("gei-achievement-toast"); if (!toast) return;
    document.getElementById("gei-achievement-toast-icon").textContent = achievement.icon;
    document.getElementById("gei-achievement-toast-title").textContent = `${achievement.days}-Day Achievement Earned!`;
    document.getElementById("gei-achievement-toast-message").textContent = achievement.message;
    document.getElementById("gei-achievement-toast-xp").textContent = `+${achievement.reward} XP`;
    toast.classList.add("is-visible");
    window.setTimeout(() => toast.classList.remove("is-visible"), 4200);
  }
  function rewardXP(amount) {
    if (window.GEI_PROGRESS?.addXP) window.GEI_PROGRESS.addXP(amount, "streak-achievement");
  }
  function evaluate(detail) {
    const streak = Number(detail?.streak) || 0; if (!streak) return;
    const achievement = ACHIEVEMENTS.find((a) => a.days === streak && !state.earned.includes(a.days)); if (!achievement) return;
    state.earned.push(achievement.days); state.earned = [...new Set(state.earned)].sort((a,b) => a-b); state.totalRewards += achievement.reward; state.lastEarned = achievement.days; saveState(); render(); rewardXP(achievement.reward); showToast(achievement);
    window.dispatchEvent(new CustomEvent("gei:achievement-earned", { detail: { ...achievement, totalRewards: state.totalRewards } }));
    const message = document.querySelector("#home-adam-assistant-message"); if (message) message.textContent = `Achievement unlocked: ${achievement.days}-day ${achievement.name}. You earned +${achievement.reward} XP. Keep building your GEI rhythm.`;
  }
  function init() {
    render(); window.addEventListener("gei:streak-updated", (event) => evaluate(event.detail)); window.addEventListener("gei:progress-ready", render); window.GEI_ACHIEVEMENTS = Object.freeze({ getState: () => ({ ...state }), getAchievements: () => ACHIEVEMENTS.map((a) => ({ ...a, earned: state.earned.includes(a.days) })) }); window.dispatchEvent(new CustomEvent("gei:achievements-ready", { detail: { ...state } }));
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
