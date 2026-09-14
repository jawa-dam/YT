(() => {
  "use strict";

  const MASCOT_URL = "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-mascot-animated-UgmkGIe3sJES4tKm.gif";

  window.GEI_MASCOT = Object.freeze({
    name: "Adam",
    url: MASCOT_URL,
    alt: "Adam, the YallToo mascot",
    academyLabel: "Open Adam GEI assistant"
  });

  const ASSISTANT_RESPONSES = {
    gei: "GEI stands for Genesis Engineered Interpretations. Adam can help you explore the project through water, engineering, language and interpretation.",
    day1: "Start with Day 1. It introduces the first step of the GEI blueprint and gives you the foundation for the days that follow.",
    academy: "GEI Academy is your learning space. Use it to work through the six-day blueprint and build your understanding step by step.",
    navigate: "I can help you find your way. Use the Home, Academy, Portfolio, Video and Support buttons below whenever you need them."
  };

  function personalizeHomeCard() {
    const copy = document.querySelector("#screen-home .welcome-copy");
    if (!copy || copy.dataset.adamAssistantReady === "true") return;
    copy.dataset.adamAssistantReady = "true";
    copy.innerHTML = `
      <span class="card-label">ADAM • YOUR GEI ASSISTANT</span>
      <h2>Hi, I'm Adam.</h2>
      <p>Your compact GEI guide. Tap me and I'll help you find what you need.</p>
    `;
  }

  function personalizeHomeMascot() {
    const button = document.querySelector("#screen-home .home-mascot-button");
    if (!button || button.dataset.adamAssistantLabelReady === "true") return;
    button.dataset.adamAssistantLabelReady = "true";
    button.setAttribute("aria-label", "Ask Adam, your GEI Assistant");
    const badge = button.querySelector(".mascot-badge");
    const caption = button.querySelector(".mascot-caption");
    if (badge) badge.textContent = "ADAM";
    if (caption) caption.textContent = "ASK ADAM";
  }

  function ensureAssistantStyles() {
    if (document.getElementById("home-adam-assistant-styles")) return;
    const style = document.createElement("style");
    style.id = "home-adam-assistant-styles";
    style.textContent = `
      .home-adam-assistant { position:absolute;z-index:40;left:12px;right:12px;top:88px;bottom:88px;display:flex;align-items:center;justify-content:center;pointer-events:none; }
      .home-adam-assistant-backdrop { position:absolute;inset:0;border-radius:24px;background:rgba(2,5,11,.58);backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px);opacity:0;animation:adamAssistantBackdrop .2s ease-out forwards; }
      .home-adam-assistant-card { position:relative;width:min(100%,390px);max-height:100%;overflow:hidden;display:grid;grid-template-rows:auto auto 1fr auto;gap:10px;padding:14px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 42%,rgba(255,255,255,.16));border-radius:22px;background:linear-gradient(145deg,color-mix(in srgb,var(--skin-surface,#fff) 94%,var(--skin-accent,#2fd2ff) 6%),var(--skin-surface,#fff));box-shadow:0 24px 60px rgba(0,0,0,.34),0 0 36px color-mix(in srgb,var(--skin-accent,#2fd2ff) 12%,transparent);color:var(--skin-text,#102a43);transform:translateY(10px) scale(.98);opacity:0;animation:adamAssistantIn .24s cubic-bezier(.2,.8,.2,1) forwards;pointer-events:auto; }
      .home-adam-assistant-head { display:flex;align-items:center;gap:10px;min-width:0; }
      .home-adam-assistant-avatar { width:48px;height:48px;flex:0 0 48px;object-fit:contain;filter:drop-shadow(0 7px 10px rgba(0,0,0,.18)); }
      .home-adam-assistant-heading { min-width:0;flex:1; }
      .home-adam-assistant-kicker { display:block;color:var(--skin-accent,#2fd2ff);font-size:9px;font-weight:900;letter-spacing:.13em;text-transform:uppercase; }
      .home-adam-assistant-heading strong { display:block;margin-top:2px;font-size:20px;line-height:1.05;letter-spacing:-.025em; }
      .home-adam-assistant-close { width:34px;height:34px;flex:0 0 34px;display:grid;place-items:center;padding:0;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 28%,transparent);border-radius:11px;background:var(--skin-soft,#f1f4f8);color:var(--skin-text,#102a43);font-size:20px;line-height:1;cursor:pointer; }
      .home-adam-assistant-close:focus-visible,.home-adam-assistant-choice:focus-visible { outline:3px solid var(--skin-accent,#2fd2ff);outline-offset:2px; }
      .home-adam-assistant-message { margin:0;padding:11px 12px;border-left:3px solid var(--skin-accent,#2fd2ff);border-radius:12px;background:var(--skin-soft,#f1f4f8);font-size:13px;line-height:1.38;color:var(--skin-text,#102a43); }
      .home-adam-assistant-label { margin:0 2px -3px;color:var(--skin-muted,#526b82);font-size:9px;font-weight:900;letter-spacing:.11em;text-transform:uppercase; }
      .home-adam-assistant-choices { min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:7px;align-content:start;overflow:auto; }
      .home-adam-assistant-choice { min-height:48px;padding:9px 10px;border:1px solid color-mix(in srgb,var(--skin-accent,#2fd2ff) 25%,transparent);border-radius:13px;background:var(--skin-surface,#fff);color:var(--skin-text,#102a43);font-size:11px;font-weight:800;text-align:left;cursor:pointer; }
      .home-adam-assistant-choice:active { transform:scale(.985); }
      .home-adam-assistant-footer { display:flex;align-items:center;justify-content:space-between;gap:8px;padding-top:2px;color:var(--skin-muted,#526b82);font-size:9px;font-weight:800; }
      .home-adam-assistant-status { color:var(--skin-accent,#2fd2ff);font-weight:900; }
      @keyframes adamAssistantBackdrop { to { opacity:1; } }
      @keyframes adamAssistantIn { to { transform:translateY(0) scale(1);opacity:1; } }
      @media(max-width:360px){
        .home-adam-assistant{left:8px;right:8px;top:76px;bottom:80px;}
        .home-adam-assistant-card{padding:11px;border-radius:19px;gap:8px;}
        .home-adam-assistant-avatar{width:42px;height:42px;flex-basis:42px;}
        .home-adam-assistant-heading strong{font-size:18px;}
        .home-adam-assistant-message{font-size:12px;padding:9px 10px;}
        .home-adam-assistant-choice{min-height:44px;padding:8px;font-size:10px;}
      }
      @media(prefers-reduced-motion:reduce){.home-adam-assistant-backdrop,.home-adam-assistant-card{animation:none;opacity:1;transform:none;}}
    `;
    document.head.appendChild(style);
  }

  function openAssistant() {
    const home = document.getElementById("screen-home");
    if (!home) return;
    const existing = document.getElementById("home-adam-assistant");
    if (existing) return;
    ensureAssistantStyles();

    const assistant = document.createElement("div");
    assistant.className = "home-adam-assistant";
    assistant.id = "home-adam-assistant";
    assistant.setAttribute("role", "dialog");
    assistant.setAttribute("aria-modal", "true");
    assistant.setAttribute("aria-label", "Adam GEI Assistant");
    assistant.innerHTML = `
      <div class="home-adam-assistant-backdrop" aria-hidden="true"></div>
      <section class="home-adam-assistant-card">
        <header class="home-adam-assistant-head">
          <img class="home-adam-assistant-avatar" src="${MASCOT_URL}" alt="Adam, GEI Assistant" />
          <div class="home-adam-assistant-heading"><span class="home-adam-assistant-kicker">YALLTOO • GEI ASSISTANT</span><strong>Hi, I'm Adam.</strong></div>
          <button class="home-adam-assistant-close" type="button" aria-label="Close Adam assistant">×</button>
        </header>
        <p class="home-adam-assistant-message" id="home-adam-assistant-message">I'm here to help. What can I help you with?</p>
        <div>
          <p class="home-adam-assistant-label">Quick help</p>
          <div class="home-adam-assistant-choices">
            <button class="home-adam-assistant-choice" type="button" data-adam-question="gei">💧 What is GEI?</button>
            <button class="home-adam-assistant-choice" type="button" data-adam-question="day1">📖 Start with Day 1</button>
            <button class="home-adam-assistant-choice" type="button" data-adam-question="academy">🎓 How does Academy work?</button>
            <button class="home-adam-assistant-choice" type="button" data-adam-question="navigate">🧭 Help me navigate</button>
          </div>
        </div>
        <footer class="home-adam-assistant-footer"><span>Ask Adam anytime.</span><span class="home-adam-assistant-status">● ONLINE</span></footer>
      </section>
    `;
    home.appendChild(assistant);

    const close = () => {
      assistant.remove();
      document.querySelector(".home-mascot-button")?.focus();
    };
    assistant.querySelector(".home-adam-assistant-close")?.addEventListener("click", close);
    assistant.querySelector(".home-adam-assistant-backdrop")?.addEventListener("click", close);
    assistant.querySelectorAll("[data-adam-question]").forEach((button) => {
      button.addEventListener("click", () => {
        const key = button.dataset.adamQuestion;
        const message = assistant.querySelector("#home-adam-assistant-message");
        if (message && ASSISTANT_RESPONSES[key]) message.textContent = ASSISTANT_RESPONSES[key];
      });
    });
    assistant.querySelector(".home-adam-assistant-close")?.focus();
  }

  function routeHomeAdam(event) {
    const button = event.target.closest?.(".home-mascot-button");
    if (!button) return;

    const home = document.getElementById("screen-home");
    if (!home) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    openAssistant();
  }

  function init() {
    personalizeHomeCard();
    personalizeHomeMascot();
    document.addEventListener("click", routeHomeAdam, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
