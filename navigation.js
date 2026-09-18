(() => {
  "use strict";

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: "⌂", target: "screen-home" },
    { id: "academy", label: "Academy", icon: "✦", target: "screen-academy" },
    { id: "portfolio", label: "Portfolio", icon: "▤", target: "screen-portfolio" },
    { id: "video", label: "Video", icon: "▶", target: "screen-video" },
    { id: "support", label: "Support", icon: "?", target: "screen-support" }
  ];

  const GEI_LOGO_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-logo-gwP3315oRt91xpE8.png";
  const SUPPORT_LINKS = [
    { label: "GoFundMe", detail: "Support the GEI research fundraiser", href: "https://gofund.me/927c07d75", className: "support-gofundme", image: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/go-fund-me-gei-rQp76i277bWw1w6S.png", imageAlt: "GoFundMe" },
    { label: "Cash App", detail: "Send direct support through Cash App", href: "https://cash.app/$1oh1", className: "support-cashapp", image: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/cashapp-gei-Kl9CjhEgQiciiucv.png", imageAlt: "Cash App" },
    { label: "PayPal", detail: "Support GEI securely through PayPal", href: "https://www.paypal.com/ncp/payment/YCVQWR87ZEBFJ", className: "support-paypal", image: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/paypal-gei-8S9OqrMZCaU0iIBk.png", imageAlt: "PayPal" }
  ];

  const MASCOT = window.GEI_MASCOT || {
    url: "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif",
    alt: "Adam, the YallToo mascot",
    academyLabel: "Open Adam Academy guide"
  };
  const HOME_MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam-dam-guide-qtx78bnE5ITfwakV.png";
  const HOME_PRODUCT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/inshot_20260808_192709068-u7bYAfdJRGRfnEfC.gif";
  const HOME_STORE_URL = "https://www.yalltoo.com/gei-discovery-guide-";
  const HOME_DAM_URL = "dam-release.html";
  const state = { activeScreen: "home", initialized: false };

  function getNavRoot() { return document.getElementById("bottom-navigation"); }
  function getScreens() { return Array.from(document.querySelectorAll(".app-screen")); }

  function ensureSupportStyles() {
    if (document.getElementById("support-page-styles")) return;
    const style = document.createElement("style");
    style.id = "support-page-styles";
    style.textContent = `
      #screen-support { position:relative;overflow:hidden!important;overscroll-behavior:none;touch-action:none; }
      .support-root { position:absolute;inset:0;width:100%;height:auto;min-height:0;overflow:hidden!important;overscroll-behavior:none;touch-action:none;box-sizing:border-box;padding:max(16px,env(safe-area-inset-top)) 16px calc(82px + env(safe-area-inset-bottom));display:grid;grid-template-rows:auto minmax(0,1fr);gap:12px;color:var(--skin-text,#102a43); }
      .support-header { display:flex;align-items:flex-start;justify-content:space-between;gap:12px; }
      .support-kicker { display:block;color:var(--skin-accent,#2fd2ff);font-size:12px;font-weight:900;letter-spacing:.14em;text-transform:uppercase; }
      .support-header h1 { margin:5px 0 4px;font-size:clamp(34px,8.8vw,42px);line-height:.98;letter-spacing:-.045em; }
      .support-header p { margin:0;max-width:290px;color:var(--skin-muted,#526b82);font-size:15px;line-height:1.3; }
      .support-gei-logo { display:block;width:72px;height:52px;flex:0 0 72px;object-fit:contain;object-position:center;border-radius:10px; }
      .support-content { min-height:0;overflow:hidden!important;overscroll-behavior:none;touch-action:none;display:grid;align-content:start;gap:10px;padding-right:0; }
      .support-goal { padding:16px 15px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 35%,transparent);border-radius:21px;background:linear-gradient(145deg,color-mix(in srgb,var(--skin-accent,#2fd2ff) 12%,var(--skin-surface,#fff)),var(--skin-surface,#fff)); }
      .support-goal-label { display:block;margin-bottom:6px;color:var(--skin-accent,#2fd2ff);font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase; }
      .support-goal p { margin:0;color:var(--skin-text,#102a43);font-size:15px;line-height:1.38; }
      .support-methods { display:grid;grid-template-columns:1fr;gap:8px; }
      .support-method { display:flex;align-items:center;gap:12px;min-height:64px;padding:8px 12px;box-sizing:border-box;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 28%,transparent);border-radius:17px;background:var(--skin-surface,#fff);color:inherit;text-decoration:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation; }
      .support-method:focus-visible { outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px; }
      .support-icon { display:grid;place-items:center;width:62px;height:46px;flex:0 0 62px;border-radius:11px;background:var(--skin-soft,#f1f4f8);overflow:hidden; }
      .support-icon img { display:block;width:100%;height:100%;object-fit:contain;object-position:center; }
      .support-method strong,.support-method span { display:block; }.support-method strong { font-size:17px;line-height:1.05; }.support-method span { margin-top:3px;color:var(--skin-muted,#526b82);font-size:12px;line-height:1.2; }
      .support-arrow { margin-left:auto;color:var(--skin-accent,#2fd2ff);font-size:23px; }
      .support-contact { display:flex;align-items:center;justify-content:space-between;gap:10px;min-height:58px;padding:10px 12px;box-sizing:border-box;border-radius:16px;background:var(--skin-soft,#f1f4f8); }
      .support-contact-copy { min-width:0;flex:1 1 auto; }
      .support-contact-copy strong,.support-contact-copy span { display:block; }.support-contact-copy strong { font-size:14px;line-height:1.05; }.support-contact-copy span { margin-top:3px;color:var(--skin-muted,#526b82);font-size:11px;line-height:1.2; }
      .support-email { flex:0 1 auto;min-width:0;max-width:52%;box-sizing:border-box;color:var(--skin-accent,#2fd2ff);font-size:12px;font-weight:800;text-decoration:none;overflow-wrap:anywhere;word-break:break-word;text-align:right;line-height:1.15;touch-action:manipulation; }
      @media(max-width:360px){.support-root{padding-inline:12px;padding-top:13px;gap:9px}.support-header{gap:8px}.support-kicker{font-size:11px}.support-header h1{font-size:32px}.support-header p{font-size:14px;max-width:220px}.support-gei-logo{width:62px;height:46px;flex-basis:62px}.support-content{gap:8px}.support-goal{padding:13px 12px}.support-goal-label{font-size:11px;margin-bottom:5px}.support-goal p{font-size:14px;line-height:1.34}.support-methods{gap:7px}.support-method{min-height:59px;padding:7px 9px;gap:9px}.support-icon{width:55px;height:41px;flex-basis:55px}.support-method strong{font-size:16px}.support-method span{font-size:11px}.support-arrow{font-size:21px}.support-contact{min-height:52px;padding:8px 9px;gap:7px}.support-contact-copy strong{font-size:13px}.support-contact-copy span{font-size:10px}.support-email{max-width:48%;font-size:10px}}
    `;
    document.head.appendChild(style);
  }

  function ensureHomeProductStyles() {
    if (document.getElementById("home-product-styles")) return;
    const style = document.createElement("style");
    style.id = "home-product-styles";
    style.textContent = `
      .home-experience-stack { width:100%;display:grid;gap:10px; }
      .home-dam-card { position:relative;width:100%;height:180px;box-sizing:border-box;overflow:hidden;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 34%,transparent);border-radius:22px;background:linear-gradient(135deg,#08101b,#0b0e18);box-shadow:0 12px 30px rgba(0,0,0,.1); }
      .home-dam-label { position:absolute;z-index:2;left:11px;top:8px;padding:4px 8px;border:1px solid rgba(47,210,255,.28);border-radius:999px;background:rgba(3,8,16,.72);color:#eaf9ff;font-size:8px;font-weight:900;letter-spacing:.13em;text-transform:uppercase;pointer-events:none; }
      .home-dam-frame { display:block;width:100%;height:100%;border:0;background:transparent; }
      .home-product-card { position:relative;display:block;width:100%;min-height:112px;box-sizing:border-box;overflow:hidden;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 34%,transparent);border-radius:22px;background:linear-gradient(135deg,color-mix(in srgb,var(--skin-accent,#2fd2ff) 10%,var(--skin-surface,#fff)),var(--skin-surface,#fff));box-shadow:0 14px 34px rgba(0,0,0,.08);text-decoration:none;-webkit-tap-highlight-color:transparent; }
      .home-product-card img { display:block;width:100%;height:112px;object-fit:cover;object-position:center; }
      .home-product-card::after { content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 48%,rgba(6,7,13,.78) 100%);pointer-events:none; }
      .home-product-cta { position:absolute;left:14px;right:14px;bottom:11px;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:10px;color:#fff; }
      .home-product-cta span { font-size:10px;font-weight:900;letter-spacing:.12em;text-transform:uppercase; }
      .home-product-cta b { display:grid;place-items:center;width:34px;height:34px;flex:0 0 34px;border-radius:11px;background:rgba(255,255,255,.94);color:#102a43;font-size:19px;box-shadow:0 6px 18px rgba(0,0,0,.18); }
      .home-product-card:hover,.home-product-card:focus-visible { transform:translateY(-1px);box-shadow:0 18px 38px rgba(0,0,0,.12); }
      .home-product-card:focus-visible { outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px; }
      @media(max-width:360px){.home-dam-card{height:150px;border-radius:20px}.home-dam-label{left:8px;top:6px;font-size:7px;padding:3px 7px}.home-product-card{min-height:98px;border-radius:20px}.home-product-card img{height:98px}.home-product-cta{left:11px;right:11px;bottom:8px}.home-product-cta span{font-size:8px}.home-product-cta b{width:30px;height:30px;flex-basis:30px;font-size:16px}}
    `;
    document.head.appendChild(style);
  }

  function replaceHomeBlueprint() {
    const screen = document.getElementById("screen-home");
    if (!screen || screen.dataset.productReady === "true") return;
    const blueprint = screen.querySelector(".blueprint-card");
    const cta = screen.querySelector(".academy-cta");
    if (!blueprint) return;
    ensureHomeProductStyles();

    const homeStack = document.createElement("div");
    homeStack.className = "home-experience-stack";

    const dam = document.createElement("section");
    dam.className = "home-dam-card";
    dam.setAttribute("aria-label", "Interactive GEI dam release");
    dam.innerHTML = `<span class="home-dam-label">GEI LIVE DAM • RELEASE WATER</span><iframe class="home-dam-frame" src="${HOME_DAM_URL}" title="Interactive GEI dam release" loading="eager" sandbox="allow-scripts"></iframe>`;

    const product = document.createElement("a");
    product.className = "home-product-card";
    product.href = HOME_STORE_URL;
    product.target = "_blank";
    product.rel = "noopener noreferrer";
    product.setAttribute("aria-label", "Open the GEI Discovery Guide store page");
    product.innerHTML = `<img src="${HOME_PRODUCT_URL}" alt="GEI Discovery Guide" loading="eager" decoding="async"><span class="home-product-cta"><span>GET THE GEI DISCOVERY GUIDE</span><b aria-hidden="true">→</b></span>`;

    homeStack.append(dam, product);
    blueprint.replaceWith(homeStack);
    if (cta) cta.remove();
    screen.dataset.productReady = "true";
  }

  function renderSupport() {
    const screen = document.getElementById("screen-support");
    if (!screen || screen.dataset.supportRendered === "true") return;
    ensureSupportStyles();
    screen.dataset.supportRendered = "true";
    screen.innerHTML = `<div class="support-root"><header class="support-header"><div><span class="support-kicker">GEI SUPPORT</span><h1>Support the Research</h1><p>Help Genesis Engineered Interpretations grow, build, document and share.</p></div><img class="support-gei-logo" src="${GEI_LOGO_URL}" alt="Genesis Engineered Interpretations" loading="eager" decoding="async" /></header><div class="support-content"><section class="support-goal" aria-labelledby="support-goal-title"><span class="support-goal-label" id="support-goal-title">Fundraiser Goal</span><p>Your support directly funds the research — enabling GEI to develop working prototypes, documents, and share this knowledge freely with communities, students, and innovators worldwide. Every contribution moves GEI closer to a future where this guide is accessible to all.</p></section><section class="support-methods" aria-label="Ways to support GEI">${SUPPORT_LINKS.map((item) => `<a class="support-method ${item.className}" href="${item.href}" target="_blank" rel="noopener noreferrer"><span class="support-icon"><img src="${item.image}" alt="${item.imageAlt}" loading="lazy" decoding="async" /></span><span><strong>${item.label}</strong><span>${item.detail}</span></span><span class="support-arrow" aria-hidden="true">→</span></a>`).join("")}</section><div class="support-contact"><div class="support-contact-copy"><strong>Contact GEI</strong><span>Questions, collaboration or research support</span></div><a class="support-email" href="mailto:Contact@yalltoo.com">Contact@yalltoo.com</a></div></div></div>`;
  }

  function replaceHomeMascot() {
    const orbit = document.querySelector("#screen-home .mascot-orbit");
    if (!orbit || orbit.dataset.mascotReady === "true") return;
    orbit.dataset.mascotReady = "true";
    orbit.setAttribute("aria-label", "Adam mascot");
    orbit.innerHTML = `<button class="home-mascot-button gei-mascot-button gei-mascot-button--interactive" type="button" aria-label="${MASCOT.academyLabel}"><span class="mascot-ring" aria-hidden="true"></span><img class="home-mascot-image gei-mascot-image" src="${HOME_MASCOT_URL}" alt="Adam, the GEI dam guide mascot" /></button>`;
    orbit.querySelector(".home-mascot-button")?.addEventListener("click", () => document.querySelector("#screen-academy .academy-mascot")?.click());
  }

  function renderNavigation() {
    const root = getNavRoot();
    if (!root || root.dataset.rendered === "true") return;
    root.dataset.rendered = "true";
    root.innerHTML = NAV_ITEMS.map((item) => `<button type="button" class="nav-button" data-nav-id="${item.id}" aria-label="${item.label}"><span class="nav-icon" aria-hidden="true">${item.icon}</span><span class="nav-label">${item.label}</span></button>`).join("");
    root.querySelectorAll("[data-nav-id]").forEach((button) => button.addEventListener("click", () => setActiveScreen(button.dataset.navId)));
  }

  function setActiveScreen(id) {
    const item = NAV_ITEMS.find((entry) => entry.id === id) || NAV_ITEMS[0];
    state.activeScreen = item.id;
    getScreens().forEach((screen) => {
      const isActive = screen.id === item.target;
      screen.classList.toggle("active", isActive);
      screen.classList.toggle("is-active", isActive);
      screen.setAttribute("aria-hidden", isActive ? "false" : "true");
    });
    getNavRoot()?.querySelectorAll("[data-nav-id]").forEach((button) => {
      const isActive = button.dataset.navId === item.id;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-current", isActive ? "page" : "false");
    });
    if (item.id === "home") {
      replaceHomeMascot();
      replaceHomeBlueprint();
    }
    if (item.id === "support") renderSupport();
    window.dispatchEvent(new CustomEvent("gei:navigation", { detail: { id: item.id, target: item.target } }));
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;
    renderNavigation();
    replaceHomeMascot();
    replaceHomeBlueprint();
    renderSupport();
    setActiveScreen(location.hash === "#academy" ? "academy" : "home");
    window.addEventListener("hashchange", () => { if (location.hash === "#academy") setActiveScreen("academy"); });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
