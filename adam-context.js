/* V1.26 — Adam Contextual Page Intelligence */
(() => {
  "use strict";

  const MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif";
  const CONTEXTS = Object.freeze({
    "screen-academy": { key: "academy", label: "ACADEMY", title: "Your learning space", message: "You're in GEI Academy. Your current blueprint step is ready when you are.", action: "Open next day", actionType: "day" },
    "screen-portfolio": { key: "portfolio", label: "PORTFOLIO", title: "Your GEI record", message: "You're viewing your GEI portfolio. This is where your learning progress and research identity can take shape.", action: "Review my progress", actionType: "home" },
    "screen-video": { key: "video", label: "VIDEO LAB", title: "Explore GEI visually", message: "You're in the Video Lab. Use this space to explore GEI through visual learning and media.", action: "Open Academy", actionType: "academy" },
    "screen-support": { key: "support", label: "SUPPORT", title: "Support the research", message: "You're viewing GEI Support. Your next step here can be learning, collaborating, or supporting the research.", action: "Back to Home", actionType: "home" }
  });

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return { completed: [], xp: 0, currentDay: 1 };
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed) ? [...new Set(state.completed.map(Number).filter((id) => id >= 1 && id <= 6))].sort((a, b) => a - b) : [];
    return { completed, xp: Math.max(0, Number(state.xp) || 0), currentDay: Number(api.getCurrentDay?.()) || 1 };
  }

  function getContext() {
    const active = document.querySelector(".app-screen.is-active");
    const id = active?.id || "screen-home";
    const context = CONTEXTS[id] || { key: "home", label: "HOME", title: "Your GEI command center", message: "You're on the GEI home screen. Adam is ready to guide your next move.", action: "Meet Adam", actionType: "home" };
    const progress = getProgress();
    const count = progress.completed.length;
    const currentDay = count < 6 ? progress.currentDay : 1;
    return Object.freeze({ ...context, screenId: id, count, currentDay, xp: progress.xp, version: 1 });
  }

  function navigate(type) {
    const progress = getProgress();
    if (type === "day") {
      const url = window.GEI_PROGRESS?.getDayUrl?.(progress.completed.length < 6 ? progress.currentDay : 1);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const label = type === "academy" ? "Academy" : "Home";
    const target = Array.from(document.querySelectorAll("#bottom-navigation button, #bottom-navigation a")).find((el) => el.textContent.trim().toLowerCase().includes(label.toLowerCase()));
    target?.click();
  }

  function ensureStyles() {
    if (document.getElementById("adam-context-styles")) return;
    const style = document.createElement("style");
    style.id = "adam-context-styles";
    style.textContent = `
      .adam-context-launcher{position:absolute;z-index:25;top:12px;right:12px;display:flex;align-items:center;gap:7px;min-height:38px;padding:7px 11px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 38%,transparent);border-radius:999px;background:color-mix(in srgb,var(--skin-surface,#fff) 92%,var(--skin-accent,#2fd2ff) 8%);color:var(--skin-text,#102a43);font-size:10px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 8px 22px rgba(0,0,0,.10);cursor:pointer;touch-action:manipulation}.adam-context-launcher img{width:24px;height:24px;object-fit:contain}.adam-context-launcher:focus-visible{outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px}.adam-context-panel{position:absolute;z-index:35;left:12px;right:12px;top:60px;display:none}.adam-context-panel.is-open{display:block}.adam-context-card{width:min(100%,390px);margin:0 auto;padding:14px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 38%,transparent);border-radius:20px;background:var(--skin-surface,#fff);color:var(--skin-text,#102a43);box-shadow:0 22px 55px rgba(0,0,0,.24)}.adam-context-head{display:flex;align-items:center;gap:9px}.adam-context-avatar{width:42px;height:42px;object-fit:contain}.adam-context-head strong{display:block;font-size:19px;line-height:1.05}.adam-context-kicker{display:block;color:var(--skin-accent,#2fd2ff);font-size:9px;font-weight:900;letter-spacing:.12em}.adam-context-close{margin-left:auto;width:34px;height:34px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 25%,transparent);border-radius:10px;background:var(--skin-soft,#f1f4f8);color:var(--skin-text,#102a43);font-size:20px}.adam-context-message{margin:11px 0;padding:11px 12px;border-left:3px solid var(--skin-accent,#2fd2ff);border-radius:11px;background:var(--skin-soft,#f1f4f8);font-size:14px;line-height:1.4}.adam-context-meta{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 22%,transparent);border-radius:11px;color:var(--skin-muted,#526b82);font-size:10px;font-weight:900}.adam-context-meta b{color:var(--skin-accent,#2fd2ff)}.adam-context-action{width:100%;min-height:44px;margin-top:9px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 45%,transparent);border-radius:12px;background:color-mix(in srgb,var(--skin-accent,#2fd2ff) 13%,var(--skin-surface,#fff));color:var(--skin-text,#102a43);font-size:12px;font-weight:900;cursor:pointer}.adam-context-action:focus-visible{outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px}@media(max-width:360px){.adam-context-launcher{top:9px;right:9px;min-height:35px;padding:6px 9px;font-size:9px}.adam-context-panel{left:8px;right:8px;top:53px}.adam-context-card{padding:11px;border-radius:18px}.adam-context-head strong{font-size:17px}.adam-context-message{font-size:13px}.adam-context-action{min-height:42px;font-size:11px}}
    `;
    document.head.appendChild(style);
  }

  function removeContextUI() {
    document.querySelectorAll(".adam-context-launcher,.adam-context-panel").forEach((el) => el.remove());
  }

  function render() {
    removeContextUI();
    const active = document.querySelector(".app-screen.is-active");
    if (!active || active.id === "screen-home") return;
    const context = getContext();
    const launcher = document.createElement("button");
    launcher.className = "adam-context-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", `Ask Adam about ${context.label}`);
    launcher.innerHTML = `<img src="${MASCOT_URL}" alt="" aria-hidden="true"><span>ASK ADAM</span>`;

    const panel = document.createElement("div");
    panel.className = "adam-context-panel";
    panel.innerHTML = `<section class="adam-context-card" role="dialog" aria-label="Adam contextual guide"><header class="adam-context-head"><img class="adam-context-avatar" src="${MASCOT_URL}" alt="Adam, GEI Assistant"><div><span class="adam-context-kicker">ADAM • ${context.label}</span><strong>${context.title}</strong></div><button class="adam-context-close" type="button" aria-label="Close Adam guide">×</button></header><p class="adam-context-message">${context.message}</p><div class="adam-context-meta"><span>BLUEPRINT <b>${context.count}/6</b></span><span>XP <b>${context.xp}</b></span></div><button class="adam-context-action" type="button">${context.action}</button></section>`;
    active.append(launcher, panel);

    launcher.addEventListener("click", () => { panel.classList.add("is-open"); panel.querySelector(".adam-context-close")?.focus(); });
    panel.querySelector(".adam-context-close")?.addEventListener("click", () => { panel.classList.remove("is-open"); launcher.focus(); });
    panel.querySelector(".adam-context-action")?.addEventListener("click", () => navigate(context.actionType));
  }

  function init() {
    ensureStyles();
    window.GEI_ADAM_CONTEXT = Object.freeze({ version: 1, getContext, refresh: render });
    render();
    const observer = new MutationObserver(() => {
      if (document.querySelector(".app-screen.is-active")) render();
    });
    observer.observe(document.getElementById("app-frame") || document.body, { subtree: true, attributes: true, attributeFilter: ["class"] });
    window.addEventListener("gei:progress-ready", render);
    window.addEventListener("gei:progress-updated", render);
    window.addEventListener("gei:xp-updated", render);
    window.addEventListener("gei:adam-memory-updated", render);
    window.addEventListener("gei:adam-milestone-updated", render);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
