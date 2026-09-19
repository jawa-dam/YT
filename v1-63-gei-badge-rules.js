/* V1.63 — GEI Badge Rules & Achievement Engine
   Badges are achievement records, not XP rewards.
   XP remains the six-day 666 XP mastery progression.
*/
(() => {
  "use strict";
  if (window.GEI_BADGES) return;
  const STORAGE_KEY = "geiBadgeStateV1";
  const MASTERY_KEY = "geiAdamObjectiveMasteryV1";
  const COMPLETION_KEY = "geiDayCompletionV1";
  const XP_KEY = "geiAcademyProgressV1";
  const STREAK_KEY = "geiAcademyStreakV1";
  const BADGES = Object.freeze([
    { id:"day-1", icon:"💧", name:"Water Observer", rule:"Complete Day 1.", type:"mastery" },
    { id:"day-2", icon:"🧱", name:"Dam Engineer", rule:"Complete Day 2.", type:"mastery" },
    { id:"day-3", icon:"🌊", name:"Reservoir Builder", rule:"Complete Day 3.", type:"mastery" },
    { id:"day-4", icon:"🚪", name:"Gate Operator", rule:"Complete Day 4.", type:"mastery" },
    { id:"day-5", icon:"⚙️", name:"Waterwheel Engineer", rule:"Complete Day 5.", type:"mastery" },
    { id:"day-6", icon:"🏆", name:"System Architect", rule:"Complete Day 6.", type:"mastery" },
    { id:"streak-2", icon:"⚡", name:"Flow Starter", rule:"Reach a 2-day learning streak.", type:"streak" },
    { id:"streak-3", icon:"🔥", name:"Momentum Builder", rule:"Reach a 3-day learning streak.", type:"streak" },
    { id:"streak-5", icon:"🌟", name:"Sustained Flow", rule:"Reach a 5-day learning streak.", type:"streak" },
    { id:"first-spark", icon:"✨", name:"First Spark", rule:"Master your first objective.", type:"achievement" },
    { id:"six-day-flow", icon:"🔄", name:"Six-Day Flow", rule:"Complete all six GEI days.", type:"achievement" },
    { id:"blueprint-master", icon:"👑", name:"Blueprint Master", rule:"Reach 666 XP and complete the six-day blueprint.", type:"final" }
  ]);
  function load(){try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");return {earned:Array.isArray(p.earned)?[...new Set(p.earned.map(String))]:[]};}catch(_){return {earned:[]};}}
  function save(s){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({earned:[...new Set(s.earned)]}));}catch(_){} }
  function progress(){try{const p=JSON.parse(localStorage.getItem(XP_KEY)||"{}");return {xp:Math.max(0,Number(p?.xp)||0),completed:Array.isArray(p?.completed)?p.completed.map(Number):[]};}catch(_){return {xp:0,completed:[]};}}
  function completionLedger(){try{const p=JSON.parse(localStorage.getItem(COMPLETION_KEY)||"{}");return p&&typeof p==="object"?p:{};}catch(_){return {};}}
  function masteryCount(){try{const p=JSON.parse(localStorage.getItem(MASTERY_KEY)||"{}");return Array.isArray(p?.mastered)?new Set(p.mastered.map(String)).size:0;}catch(_){return 0;}}
  function streak(){try{const p=JSON.parse(localStorage.getItem(STREAK_KEY)||"{}");return Math.max(0,Number(p?.streak)||0);}catch(_){return 0;}}
  function completedDays(){const p=progress(),ledger=completionLedger(),set=new Set((p.completed||[]).filter(n=>n>=1&&n<=6));Object.keys(ledger).forEach(k=>{const day=Number(k);if(day>=1&&day<=6&&ledger[k]?.completed===true)set.add(day);});return set;}
  function qualifies(b){const days=completedDays();if(b.id.indexOf("day-")===0)return days.has(Number(b.id.split("-")[1]));if(b.id==="streak-2")return streak()>=2;if(b.id==="streak-3")return streak()>=3;if(b.id==="streak-5")return streak()>=5;if(b.id==="first-spark")return masteryCount()>=1;if(b.id==="six-day-flow")return days.size>=6;if(b.id==="blueprint-master")return days.size>=6&&progress().xp>=666;return false;}
  function sync(){const state=load(),before=state.earned.length;BADGES.forEach(b=>{if(qualifies(b))state.earned.push(b.id);});state.earned=[...new Set(state.earned)];if(state.earned.length!==before)save(state);window.GEI_BADGES_STATE=state;window.dispatchEvent(new CustomEvent("gei:badges-updated",{detail:{earned:state.earned.slice(),total:BADGES.length,newlyEarned:state.earned.length-before}}));return state;}
  function ensureRewardsCard(){
    const academy=document.getElementById("screen-academy");
    const view=academy?.querySelector(".academy-view")||academy;
    if(!view||document.getElementById("gei-rewards-card"))return;
    const card=document.createElement("section");
    card.className="gei-rewards-card";
    card.id="gei-rewards-card";
    card.setAttribute("aria-labelledby","gei-rewards-title");
    card.innerHTML='<div class="gei-rewards-head"><div><span class="gei-rewards-kicker">🏆 REWARDS</span><h2 id="gei-rewards-title">Achievement Collection</h2></div><strong data-gei-badge-count>0 / 12</strong></div><p class="gei-rewards-copy">Badges record mastery, streaks and major GEI milestones. Badges do not add XP.</p><div class="gei-badge-grid gei-rewards-grid"></div>';
    view.appendChild(card);
  }
  function renderRewards(){
    ensureRewardsCard();
    const card=document.getElementById("gei-rewards-card");
    if(!card)return;
    const state=window.GEI_BADGES_STATE||sync();
    const grid=card.querySelector(".gei-rewards-grid");
    if(grid)grid.innerHTML=BADGES.map(b=>'<div class="gei-badge '+(state.earned.includes(b.id)?"is-earned":"is-locked")+'" data-gei-badge-id="'+b.id+'"><span class="gei-badge-icon" aria-hidden="true">'+b.icon+'</span><span class="gei-badge-name">'+b.name+'</span><span class="gei-badge-rule">'+b.rule+'</span><span class="gei-badge-status">'+(state.earned.includes(b.id)?"EARNED":"LOCKED")+'</span></div>').join("");
    const count=card.querySelector("[data-gei-badge-count]");
    if(count)count.textContent=state.earned.length+" / "+BADGES.length;
  }
  function render(root=document){const state=window.GEI_BADGES_STATE||sync();root.querySelectorAll("[data-gei-badge-id]").forEach(el=>{const b=BADGES.find(x=>x.id===el.dataset.geiBadgeId);if(!b)return;const earned=state.earned.includes(b.id);el.classList.toggle("is-earned",earned);el.classList.toggle("is-locked",!earned);el.setAttribute("aria-label",earned?b.name+" earned":b.name+" locked");});root.querySelectorAll("[data-gei-badge-count]").forEach(el=>{el.textContent=state.earned.length+" / "+BADGES.length;});}
  function init(){sync();window.GEI_BADGES=Object.freeze({version:"1.63",getState:()=>({earned:[...(window.GEI_BADGES_STATE?.earned||[])]}),getBadges:()=>BADGES.map(b=>({...b,earned:(window.GEI_BADGES_STATE?.earned||[]).includes(b.id)})),sync,render});render();renderRewards();window.dispatchEvent(new CustomEvent("gei:badges-ready",{detail:window.GEI_BADGES.getState()}));["gei:progress-updated","gei:xp-updated","gei:day-completion","gei:objective-mastery-updated","gei:day-objectives-mastered","gei:streak-updated"].forEach(event=>window.addEventListener(event,()=>{sync();render();renderRewards();}));window.addEventListener("storage",event=>{if([STORAGE_KEY,MASTERY_KEY,COMPLETION_KEY,XP_KEY].includes(event.key)){sync();render();renderRewards();}});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();