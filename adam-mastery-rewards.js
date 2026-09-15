/* V1.33 — Adam Mastery Rewards */
(() => {
  "use strict";
  const MASTERY_KEY="geiAdamObjectiveMasteryV1";
  const REWARD_KEY="geiAdamMasteryRewardsV1";
  const DAYS=Object.freeze([1,2,3,4,5,6]);
  const PER_DAY=3;

  function loadMastery(){
    try{
      const d=JSON.parse(localStorage.getItem(MASTERY_KEY)||"{}");
      return Array.isArray(d.mastered)?[...new Set(d.mastered.map(String))]:[];
    }catch(_){return[]}
  }
  function count(m,day){return m.filter(k=>k.startsWith(`${day}-`)).length}
  function derive(m){
    const days=DAYS.filter(d=>count(m,d)>=PER_DAY);
    return {days,allSix:days.length===6};
  }
  function loadRewardState(){
    try{return JSON.parse(localStorage.getItem(REWARD_KEY)||"{}")||{}}
    catch(_){return{}}
  }
  function saveRewardState(s){
    try{localStorage.setItem(REWARD_KEY,JSON.stringify(s))}catch(_){}
  }
  function sync(m){
    const derived=derive(m), prior=loadRewardState();
    const state={days:derived.days,allSix:derived.allSix};
    if(JSON.stringify(prior.days||[])!==JSON.stringify(state.days)||prior.allSix!==state.allSix)saveRewardState(state);
    return state;
  }
  function build(){
    const e=document.createElement("section");
    e.className="adam-mastery-rewards";
    e.setAttribute("aria-labelledby","adam-rewards-title");
    e.innerHTML=`
      <div class="adam-rewards-head">
        <span class="adam-rewards-icon" aria-hidden="true">🎁</span>
        <div><span class="adam-rewards-kicker">ADAM • MASTERY REWARDS</span><h3 id="adam-rewards-title">Your earned blueprint badges</h3></div>
      </div>
      <p class="adam-rewards-message" id="adam-rewards-message" aria-live="polite"></p>
      <div class="adam-rewards-grid" id="adam-rewards-grid" aria-label="Earned mastery rewards"></div>`;
    return e;
  }
  function render(){
    const academy=document.getElementById("screen-academy"),view=academy?.querySelector(".academy-view"),mastery=view?.querySelector(":scope > .adam-objective-mastery");
    if(!view||!mastery)return;
    let card=view.querySelector(":scope > .adam-mastery-rewards");
    if(!card){card=build();const celebration=view.querySelector(":scope > .adam-mastery-celebration");view.insertBefore(card,celebration?.nextElementSibling||mastery.nextElementSibling||null)}
    const m=loadMastery(),state=sync(m),message=card.querySelector("#adam-rewards-message"),grid=card.querySelector("#adam-rewards-grid");
    if(message)message.textContent=state.allSix?"All six mastery badges earned. The complete blueprint badge is unlocked.":state.days.length?`${state.days.length} of 6 day badges earned. Complete each day's 3 checkpoints to unlock the next badge.`:"No mastery badge earned yet. Complete all 3 checkpoints for Day 1 to unlock your first badge.";
    if(grid)grid.innerHTML=DAYS.map(d=>{const earned=state.days.includes(d);return `<div class="adam-reward-badge${earned?" is-earned":""}" aria-label="Day ${d} badge: ${earned?"earned":"locked"}"><span class="adam-reward-medal" aria-hidden="true">${earned?"★":"•"}</span><b>DAY ${d}</b><small>${earned?"EARNED":"LOCKED"}</small></div>`}).join("")+`<div class="adam-reward-badge adam-reward-final${state.allSix?" is-earned":""}" aria-label="Blueprint Master badge: ${state.allSix?"earned":"locked"}"><span class="adam-reward-medal" aria-hidden="true">${state.allSix?"✦":"•"}</span><b>BLUEPRINT</b><small>${state.allSix?"MASTER":"LOCKED"}</small></div>`;
    card.classList.toggle("is-complete",state.allSix);
  }
  function init(){
    render();
    document.addEventListener("gei:navigation",render);
    document.addEventListener("gei:progress-ready",render);
    document.addEventListener("gei:progress-updated",render);
    window.addEventListener("storage",e=>{if(e.key===MASTERY_KEY||e.key===REWARD_KEY)render()});
    window.setInterval(render,1000);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
