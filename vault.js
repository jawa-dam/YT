/* V1.14 — GEI Achievement Vault & Learner Identity */
(() => {
  "use strict";
  const STORAGE_KEY = "geiAcademyLearnerIdentityV1";
  const DEFAULT = { visits: 0, joinedAt: null };
  let state = load();
  function load(){ try { const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null"); return {...DEFAULT,...p,visits:Math.max(0,Number(p?.visits)||0),joinedAt:typeof p?.joinedAt==="string"?p.joinedAt:null}; } catch(e){ return {...DEFAULT}; } }
  function save(){ try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(e){} }
  function identity(){
    if(!state.joinedAt) state.joinedAt=new Date().toISOString();
    state.visits+=1; save();
    const progress=window.GEI_PROGRESS?.getState?.()||{completed:[],xp:0};
    const achievements=window.GEI_ACHIEVEMENTS?.getState?.()||{earned:[],totalRewards:0};
    return {joinedAt:state.joinedAt,visits:state.visits,daysCompleted:progress.completed?.length||0,xp:progress.xp||0,achievements:achievements.earned?.length||0};
  }
  function markup(){return `<section class="gei-vault-card" id="gei-vault-card" aria-labelledby="gei-vault-title"><div class="gei-vault-head"><div><span class="gei-vault-kicker">LEARNER IDENTITY</span><h2 id="gei-vault-title">Achievement Vault</h2></div><span class="gei-vault-badge" id="gei-vault-badge">0 / 4</span></div><div class="gei-vault-identity"><span class="gei-vault-avatar" aria-hidden="true">A</span><div><strong>GEI LEARNER</strong><span id="gei-vault-since">Building your learning identity</span></div></div><div class="gei-vault-grid" id="gei-vault-grid"></div><p class="gei-vault-status" id="gei-vault-status">Complete GEI learning days to build your achievement record.</p></section>`;}
  function ensure(){const s=document.getElementById("screen-home"),stack=s?.querySelector(".home-experience-stack")||s?.querySelector(".dashboard-main");if(!stack||document.getElementById("gei-vault-card"))return;stack.insertAdjacentHTML("beforeend",markup());}
  function render(){ensure();const c=document.getElementById("gei-vault-card");if(!c)return;const list=window.GEI_ACHIEVEMENTS?.getAchievements?.()||[];const earned=list.filter(a=>a.earned);const grid=c.querySelector("#gei-vault-grid");if(grid)grid.innerHTML=list.map(a=>`<div class="gei-vault-item ${a.earned?"is-earned":"is-locked"}"><span>${a.icon}</span><strong>${a.days}-DAY</strong><small>${a.name}</small></div>`).join("");const b=c.querySelector("#gei-vault-badge");if(b)b.textContent=`${earned.length} / ${list.length||4}`;const i=identity();const since=c.querySelector("#gei-vault-since");if(since)since.textContent=`Learner since ${new Date(i.joinedAt).toLocaleDateString(undefined,{month:"short",year:"numeric"})}`;const status=c.querySelector("#gei-vault-status");if(status)status.textContent=earned.length?`${earned.length} achievement${earned.length===1?"":"s"} secured in your vault • ${i.xp} XP total.`:"Complete GEI learning days to build your achievement record.";}
  function init(){render();window.addEventListener("gei:achievements-ready",render);window.addEventListener("gei:achievement-earned",render);window.addEventListener("gei:progress-ready",render);window.addEventListener("gei:progress-updated",render);window.GEI_VAULT=Object.freeze({getIdentity:()=>({...identity()}),render});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
