/* V1.36.6 — Adam Assistant interaction failsafe */
(() => {
  "use strict";

  const ASSISTANT_ID = "home-adam-assistant";
  let lastActivation = 0;

  function pointFromEvent(event) {
    if (Number.isFinite(event.clientX) && Number.isFinite(event.clientY)) {
      return { x: event.clientX, y: event.clientY };
    }
    const touch = event.changedTouches?.[0] || event.touches?.[0];
    if (touch) return { x: touch.clientX, y: touch.clientY };
    return null;
  }

  function elementAtPoint(assistant, x, y, selector) {
    return Array.from(assistant.querySelectorAll(selector)).find((element) => {
      if (element.disabled) return false;
      const rect = element.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    }) || null;
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

  function showResponse(assistant, text) {
    const message = assistant.querySelector("#home-adam-assistant-message");
    if (message) message.textContent = text;
  }

  function runAction(assistant, action) {
    if (!assistant || !action) return;
    const progress = getProgress();
    const memory = getMemory();
    const current = progress.completed.length < 6 ? progress.currentDay : 1;

    if (action === "continue" || action === "review") {
      const url = window.GEI_PROGRESS?.getDayUrl?.(current);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
      return;
    }

    if (action === "progress") {
      const completeText = progress.completed.length === 0
        ? "No days completed yet."
        : `${progress.completed.length} of 6 days complete • ${progress.xp} XP`;
      const memoryText = memory?.lastCompletedDay
        ? ` I remember your last milestone as Day ${memory.lastCompletedDay}.`
        : "";
      showResponse(
        assistant,
        `${completeText}.${memoryText} Your next step is Day ${progress.currentDay}. Keep building one day at a time.`
      );
      return;
    }

    if (action === "gei") {
      showResponse(assistant, "GEI stands for Genesis Engineered Interpretations. Explore the project through water, engineering, language and interpretation.");
      return;
    }

    if (action === "navigate") {
      showResponse(assistant, "I can guide you to the right place. Your next learning step is always shown here, and the bottom navigation can take you to Home, Academy, Portfolio, Video or Support.");
      return;
    }

    if (action === "academy") {
      showResponse(assistant, "Opening GEI Academy. Your unlocked path is ready there.");
      window.setTimeout(() => {
        const buttons = Array.from(document.querySelectorAll("#bottom-navigation button, #bottom-navigation a"));
        const target = buttons.find((button) => button.textContent.trim().toLowerCase().includes("academy"));
        if (target) target.click();
        assistant.remove();
      }, 260);
    }
  }

  function activateAtPoint(event) {
    const assistant = document.getElementById(ASSISTANT_ID);
    if (!assistant) return;

    const point = pointFromEvent(event);
    if (!point) return;

    const close = elementAtPoint(assistant, point.x, point.y, ".home-adam-assistant-close");
    const action = elementAtPoint(assistant, point.x, point.y, "[data-adam-action]");
    const target = close || action;
    if (!target) return;

    const now = Date.now();
    if (now - lastActivation < 350) return;
    lastActivation = now;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (close) {
      assistant.remove();
      document.querySelector("#screen-home .home-mascot-button")?.focus({ preventScroll: true });
      return;
    }

    runAction(assistant, action.dataset.adamAction);
  }

  function init() {
    if (window.__GEI_ADAM_FAILSAFE_READY) return;
    window.__GEI_ADAM_FAILSAFE_READY = true;

    /* Window capture runs before normal target/bubble handlers. The action is resolved
       from viewport coordinates rather than event.target, so another visual layer
       cannot make the assistant controls inert. */
    window.addEventListener("pointerup", activateAtPoint, { capture: true, passive: false });
    window.addEventListener("touchend", activateAtPoint, { capture: true, passive: false });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
