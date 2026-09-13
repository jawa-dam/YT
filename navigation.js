(() => {
  "use strict";

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "⌂", target: "screen-home" },
    { id: "academy", label: "Academy", icon: "✦", target: "screen-academy" },
    { id: "portfolio", label: "Portfolio", icon: "▤", target: "screen-portfolio" },
    { id: "video", label: "Video", icon: "▶", target: "screen-video" },
    { id: "support", label: "Support", icon: "?", target: "screen-support" }
  ];

  const SUPPORT_LINKS = [
    {
      label: "GoFundMe",
      detail: "Support the GEI research fundraiser",
      href: "https://gofund.me/927c07d75",
      className: "support-gofundme"
    },
    {
      label: "Cash App",
      detail: "Send direct support through Cash App",
      href: "https://cash.app/$1oh1",
      className: "support-cashapp"
    },
    {
      label: "PayPal",
      detail: "Support GEI securely through PayPal",
      href: "https://www.paypal.com/ncp/payment/YCVQWR87ZEBFJ",
      className: "support-paypal"
    }
  ];

  const state = {
    activeScreen: "home",
    initialized: false
  };

  function getNavRoot() {
    return document.getElementById("bottom-navigation");
  }

  function getScreens() {
    return Array.from(document.querySelectorAll(".app-screen"));
  }

  function ensureSupportStyles() {
    if (document.getElementById("support-page-styles")) return;
    const style = document.createElement("style");
    style.id = "support-page-styles";
    style.textContent = `
      #screen-support { overflow: hidden; }
      .support-root {
        width: 100%;
        height: 100%;
        min-height: 0;
        overflow: hidden;
        padding: max(22px, env(safe-area-inset-top)) 18px calc(92px + env(safe-area-inset-bottom));
        display: grid;
        grid-template-rows: auto 1fr;
        gap: 12px;
        color: var(--skin-text, #102a43);
      }
      .support-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }
      .support-kicker {
        display: block;
        color: var(--skin-accent, #2fd2ff);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .14em;
        text-transform: uppercase;
      }
      .support-header h1 {
        margin: 5px 0 4px;
        font-size: clamp(29px, 8vw, 38px);
        line-height: .98;
        letter-spacing: -.045em;
      }
      .support-header p {
        margin: 0;
        max-width: 280px;
        color: var(--skin-muted, #526b82);
        font-size: 14px;
        line-height: 1.4;
      }
      .support-heart {
        display: grid;
        place-items: center;
        width: 48px;
        height: 48px;
        flex: 0 0 48px;
        border: 1px solid color-mix(in srgb, var(--skin-accent, #2fd2ff) 35%, transparent);
        border-radius: 16px;
        background: var(--skin-surface, #fff);
        color: var(--skin-accent, #2fd2ff);
        font-size: 22px;
      }
      .support-content {
        min-height: 0;
        overflow: auto;
        display: grid;
        align-content: start;
        gap: 10px;
        padding-right: 2px;
      }
      .support-goal {
        padding: 15px;
        border: 1px solid color-mix(in srgb, var(--skin-accent, #2fd2ff) 35%, transparent);
        border-radius: 22px;
        background: linear-gradient(145deg, color-mix(in srgb, var(--skin-accent, #2fd2ff) 12%, var(--skin-surface, #fff)), var(--skin-surface, #fff));
      }
      .support-goal-label {
        display: block;
        margin-bottom: 6px;
        color: var(--skin-accent, #2fd2ff);
        font-size: 11px;
        font-weight: 900;
        letter-spacing: .12em;
        text-transform: uppercase;
      }
      .support-goal p {
        margin: 0;
        color: var(--skin-text, #102a43);
        font-size: 14px;
        line-height: 1.48;
      }
      .support-methods {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }
      .support-method {
        display: flex;
        align-items: center;
        gap: 12px;
        min-height: 58px;
        padding: 10px 12px;
        border: 1px solid color-mix(in srgb, var(--skin-accent, #2fd2ff) 28%, transparent);
        border-radius: 17px;
        background: var(--skin-surface, #fff);
        color: inherit;
        text-decoration: none;
        -webkit-tap-highlight-color: transparent;
      }
      .support-method:focus-visible { outline: 3px solid var(--skin-accent, #2fd2ff); outline-offset: 2px; }
      .support-icon {
        display: grid;
        place-items: center;
        width: 38px;
        height: 38px;
        flex: 0 0 38px;
        border-radius: 12px;
        background: var(--skin-soft, #f1f4f8);
        color: var(--skin-accent, #2fd2ff);
        font-size: 12px;
        font-weight: 900;
      }
      .support-method strong, .support-method span { display: block; }
      .support-method strong { font-size: 15px; }
      .support-method span { margin-top: 2px; color: var(--skin-muted, #526b82); font-size: 11px; line-height: 1.3; }
      .support-arrow { margin-left: auto; color: var(--skin-accent, #2fd2ff); font-size: 20px; }
      .support-contact {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 17px;
        background: var(--skin-soft, #f1f4f8);
      }
      .support-contact-copy strong, .support-contact-copy span { display: block; }
      .support-contact-copy strong { font-size: 13px; }
      .support-contact-copy span { margin-top: 2px; color: var(--skin-muted, #526b82); font-size: 11px; }
      .support-email {
        color: var(--skin-accent, #2fd2ff);
        font-size: 12px;
        font-weight: 800;
        text-decoration: none;
        overflow-wrap: anywhere;
      }
      @media (max-width: 360px) {
        .support-root { padding-inline: 15px; gap: 10px; }
        .support-header p { font-size: 13px; }
        .support-goal p { font-size: 13px; }
      }
    `;
    document.head.appendChild(style);
  }

  function renderSupport() {
    const screen = document.getElementById("screen-support");
    if (!screen || screen.dataset.supportRendered === "true") return;
    ensureSupportStyles();
    screen.dataset.supportRendered = "true";
    screen.innerHTML = `
      <div class="support-root">
        <header class="support-header">
          <div>
            <span class="support-kicker">GEI SUPPORT</span>
            <h1>Support the Research</h1>
            <p>Help Genesis Engineered Interpretations grow, build, document and share.</p>
          </div>
          <div class="support-heart" aria-hidden="true">♥</div>
        </header>

        <div class="support-content">
          <section class="support-goal" aria-labelledby="support-goal-title">
            <span class="support-goal-label" id="support-goal-title">Fundraiser Goal</span>
            <p>Your support directly funds the research — enabling GEI to develop working prototypes, documents, and share this knowledge freely with communities, students, and innovators worldwide. Every contribution moves GEI closer to a future where this guide is accessible to all.</p>
          </section>

          <section class="support-methods" aria-label="Ways to support GEI">
            ${SUPPORT_LINKS.map((item) => `
              <a class="support-method ${item.className}" href="${item.href}" target="_blank" rel="noopener noreferrer">
                <span class="support-icon" aria-hidden="true">$</span>
                <span>
                  <strong>${item.label}</strong>
                  <span>${item.detail}</span>
                </span>
                <span class="support-arrow" aria-hidden="true">→</span>
              </a>
            `).join("")}
          </section>

          <div class="support-contact">
            <div class="support-contact-copy">
              <strong>Contact GEI</strong>
              <span>Questions, collaboration or research support</span>
            </div>
            <a class="support-email" href="mailto:Contact@yalltoo.com">Contact@yalltoo.com</a>
          </div>
        </div>
      </div>
    `;
  }

  function setActiveScreen(screenId) {
    const target = NAV_ITEMS.find((item) => item.id === screenId) || NAV_ITEMS[0];
    state.activeScreen = target.id;

    document.querySelectorAll("[data-nav-item]").forEach((button) => {
      const isActive = button.dataset.navItem === target.id;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });

    getScreens().forEach((screen) => {
      const isActive = screen.id === target.target;
      screen.classList.toggle("is-active", isActive);
      screen.setAttribute("aria-hidden", isActive ? "false" : "true");
    });

    if (target.id === "support") renderSupport();
  }

  function buildNavigation() {
    const root = getNavRoot();
    if (!root) return;

    root.innerHTML = NAV_ITEMS.map((item) => `
      <button
        class="nav-item${item.id === state.activeScreen ? " is-active" : ""}"
        type="button"
        data-nav-item="${item.id}"
        aria-label="${item.label}"
        aria-current="${item.id === state.activeScreen ? "page" : "false"}"
      >
        <span class="nav-icon" aria-hidden="true">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </button>
    `).join("");

    root.querySelectorAll("[data-nav-item]").forEach((button) => {
      button.addEventListener("click", () => {
        setActiveScreen(button.dataset.navItem || "home");
      });
    });
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    buildNavigation();
    setActiveScreen(state.activeScreen);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
