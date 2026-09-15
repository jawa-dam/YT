/* V1.23 — Adam Learning Memory */
(() => {
  "use strict";

  const STORAGE_KEY = "geiAdamLearningMemoryV1";
  const VERSION = 1;

  const clampDay = (value) => {
    const day = Number(value);
    return Number.isInteger(day) && day >= 1 && day <= 6 ? day : null;
  };

  const cleanState = (raw) => {
    const source = raw && typeof raw === "object" ? raw : {};
    const memory = {
      version: VERSION,
      firstSeenAt: typeof source.firstSeenAt === "string" ? source.firstSeenAt : null,
      lastSeenAt: typeof source.lastSeenAt === "string" ? source.lastSeenAt : null,
      visitCount: Math.max(0, Number(source.visitCount) || 0),
      lastCompletedDay: clampDay(source.lastCompletedDay),
      lastNextDay: clampDay(source.lastNextDay),
      lastKnownCompletedCount: Math.max(0, Math.min(6, Number(source.lastKnownCompletedCount) || 0)),
      lastKnownXp: Math.max(0, Number(source.lastKnownXp) || 0),
      lastCompletionAt: typeof source.lastCompletionAt === "string" ? source.lastCompletionAt : null
    };
    return memory;
  };

  const read = () => {
    try {
      return cleanState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
    } catch (_) {
      return cleanState({});
    }
  };

  const write = (memory) => {
    const next = cleanState(memory);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch (_) {}
    return next;
  };

  const getProgress = () => {
    const api = window.GEI_PROGRESS;
    if (!api || typeof api.getState !== "function" || typeof api.getCurrentDay !== "function") {
      return { completed: [], xp: 0, currentDay: 1 };
    }
    const state = api.getState() || {};
    const completed = Array.isArray(state.completed)
      ? [...new Set(state.completed.map(Number).filter((id) => id >= 1 && id <= 6))].sort((a, b) => a - b)
      : [];
    return {
      completed,
      xp: Math.max(0, Number(state.xp) || 0),
      currentDay: Number(api.getCurrentDay()) || 1
    };
  };

  const emit = () => {
    window.dispatchEvent(new CustomEvent("gei:adam-memory-updated"));
  };

  const sync = (event) => {
    const now = new Date().toISOString();
    const progress = getProgress();
    const previous = read();
    const completedDay = clampDay(event?.detail?.completedDay);
    const memory = {
      ...previous,
      version: VERSION,
      lastSeenAt: now,
      visitCount: Math.max(1, previous.visitCount),
      lastKnownCompletedCount: progress.completed.length,
      lastKnownXp: progress.xp,
      lastNextDay: progress.completed.length < 6 ? progress.currentDay : 6
    };

    if (completedDay) {
      memory.lastCompletedDay = completedDay;
      memory.lastCompletionAt = now;
      memory.lastNextDay = progress.completed.length < 6 ? progress.currentDay : 6;
    }

    write(memory);
    emit();
  };

  const init = () => {
    const now = new Date().toISOString();
    const previous = read();
    const progress = getProgress();
    const memory = write({
      ...previous,
      version: VERSION,
      firstSeenAt: previous.firstSeenAt || now,
      lastSeenAt: now,
      visitCount: previous.visitCount + 1,
      lastKnownCompletedCount: progress.completed.length,
      lastKnownXp: progress.xp,
      lastNextDay: progress.completed.length < 6 ? progress.currentDay : 6
    });

    window.GEI_ADAM_MEMORY = Object.freeze({
      version: VERSION,
      getState: () => ({ ...read() }),
      getLastCompletedDay: () => read().lastCompletedDay,
      getLastNextDay: () => read().lastNextDay,
      getVisitCount: () => read().visitCount,
      hasLearningHistory: () => Boolean(read().lastCompletedDay),
      sync
    });

    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("gei:adam-memory-ready", { detail: memory }));
    }, 0);
  };

  window.addEventListener("gei:progress-ready", sync);
  window.addEventListener("gei:progress-updated", sync);
  window.addEventListener("gei:xp-updated", sync);

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
