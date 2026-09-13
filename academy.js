(() => {
  "use strict";

  const ACADEMY_DAYS = [
    { id: 1, label: "DAY 1", title: "Water & Light", status: "START HERE", active: true, url: "https://www.yalltoo.com/genesis-engineered-day-1" },
    { id: 2, label: "DAY 2", title: "The Firmament", status: "COMING NEXT", active: false, url: "https://www.yalltoo.com/genesis-engineered-day-2-firmament-dam-wall" },
    { id: 3, label: "DAY 3", title: "Reservoir & Dry Land", status: "LOCKED", active: false, url: "https://www.yalltoo.com/genesis-engineered-day-3-waters-land" },
    { id: 4, label: "DAY 4", title: "The Sluice", status: "LOCKED", active: false, url: "https://www.yalltoo.com/day-4-mill-of-the-dam" },
    { id: 5, label: "DAY 5", title: "The Waterwheel", status: "LOCKED", active: false, url: "https://www.yalltoo.com/day-5-mill-activation" },
    { id: 6, label: "DAY 6", title: "The Beast System", status: "LOCKED", active: false, url: "https://www.yalltoo.com/genesis-engineered-day-6-final-operator" }
  ];

  const MASCOT = window.GEI_MASCOT || {
    url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif",
    alt: "Adam, the YallToo mascot",
    academyLabel: "Open Adam Academy guide"
  };

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
            <linearGradient id="academyWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b87942"/><stop offset="1" stop-color="#5c3a1e"/></linearGradient>
            <linearGradient id="academyWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2fd2ff"/><stop offset="1" stop-color="#2451d6"/></linearGradient>
          </defs>
          <g class="academy-wheel-rotor" id="academy-wheel-rotor" transform="translate(110 82)">
            <circle r="67" fill="none" stroke="#6d4726" stroke-width="9"/><circle r="67" fill="none" stroke="#34200f" stroke-width="2" opacity=".65"/>
            ${paddles}<circle r="13" fill="#38210f" stroke="#1d1108" stroke-width="2"/><circle r="4" fill="#d79b5d"/>
          </g>
          <g class="academy-wheel-water"><path fill="url(#academyWater)" opacity=".38" d="M0 142 Q28 128 55 142 T110 142 T165 142 T220 142 V190 H0Z"/><path fill="#2fd2ff" opacity=".6" d="M0 151 Q28 137 55 151 T110 151 T165 151 T220 151 V190 H0Z"/></g>
          <g class="academy-wheel-sparkles" aria-hidden="true"><circle cx="31" cy="74" r="2.5" fill="#eaf9ff"/><circle cx="185" cy="54" r="2.5" fill="#eaf9ff"/><circle cx="191" cy="103" r="2" fill="#bfeaff"/></g>
        </svg>
        <button class="academy-wheel-tap" id="academy-wheel-tap" type="button" aria-label="Turn the waterwheel">TURN</button>
      </div>`;
  }

  function mascotGuideMarkup() {
    return `
      <div class="academy-guide" id="academy-guide" hidden>
        <button class="academy-guide-backdrop" id="academy-guide-backdrop" type="button" aria-label="Close Adam guide"></button>
        <section class="academy-guide-card" role="dialog" aria-modal="true" aria-labelledby="academy-guide-title">
          <button class="academy-guide-close" id="academy-guide-close" type="button" aria-label="Close Adam guide">×</button>
          <div class="academy-guide-mascot"><img class="gei-mascot-image" src="${MASCOT.url}" alt="${MASCOT.alt}" loading="eager" decoding="async" /></div>
          <div class="academy-guide-copy">
            <span class="academy-section-label">ADAM • ACADEMY GUIDE</span>
            <h2 id="academy-guide-title">Welcome to the Water Blueprint.</h2>
            <p>Explore the six stages, observe the design, and begin with Day 1 when you're ready.</p>
            <a class="academy-guide-action" href="${ACADEMY_DAYS[0].url}" target="_blank" rel="noopener noreferrer">BEGIN DAY 1 <strong aria-hidden="true">→</strong></a>
          </div>
        </section>
      </div>`;
  }

  function renderAcademy() {
    const screen = document.getElementById("screen-academy");
    if (!screen) return;
    const dayOneUrl = ACADEMY_DAYS[0].url;

    screen.innerHTML = `
      <div class="academy-view">
        <header class="academy-topbar">
          <div><span class="academy-kicker">GEI ACADEMY</span><h1>6-Day Water Blueprint</h1><p>Learn to observe, question &amp; discover.</p></div>
          <button class="academy-mascot gei-mascot-button gei-mascot-button--interactive" id="academy-mascot" type="button" aria-label="${MASCOT.academyLabel}" aria-controls="academy-guide" aria-expanded="false">
            <img class="gei-mascot-image" src="${MASCOT.url}" alt="${MASCOT.alt}" loading="eager" decoding="async" />
          </button>
        </header>

        <section class="academy-hero academy-waterwheel-hero" aria-labelledby="academy-hero-title">
          <div class="academy-hero-copy"><span class="academy-section-label">EXPLORE THE WATER BLUEPRINT</span><h2 id="academy-hero-title">6-Day Water Blueprint</h2><p>Turn the wheel and enter the first stage of the Genesis Engineered Interpretations learning path.</p><a class="academy-primary-action" href="${dayOneUrl}" target="_blank" rel="noopener noreferrer"><span>Begin Day 1</span><strong aria-hidden="true">→</strong></a></div>
          ${wheelMarkup()}
        </section>

        <section class="academy-path" aria-labelledby="academy-path-title">
          <div class="academy-path-heading"><div><span class="academy-section-label">THE PATH</span><h2 id="academy-path-title">Six stages</h2></div><span class="academy-path-count">01 / 06</span></div>
          <div class="academy-day-grid">
            ${ACADEMY_DAYS.map((day) => `<a class="academy-day-card${day.active ? " is-active" : ""}${day.id > 1 ? " is-locked" : ""}" data-day="${day.id}" href="${day.url}" target="_blank" rel="noopener noreferrer" aria-label="Open ${day.label}: ${day.title}"><span class="academy-day-number">${day.label}</span><h3>${day.title}</h3><span class="academy-day-status">${day.status}</span></a>`).join("")}
          </div>
        </section>
        ${mascotGuideMarkup()}
      </div>`;

    const rotor = document.getElementById("academy-wheel-rotor");
    const turnButton = document.getElementById("academy-wheel-tap");
    if (rotor && turnButton) {
      let angle = 0, speed = 8, last = null;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const tick = (now) => {
        if (last === null) last = now;
        const dt = Math.min((now - last) / 1000, 0.05); last = now;
        speed += ((reduced ? 0 : 8) - speed) * Math.min(1, 2.4 * dt);
        angle = (angle + speed * dt) % 360;
        rotor.setAttribute("transform", `translate(110 82) rotate(${angle})`);
        requestAnimationFrame(tick);
      };
      if (!reduced) requestAnimationFrame(tick); else rotor.setAttribute("transform", "translate(110 82) rotate(0)");
      turnButton.addEventListener("click", () => { speed = Math.min(300, speed + 115); turnButton.classList.remove("is-active"); void turnButton.offsetWidth; turnButton.classList.add("is-active"); });
    }

    const mascot = document.getElementById("academy-mascot"), guide = document.getElementById("academy-guide"), closeButton = document.getElementById("academy-guide-close"), backdrop = document.getElementById("academy-guide-backdrop");
    if (!mascot || !guide || !closeButton || !backdrop) return;
    let previousFocus = null;
    const closeGuide = () => { guide.hidden = true; mascot.setAttribute("aria-expanded", "false"); document.body.classList.remove("academy-guide-open"); if (previousFocus) previousFocus.focus(); previousFocus = null; };
    const openGuide = () => { previousFocus = document.activeElement; guide.hidden = false; mascot.setAttribute("aria-expanded", "true"); document.body.classList.add("academy-guide-open"); requestAnimationFrame(() => closeButton.focus()); };
    mascot.addEventListener("click", openGuide);
    closeButton.addEventListener("click", closeGuide);
    backdrop.addEventListener("click", closeGuide);
    guide.addEventListener("keydown", (event) => { if (event.key === "Escape") closeGuide(); });
  }

  function init() { renderAcademy(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true }); else init();
})();
