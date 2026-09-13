(() => {
  "use strict";

  const MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif";

  window.GEI_MASCOT = Object.freeze({
    name: "Adam",
    url: MASCOT_URL,
    alt: "Adam, the YallToo mascot",
    academyLabel: "Open Adam Academy guide"
  });

  function routeHomeAdam(event) {
    const button = event.target.closest?.(".home-mascot-button");
    if (!button) return;

    const home = document.getElementById("screen-home");
    const academy = document.getElementById("screen-academy");
    if (!home || !academy) return;

    // Own the Home Adam interaction before navigation.js can replay the click
    // against the hidden Academy mascot. This keeps the interaction direct.
    event.preventDefault();
    event.stopImmediatePropagation();

    document.querySelectorAll(".app-screen").forEach((screen) => {
      screen.classList.toggle("active", screen === academy);
    });
    document.querySelectorAll("[data-nav-id]").forEach((navButton) => {
      navButton.classList.toggle("active", navButton.dataset.navId === "academy");
    });

    window.dispatchEvent(new CustomEvent("gei:navigation", { detail: { id: "academy" } }));
    window.dispatchEvent(new CustomEvent("gei:open-adam-guide"));
  }

  // Capture phase guarantees the Home mascot remains a reliable tap target
  // even when another child/overlay participates in the normal click chain.
  document.addEventListener("click", routeHomeAdam, true);
})();
