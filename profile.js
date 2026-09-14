/* V1.16 — GEI Learner Profile & Blueprint Identity */
(() => {
  "use strict";
  const PROFILE_KEY = "geiAcademyLearnerProfileV1";
  const DEFAULT = { createdAt: null, profileVersion: "V1.16" };
  let state = load();

  function load(){
    try{ const p=JSON.parse(localStorage.getItem(PROFILE_KEY)||"null"); return {...DEFAULT,...p,createdAt:typeof p?.createdAt==="string"?p.createdAt:null}; }
    catch(e){ return {...DEFAULT}; }
  }
  function save(){ try{localStorage.setItem(PROFILE_KEY,JSON.stringify(state));}catch(e){} }
  function identity(){
    const progress=window.GEI_PROGRESS?.getState?.()||{completed:[],xp:0};
    const streak=window.GEI_STREAK?.getState?.()||{streak:0,best:0};
    const achievements=window.GEI_ACHIEVEMENTS?.getState?.()||{earned:[]};
    const completed=Array.isArray(progress.completed)?progress.completed:[];
    return {createdAt:state.createdAt,profileVersion:state.profileVersion,daysCompleted:completed.length,xp:Number(progress.xp)||0,currentDay:completed.length<6?completed.length+1:6,blueprintPercent:Math.round((completed.length/6)*100),streak:Number(streak.streak)||0,bestStreak:Number(streak.best)||0,achievements:achievements.earned?.length||0,blueprintMaster:achievements.earned?.includes(6)||false};
  }
  function markup(){return `<section class="gei-profile-card" id="gei-profile-card" aria-labelledby="gei-profile-title"><div class="gei-profile-head"><div><span class="gei-profile-kicker">LEARNER PROFILE</span><h2 class="gei-profile-title" id="gei-profile-title">Blueprint Identity</h2></div><span class="gei-profile-status" id="gei-profile-status">BUILDING</span></div><div class="gei-profile-identity"><span class="gei-profile-avatar" aria-hidden="true">A</span><div><strong class="gei-profile-name">GEI LEARNER</strong><span class="gei-profile-since" id="gei-profile-since">Building your learner identity</span></div></div><div class="gei-profile-progress"><div class="gei-profile-progress-top"><span>6-DAY BLUEPRINT</span><span id="gei-profile-percent">0%</span></div><div class="gei-profile-track" role="progressbar" aria-label="Blueprint completion" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="gei-profile-fill" id="gei-profile-fill"></span></div></div><div class="gei-profile-stats"><div class="gei-profile-stat"><strong id="gei-profile-days">0/6</strong><span>DAYS</span></div><div class="gei-profile-stat"><strong id="gei-profile-xp">0</strong><span>XP</span></div><div class="gei-profile-stat"><strong id="gei-profile-streak">0</strong><span>STREAK</span></div><div class="gei-profile-stat"><strong id="gei-profile-achievements">0</strong><span>BADGES</span></div></div><div class="gei-profile-footer"><p id="gei-profile-guidance">Start with Day 1 to build your blueprint identity.</p><span class="gei-profile-badge" id="gei-profile-badge">BLUEPRINT IN PROGRESS</span></div></section>`;}
  function ensure(){const s=document.getElementById("screen-home"),stack=s?.querySelector(".home-experience-stack")||s?.querySelector(".dashboard-main");if(!stack||document.getElementById("gei-profile-card"))return;stack.insertAdjacentHTML("beforeend",markup());}
  function render(){
    ensure(); const c=document.getElementById("gei-profile-card"); if(!c)return;
    if(!state.createdAt){state.createdAt=new Date().toISOString();save();}
    const d=identity(), pct=d.blueprintPercent;
    c.querySelector("#gei-profile-percent").textContent=`${pct}%`; c.querySelector("#gei-profile-fill").style.width=`${pct}%`;
    const track=c.querySelector(".gei-profile-track"); track?.setAttribute("aria-valuenow",String(pct));
    c.querySelector("#gei-profile-days").textContent=`${d.daysCompleted}/6`; c.querySelector("#gei-profile-xp").textContent=String(d.xp); c.querySelector("#gei-profile-streak").textContent=String(d.streak); c.querySelector("#gei-profile-achievements").textContent=String(d.achievements);
    c.querySelector("#gei-profile-since").textContent=`Learner since ${new Date(d.createdAt).toLocaleDateString(undefined,{month:"short",year:"numeric"})}`;
    const complete=d.blueprintMaster||d.daysCompleted===6;
    c.querySelector("#gei-profile-status").textContent=complete?"BLUEPRINT MASTER":(d.daysCompleted?`DAY ${d.currentDay} READY`:"READY TO BUILD");
    c.querySelector("#gei-profile-badge").textContent=complete?"🏆 BLUEPRINT MASTER":"BLUEPRINT IN PROGRESS"; c.querySelector("#gei-profile-badge").classList.toggle("is-complete",complete);
    c.querySelector("#gei-profile-guidance").textContent=complete?"Six-day blueprint complete. Review the path and keep building your GEI knowledge.":d.daysCompleted?`Day ${d.currentDay} is your next step. Keep building your blueprint identity.`:"Start with Day 1 to build your blueprint identity.";
  }
  function updateAdam(){const d=identity(),m=document.querySelector("#home-adam-assistant-message");if(!m)return;m.textContent=d.blueprintMaster?"You're a Blueprint Master. Let's review the six-day GEI path and keep discovering.":d.daysCompleted?`You're ${d.blueprintPercent}% through the blueprint. Day ${d.currentDay} is ready when you are.`:"Welcome. Start Day 1 and I'll help you build your GEI learner identity.";}
  function init(){render();window.addEventListener("gei:progress-ready",render);window.addEventListener("gei:progress-updated",()=>{render();updateAdam();});window.addEventListener("gei:xp-updated",render);window.addEventListener("gei:streak-ready",render);window.addEventListener("gei:streak-updated",render);window.addEventListener("gei:achievements-ready",render);window.addEventListener("gei:achievement-earned",render);window.GEI_PROFILE=Object.freeze({getIdentity:()=>({...identity()}),render});updateAdam();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
