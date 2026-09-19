/* V1.14 — GEI Achievement Vault & Learner Identity */
(() => {
  "use strict";
  const STORAGE_KEY = "geiAcademyLearnerIdentityV1";
  const DEFAULT = { visits: 0, joinedAt: null };
  let state = load();
  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return { ...DEFAULT, ...parsed, visits: Math.max(0, Number(parsed?.visits) || 0), joinedAt: typeof parsed?.joinedAt === "string" ? parsed.joinedAt : null };
    } catch (error) { return { ...DEFAULT }; }
  }
  function save() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (error) {} }
  function getIdentity() {
    const progress = window.GEI_PROGRESS?.getState?.() || { completed: [], xp: 0 };
    const achievements = window.GEI_ACHIEVEMENTS?.getState?.() || { earned: [], totalRewards: 0 };
    return { joinedAt: state.joinedAt, visits: state.visits, daysCompleted: progress.completed?.length || 0, xp: progress.xp || 0, achievements: achievements.earned?.length || 0 };
  }
  function markup() {
    return `<section class="gei-vault-card" id="gei-vault-card" aria-labelledby="gei-vault-title"><div class="gei-vault-head"><div><span class="gei-vault-kicker">LEARNER IDENTITY</span><h2 id="gei-vault-title">Achievement Vault</h2></div><span class="gei-vault-badge" id="gei-vault-badge">0 / 4</span></div><div class="gei-vault-identity"><span class="gei-vault-avatar" id="gei-vault-avatar" aria-hidden="true"></span><div><strong id="gei-vault-name">GEI LEARNER</strong><span id="gei-vault-since">Building your learning identity</span></div><span class="gei-vault-complete" id="gei-vault-complete" hidden>BLUEPRINT COMPLETE</span></div><div class="gei-vault-grid" id="gei-vault-grid"></div><div class="gei-vault-history"><span>ACHIEVEMENT HISTORY</span><strong id="gei-vault-last-earned">No achievements yet</strong></div><p class="gei-vault-status" id="gei-vault-status">Complete GEI learning days to build your achievement record.</p></section>`;
  }
  function ensure() {
    const screen = document.getElementById("screen-home");
    const stack = screen?.querySelector(".home-experience-stack") || screen?.querySelector(".dashboard-main");
    if (!stack || document.getElementById("gei-vault-card")) return;
    stack.insertAdjacentHTML("beforeend", markup());
  }
  function render() {
    ensure();
    const card = document.getElementById("gei-vault-card");
    if (!card) return;
    const list = window.GEI_ACHIEVEMENTS?.getAchievements?.() || [];
    const achievementState = window.GEI_ACHIEVEMENTS?.getState?.() || { earned: [], totalRewards: 0, lastEarned: null };
    const earned = list.filter((item) => item.earned);
    const grid = card.querySelector("#gei-vault-grid");
    if (grid) grid.innerHTML = list.map((item) => `<div class="gei-vault-item ${item.earned ? "is-earned" : "is-locked"}" aria-label="${item.earned ? "Earned" : "Locked"}: ${item.days}-day ${item.name}"><span>${item.earned ? item.icon : "🔒"}</span><strong>${item.days}-DAY</strong><small>${item.name}</small><em>${item.earned ? `+${item.reward} XP` : "LOCKED"}</em></div>`).join("");
    const badge = card.querySelector("#gei-vault-badge"); if (badge) badge.textContent = `${earned.length} / ${list.length || 4}`;
    if (!state.joinedAt) { state.joinedAt = new Date().toISOString(); save(); }
    const api=window.GEI_IDENTITY;
    const damName=api?.getDamName?.()||"";
    const nameEl=card.querySelector("#gei-vault-name"); if(nameEl) nameEl.textContent=damName?"@"+damName:"GEI LEARNER";
    const avatarEl=card.querySelector("#gei-vault-avatar"); if(avatarEl&&api){avatarEl.innerHTML=api.avatarMarkup({className:"gei-vault-avatar-image",alt:"Adam, the YallToo mascot"});}
    const since = card.querySelector("#gei-vault-since"); if (since) since.textContent = damName ? "Learner since "+new Date(state.joinedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : "Set your Dam Name in Profile";
    const complete = card.querySelector("#gei-vault-complete"); if (complete) complete.hidden = !achievementState.earned?.includes(6);
    const last = card.querySelector("#gei-vault-last-earned");
    if (last) { const latest = list.find((item) => item.days === achievementState.lastEarned); last.textContent = latest ? `${latest.days}-DAY ${latest.name} • +${latest.reward} XP` : "No achievements yet"; }
    const status = card.querySelector("#gei-vault-status"); if (status) status.textContent = earned.length ? `${earned.length} achievement${earned.length === 1 ? "" : "s"} secured • ${achievementState.totalRewards || 0} XP from streak rewards.` : "Complete GEI learning days to build your achievement record.";
  }
  function init() {
    render(); state.visits += 1; save();
    window.addEventListener("gei:achievements-ready", render);
    window.addEventListener("gei:achievement-earned", render);
    window.addEventListener("gei:progress-ready", render);
    window.addEventListener("gei:progress-updated", render);
    window.addEventListener("gei:identity-updated", render);
    window.addEventListener("gei:learner-identity-ready", render);
    window.GEI_VAULT = Object.freeze({ getIdentity: () => ({ ...getIdentity(), visits: state.visits }), render });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
