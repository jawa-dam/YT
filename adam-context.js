/* V1.26.1 — Adam Contextual Launcher Recovery */
(() => {
  "use strict";

  const MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif";
  const CONTEXTS = Object.freeze({
    "screen-academy": { label: "ACADEMY", title: "Your learning space", message: "You're in GEI Academy. Your current blueprint step is ready when you are.", action: "Open next day", actionType: "day" },
    "screen-portfolio": { label: "PORTFOLIO", title: "Your GEI record", message: "You're viewing your GEI portfolio. This is where your learning progress and research identity can take shape.", action: "Review my progress", actionType: "home" },
    "screen-video": { label: "VIDEO LAB", title: "Explore GEI visually", message: "You're in the Video Lab. Use this space to explore GEI through visual learning and media.", action: "Open Academy", actionType: "academy" },
    "screen-support": { label: "SUPPORT", title: "Support the research", message: "You're viewing GEI Support. Your next step here can be learning, collaborating, or supporting the research.", action: "Back to Home", actionType: "home" }
  });

  let lastScreenId = null;
  let refreshTimer = 0;
  let rendering = false;

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function") return { completed: [], xp: 0, currentDay: 1 };
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed)
      ? [...new Set(state.completed.map(Number).filter((id) => id >= 1 && id <= 6))].sort((a, b) => a - b)
      : [];
    return { completed, xp: Math.max(0, Number(state.xp) || 0), currentDay: Number(api.getCurrentDay?.()) || 1 };
  }

  function getActiveScreen() {
    const screens = Array.from(document.querySelectorAll(".app-screen"));
    const visible = screens.find((screen) => {
      if (screen.getAttribute("aria-hidden") === "true") return false;
      const style = window.getComputedStyle(screen);
      return style.display !== "none" && style.visibility !== "hidden";
    });
    if (visible) return visible;
    return document.querySelector(".app-screen.is-active") || document.querySelector('.app-screen[aria-hidden="false"]') || null;
  }

  function getContext() {
    const active = getActiveScreen();
    const id = active?.id || "screen-home";
    const context = CONTEXTS[id] || {
      key: "home",
      label: "HOME",
      title: "Your GEI command center",
      message: "You're on the GEI home screen. Adam is ready to guide your next move.",
      action: "Meet Adam",
      actionType: "home"
    };
    const progress = getProgress();
    const count = progress.completed.length;
    return Object.freeze({ ...context, screenId: id, count, currentDay: count < 6 ? progress.currentDay : 1, xp: progress.xp, version: 1.1 });
  }

  function navigate(type) {
    const progress = getProgress();
    if (type === "day") {
      const url = window.GEI_PROGRESS?.getDayUrl?.(progress.completed.length < 6 ? progress.currentDay : 1);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    const label = type === "academy" ? "Academy" : "Home";
    const target = Array.from(document.querySelectorAll("#bottom-navigation button, #bottom-navigation a"))
      .find((el) => el.textContent.trim().toLowerCase().includes(label.toLowerCase()));
    target?.click();
  }

  function ensureStyles() {
    if (document.getElementById("adam-context-styles")) return;
    const style = document.createElement("style");
    style.id = "adam-context-styles";
    style.textContent = `
      .adam-context-launcher{position:absolute;z-index:60;top:88px;right:12px;display:flex;align-items:center;gap:7px;min-height:40px;padding:7px 12px;border:2px solid #155eef;border-radius:999px;background:#fff;color:#102a5c;font-size:10px;font-weight:1000;letter-spacing:.08em;text-transform:uppercase;box-shadow:0 8px 24px rgba(21,94,239,.22);cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent;white-space:nowrap}.adam-context-launcher img{width:25px;height:25px;object-fit:contain}.adam-context-launcher:active{transform:translateY(1px)}.adam-context-launcher:focus-visible{outline:3px solid #ff1493;outline-offset:3px}.adam-context-panel{position:absolute;z-index:70;left:10px;right:10px;top:136px;display:none}.adam-context-panel.is-open{display:block}.adam-context-card{width:min(100%,390px);margin:0 auto;padding:14px;border:2px solid #155eef;border-radius:20px;background:#fff;color:#102a43;box-shadow:0 22px 55px rgba(0,0,0,.24)}.adam-context-head{display:flex;align-items:center;gap:9px}.adam-context-avatar{width:42px;height:42px;object-fit:contain}.adam-context-head strong{display:block;font-size:19px;line-height:1.05}.adam-context-kicker{display:block;color:#155eef;font-size:9px;font-weight:900;letter-spacing:.12em}.adam-context-close{margin-left:auto;width:34px;height:34px;border:1px solid rgba(21,94,239,.25);border-radius:10px;background:#e1e9ff;color:#102a43;font-size:20px;cursor:pointer}.adam-context-message{margin:11px 0;padding:11px 12px;border-left:3px solid #155eef;border-radius:11px;background:#e1e9ff;font-size:14px;line-height:1.4}.adam-context-meta{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;border:1px solid rgba(21,94,239,.22);border-radius:11px;color:#50658b;font-size:10px;font-weight:900}.adam-context-meta b{color:#155eef}.adam-context-action{width:100%;min-height:44px;margin-top:9px;border:1px solid #155eef;border-radius:12px;background:#eef3ff;color:#102a5c;font-size:12px;font-weight:900;cursor:pointer}.adam-context-action:focus-visible{outline:3px solid #ff1493;outline-offset:2px}@media(max-width:360px){.adam-context-launcher{top:82px;right:9px;min-height:37px;padding:6px 10px;font-size:9px}.adam-context-launcher img{width:23px;height:23px}.adam-context-panel{left:8px;right:8px;top:127px}.adam-context-card{padding:11px;border-radius:18px}.adam-context-head strong{font-size:17px}.adam-context-message{font-size:13px}.adam-context-action{min-height:42px;font-size:11px}}
      #screen-academy,#screen-portfolio,#screen-video,#screen-support{position:relative!important;}
    `;
    document.head.appendChild(style);
  }

  function removeContextUI() {
    document.querySelectorAll(".adam-context-launcher,.adam-context-panel").forEach((el) => el.remove());
  }

  function render(force = false) {
    if (rendering) return;
    const active = getActiveScreen();
    const activeId = active?.id || "screen-home";
    if (!force && activeId === lastScreenId) return;
    rendering = true;
    removeContextUI();
    lastScreenId = activeId;

    if (!active || activeId === "screen-home") {
      rendering = false;
      return;
    }

    const context = getContext();
    const launcher = document.createElement("button");
    launcher.className = "adam-context-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", `Ask Adam about ${context.label}`);
    launcher.innerHTML = `<img src="${MASCOT_URL}" alt="" aria-hidden="true"><span>ASK ADAM</span>`;

    const panel = document.createElement("div");
    panel.className = "adam-context-panel";
    panel.innerHTML = `<section class="adam-context-card" role="dialog" aria-modal="true" aria-label="Adam contextual guide"><header class="adam-context-head"><img class="adam-context-avatar" src="${MASCOT_URL}" alt="Adam, GEI Assistant"><div><span class="adam-context-kicker">ADAM • ${context.label}</span><strong>${context.title}</strong></div><button class="adam-context-close" type="button" aria-label="Close Adam guide">×</button></header><p class="adam-context-message">${context.message}</p><div class="adam-context-meta"><span>BLUEPRINT <b>${context.count}/6</b></span><span>XP <b>${context.xp}</b></span></div><button class="adam-context-action" type="button">${context.action}</button></section>`;
    active.append(launcher, panel);

    const closeButton = panel.querySelector(".adam-context-close");
    launcher.addEventListener("click", () => {
      panel.classList.add("is-open");
      closeButton?.focus();
    });
    closeButton?.addEventListener("click", () => {
      panel.classList.remove("is-open");
      launcher.focus();
    });
    panel.querySelector(".adam-context-action")?.addEventListener("click", () => navigate(context.actionType));
    rendering = false;
  }

  function scheduleRefresh(force = false) {
    window.clearTimeout(refreshTimer);
    refreshTimer = window.setTimeout(() => render(force), 80);
  }

  function init() {
    ensureStyles();
    window.GEI_ADAM_CONTEXT = Object.freeze({ version: 1.1, getContext, refresh: () => render(true) });
    scheduleRefresh(true);

    const root = document.getElementById("app-frame") || document.body;
    const observer = new MutationObserver((mutations) => {
      if (mutations.some((mutation) => {
        const target = mutation.target?.closest?.(".adam-context-launcher,.adam-context-panel");
        return !target;
      })) scheduleRefresh(false);
    });
    observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ["class", "aria-hidden", "style"] });

    document.addEventListener("click", (event) => {
      const navItem = event.target.closest?.("#bottom-navigation button, #bottom-navigation a");
      if (navItem) scheduleRefresh(true);
    }, true);

    window.addEventListener("gei:progress-ready", () => scheduleRefresh(true));
    window.addEventListener("gei:progress-updated", () => scheduleRefresh(true));
    window.addEventListener("gei:xp-updated", () => scheduleRefresh(true));
    window.addEventListener("gei:adam-memory-updated", () => scheduleRefresh(true));
    window.addEventListener("gei:adam-milestone-updated", () => scheduleRefresh(true));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
