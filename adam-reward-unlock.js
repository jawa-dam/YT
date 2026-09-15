/* V1.34 — Adam Reward Unlock Experience */
(() => {
  "use strict";
  const MASTERY_KEY = "geiAdamObjectiveMasteryV1";
  const DAYS = Object.freeze([1,2,3,4,5,6]);
  const PER_DAY = 3;
  const ID = "adam-reward-unlock";

  function mastery() {
    try {
      const d = JSON.parse(localStorage.getItem(MASTERY_KEY) || "{}");
      return Array.isArray(d.mastered) ? [...new Set(d.mastered.map(String))] : [];
    } catch (_) { return []; }
  }
  function count(m, day) { return m.filter(k => k.startsWith(`${day}-`)).length; }
  function earned(m, day) { return count(m, day) >= PER_DAY; }

  function build() {
    const e = document.createElement("section");
    e.id = ID;
    e.className = "adam-reward-unlock";
    e.setAttribute("aria-labelledby", "adam-reward-unlock-title");
    e.innerHTML = `
      <div class="adam-reward-unlock-head">
        <span class="adam-reward-unlock-icon" aria-hidden="true">🎁</span>
        <div><span class="adam-reward-unlock-kicker">ADAM • REWARD VAULT</span>
        <h3 id="adam-reward-unlock-title">Earned rewards</h3></div>
      </div>
      <p class="adam-reward-unlock-message" aria-live="polite"></p>
      <div class="adam-reward-grid" role="list" aria-label="Earned mastery rewards"></div>`;
    return e;
  }

  function render() {
    const academy = document.getElementById("screen-academy");
    const view = academy?.querySelector(".academy-view");
    const celebration = view?.querySelector(":scope > .adam-mastery-celebration");
    if (!view || !celebration) return;
    let root = view.querySelector(":scope > #" + ID);
    if (!root) { root = build(); celebration.insertAdjacentElement("afterend", root); }

    const m = mastery();
    const earnedDays = DAYS.filter(d => earned(m, d));
    const allSix = earnedDays.length === DAYS.length;
    const message = root.querySelector(".adam-reward-unlock-message");
    if (message) message.textContent = allSix
      ? "All six mastery rewards are earned. Blueprint Master unlocked."
      : earnedDays.length
        ? `${earnedDays.length} of 6 mastery rewards earned. Complete each day's checkpoints to unlock the next reward.`
        : "Complete a day's 3 mastery checkpoints to unlock its reward.";

    const grid = root.querySelector(".adam-reward-grid");
    if (grid) grid.innerHTML = DAYS.map(d => {
      const isEarned = earned(m, d);
      return `<article class="adam-reward-item${isEarned ? " is-earned" : " is-locked"}" role="listitem" aria-label="Day ${d} reward: ${isEarned ? "earned" : "locked"}">
        <span class="adam-reward-badge" aria-hidden="true">${isEarned ? "🏅" : "🔒"}</span>
        <div><strong>Day ${d}</strong><small>${isEarned ? "REWARD EARNED" : "LOCKED • 3/3 MASTERY"}</small></div>
      </article>`;
    }).join("") + `<article class="adam-reward-item adam-reward-final${allSix ? " is-earned" : " is-locked"}" role="listitem" aria-label="Blueprint Master reward: ${allSix ? "unlocked" : "locked"}">
      <span class="adam-reward-badge" aria-hidden="true">${allSix ? "👑" : "🔒"}</span>
      <div><strong>Blueprint Master</strong><small>${allSix ? "18/18 • UNLOCKED" : "LOCKED • 18/18 REQUIRED"}</small></div>
    </article>`;
  }

  function init() {
    render();
    document.addEventListener("gei:navigation", render);
    document.addEventListener("gei:progress-ready", render);
    document.addEventListener("gei:progress-updated", render);
    window.addEventListener("storage", e => { if (e.key === MASTERY_KEY) render(); });
    window.setInterval(render, 1200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
