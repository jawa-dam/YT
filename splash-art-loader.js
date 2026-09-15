/* V1.17 — Resilient Random Splash Artwork Loader
 * Keeps splash artwork independent from the main splash boot path.
 * It extracts the existing Zyro artwork deck from splash.js, retries bad/slow
 * candidates, and applies the first image that actually loads in the browser.
 */
(() => {
  "use strict";

  const ARTWORK_ID = "gei-splash-art-loader-v1";
  const DECK_KEY = "gei-splash-art-loader-deck-v1";
  const LAST_KEY = "gei-splash-art-loader-last-v1";
  const MAX_ATTEMPTS = 10;
  const IMAGE_TIMEOUT_MS = 3200;
  const BOOT_DELAY_MS = 120;
  const ZYRO_PREFIX = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/";

  const FALLBACK_CANDIDATES = [
    `${ZYRO_PREFIX}y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png`,
    `${ZYRO_PREFIX}start-here-gei-ZAxHC3CvlzNVXcDh.png`,
    `${ZYRO_PREFIX}gei-starts-here-orQtAS63EOlGh6HB.png`,
    `${ZYRO_PREFIX}god-the-mountain-7zeFS6ZCAEhfcma0.png`,
    `${ZYRO_PREFIX}yalltoo-WPvyPpmEq4qJVmwx.png`,
    `${ZYRO_PREFIX}yalltoo-gei-G8MnWLUJs9kGKc5Q.png`,
    `${ZYRO_PREFIX}god-is-mountain-BCHRDwrxTxtsDi2F.png`,
    `${ZYRO_PREFIX}mountain-water-god-8e1Afrt45iPrD0w1.png`
  ];

  function getArtworkElement() {
    return document.querySelector(".splash-layer .splash-artwork");
  }

  function getStatusElement() {
    return document.querySelector(".splash-layer #splash-status");
  }

  function readJson(key) {
    try {
      const value = JSON.parse(localStorage.getItem(key) || "null");
      return Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  }

  function writeJson(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  function readLast() {
    try { return localStorage.getItem(LAST_KEY) || ""; } catch { return ""; }
  }

  function writeLast(url) {
    try { localStorage.setItem(LAST_KEY, url); } catch {}
  }

  function shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  async function extractDeck() {
    try {
      const response = await fetch("splash.js", { cache: "no-store" });
      if (!response.ok) throw new Error(`splash.js ${response.status}`);
      const source = await response.text();
      const matches = source.match(/https:\/\/assets\.zyrosite\.com\/YZ9jg46Bljs5wOZR\/[A-Za-z0-9._-]+\.png/g) || [];
      return [...new Set(matches)].filter((url) => url !== "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png");
    } catch {
      return [];
    }
  }

  function prepareArtwork(artwork) {
    artwork.style.setProperty("z-index", "0", "important");
    artwork.style.setProperty("display", "block", "important");
    artwork.style.setProperty("visibility", "visible", "important");
    artwork.style.setProperty("opacity", "1", "important");
    artwork.style.setProperty("position", "absolute", "important");
    artwork.style.setProperty("inset", "0", "important");
    artwork.style.setProperty("width", "100%", "important");
    artwork.style.setProperty("height", "100%", "important");
    artwork.style.setProperty("object-fit", "cover", "important");
    artwork.style.setProperty("object-position", "center", "important");
    artwork.style.setProperty("transform", "scale(1.02)", "important");
    artwork.style.setProperty("filter", "saturate(1.06) contrast(1.04) brightness(.96)", "important");
  }

  function tryImage(url) {
    return new Promise((resolve) => {
      const image = new Image();
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timer);
        resolve(ok);
      };
      const timer = window.setTimeout(() => finish(false), IMAGE_TIMEOUT_MS);
      image.decoding = "async";
      image.onload = () => finish(image.naturalWidth > 0 && image.naturalHeight > 0);
      image.onerror = () => finish(false);
      image.src = url;
    });
  }

  function getDeck(candidates) {
    const stored = readJson(DECK_KEY);
    const valid = Array.isArray(stored) ? stored.filter((url) => candidates.includes(url)) : [];
    if (valid.length) return valid;
    return shuffle(candidates);
  }

  async function loadArtwork() {
    const artwork = getArtworkElement();
    if (!artwork) return;

    prepareArtwork(artwork);

    const discovered = await extractDeck();
    const candidates = discovered.length ? discovered : FALLBACK_CANDIDATES;
    let deck = getDeck(candidates);
    const last = readLast();
    if (deck.length > 1 && deck[0] === last) [deck[0], deck[1]] = [deck[1], deck[0]];

    const status = getStatusElement();
    if (status) status.textContent = "Selecting GEI artwork";

    for (let attempt = 0; attempt < MAX_ATTEMPTS && deck.length; attempt += 1) {
      const url = deck.shift();
      const ok = await tryImage(url);
      if (!ok) continue;

      artwork.src = url;
      artwork.dataset.randomArtworkLoaded = "true";
      artwork.dataset.randomArtworkUrl = url;
      writeLast(url);
      writeJson(DECK_KEY, deck);
      if (status) status.textContent = "Ready to enter";
      return;
    }

    writeJson(DECK_KEY, deck);
    if (status) status.textContent = "GEI artwork ready";
  }

  function init() {
    window.setTimeout(loadArtwork, BOOT_DELAY_MS);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
