(() => {
  "use strict";

  const STORAGE_KEY = "gei-academy-skin-v1";
  const SKINS = [
    { id: "academic", label: "Academic", className: "skin-academic" },
    { id: "pink", label: "Pink", className: "skin-pink" },
    { id: "blue", label: "Baby Blue", className: "skin-blue" },
    { id: "dark", label: "Dark Mode", className: "skin-dark" }
  ];

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

  function applySkin(id) {
    const selected = SKINS.find((skin) => skin.id === id) || SKINS[0];
    state.active = selected.id;
    document.documentElement.dataset.skin = selected.id;
    document.body.dataset.skin = selected.id;

    document.querySelectorAll("[data-skin-option]").forEach((button) => {
      const active = button.dataset.skinOption === selected.id;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });

    saveSkin(selected.id);
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
