/* V1.23 — Adam Learning Memory */
(() => {
  "use strict";

  const MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif";

  window.GEI_MASCOT = Object.freeze({
    name: "Adam",
    url: MASCOT_URL,
    alt: "Adam, the YallToo mascot",
    academyLabel: "Open Adam GEI assistant"
  });

  const STATIC_RESPONSES = {
    gei: "GEI stands for Genesis Engineered Interpretations. Explore the project through water, engineering, language and interpretation.",
    academy: "GEI Academy is your six-day learning path. Each completed day unlocks the next step in the blueprint.",
    navigate: "I can guide you to the right place. Your next learning step is always shown here, and the bottom navigation can take you to Home, Academy, Portfolio, Video or Support.",
    progress: "Your GEI progress is saved on this device. I can tell you what you've completed and what comes next."
  };

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function" || typeof api.getCurrentDay !== "function") {
      return { completed: [], xp: 0, currentDay: 1 };
    }
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed) ? state.completed.map(Number).filter((id) => id >= 1 && id <= 6) : [];
    return { completed: [...new Set(completed)].sort((a, b) => a - b), xp: Math.max(0, Number(state.xp) || 0), currentDay: Number(api.getCurrentDay()) || 1 };
  }

  function getMemory() {
    const api = window.GEI_ADAM_MEMORY;
    if (!api || typeof api.getState !== "function") return null;
    return api.getState() || null;
  }

  function getDayUrl(id) {
    return window.GEI_PROGRESS?.getDayUrl?.(id) || null;
  }

  function getGuidance() {
    const progress = getProgress();
    const memory = getMemory();
    const count = progress.completed.length;
    const lastCompleted = Number(memory?.lastCompletedDay) || null;
    const returning = Boolean(lastCompleted);

    if (count === 0) {
      return {
        count,
        currentDay: 1,
        kicker: "YOUR NEXT STEP",
        message: returning
          ? `Welcome back. I remember that your last recorded learning milestone was Day ${lastCompleted}. Your current path is ready to begin again with Day 1.`
          : "You're ready for Day 1. I'll help you start the GEI blueprint and understand what to look for.",
        actionLabel: "📖 Start Day 1",
        action: "continue"
      };
    }
    if (count < 6) {
      return {
        count,
        currentDay: progress.currentDay,
        kicker: "YOUR NEXT STEP",
        message: lastCompleted && lastCompleted < progress.currentDay
          ? `Welcome back. You completed Day ${lastCompleted} last time, and Day ${progress.currentDay} is now your next step. I'll help you keep building from there.`
          : `Welcome back. Day ${progress.currentDay} is unlocked. I'll help you keep moving through the blueprint.`,
        actionLabel: `📖 Continue Day ${progress.currentDay}`,
        action: "continue"
      };
    }
    return {
      count,
      currentDay: 6,
      kicker: "BLUEPRINT COMPLETE",
      message: "You've completed all six days. I remember your learning path, so I can help you review it or explore the rest of YallToo.",
      actionLabel: "📖 Review Day 1",
      action: "review"
    };
  }

  function personalizeHomeCard() {
    const copy = document.querySelector("#screen-home .welcome-copy");
    if (!copy || copy.dataset.adamAssistantReady === "true") return;
    copy.dataset.adamAssistantReady = "true";
    copy.innerHTML = `
      <span class="card-label">ADAM • YOUR GEI ASSISTANT</span>
      <h2>Hi, I'm Adam.</h2>
      <p>Your compact GEI guide. Tap me and I'll help you find what you need.</p>
    `;
  }

  function personalizeHomeMascot() {
    const button = document.querySelector("#screen-home .home-mascot-button");
    if (!button || button.dataset.adamAssistantLabelReady === "true") return;
    button.dataset.adamAssistantLabelReady = "true";
    button.setAttribute("aria-label", "Ask Adam, your GEI Assistant");
    const badge = button.querySelector(".mascot-badge");
    const caption = button.querySelector(".mascot-caption");
    if (badge) badge.textContent = "ADAM";
    if (caption) caption.textContent = "ASK ADAM";
  }

  function ensureAssistantStyles() {
    if (document.getElementById("home-adam-assistant-styles")) return;
    const style = document.createElement("style");
    style.id = "home-adam-assistant-styles";
    style.textContent = `
      .home-adam-assistant { position:fixed;z-index:2147483647;inset:0;padding:88px 12px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;pointer-events:auto;touch-action:manipulation;isolation:isolate; }
      .home-adam-assistant-backdrop { position:absolute;inset:0;z-index:0;border-radius:0;background:rgba(2,5,11,.58);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);opacity:0;animation:adamAssistantBackdrop .2s ease-out forwards;pointer-events:none;touch-action:none; }
      .home-adam-assistant-card { position:relative;z-index:1;width:min(100%,390px);max-height:100%;overflow:hidden;display:grid;grid-template-rows:auto auto auto 1fr auto;gap:10px;padding:14px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 42%,rgba(255,255,255,.16));border-radius:22px;background:linear-gradient(145deg,color-mix(in srgb,var(--skin-surface,#fff) 94%,var(--skin-accent,#2fd2ff) 6%),var(--skin-surface,#fff));box-shadow:0 24px 60px rgba(0,0,0,.34),0 0 36px color-mix(in srgb,var(--skin-accent,#2fd2ff) 12%,transparent);color:var(--skin-text,#102a43);transform:translateY(10px) scale(.98);opacity:0;animation:adamAssistantIn .24s cubic-bezier(.2,.8,.2,1) forwards;pointer-events:auto;touch-action:manipulation; }
      .home-adam-assistant-head { display:flex;align-items:center;gap:10px;min-width:0; }
      .home-adam-assistant-avatar { width:48px;height:48px;flex:0 0 48px;object-fit:contain;filter:drop-shadow(0 7px 10px rgba(0,0,0,.18));pointer-events:none; }
      .home-adam-assistant-heading { min-width:0;flex:1; }
      .home-adam-assistant-kicker { display:block;color:var(--skin-accent,#2fd2ff);font-size:10px;font-weight:900;letter-spacing:.13em;text-transform:uppercase; }
      .home-adam-assistant-heading strong { display:block;margin-top:2px;font-size:24px;line-height:1.05;letter-spacing:-.025em; }
      .home-adam-assistant-close { width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;padding:0;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 28%,transparent);border-radius:11px;background:var(--skin-soft,#f1f4f8);color:var(--skin-text,#102a43);font-size:22px;line-height:1;cursor:pointer;pointer-events:auto;touch-action:manipulation; }
      .home-adam-assistant-close:focus-visible,.home-adam-assistant-choice:focus-visible { outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px; }
      .home-adam-assistant-message { margin:0;padding:12px 13px;border-left:3px solid var(--skin-accent,#2fd2ff);border-radius:12px;background:var(--skin-soft,#f1f4f8);font-size:16px;line-height:1.45;color:var(--skin-text,#102a43); }
      .home-adam-assistant-next { display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px 11px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 25%,transparent);border-radius:13px;background:color-mix(in srgb,var(--skin-accent,#2fd2ff) 8%,var(--skin-surface,#fff)); }
      .home-adam-assistant-next-label { color:var(--skin-muted,#526b82);font-size:9px;font-weight:900;letter-spacing:.11em;text-transform:uppercase; }
      .home-adam-assistant-next-value { color:var(--skin-accent,#2fd2ff);font-size:12px;font-weight:900;white-space:nowrap; }
      .home-adam-assistant-label { margin:0 2px -3px;color:var(--skin-muted,#526b82);font-size:10px;font-weight:900;letter-spacing:.11em;text-transform:uppercase; }
      .home-adam-assistant-choices { min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:8px;align-content:start;overflow:auto;touch-action:pan-y; }
      .home-adam-assistant-choice { min-height:54px;padding:10px 11px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 25%,transparent);border-radius:13px;background:var(--skin-surface,#fff);color:var(--skin-text,#102a43);font-size:14px;font-weight:800;line-height:1.25;text-align:left;cursor:pointer;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;user-select:none; }
      .home-adam-assistant-choice.primary { border-color:color-mix(in srgb,var(--skin-accent,#2fd2ff) 55%,transparent);background:linear-gradient(145deg,color-mix(in srgb,var(--skin-accent,#2fd2ff) 13%,var(--skin-surface,#fff)),var(--skin-surface,#fff)); }
      .home-adam-assistant-choice:active { transform:scale(.985); }
      .home-adam-assistant-footer { display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:2px;color:var(--skin-muted,#526b82);font-size:10px;font-weight:800; }
      .home-adam-assistant-status { color:var(--skin-accent,#2fd2ff);font-weight:900; }
      @keyframes adamAssistantBackdrop { to { opacity:1; } }
      @keyframes adamAssistantIn { to { transform:translateY(0) scale(1);opacity:1; } }
      @media(max-width:360px){
        .home-adam-assistant{padding:76px 8px 80px;}
        .home-adam-assistant-card{padding:11px;border-radius:19px;gap:8px;}
        .home-adam-assistant-avatar{width:42px;height:42px;flex-basis:42px;}
        .home-adam-assistant-heading strong{font-size:22px;}
        .home-adam-assistant-message{font-size:15px;padding:10px 11px;}
        .home-adam-assistant-choice{min-height:50px;padding:9px;font-size:13px;}
        .home-adam-assistant-next{padding:8px 9px;}
        .home-adam-assistant-next-value{font-size:11px;}
      }
      @media(prefers-reduced-motion:reduce){.home-adam-assistant-backdrop,.home-adam-assistant-card{animation:none;opacity:1;transform:none;}}
    `;
    document.head.appendChild(style);
  }

  function clickNavigation(label) {
    const buttons = Array.from(document.querySelectorAll("#bottom-navigation button, #bottom-navigation a"));
    const target = buttons.find((button) => button.textContent.trim().toLowerCase().includes(label.toLowerCase()));
    if (target) { target.click(); return true; }
    return false;
  }

  function showResponse(assistant, text) {
    const message = assistant.querySelector("#home-adam-assistant-message");
    if (message) message.textContent = text;
  }

  function handleAction(assistant, action) {
    const progress = getProgress();
    const memory = getMemory();
    const count = progress.completed.length;
    const current = count < 6 ? progress.currentDay : 1;

    if (action === "continue" || action === "review") {
      const url = getDayUrl(current);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    }
    if (action === "progress") {
      const completeText = count === 0 ? "No days completed yet." : `${count} of 6 days complete • ${progress.xp} XP`;
      const memoryText = memory?.lastCompletedDay ? ` I remember your last milestone as Day ${memory.lastCompletedDay}.` : "";
      showResponse(assistant, `${completeText}.${memoryText} Your next step is Day ${progress.currentDay}. Keep building one day at a time.`);
      return;
    }
    if (action === "academy") {
      showResponse(assistant, "Opening GEI Academy. Your unlocked path is ready there.");
      window.setTimeout(() => { clickNavigation("Academy"); assistant.remove(); }, 260);
      return;
    }
    if (action === "navigate") {
      showResponse(assistant, STATIC_RESPONSES.navigate);
      return;
    }
    if (STATIC_RESPONSES[action]) showResponse(assistant, STATIC_RESPONSES[action]);
  }

  function openAssistant() {
    const home = document.getElementById("screen-home");
    if (!home) return;
    const existing = document.getElementById("home-adam-assistant");
    if (existing) return;
    ensureAssistantStyles();

    const guidance = getGuidance();
    const assistant = document.createElement("div");
    assistant.className = "home-adam-assistant";
    assistant.id = "home-adam-assistant";
    assistant.setAttribute("role", "dialog");
    assistant.setAttribute("aria-modal", "true");
    assistant.setAttribute("aria-label", "Adam GEI Assistant");
    assistant.innerHTML = `
      <div class="home-adam-assistant-backdrop" aria-hidden="true"></div>
      <section class="home-adam-assistant-card">
        <header class="home-adam-assistant-head">
          <img class="home-adam-assistant-avatar" src="${MASCOT_URL}" alt="Adam, GEI Assistant" />
          <div class="home-adam-assistant-heading"><span class="home-adam-assistant-kicker">YALLTOO • GEI ASSISTANT</span><strong>Hi, I'm Adam.</strong></div>
          <button class="home-adam-assistant-close" type="button" aria-label="Close Adam assistant">×</button>
        </header>
        <p class="home-adam-assistant-message" id="home-adam-assistant-message">${guidance.message}</p>
        <div class="home-adam-assistant-next"><span class="home-adam-assistant-next-label">${guidance.kicker}</span><span class="home-adam-assistant-next-value">DAY ${guidance.currentDay} • ${guidance.count}/6</span></div>
        <div>
          <p class="home-adam-assistant-label">Adam's quick guidance</p>
          <div class="home-adam-assistant-choices">
            <button class="home-adam-assistant-choice primary" type="button" data-adam-action="${guidance.action}">${guidance.actionLabel}</button>
            <button class="home-adam-assistant-choice" type="button" data-adam-action="progress">📊 My progress</button>
            <button class="home-adam-assistant-choice" type="button" data-adam-action="gei">💧 What is GEI?</button>
            <button class="home-adam-assistant-choice" type="button" data-adam-action="academy">🎓 Open Academy</button>
            <button class="home-adam-assistant-choice" type="button" data-adam-action="navigate">🧭 Help me navigate</button>
          </div>
        </div>
        <footer class="home-adam-assistant-footer"><span>Ask Adam anytime.</span><span class="home-adam-assistant-status">● ONLINE</span></footer>
      </section>
    `;

    /* V1.36.3: mount at document.body so Home-screen overflow, stacking and inertness cannot disable the dialog. */
    document.body.appendChild(assistant);

    let detachDismiss = () => {};
    const close = () => {
      detachDismiss();
      assistant.remove();
      document.querySelector("#screen-home .home-mascot-button")?.focus({ preventScroll: true });
    };

    const activateAction = (button, event) => {
      if (!button || button.disabled) return;
      const action = button.dataset.adamAction;
      if (!action) return;
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      handleAction(assistant, action);
    };

    const activateClose = (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      event?.stopImmediatePropagation?.();
      close();
    };

    const isBackdropTap = (target) => target?.classList?.contains("home-adam-assistant-backdrop");

    /* V1.63.23: pointerdown is the primary mobile close path; pointerup/click remain fallbacks. */
    assistant.addEventListener("pointerdown", (event) => {
      if (isBackdropTap(event.target)) {
        activateClose(event);
        return;
      }
      const closeButton = event.target.closest?.(".home-adam-assistant-close");
      if (closeButton) activateClose(event);
    }, { capture: true, passive: false });

    assistant.addEventListener("pointerup", (event) => {
      const closeButton = event.target.closest?.(".home-adam-assistant-close");
      if (closeButton) {
        activateClose(event);
        return;
      }
      if (isBackdropTap(event.target)) {
        activateClose(event);
        return;
      }
      const button = event.target.closest?.("[data-adam-action]");
      if (!button) return;
      activateAction(button, event);
    }, { passive: false });

    assistant.addEventListener("click", (event) => {
      const closeButton = event.target.closest?.(".home-adam-assistant-close");
      if (closeButton || isBackdropTap(event.target)) {
        activateClose(event);
      }
    }, { capture: true, passive: false });

    /* Document-level fallback guarantees an exit even if another handler interferes. */
    const documentDismiss = (event) => {
      const active = document.getElementById("home-adam-assistant");
      if (!active || active !== assistant) return;
      const target = event.target;
      if (target?.closest?.(".home-adam-assistant-close") || isBackdropTap(target)) {
        activateClose(event);
      }
    };
    document.addEventListener("pointerdown", documentDismiss, { capture: true, passive: false });
    document.addEventListener("click", documentDismiss, { capture: true, passive: false });
    detachDismiss = () => {
      document.removeEventListener("pointerdown", documentDismiss, true);
      document.removeEventListener("click", documentDismiss, true);
      detachDismiss = () => {};
    };

    assistant.addEventListener("keydown", (event) => {
      const closeButton = event.target.closest?.(".home-adam-assistant-close");
      if (closeButton && (event.key === "Enter" || event.key === " ")) {
        activateClose(event);
        return;
      }
      const button = event.target.closest?.("[data-adam-action]");
      if (button && (event.key === "Enter" || event.key === " ")) {
        activateAction(button, event);
      }
    });

    assistant.querySelector(".home-adam-assistant-close")?.focus({ preventScroll: true });
  }

  function routeHomeAdam(event) {
    const button = event.target.closest?.(".home-mascot-button");
    if (!button) return;
    const home = document.getElementById("screen-home");
    if (!home) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    openAssistant();
  }

  function refreshOpenAssistant() {
    const assistant = document.getElementById("home-adam-assistant");
    if (!assistant) return;
    const guidance = getGuidance();
    const message = assistant.querySelector("#home-adam-assistant-message");
    const next = assistant.querySelector(".home-adam-assistant-next-value");
    const primary = assistant.querySelector('[data-adam-action="continue"], [data-adam-action="review"]');
    if (message) message.textContent = guidance.message;
    if (next) next.textContent = `DAY ${guidance.currentDay} • ${guidance.count}/6`;
    if (primary) { primary.dataset.adamAction = guidance.action; primary.textContent = guidance.actionLabel; }
  }

  function init() {
    personalizeHomeCard();
    personalizeHomeMascot();
    document.addEventListener("click", routeHomeAdam, true);
    window.addEventListener("gei:progress-ready", refreshOpenAssistant);
    window.addEventListener("gei:progress-updated", refreshOpenAssistant);
    window.addEventListener("gei:xp-updated", refreshOpenAssistant);
    window.addEventListener("gei:adam-memory-ready", refreshOpenAssistant);
    window.addEventListener("gei:adam-memory-updated", refreshOpenAssistant);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
