(() => {
  "use strict";

  const STORAGE_KEY = "gei-member-since-v1";
  const OUTPUT_ID = "member-since";

  function todayKey() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }

  function readOrCreateMemberDate() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && /^\d{4}-\d{2}-\d{2}$/.test(saved)) return saved;
      const created = todayKey();
      window.localStorage.setItem(STORAGE_KEY, created);
      return created;
    } catch {
      return todayKey();
    }
  }

  function dateFromKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  function formatMemberDate(key) {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(dateFromKey(key));
  }

  function daysWithMember(key) {
    const start = dateFromKey(key);
    const today = dateFromKey(todayKey());
    const elapsed = Math.floor((today - start) / 86400000);
    return Math.max(0, elapsed);
  }

  function updateMemberDisplay() {
    const output = document.getElementById(OUTPUT_ID);
    if (!output) return;

    const statusCopy = output.closest(".member-status-copy");
    const heading = statusCopy ? statusCopy.querySelector("strong") : null;
    if (heading) heading.textContent = "GEI MEMBER SINCE";

    const memberDate = readOrCreateMemberDate();
    const days = daysWithMember(memberDate);
    const dayLabel = days === 1 ? "1 day with GEI" : `${days} days with GEI`;
    output.textContent = `${formatMemberDate(memberDate)} • ${dayLabel}`;
  }

  function init() {
    updateMemberDisplay();
    window.setInterval(updateMemberDisplay, 60 * 60 * 1000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
