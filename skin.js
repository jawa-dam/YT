(() => {
  "use strict";

  const STORAGE_KEY = "gei-academy-skin-v1";
  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";
  const SKINS = [
    { id: "academic", label: "Academic", className: "skin-academic" },
    { id: "pink", label: "Hot Pink", className: "skin-pink" },
    { id: "blue", label: "Electric Blue", className: "skin-blue" },
    { id: "green", label: "Green", className: "skin-green" },
    { id: "dark", label: "Dark Mode", className: "skin-dark" }
  ];

  const PALETTES = {
    academic: { bg: "#f7f9fc", surface: "#ffffff", soft: "#f1f4f8", text: "#102a43", muted: "#526b82", accent: "#2fd2ff" },
    pink: { bg: "#fff0f7", surface: "#ffffff", soft: "#ffe5f1", text: "#3b1028", muted: "#70485f", accent: "#ff1493" },
    blue: { bg: "#edf3ff", surface: "#ffffff", soft: "#dbe7ff", text: "#10254d", muted: "#4d6487", accent: "#0057ff" },
    green: { bg: "#effaf3", surface: "#ffffff", soft: "#dcf7e6", text: "#123524", muted: "#4d6b59", accent: "#12b76a" },
    dark: { bg: "#05060a", surface: "#0b0e18", soft: "#111522", text: "#f6f8ff", muted: "#aeb8cb", accent: "#aeb8cb" }
  };

  const state = { active: "academic", initialized: false };

  function readSavedSkin() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      return SKINS.some((skin) => skin.id === saved) ? saved : "academic";
    } catch {
      return "academic";
    }
  }

  function saveSkin(id) {
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // Theme remains active for the current session when storage is unavailable.
    }
  }

  function applyPalette(id) {
    const palette = PALETTES[id] || PALETTES.academic;
    Object.entries(palette).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--skin-${key}`, value);
    });
  }

  function applySkin(id) {
    const selected = SKINS.find((skin) => skin.id === id) || SKINS[0];
    state.active = selected.id;
    document.documentElement.dataset.skin = selected.id;
    document.body.dataset.skin = selected.id;
    applyPalette(selected.id);

    document.querySelectorAll("[data-skin-option]").forEach((button) => {
      const active = button.dataset.skinOption === selected.id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    saveSkin(selected.id);
  }

  function buildHomeBrand() {
    const title = document.querySelector("#screen-home .dashboard-header h1");
    if (!title || title.querySelector(".home-gei-logo")) return;

    title.replaceChildren();
    const logo = document.createElement("img");
    logo.className = "home-gei-logo";
    logo.src = GEI_LOGO_URL;
    logo.alt = "Genesis Engineered Interpretations";
    logo.loading = "eager";
    logo.decoding = "async";
    title.appendChild(logo);
  }

  function closePanel(panel, trigger) {
    panel.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  function buildSkinControl() {
    const host = document.getElementById("skin-control");
    if (!host) return;

    host.innerHTML = `
      <button class="skin-trigger" id="skin-trigger" type="button" aria-haspopup="true" aria-expanded="false" aria-controls="skin-panel">
        <span class="skin-trigger-icon" aria-hidden="true">◐</span>
        <span>Skins</span>
      </button>
      <div class="skin-panel" id="skin-panel" role="group" aria-label="Academy skins" hidden>
        <div class="skin-panel-title">Choose a skin</div>
        <div class="skin-options">
          ${SKINS.map((skin) => `
            <button class="skin-option" data-skin-option="${skin.id}" type="button" aria-pressed="false">
              <span class="skin-swatch skin-swatch-${skin.id}" aria-hidden="true"></span>
              <span>${skin.label}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    const trigger = host.querySelector("#skin-trigger");
    const panel = host.querySelector("#skin-panel");

    trigger.addEventListener("click", () => {
      panel.hidden = !panel.hidden;
      trigger.setAttribute("aria-expanded", panel.hidden ? "false" : "true");
    });

    host.querySelectorAll("[data-skin-option]").forEach((button) => {
      button.addEventListener("click", () => {
        applySkin(button.dataset.skinOption || "academic");
        closePanel(panel, trigger);
      });
    });

    document.addEventListener("click", (event) => {
      if (!host.contains(event.target)) closePanel(panel, trigger);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !panel.hidden) {
        closePanel(panel, trigger);
        trigger.focus();
      }
    });

    applySkin(readSavedSkin());
    buildHomeBrand();
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    buildSkinControl();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
