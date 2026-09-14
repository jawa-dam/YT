/* V1.15 — GEI Homepage Product Focus */
(() => {
  "use strict";

  function cleanHome() {
    const screen = document.getElementById("screen-home");
    if (!screen) return;

    screen.querySelectorAll(".home-dam-card").forEach((card) => card.remove());

    const product = screen.querySelector(".home-product-card");
    if (product) product.classList.add("v1-15-product-focus");
  }

  function init() {
    cleanHome();
    const screen = document.getElementById("screen-home");
    if (!screen) return;
    const observer = new MutationObserver(cleanHome);
    observer.observe(screen, { childList: true, subtree: true });
    window.setTimeout(() => {
      cleanHome();
      observer.disconnect();
    }, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
