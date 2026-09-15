(() => {
  "use strict";

  const FRAME_ID = "app-frame";
  const ACTIVE = "SPLASH_ACTIVE";
  const COMPLETE = "SPLASH_COMPLETE";
  const TIMEOUT_MS = 10000;
  const DECK_KEY = "gei-splash-image-deck-v3";
  const LAST_KEY = "gei-splash-last-image-v3";
  const IMAGE_TIMEOUT_MS = 6500;

  const LOCAL_FALLBACK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1800" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07101b"/><stop offset=".55" stop-color="#10263a"/><stop offset="1" stop-color="#160d22"/></linearGradient><linearGradient id="water" x1="0" x2="1"><stop stop-color="#2fd2ff"/><stop offset=".5" stop-color="#3d3dea"/><stop offset="1" stop-color="#f310ba"/></linearGradient></defs><rect width="1200" height="1800" fill="url(#bg)"/><circle cx="180" cy="310" r="420" fill="#2fd2ff" opacity=".12"/><circle cx="1050" cy="680" r="470" fill="#f310ba" opacity=".08"/><path d="M0 1040 220 790 390 930 560 560 720 820 900 610 1200 1040v220H0Z" fill="#0b1725" stroke="#2fd2ff" stroke-opacity=".22" stroke-width="8"/><path d="M0 1110h1200v690H0Z" fill="#07111d" opacity=".82"/><rect x="105" y="1035" width="990" height="95" rx="20" fill="#dce8f2" opacity=".92"/><path d="M180 1255c180-65 300 55 470-10s280-50 430 15v545H180Z" fill="url(#water)" opacity=".72"/><text x="600" y="925" fill="#fff" font-family="Arial,sans-serif" font-size="54" font-weight="800" text-anchor="middle">GEI</text><text x="600" y="985" fill="#bfefff" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="7" text-anchor="middle">WATER • ENGINEERING</text></svg>`;

  let state = ACTIVE;
  let timeoutId = null;
  let imageTimer = null;

  function readJson(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function readLast() {
    try { return localStorage.getItem(LAST_KEY) || ""; } catch { return ""; }
  }

  function writeLast(value) {
    try { localStorage.setItem(LAST_KEY, value); } catch {}
  }

  function shuffle(items) {
    const result = [...items];
    for (let i = result.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  async function loadDeck() {
    try {
      const response = await fetch("splash-images.json", { cache: "no-store" });
      if (response.ok) {
        const deck = await response.json();
        if (Array.isArray(deck) && deck.length) return deck.filter((url) => typeof url === "string" && url.startsWith("https://assets.zyrosite.com/"));
      }
    } catch {}
    return [];
  }

  function getWorkingDeck(candidates) {
    const stored = readJson(DECK_KEY);
    const valid = Array.isArray(stored) ? stored.filter((url) => candidates.includes(url)) : [];
    return valid.length ? valid : shuffle(candidates);
  }

  function showLocalFallback(artwork) {
    artwork.removeAttribute("src");
    artwork.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(LOCAL_FALLBACK_SVG)}`;
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
      transform: "scale(1.02)",
      filter: "saturate(1.06) contrast(1.04) brightness(.96)"
    });
  }

  function setStatus(text) {
    const status = document.querySelector(".splash-layer #splash-status");
    if (status) status.textContent = text;
  }

  function clearImageTimer() {
    if (imageTimer) {
      window.clearTimeout(imageTimer);
      imageTimer = null;
    }
  }

  async function showRandomArtwork(artwork) {
    const candidates = await loadDeck();
    if (!candidates.length) {
      setStatus("GEI artwork ready");
      showLocalFallback(artwork);
      return;
    }

    let deck = getWorkingDeck(candidates);
    const last = readLast();
    if (deck.length > 1 && deck[0] === last) [deck[0], deck[1]] = [deck[1], deck[0]];

    for (let attempt = 0; attempt < Math.min(12, deck.length); attempt += 1) {
      if (state !== ACTIVE) return;
      const url = deck.shift();
      setStatus(`Loading GEI artwork ${attempt + 1}`);

      const loaded = await new Promise((resolve) => {
        let settled = false;
        const finish = (ok) => {
          if (settled) return;
          settled = true;
          clearImageTimer();
          resolve(ok);
        };

        artwork.onload = () => finish(artwork.naturalWidth > 0 && artwork.naturalHeight > 0);
        artwork.onerror = () => finish(false);
        artwork.src = url;
        imageTimer = window.setTimeout(() => finish(false), IMAGE_TIMEOUT_MS);
      });

      if (loaded) {
        artwork.dataset.randomArtwork = url;
        writeLast(url);
        writeJson(DECK_KEY, deck);
        setStatus("Ready to enter");
        return;
      }
    }

    writeJson(DECK_KEY, deck);
    showLocalFallback(artwork);
    setStatus("GEI artwork ready");
  }

  function complete(reason) {
    if (state === COMPLETE) return;
    state = COMPLETE;
    clearImageTimer();
    if (timeoutId) window.clearTimeout(timeoutId);
    const frame = document.getElementById(FRAME_ID);
    if (!frame) return;
    frame.classList.add("splash-done");
    frame.dataset.splashExit = reason;
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

    prepareArtwork(artwork);
    showRandomArtwork(artwork);

    enter.addEventListener("click", () => complete("enter"), { once: true });
    document.addEventListener("keydown", (event) => {
      if (state === ACTIVE && event.key === "Enter") {
        event.preventDefault();
        complete("keyboard-enter");
      }
    });

    const start = performance.now();
    const tick = (now) => {
      if (state !== ACTIVE) return;
      progress.style.width = `${Math.min((now - start) / TIMEOUT_MS, 1) * 100}%`;
      if (now - start < TIMEOUT_MS) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    timeoutId = window.setTimeout(() => complete("timeout"), TIMEOUT_MS);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
