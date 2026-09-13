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

  function wheelMarkup() {
    const paddles = Array.from({ length: 8 }, (_, i) => {
      const angle = i * 45;
      return `<g transform="rotate(${angle})"><line x1="0" y1="0" x2="0" y2="-72" stroke="#5c3a1e" stroke-width="5"/><rect x="-11" y="-91" width="22" height="27" rx="5" fill="url(#academyWood)"/></g>`;
    }).join("");

    return `
      <div class="academy-waterwheel-wrap" aria-label="Interactive waterwheel">
        <div class="academy-waterwheel-glow" aria-hidden="true"></div>
        <svg class="academy-waterwheel" viewBox="0 0 220 190" role="img" aria-label="Waterwheel turning above flowing water">
          <defs>
            <linearGradient id="academyWood" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#b87942"/>
              <stop offset="1" stop-color="#5c3a1e"/>
            </linearGradient>
            <linearGradient id="academyWater" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#2fd2ff"/>
              <stop offset="1" stop-color="#2451d6"/>
            </linearGradient>
          </defs>
          <g class="academy-wheel-rotor" id="academy-wheel-rotor" transform="translate(110 82)">
            <circle r="67" fill="none" stroke="#6d4726" stroke-width="9"/>
            <circle r="67" fill="none" stroke="#34200f" stroke-width="2" opacity=".65"/>
            ${paddles}
            <circle r="13" fill="#38210f" stroke="#1d1108" stroke-width="2"/>
            <circle r="4" fill="#d79b5d"/>
          </g>
          <g class="academy-wheel-water">
            <path fill="url(#academyWater)" opacity=".38" d="M0 142 Q28 128 55 142 T110 142 T165 142 T220 142 V190 H0Z"/>
            <path fill="#2fd2ff" opacity=".6" d="M0 151 Q28 137 55 151 T110 151 T165 151 T220 151 V190 H0Z"/>
          </g>
          <g class="academy-wheel-sparkles" aria-hidden="true">
            <circle cx="31" cy="74" r="2.5" fill="#eaf9ff"/>
            <circle cx="185" cy="54" r="2.5" fill="#eaf9ff"/>
            <circle cx="191" cy="103" r="2" fill="#bfeaff"/>
          </g>
        </svg>
        <button class="academy-wheel-tap" id="academy-wheel-tap" type="button" aria-label="Turn the waterwheel">TURN</button>
      </div>
    `;
  }

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

        <section class="academy-hero academy-waterwheel-hero" aria-labelledby="academy-hero-title">
          <div class="academy-hero-copy">
            <span class="academy-section-label">EXPLORE THE WATER BLUEPRINT</span>
            <h2 id="academy-hero-title">6-Day Water Blueprint</h2>
            <p>Turn the wheel and enter the first stage of the Genesis Engineered Interpretations learning path.</p>
            <button class="academy-primary-action" type="button">
              <span>Begin Day 1</span>
              <strong aria-hidden="true">→</strong>
            </button>
          </div>
          ${wheelMarkup()}
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

    const rotor = document.getElementById("academy-wheel-rotor");
    const turnButton = document.getElementById("academy-wheel-tap");
    if (!rotor || !turnButton) return;

    let angle = 0;
    let speed = 8;
    let last = null;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = null;

    const tick = (now) => {
      if (last === null) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      speed += ((reduced ? 0 : 8) - speed) * Math.min(1, 2.4 * dt);
      angle = (angle + speed * dt) % 360;
      rotor.setAttribute("transform", `translate(110 82) rotate(${angle})`);
      frame = requestAnimationFrame(tick);
    };

    if (!reduced) frame = requestAnimationFrame(tick);
    if (reduced) rotor.setAttribute("transform", "translate(110 82) rotate(0)");

    turnButton.addEventListener("click", () => {
      speed = Math.min(300, speed + 115);
      turnButton.classList.remove("is-active");
      void turnButton.offsetWidth;
      turnButton.classList.add("is-active");
    });
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
