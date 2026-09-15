/* V1.17 — Compact Home Section Popouts */
(() => {
  "use strict";
  const CONFIG = [
    ["gei-streak-card", "🎁", "LEARNING MOMENTUM", "0 Day Streak"],
    ["gei-vault-card", "🔐", "LEARNER IDENTITY", "Achievement Vault"],
    ["gei-journey-card", "🧭", "GEI PROGRESS", "Continue Your Journey"],
    ["gei-achievement-card", "🏆", "STREAK ACHIEVEMENTS", "Learning Rewards"],
    ["gei-profile-card", "👤", "LEARNER PROFILE", "Blueprint Identity"]
  ];
  const SELECTOR = CONFIG.map(([id]) => `#${id}`).join(",");
  let observer;

  function configFor(card) { return CONFIG.find(([id]) => id === card.id); }
  function makeTrigger(card, cfg) {
    if (card.dataset.geiPopoutPrepared === "true") return;
    const [id, icon, kicker, title] = cfg;
    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "gei-popout-trigger";
    trigger.dataset.geiPopoutTarget = id;
    trigger.setAttribute("aria-label", `Open ${kicker}: ${title}`);
    trigger.innerHTML = `<span class="gei-popout-icon" aria-hidden="true">${icon}</span><span class="gei-popout-copy"><span class="gei-popout-kicker">${kicker}</span><span class="gei-popout-title">${title}</span></span><span class="gei-popout-arrow" aria-hidden="true">›</span>`;
    card.dataset.geiPopoutPrepared = "true";
    card.dataset.geiPopoutDisplay = card.style.display;
    card.parentNode.insertBefore(trigger, card);
    card.hidden = true;
  }

  function prepare() {
    document.querySelectorAll(SELECTOR).forEach((card) => {
      if (card.closest(".gei-popout-dialog")) return;
      const cfg = configFor(card);
      if (cfg) makeTrigger(card, cfg);
    });
  }

  function open(card, trigger) {
    if (document.getElementById("gei-section-popout")) return;
    const backdrop = document.createElement("div");
    backdrop.className = "gei-popout-backdrop";
    backdrop.id = "gei-section-popout";
    backdrop.setAttribute("role", "presentation");
    const dialog = document.createElement("section");
    dialog.className = "gei-popout-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    const content = document.createElement("div");
    content.className = "gei-popout-content";
    const close = document.createElement("button");
    close.className = "gei-popout-close";
    close.type = "button";
    close.setAttribute("aria-label", "Close section");
    close.textContent = "×";
    dialog.append(close, content);
    backdrop.appendChild(dialog);
    document.getElementById("screen-home")?.appendChild(backdrop);
    card.hidden = false;
    content.appendChild(card);
    const cleanup = () => {
      if (!backdrop.isConnected) return;
      const parent = document.querySelector("#screen-home .home-experience-stack") || document.querySelector("#screen-home .dashboard-main");
      if (parent && trigger.isConnected) parent.insertBefore(card, trigger.nextSibling);
      card.hidden = true;
      backdrop.remove();
      trigger.focus();
      prepare();
    };
    close.addEventListener("click", cleanup);
    backdrop.addEventListener("click", (event) => { if (event.target === backdrop) cleanup(); });
    document.addEventListener("keydown", function escape(event) { if (event.key === "Escape") { document.removeEventListener("keydown", escape); cleanup(); } }, { once: true });
    close.focus();
  }

  function route(event) {
    const trigger = event.target.closest?.("[data-gei-popout-target]");
    if (!trigger) return;
    const card = document.getElementById(trigger.dataset.geiPopoutTarget);
    if (!card) return;
    event.preventDefault();
    open(card, trigger);
  }

  function init() {
    prepare();
    document.addEventListener("click", route, true);
    const home = document.getElementById("screen-home");
    if (home) {
      observer = new MutationObserver(() => prepare());
      observer.observe(home, { childList: true, subtree: true });
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
