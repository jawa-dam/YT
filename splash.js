(() => {
  "use strict";

  const FRAME_ID = "app-frame";
  const TIMEOUT_MS = 10000;

  function complete(reason) {
    const frame = document.getElementById(FRAME_ID);
    if (!frame || frame.classList.contains("splash-done")) return;
    frame.classList.add("splash-done");
    frame.dataset.splashExit = reason;
  }

  function init() {
    const frame = document.getElementById(FRAME_ID);
    const splash = frame && frame.querySelector(".splash-layer");
    if (!frame || !splash) return;

    frame.dataset.splashBuild = "V1.17-INTEGRITY-LOCAL";
    const status = splash.querySelector("#splash-status");
    const enter = splash.querySelector("#splash-enter");
    const progress = splash.querySelector("#splash-progress-bar");

    if (status) status.textContent = "SPLASH READY • LOCAL VISUAL";

    if (enter) enter.addEventListener("click", () => complete("enter"), { once: true });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        complete("keyboard-enter");
      }
    }, { once: true });

    const start = performance.now();
    const tick = (now) => {
      if (frame.classList.contains("splash-done")) return;
      if (progress) progress.style.width = `${Math.min((now - start) / TIMEOUT_MS, 1) * 100}%`;
      if (now - start < TIMEOUT_MS) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    window.setTimeout(() => complete("timeout"), TIMEOUT_MS);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
