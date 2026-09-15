(() => {
  "use strict";

  const FRAME_ID = "app-frame";
  const TIMEOUT_MS = 10000;
  const TEST_IMAGE = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png";

  let state = "ACTIVE";
  let timeoutId = null;

  function setStatus(text, kind = "") {
    const status = document.querySelector(".splash-layer #splash-status");
    if (!status) return;
    status.textContent = text;
    status.dataset.status = kind;
  }

  function complete(reason) {
    if (state !== "ACTIVE") return;
    state = "COMPLETE";
    if (timeoutId) window.clearTimeout(timeoutId);
    const frame = document.getElementById(FRAME_ID);
    if (!frame) return;
    frame.classList.add("splash-done");
    frame.dataset.splashExit = reason;
  }

  function prepareArtwork(artwork) {
    Object.assign(artwork.style, {
      position: "absolute",
      inset: "0",
      zIndex: "0",
      display: "block",
      visibility: "visible",
      opacity: "1",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
      transform: "scale(1.02)"
    });
  }

  function testArtwork(artwork) {
    setStatus("Testing direct GEI artwork…", "testing");
    artwork.onload = () => {
      const ok = artwork.naturalWidth > 0 && artwork.naturalHeight > 0;
      if (ok) {
        artwork.dataset.integrity = "PASS";
        setStatus("ARTWORK TEST: PASS", "pass");
      } else {
        artwork.dataset.integrity = "FAIL";
        setStatus("ARTWORK TEST: FAIL", "fail");
      }
    };
    artwork.onerror = () => {
      artwork.dataset.integrity = "FAIL";
      setStatus("ARTWORK TEST: FAIL — DIRECT IMAGE LOAD FAILED", "fail");
    };
    artwork.src = `${TEST_IMAGE}?geiIntegrity=v117`;
  }

  function init() {
    const frame = document.getElementById(FRAME_ID);
    if (!frame) return;
    const splash = frame.querySelector(".splash-layer");
    if (!splash) return;

    const artwork = splash.querySelector(".splash-artwork");
    const enter = splash.querySelector("#splash-enter");
    const progress = splash.querySelector("#splash-progress-bar");
    if (!artwork || !enter || !progress) return;

    frame.dataset.splashBuild = "V1.17-INTEGRITY";
    prepareArtwork(artwork);
    testArtwork(artwork);

    enter.addEventListener("click", () => complete("enter"), { once: true });
    document.addEventListener("keydown", (event) => {
      if (state === "ACTIVE" && event.key === "Enter") {
        event.preventDefault();
        complete("keyboard-enter");
      }
    });

    const start = performance.now();
    const tick = (now) => {
      if (state !== "ACTIVE") return;
      progress.style.width = `${Math.min((now - start) / TIMEOUT_MS, 1) * 100}%`;
      if (now - start < TIMEOUT_MS) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    timeoutId = window.setTimeout(() => complete("timeout"), TIMEOUT_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
