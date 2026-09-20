/* V1.63.28 — GEI Dam Gate Ceremony
   Explicit confirmation + one-time 666 XP consumption.
   Preserves six-day completion, mastery, badges, identity and history.
*/
(() => {
  "use strict";
  if (window.GEI_DAM_GATE_CEREMONY) return;

  const STORAGE_KEY = "geiDamGateV1";
  const COST = 666;

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const state = raw ? JSON.parse(raw) : {};
      return state && typeof state === "object" ? state : {};
    } catch (_) {
      return {};
    }
  }

  function isOpened() {
    return readState().opened === true;
  }

  function playGateSound(success = true) {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(success ? 0.18 : 0.1, now + 0.04);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.9);
      master.connect(ctx.destination);

      if (success) {
        const notes = [110, 165, 220, 330];
        notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = i === 3 ? "triangle" : "sine";
          osc.frequency.setValueAtTime(freq, now + i * 0.16);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.16, now + 0.42 + i * 0.16);
          gain.gain.setValueAtTime(0.0001, now + i * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.12, now + 0.08 + i * 0.16);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72 + i * 0.16);
          osc.connect(gain);
          gain.connect(master);
          osc.start(now + i * 0.16);
          osc.stop(now + 0.9 + i * 0.16);
        });

        const gate = ctx.createOscillator();
        const gateGain = ctx.createGain();
        gate.type = "sawtooth";
        gate.frequency.setValueAtTime(58, now);
        gate.frequency.exponentialRampToValueAtTime(24, now + 1.15);
        gateGain.gain.setValueAtTime(0.0001, now);
        gateGain.gain.exponentialRampToValueAtTime(0.09, now + 0.08);
        gateGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.35);
        gate.connect(gateGain);
        gateGain.connect(master);
        gate.start(now);
        gate.stop(now + 1.45);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.5);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
        osc.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 0.65);
      }
      window.setTimeout(() => ctx.close().catch(() => {}), 2400);
    } catch (_) {}
  }

  function ceremonyMarkup() {
    return `
      <div class="gei-gate-ceremony" id="gei-gate-ceremony" role="dialog" aria-modal="true" aria-labelledby="gei-gate-ceremony-title">
        <div class="gei-gate-ceremony-dialog">
          <span class="gei-gate-ceremony-kicker">DAM GATE CEREMONY</span>
          <h2 id="gei-gate-ceremony-title">Open the Dam?</h2>
          <p>Your six-day GEI Blueprint is complete and the 666 XP threshold has been reached.</p>
          <div class="gei-gate-ceremony-cost">XP CONSUMPTION<strong>666 XP</strong></div>
          <p>Opening the gate consumes the 666 XP balance. Your completed Days 1–6, mastery badges, learner identity and Blueprint history remain saved.</p>
          <div class="gei-gate-ceremony-actions">
            <button class="gei-gate-keep" id="gei-gate-keep" type="button">KEEP THE DAM</button>
            <button class="gei-gate-open-confirm" id="gei-gate-open-confirm" type="button">OPEN THE DAM</button>
          </div>
        </div>
      </div>`;
  }

  function showSuccess() {
    const old = document.getElementById("gei-gate-ceremony");
    old?.remove();

    const layer = document.createElement("div");
    layer.className = "gei-gate-ceremony is-success";
    layer.id = "gei-gate-success";
    layer.setAttribute("role", "dialog");
    layer.setAttribute("aria-modal", "true");
    layer.innerHTML = `
      <div class="gei-gate-ceremony-dialog gei-gate-success-dialog">
        <div class="gei-gate-success-mark" aria-hidden="true">🌊</div>
        <span class="gei-gate-ceremony-kicker">THE DAM IS OPEN</span>
        <h2>Flow Released.</h2>
        <p class="gei-gate-success-copy">666 XP has been consumed to open the gate. Your six-day Blueprint remains permanently recorded.</p>
        <div class="gei-gate-ceremony-cost">ACADEMY XP BALANCE<strong>0 XP</strong></div>
        <p class="gei-gate-success-copy">The simulator wall is the next stage.</p>
      </div>`;
    document.body.appendChild(layer);
    window.setTimeout(() => layer.remove(), 3200);
  }

  function openConfirmation() {
    if (isOpened() || document.getElementById("gei-gate-ceremony")) return;

    const gate = window.GEI_DAM_GATE?.getState?.();
    const xp = Math.max(0, Number(window.GEI_PROGRESS?.getState?.()?.xp) || 0);
    if (!gate?.unlocked || xp < COST) return;

    document.body.insertAdjacentHTML("beforeend", ceremonyMarkup());
    const dialog = document.getElementById("gei-gate-ceremony");
    const keep = document.getElementById("gei-gate-keep");
    const confirm = document.getElementById("gei-gate-open-confirm");
    const close = () => dialog?.remove();

    keep?.addEventListener("click", close);
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) close();
    });
    confirm?.addEventListener("click", () => {
      if (confirm.dataset.processing === "true") return;
      confirm.dataset.processing = "true";
      confirm.disabled = true;

      const latestGate = window.GEI_DAM_GATE?.getState?.();
      const latestXP = Math.max(0, Number(window.GEI_PROGRESS?.getState?.()?.xp) || 0);

      if (!latestGate?.unlocked || latestXP < COST) {
        playGateSound(false);
        close();
        return;
      }

      const spent = window.GEI_PROGRESS?.spendXP?.(COST, "dam-gate-v1.63.28");
      if (!spent) {
        playGateSound(false);
        close();
        return;
      }

      const current = readState();
      const openedState = {
        ...current,
        version: "1.63.28",
        unlocked: true,
        opened: true,
        openedAt: Date.now(),
        xpConsumed: COST
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(openedState));
      } catch (_) {
        // The XP transaction succeeded; surface the success but do not fake persistence.
      }

      window.dispatchEvent(new CustomEvent("gei:dam-gate-opened", {
        detail: {
          ...openedState,
          xpConsumed: COST,
          xpRemaining: 0,
          source: "v1.63.28"
        }
      }));

      playGateSound(true);
      window.GEI_SONIC_FX?.waterCelebration?.(6);
      close();
      showSuccess();
    });
    confirm?.focus();
  }

  function init() {
    window.GEI_DAM_GATE_CEREMONY = Object.freeze({
      version: "1.63.28",
      cost: COST,
      isOpened,
      confirm: openConfirmation
    });

    window.addEventListener("gei:dam-gate-unlocked", () => {
      window.GEI_DAM_GATE?.render?.();
    });
    window.addEventListener("gei:dam-gate-opened", () => {
      window.GEI_DAM_GATE?.render?.();
    });
    window.addEventListener("gei:progress-updated", () => {
      window.GEI_DAM_GATE?.render?.();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();