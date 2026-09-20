/* V1.63.9 — GEI Academy State Verification Panel
   Compact learner-facing systems check. Read-only; never mutates Academy state.
*/
(() => {
  "use strict";
  if (window.GEI_STATE_VERIFY) return;
  const COMPLETION_KEY = "geiDayCompletionV1";
  const XP_KEY = "geiAcademyProgressV1";
  const RESET_MARKER = "geiDamResetRecoveryV1";
  const IDENTITY_KEY = "geiDamNameIdentityV1";
  const MAX_XP = 666;
  function readJson(key, fallback) { try { const value = JSON.parse(localStorage.getItem(key) || "null"); return value ?? fallback; } catch (_) { return fallback; } }
  function completedDays() {
    const xp = readJson(XP_KEY, {}), ledger = readJson(COMPLETION_KEY, {}), set = new Set();
    (Array.isArray(xp?.completed) ? xp.completed : []).forEach(day => { const n=Number(day); if(n>=1&&n<=6)set.add(n); });
    Object.keys(ledger||{}).forEach(key => { const n=Number(key); if(n>=1&&n<=6&&ledger[key]?.completed===true&&Number(ledger[key]?.audioPercent||0)>=90)set.add(n); });
    return [...set].sort((a,b)=>a-b);
  }
  function getSnapshot() {
    const days=completedDays(), xpState=readJson(XP_KEY,{}), xp=Math.min(MAX_XP,Math.max(0,Number(xpState?.xp)||0));
    const currentDay=days.length>=6?1:days.length+1, identity=readJson(IDENTITY_KEY,{});
    const identityValid=/^[A-Za-z0-9_-]{3,20}$/.test(String(identity?.damName||"").trim());
    const badges=window.GEI_BADGES?.getState?.()?.earned||[], masteryBadges=["day-1","day-2","day-3","day-4","day-5","day-6"];
    const earnedMastery=masteryBadges.filter(id=>badges.includes(id)).length;
    const streak=Math.max(0,Number(window.GEI_STREAK?.getState?.()?.streak)||0);
    const mastery=readJson("geiAdamObjectiveMasteryV1",{}), mastered=Array.isArray(mastery?.mastered)?new Set(mastery.mastered.map(String)).size:0;
    let resetHealthy=true; try { resetHealthy=!localStorage.getItem(RESET_MARKER); } catch (_) { resetHealthy=false; }
    return {days,count:days.length,xp,currentDay,identityValid,earnedMastery,masteryObjectives:mastered,streak,resetHealthy};
  }
  function checkItems(s) { return [
    {label:"DAM STATE",value:s.count===0?"READY":"ACTIVE",ok:true},
    {label:"BLUEPRINT",value:s.count+" / 6 DAYS",ok:true},
    {label:"XP",value:s.xp+" / 666",ok:s.xp>=0&&s.xp<=666},
    {label:"CURRENT STAGE",value:"DAY "+s.currentDay,ok:s.currentDay>=1&&s.currentDay<=6},
    {label:"MASTERY",value:s.earnedMastery+" / 6 BADGES",ok:s.earnedMastery===s.count||s.count<6},
    {label:"STREAK",value:s.streak+" DAY"+(s.streak===1?"":"S"),ok:s.streak>=0},
    {label:"IDENTITY",value:s.identityValid?"PRESERVED":"NOT SET",ok:s.identityValid},
    {label:"RESET RECOVERY",value:s.resetHealthy?"HEALTHY":"PENDING",ok:s.resetHealthy}
  ]; }
  function markup() { return '<section class="gei-state-verification" id="gei-state-verification" aria-labelledby="gei-state-verification-title"><div class="gei-state-head"><div><span class="academy-section-label">GEI SYSTEM CHECK</span><h2 id="gei-state-verification-title">Academy State</h2></div><span class="gei-state-overall" id="gei-state-overall">CHECKING</span></div><div class="gei-state-grid" id="gei-state-grid"></div><p class="gei-state-note" id="gei-state-note">Read-only verification. Your learning data is not changed by this panel.</p></section>'; }
  function render() {
    const slot=document.getElementById("gei-state-verification-slot"); if(!slot)return;
    if(!document.getElementById("gei-state-verification"))slot.innerHTML=markup();
    const items=checkItems(getSnapshot()), grid=document.getElementById("gei-state-grid");
    if(grid)grid.innerHTML=items.map(item=>'<div class="gei-state-item '+(item.ok?"is-ok":"is-alert")+'"><span class="gei-state-dot" aria-hidden="true"></span><div><b>'+item.label+'</b><strong>'+item.value+'</strong></div></div>').join("");
    const healthy=items.every(item=>item.ok), overall=document.getElementById("gei-state-overall");
    if(overall){overall.textContent=healthy?"SYSTEM READY":"CHECK STATE";overall.className="gei-state-overall "+(healthy?"is-ok":"is-alert");}
    const note=document.getElementById("gei-state-note"); if(note)note.textContent=healthy?"All tracked Academy systems are reporting a valid state. This panel is read-only.":"One or more Academy systems need attention. This panel does not change your learning state.";
  }
  function init(){ render(); window.GEI_STATE_VERIFY=Object.freeze({version:"1.63.9",getSnapshot,render}); ["gei:progress-ready","gei:progress-updated","gei:xp-updated","gei:day-completion","gei:badges-ready","gei:badges-updated","gei:streak-updated","gei:learner-identity-updated","gei:dam-reset-recovered"].forEach(event=>window.addEventListener(event,render)); window.addEventListener("storage",render); }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();