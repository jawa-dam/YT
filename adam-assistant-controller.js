/* V1.36.8 — Adam Assistant Interaction Controller
   Single authoritative interaction layer for the Home Adam assistant.
*/
(() => {
  "use strict";

  const ASSISTANT_ID = "home-adam-assistant";
  let lastActivation = 0;

  function assistant() {
    return document.getElementById(ASSISTANT_ID);
  }

  function getProgress() {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function" || typeof api.getCurrentDay !== "function") {
      return { completed: [], xp: 0, currentDay: 1 };
    }
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed)
      ? state.completed.map(Number).filter((id) => id >= 1 && id <= 6)
      : [];
    return {
      completed: [...new Set(completed)].sort((a, b) => a - b),
      xp: Math.max(0, Number(state.xp) || 0),
      currentDay: Number(api.getCurrentDay()) || 1
    };
  }

  function getMemory() {
    const api = window.GEI_ADAM_MEMORY;
    return api && typeof api.getState === "function" ? api.getState() || null : null;
  }

  function showResponse(root, text) {
    const message = root.querySelector("#home-adam-assistant-message");
    if (message) message.textContent = text;
  }

  function close(root) {
    root.remove();
    document.querySelector("#screen-home .home-mascot-button")?.focus({ preventScroll: true });
  }

  function openDay(day) {
    const url = window.GEI_PROGRESS?.getDayUrl?.(day);
    if (!url) return;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openAcademy(root) {
    showResponse(root, "Opening GEI Academy. Your unlocked path is ready there.");
    window.setTimeout(() => {
      const target = Array.from(document.querySelectorAll("#bottom-navigation button, #bottom-navigation a"))
        .find((button) => button.textContent.trim().toLowerCase().includes("academy"));
      if (target) target.click();
      root.remove();
    }, 180);
  }

  function runAction(root, action) {
    const progress = getProgress();
    const memory = getMemory();
    const current = progress.completed.length < 6 ? progress.currentDay : 1;

    switch (action) {
      case "continue":
      case "review":
        openDay(current);
        break;

      case "progress": {
        const completeText = progress.completed.length === 0
          ? "No days completed yet."
          : `${progress.completed.length} of 6 days complete • ${progress.xp} XP`;
        const memoryText = memory?.lastCompletedDay
          ? ` I remember your last milestone as Day ${memory.lastCompletedDay}.`
          : "";
        showResponse(root, `${completeText}.${memoryText} Your next step is Day ${progress.currentDay}. Keep building one day at a time.`);
        break;
      }

      case "gei":
        showResponse(root, "GEI stands for Genesis Engineered Interpretations. Explore the project through water, engineering, language and interpretation.");
        break;

      case "navigate":
        showResponse(root, "I can guide you to the right place. Use Home, Academy, Portfolio, Video or Support in the bottom navigation.");
        break;

      case "academy":
        openAcademy(root);
        break;

      default:
        break;
    }
  }

  function activate(root, target, event) {
    if (!root || !target || target.disabled || !root.contains(target)) return;

    const now = Date.now();
    if (now - lastActivation < 250) return;
    lastActivation = now;

    event?.preventDefault?.();
    event?.stopPropagation?.();

    if (target.matches(".home-adam-assistant-close")) {
      close(root);
      return;
    }

    const action = target.dataset.adamAction;
    if (action) runAction(root, action);
  }

  function onClick(event) {
    const root = assistant();
    if (!root) return;
    const target = event.target?.closest?.(".home-adam-assistant-close, [data-adam-action]");
    if (target && root.contains(target)) activate(root, target, event);
  }

  function onKeydown(event) {
    const root = assistant();
    if (!root) return;

    if (event.key === "Escape") {
      event.preventDefault();
      close(root);
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target?.closest?.(".home-adam-assistant-close, [data-adam-action]");
    if (target && root.contains(target)) activate(root, target, event);
  }

  function init() {
    if (window.__GEI_ADAM_CONTROLLER_READY) return;
    window.__GEI_ADAM_CONTROLLER_READY = true;
    window.addEventListener("click", onClick, { capture: true, passive: false });
    window.addEventListener("keydown", onKeydown, { capture: true, passive: false });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
