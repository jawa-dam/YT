/* V1.36.7 — Adam Assistant interaction failsafe */
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

  function closeAssistant(assistant) {
    assistant.remove();
    document.querySelector("#screen-home .home-mascot-button")?.focus({ preventScroll: true });
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

  function activateTarget(assistant, target, event) {
    if (!assistant || !target || target.disabled) return false;

    const now = Date.now();
    if (now - lastActivation < 350) return true;
    lastActivation = now;

    event?.preventDefault?.();
    event?.stopImmediatePropagation?.();

    if (target.matches(".home-adam-assistant-close")) {
      closeAssistant(assistant);
      return true;
    }

    const action = target.dataset.adamAction;
    if (!action) return false;
    runAction(assistant, action);
    return true;
  }

  function activateAtPoint(event) {
    const assistant = document.getElementById(ASSISTANT_ID);
    if (!assistant) return;

    const point = pointFromEvent(event);
    if (!point) return;

    const close = elementAtPoint(assistant, point.x, point.y, ".home-adam-assistant-close");
    const action = elementAtPoint(assistant, point.x, point.y, "[data-adam-action]");
    activateTarget(assistant, close || action, event);
  }

  function activateFromClick(event) {
    const assistant = document.getElementById(ASSISTANT_ID);
    if (!assistant) return;

    const direct = event.target?.closest?.(".home-adam-assistant-close, [data-adam-action]");
    if (direct && assistant.contains(direct)) {
      activateTarget(assistant, direct, event);
      return;
    }

    activateAtPoint(event);
  }

  function init() {
    if (window.__GEI_ADAM_FAILSAFE_READY) return;
    window.__GEI_ADAM_FAILSAFE_READY = true;

    /* V1.36.7: click is the device-independent activation event for mouse, touch,
       keyboard and assistive technology. Keep pointer/touch coordinate fallbacks
       for browsers where another layer interferes with normal target dispatch. */
    window.addEventListener("click", activateFromClick, { capture: true, passive: false });
    window.addEventListener("pointerup", activateAtPoint, { capture: true, passive: false });
    window.addEventListener("touchend", activateAtPoint, { capture: true, passive: false });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
