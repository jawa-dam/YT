/* V1.11 — GEI Learning Feedback & Completion Intelligence */
(() => {
  "use strict";

  const DAY_INSIGHTS = {
    1: { title:"Water & Light", body:"You completed the opening observation: source, water and light are now the first pieces of your GEI blueprint.", next:"Next: enter Day 2 to examine the firmament as the next engineered stage." },
    2: { title:"The Firmament", body:"You completed the second stage. The learning path now moves from water separation into structure and containment.", next:"Next: enter Day 3 to explore reservoir and dry-land relationships." },
    3: { title:"Reservoir & Dry Land", body:"You completed the third stage. Your blueprint now connects stored water with the emergence of usable dry land.", next:"Next: enter Day 4 to follow the water toward the sluice and mill." },
    4: { title:"The Sluice", body:"You completed the fourth stage. The path now connects controlled water release with mechanical work.", next:"Next: enter Day 5 to explore the waterwheel activation stage." },
    5: { title:"The Waterwheel", body:"You completed the fifth stage. Your GEI path now reaches the mechanical energy represented by the waterwheel.", next:"Next: enter Day 6 to examine the final engineered system stage." },
    6: { title:"The Beast System", body:"You completed the sixth stage. The full six-day GEI learning path is now complete.", next:"Next: review the six-day blueprint and revisit any stage you want to study again." }
  };

  function ensureFeedback() {
    if (document.getElementById("gei-feedback")) return;
    document.body.insertAdjacentHTML("beforeend", `<section class="gei-feedback" id="gei-feedback" hidden role="dialog" aria-modal="true" aria-labelledby="gei-feedback-title">
      <div class="gei-feedback-card">
        <button class="gei-feedback-close" id="gei-feedback-close" type="button" aria-label="Close completion feedback">×</button>
        <span class="gei-feedback-kicker">LEARNING MILESTONE</span>
        <h2 id="gei-feedback-title">Day Complete</h2>
        <p class="gei-feedback-copy" id="gei-feedback-copy"></p>
        <div class="gei-feedback-stats"><div class="gei-feedback-stat"><strong id="gei-feedback-xp">+100 XP</strong><span>Milestone earned</span></div><div class="gei-feedback-stat"><strong id="gei-feedback-progress">1 / 6</strong><span>Blueprint progress</span></div></div>
        <p class="gei-feedback-next" id="gei-feedback-next"></p>
        <div class="gei-feedback-actions"><button class="gei-feedback-action" id="gei-feedback-review" type="button">Review Day</button><button class="gei-feedback-action primary" id="gei-feedback-next-action" type="button">Continue</button></div>
      </div>
    </section>`);

    const close = () => { const modal = document.getElementById("gei-feedback"); if (modal) modal.hidden = true; };
    document.getElementById("gei-feedback-close")?.addEventListener("click", close);
    document.getElementById("gei-feedback")?.addEventListener("click", (event) => { if (event.target.id === "gei-feedback") close(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  }

  function showFeedback(detail) {
    ensureFeedback();
    const completedDay = Number(detail?.completedDay || detail?.day || 0);
    if (!DAY_INSIGHTS[completedDay]) return;
    const insight = DAY_INSIGHTS[completedDay];
    const count = Number(detail?.completed?.length ?? detail?.count ?? completedDay);
    const xp = Number(detail?.xp ?? count * 100);
    const nextDay = completedDay < 6 ? completedDay + 1 : 1;
    const modal = document.getElementById("gei-feedback");
    document.getElementById("gei-feedback-title").textContent = `${insight.title} Complete`;
    document.getElementById("gei-feedback-copy").textContent = insight.body;
    document.getElementById("gei-feedback-xp").textContent = "+100 XP";
    document.getElementById("gei-feedback-progress").textContent = `${Math.min(count, 6)} / 6`;
    document.getElementById("gei-feedback-next").innerHTML = `<strong>${insight.next.split(":")[0]}:</strong>${insight.next.split(":").slice(1).join(":")}`;
    const review = document.getElementById("gei-feedback-review");
    const nextAction = document.getElementById("gei-feedback-next-action");
    review.textContent = `REVIEW DAY ${completedDay}`;
    nextAction.textContent = completedDay === 6 ? "REVIEW BLUEPRINT" : `CONTINUE DAY ${nextDay}`;
    review.onclick = () => {
      const dayUrl = window.GEI_PROGRESS?.getDayUrl?.(completedDay);
      if (dayUrl) window.open(dayUrl, "_blank", "noopener,noreferrer");
      else window.location.href = "https://www.yalltoo.com/genesis-engineered-day-1";
    };
    nextAction.onclick = () => {
      const dayUrl = window.GEI_PROGRESS?.getDayUrl?.(nextDay);
      if (dayUrl) window.open(dayUrl, "_blank", "noopener,noreferrer");
      else document.getElementById("gei-feedback-close")?.click();
    };
    modal.hidden = false;
    document.getElementById("gei-feedback-close")?.focus();
  }

  function init() {
    ensureFeedback();
    window.addEventListener("gei:progress-updated", (event) => {
      const detail = event.detail || {};
      if (!detail.completedDay) return;
      window.setTimeout(() => showFeedback(detail), 80);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
