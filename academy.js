(() => {
  "use strict";

  const ACADEMY_DAYS = [
    { id: 1, label: "DAY 1", title: "Water & Light", status: "START HERE", active: true },
    { id: 2, label: "DAY 2", title: "The Firmament", status: "COMING NEXT", active: false },
    { id: 3, label: "DAY 3", title: "Reservoir & Dry Land", status: "LOCKED", active: false },
    { id: 4, label: "DAY 4", title: "The Sluice", status: "LOCKED", active: false },
    { id: 5, label: "DAY 5", title: "The Waterwheel", status: "LOCKED", active: false },
    { id: 6, label: "DAY 6", title: "The Beast System", status: "LOCKED", active: false }
  ];

  const MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-beaver-rhhiVplt1GMykxV8.png";

  function renderAcademy() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;

    screen.innerHTML = `
      <div class="academy-view">
        <header class="academy-topbar">
          <div>
            <span class="academy-kicker">GEI ACADEMY</span>
            <h1>6-Day Water Blueprint</h1>
            <p>Learn to observe, question &amp; discover.</p>
          </div>
          <div class="academy-progress-chip" aria-label="Academy progress: Day 1 of 6">
            <span>0%</span>
            <small>PROGRESS</small>
          </div>
        </header>

        <section class="academy-hero" aria-labelledby="academy-hero-title">
          <div class="academy-hero-copy">
            <span class="academy-section-label">YOUR NEXT DISCOVERY</span>
            <h2 id="academy-hero-title" style="color:#f6f8ff !important; text-shadow:0 2px 10px rgba(0,0,0,.28);">Start with Day 1.</h2>
            <p>Enter the first stage of the Genesis Engineered Interpretations learning path.</p>
            <button class="academy-primary-action" type="button">
              <span>Begin Day 1</span>
              <strong aria-hidden="true">→</strong>
            </button>
          </div>
          <div class="academy-mascot-wrap">
            <div class="academy-mascot-glow" aria-hidden="true"></div>
            <img src="${MASCOT_URL}" alt="Adam, the YallToo water-engineering mascot" class="academy-mascot">
            <span class="academy-mascot-name">ADAM</span>
            <span class="academy-mascot-role">WATER GUIDE</span>
          </div>
        </section>

        <section class="academy-path" aria-labelledby="academy-path-title">
          <div class="academy-path-heading">
            <div>
              <span class="academy-section-label">THE PATH</span>
              <h2 id="academy-path-title">Six stages</h2>
            </div>
            <span class="academy-path-count">01 / 06</span>
          </div>

          <div class="academy-day-grid">
            ${ACADEMY_DAYS.map((day) => `
              <article class="academy-day-card${day.active ? " is-active" : ""}${day.id > 1 ? " is-locked" : ""}" data-day="${day.id}">
                <span class="academy-day-number">${day.label}</span>
                <h3>${day.title}</h3>
                <span class="academy-day-status">${day.status}</span>
              </article>
            `).join("")}
          </div>
        </section>

        <div class="academy-foundation-note" role="note">
          <span class="academy-note-mark">GEI</span>
          <span>Foundation mode • lessons and progress systems arrive in later milestones.</span>
        </div>
      </div>
    `;
  }

  function init() {
    renderAcademy();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
