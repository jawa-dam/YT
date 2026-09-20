/* V1.63.10 — GEI State Verification History
   Compact event-driven audit trail for the Academy State panel.
   Read-only UI; history is stored locally and never changes learning progress.
*/
(() => {
  "use strict";
  if (window.GEI_STATE_HISTORY) return;

  const STORAGE_KEY = "geiStateVerificationHistoryV1";
  const MAX_ENTRIES = 12;
  const EVENTS = [
    ["gei:progress-ready", "ACADEMY INITIALIZED", "Learning state became available."],
    ["gei:progress-updated", "PROGRESS UPDATED", "Academy progress state changed."],
    ["gei:xp-updated", "XP UPDATED", "XP state changed."],
    ["gei:day-completion", "DAY COMPLETED", "A day completion event was recorded."],
    ["gei:badges-ready", "BADGES READY", "Badge state became available."],
    ["gei:badges-updated", "BADGE STATE UPDATED", "Badge state changed."],
    ["gei:streak-updated", "STREAK UPDATED", "Streak state changed."],
    ["gei:learner-identity-updated", "IDENTITY UPDATED", "Learner identity state changed."],
    ["gei:dam-reset-recovered", "RESET RECOVERED", "Dam reset recovery completed."]
  ];

  function read() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }

  function write(entries) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES))); }
    catch (_) {}
  }

  function add(title, detail) {
    const entries = read();
    const now = Date.now();
    const previous = entries[0];
    if (previous && previous.title === title && now - Number(previous.time || 0) < 1500) return;
    entries.unshift({ title, detail, time: now });
    write(entries);
    render();
  }

  function formatTime(time) {
    try {
      return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(time));
    } catch (_) { return "—"; }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
    }[ch]));
  }

  function markup() {
    return `
      <details class="gei-state-history" id="gei-state-history">
        <summary class="gei-state-history-summary">
          <span>
            <span class="academy-section-label">SYSTEM DETAILS</span>
            <b>Verification History</b>
          </span>
          <span class="gei-history-count" id="gei-history-count">0</span>
        </summary>
        <div class="gei-history-body">
          <p class="gei-history-note">Recent Academy state events recorded on this device.</p>
          <div class="gei-history-list" id="gei-history-list"></div>
        </div>
      </details>`;
  }

  function render() {
    const slot = document.getElementById("gei-state-verification-slot");
    const verification = document.getElementById("gei-state-verification");
    if (!slot || !verification) return;
    let panel = document.getElementById("gei-state-history");
    if (!panel) {
      verification.insertAdjacentHTML("afterend", markup());
      panel = document.getElementById("gei-state-history");
    }
    const entries = read();
    const count = document.getElementById("gei-history-count");
    const list = document.getElementById("gei-history-list");
    if (count) count.textContent = String(entries.length);
    if (!list) return;
    list.innerHTML = entries.length
      ? entries.map(entry => `
        <div class="gei-history-entry">
          <span class="gei-history-dot" aria-hidden="true"></span>
          <div class="gei-history-copy">
            <strong>${escapeHtml(entry.title)}</strong>
            <small>${escapeHtml(entry.detail)}</small>
          </div>
          <time datetime="${new Date(entry.time).toISOString()}">${escapeHtml(formatTime(entry.time))}</time>
        </div>`).join("")
      : '<div class="gei-history-empty">No verification events recorded yet.</div>';
  }

  function init() {
    render();
    EVENTS.forEach(([event, title, detail]) => {
      window.addEventListener(event, () => add(title, detail));
    });
    window.addEventListener("storage", render);
    window.GEI_STATE_HISTORY = Object.freeze({
      version: "1.63.10",
      getHistory: () => read(),
      render
    });
    add("STATE VERIFIED", "GEI Academy verification history is active.");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else init();
})();