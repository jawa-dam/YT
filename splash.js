(() => {
  "use strict";

  const APP_FRAME_ID = "app-frame";
  const SPLASH_ACTIVE = "SPLASH_ACTIVE";
  const SPLASH_COMPLETE = "SPLASH_COMPLETE";
  const TIMEOUT_MS = 10_000;
  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";
  const DECK_STORAGE_KEY = "gei-splash-image-deck-v1";
  const LAST_IMAGE_KEY = "gei-splash-last-image-v1";

  const SPLASH_IMAGES = [
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-starts-here-orQtAS63EOlGh6HB.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-the-mountain-7zeFS6ZCAEhfcma0.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-discovery-Bufo9iokjpWT3r8v.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-WPvyPpmEq4qJVmwx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-gei-G8MnWLUJs9kGKc5Q.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/what-is-the-firmament-9qGyGNtuv6VKsvqB.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-the-bible-real-0Xht5ES8D0XVi2KC.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-mountain-BCHRDwrxTxtsDi2F.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-mountains-ump3wrcconXNYMf4.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/was-god-a-person-30Ad9rLKpXzTsdei.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/was-jesus-a-real-person-2BGifdWrS3mblK6X.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/who-decoded-the-bible-2024-l8NULnPzNsNcIBgh.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/water-is-light-wlDWMVCH8EKVKAJP.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/proof-jesus-was-fake-dBKfTDd5wVtoOovy.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-start-here-qluUrUkE6U9tZiWA.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/dewight-mann-god-uBIUgOBZcAygqaqS.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/bible-god-3R68v7GEGZYWcUxD.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-support-xgGSevqqnPG0ltF3.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/ocean-god-ErC0y8rj8GUvAE9v.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-decoded-genesis-H1sNYNwF1sEEkhE3.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-oWhYiGHWJRjLUSlW.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-water-god-8e1Afrt45iPrD0w1.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/read-the-bible-like-wilbert-bouie-jr-VKE1Tnftzc8CWmjH.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/read-genesis-like-wilbert-bouie-jr-MXtcTdXhBbJcFseb.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the-bible-was-decoded-by-wilbert-bouie-jr-2024-P4Qcl006njMicqwS.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/how-to-read-the-bible-2026-f3BOSOm8smvOuAx6.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-is-a-damn-dam-2RJWUW3JKL00BOR1.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-dam-KH6xrnqjXrb3F0sN.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/goddam-7dbUavbnAipNRplN.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/dam-god-RNsM6TxmZqlBV7Tn.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/halloween-is-for-dam-kids-IzkcYSwHxZ6lUmQa.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-dam-halloween-JgCMhACu1DGT9lGS.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-water-oXbBFLXIrLrVcuwC.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-water-goZafyA6Z3BfGLhk.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/water-god-E8FZy2xp6vyXZYnt.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-god-water-11wb1RD5v8B7qm3N.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-diy-EmDGZZuTLk6Rgoa8.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-bible-rH9jpp3TqM7ieGn2.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-genesis-BSHTsUBjt1JXgHUM.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-y-all-too-WNMWb3MfHDWZOOZM.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-yalltoo-9PkrnzHRxefvCGy1.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-genesis-engineered-interpretations-kwSWnKWRiZVB9aDt.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-yall-too-eikvukiQnLbrcW6t.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/doctor-god-ZFQq7gu0Uds2K8xg.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/guitar-god-PnQfaNx4157O1KXf.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/pirate-god-DOkoFBGTq5dMjWIr.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/astronaut-god-eRqNNpho8vDZWJ82.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-a-mountain-y-all-too-dot-com-hi3CNgf9RV4SqjHx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-wet-floor-VORHZm8eHpZLzJTv.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-a-mountain-CPg0kfsb2vuhcbmr.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-is-truly-a-dam-LoNJOtQnPpJJkvLE.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-adam-a-dam-XNxj1Mv7wdYN3QFy.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-god-a-mountain-qpO2TwmncF0id7wH.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/what-is-a-firmament-8OqgupuTJ7iOMMvU.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/where-is-heaven-JJtSPQddL4C3zxCR.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/where-is-god-HGAWbh9COdS8Igzx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-mountain-3GVTuyelzk091MC0.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-god-37hJGSo2SKtV6PAk.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/realisticly-is-adam-a-dam-V3TsRHeymHSe1x1z.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-is-the-dam-woGOC54OPUZPg4pW.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/is-god-real-AFMs1G46Tv592OJr.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/what-is-heaven-WmwgtXzhgrGSNQsQ.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-contact-god-npiW7DVvPGZGTbqO.png"
  ];

  const FALLBACK_IMAGE = SPLASH_IMAGES[0];
  let state = SPLASH_ACTIVE;
  let completionScheduled = false;
  let timeoutId = null;

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function readDeck() {
    try {
      const raw = window.localStorage.getItem(DECK_STORAGE_KEY);
      const deck = raw ? JSON.parse(raw) : null;
      if (!Array.isArray(deck)) return [];
      return deck.filter((url) => SPLASH_IMAGES.includes(url));
    } catch {
      return [];
    }
  }

  function writeDeck(deck) {
    try {
      window.localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(deck));
    } catch {
      // Continue without persistence when storage is unavailable.
    }
  }

  function readLastImage() {
    try {
      return window.localStorage.getItem(LAST_IMAGE_KEY) || "";
    } catch {
      return "";
    }
  }

  function writeLastImage(url) {
    try {
      window.localStorage.setItem(LAST_IMAGE_KEY, url);
    } catch {
      // Continue without persistence when storage is unavailable.
    }
  }

  function nextImage() {
    let deck = readDeck();
    const lastImage = readLastImage();

    if (deck.length === 0) {
      deck = shuffle(SPLASH_IMAGES);
      if (deck.length > 1 && deck[0] === lastImage) {
        [deck[0], deck[1]] = [deck[1], deck[0]];
      }
    }

    let selected = deck.shift() || FALLBACK_IMAGE;

    if (selected === lastImage && deck.length > 0) {
      const replacementIndex = deck.findIndex((url) => url !== lastImage);
      if (replacementIndex >= 0) {
        [selected, deck[replacementIndex]] = [deck[replacementIndex], selected];
      }
    }

    writeDeck(deck);
    writeLastImage(selected);
    return selected;
  }

  function applyRandomTreatment(layer) {
    const treatments = [
      { scale: 1.02, x: "50%", y: "50%", saturate: 1.05, contrast: 1.03, brightness: 1.00, hue: 0, glow: "cyan" },
      { scale: 1.08, x: "44%", y: "48%", saturate: 1.16, contrast: 1.08, brightness: 0.97, hue: -3, glow: "indigo" },
      { scale: 1.12, x: "56%", y: "45%", saturate: 1.02, contrast: 1.12, brightness: 1.04, hue: 4, glow: "magenta" },
      { scale: 1.05, x: "48%", y: "54%", saturate: 1.22, contrast: 1.00, brightness: 0.94, hue: 7, glow: "cyan" },
      { scale: 1.10, x: "53%", y: "52%", saturate: 0.96, contrast: 1.10, brightness: 1.02, hue: -6, glow: "pink" },
      { scale: 1.04, x: "46%", y: "56%", saturate: 1.10, contrast: 1.06, brightness: 1.06, hue: 2, glow: "indigo" }
    ];

    const treatment = treatments[Math.floor(Math.random() * treatments.length)];
    layer.style.setProperty("--splash-art-scale", treatment.scale);
    layer.style.setProperty("--splash-art-x", treatment.x);
    layer.style.setProperty("--splash-art-y", treatment.y);
    layer.style.setProperty("--splash-art-saturate", treatment.saturate);
    layer.style.setProperty("--splash-art-contrast", treatment.contrast);
    layer.style.setProperty("--splash-art-brightness", treatment.brightness);
    layer.style.setProperty("--splash-art-hue", `${treatment.hue}deg`);
    layer.dataset.visualTreatment = treatment.glow;
  }

  function installSplashMarkup(frame) {
    const layer = document.createElement("section");
    layer.className = "splash-layer";
    layer.setAttribute("aria-label", "GEI Academy splash screen");
    layer.innerHTML = `
      <img class="splash-artwork" alt="" decoding="async" fetchpriority="high">
      <div class="splash-scrim" aria-hidden="true"></div>
      <div class="splash-content">
        <div class="splash-brand" aria-label="Genesis Engineered Interpretations">
          <img class="splash-brand-logo" src="${GEI_LOGO_URL}" alt="G.E.I. logo" decoding="async">
        </div>
        <p class="splash-kicker">Genesis Engineered Interpretations</p>
        <h1 class="splash-title">Enter the discovery.</h1>
        <p class="splash-subtitle">Learn to observe, question &amp; discover through water, engineering and interpretation.</p>
        <div class="splash-meta"><span>Water • Engineering • Discovery</span><span class="splash-meta-dot" aria-hidden="true"></span><span id="splash-status">Loading experience</span></div>
      </div>
      <div class="splash-controls">
        <div class="splash-progress" aria-hidden="true"><span id="splash-progress-bar"></span></div>
        <button class="splash-button splash-enter" id="splash-enter" type="button">Enter Academy →</button>
      </div>
    `;
    frame.insertBefore(layer, frame.firstChild);
    return layer;
  }

  function completeSplash(reason) {
    if (state === SPLASH_COMPLETE || completionScheduled) return;
    completionScheduled = true;
    state = SPLASH_COMPLETE;
    if (timeoutId) window.clearTimeout(timeoutId);
    const frame = document.getElementById(APP_FRAME_ID);
    if (!frame) return;
    frame.classList.add("splash-done");
    frame.dataset.splashExit = reason;
    window.setTimeout(() => {
      const layer = frame.querySelector(".splash-layer");
      if (layer) layer.setAttribute("aria-hidden", "true");
    }, 540);
  }

  function init() {
    const frame = document.getElementById(APP_FRAME_ID);
    if (!frame) return;
    const splash = frame.querySelector(".splash-layer") || installSplashMarkup(frame);
    const artwork = splash.querySelector(".splash-artwork");
    const enter = splash.querySelector("#splash-enter");
    const status = splash.querySelector("#splash-status");
    const progressBar = splash.querySelector("#splash-progress-bar");

    applyRandomTreatment(splash);
    const selectedImage = nextImage();
    artwork.src = selectedImage;
    artwork.onerror = () => {
      if (artwork.dataset.fallbackApplied === "true") return;
      artwork.dataset.fallbackApplied = "true";
      artwork.src = FALLBACK_IMAGE;
      if (status) status.textContent = "Using fallback artwork";
    };
    artwork.onload = () => {
      if (status) status.textContent = "Ready to enter";
    };

    enter.addEventListener("click", () => completeSplash("enter"));
    document.addEventListener("keydown", (event) => {
      if (state !== SPLASH_ACTIVE) return;
      if (event.key === "Enter") {
        event.preventDefault();
        completeSplash("keyboard-enter");
      }
    });

    const start = performance.now();
    const tick = (now) => {
      if (state !== SPLASH_ACTIVE) return;
      const progress = Math.min((now - start) / TIMEOUT_MS, 1);
      progressBar.style.width = `${progress * 100}%`;
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    timeoutId = window.setTimeout(() => completeSplash("timeout"), TIMEOUT_MS);
    window.requestAnimationFrame(tick);
  }

  init();
})();