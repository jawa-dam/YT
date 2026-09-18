(()=>{"use strict";
const completionKey="geiDayCompletionV1",achievementKey="geiAcademyAchievementsV1";
const items={1:{title:"THE OBSERVER",short:"Opening observation",icon:"👁️"},2:{title:"THE BUILDER",short:"Structural reading",icon:"🧱"},3:{title:"THE RESERVOIR",short:"Water gathering",icon:"💧"},4:{title:"THE FLOW ENGINEER",short:"Controlled release",icon:"⚙️"},5:{title:"THE WATERWHEEL",short:"Mechanical motion",icon:"🌊"},6:{title:"BLUEPRINT MASTER",short:"Six-day completion",icon:"🏆"}};
function read(key){try{const v=JSON.parse(localStorage.getItem(key)||"{}");return v&&typeof v==="object"?v:{}}catch{return{}}}
function validDays(){const c=read(completionKey),a=read(achievementKey);return Object.keys(items).filter(k=>c[k]?.completed===true&&Number(c[k].audioPercent||0)>=90&&a[k]?.earned===true).map(Number)}
function mount(){return document.querySelector("#screen-academy .academy-view")}
function render(){
const academy=mount();if(!academy)return;
let vault=academy.querySelector(".v1-45-achievement-vault");
if(!vault){vault=document.createElement("section");vault.className="v1-45-achievement-vault";vault.setAttribute("aria-labelledby","v1-45-vault-title");const path=academy.querySelector(".academy-path");(path?.parentNode||academy).appendChild(vault)}
let head=vault.querySelector(".v1-45-vault-head"),subtitle=vault.querySelector(".v1-45-vault-subtitle"),grid=vault.querySelector(".v1-45-vault-grid"),complete=vault.querySelector(".v1-45-vault-complete");
if(!head){head=document.createElement("div");head.className="v1-45-vault-head";head.innerHTML='<div><span class="v1-45-vault-kicker">ACHIEVEMENT VAULT</span><h2 id="v1-45-vault-title">Academy Collection</h2></div><strong class="v1-45-vault-count">0 / 6</strong>';vault.appendChild(head)}
if(!subtitle){subtitle=document.createElement("p");subtitle.className="v1-45-vault-subtitle";vault.appendChild(subtitle)}
if(!grid){grid=document.createElement("div");grid.className="v1-45-vault-grid";vault.appendChild(grid)}
const earned=validDays(),count=earned.length;
const countEl=head.querySelector(".v1-45-vault-count");if(countEl)countEl.textContent=count+" / 6";
subtitle.textContent=count===6?"All six achievements mastered. Blueprint Master unlocked.":count+" of 6 achievements unlocked. Complete each lesson to build the collection.";
for(const [key,item] of Object.entries(items)){
  const n=Number(key),isEarned=earned.includes(n);
  let card=grid.querySelector('[data-v1-45-day="'+n+'"]');
  if(!card){card=document.createElement("article");card.className="v1-45-vault-item";card.setAttribute("data-v1-45-day",String(n));grid.appendChild(card)}
  card.classList.toggle("is-earned",isEarned);card.classList.toggle("is-locked",!isEarned);card.setAttribute("aria-label",item.title+": "+(isEarned?"earned":"locked"));
  card.innerHTML='<span class="v1-45-vault-icon" aria-hidden="true">'+(isEarned?item.icon:"🔒")+'</span><span class="v1-45-vault-day">DAY '+n+'</span><strong>'+item.title+'</strong><span class="v1-45-vault-copy">'+(isEarned?item.short:"Complete this lesson to unlock")+'</span>';
}
if(count===6){if(!complete){complete=document.createElement("div");complete.className="v1-45-vault-complete";vault.appendChild(complete)}complete.textContent="🏆 BLUEPRINT MASTER • 6 / 6 DAYS MASTERED";}
else if(complete)complete.remove();
}function boot(){render();if(!document.querySelector('script[data-v1-46="true"]')){const script=document.createElement("script");script.src="v1-46-achievement-vault-interaction.js";script.defer=true;script.dataset.v1_46="true";document.head.appendChild(script)}if(!document.querySelector('link[data-v1-47="true"]')){const link=document.createElement("link");link.rel="stylesheet";link.href="v1-47-achievement-reward-reveal.css";link.dataset.v1_47="true";document.head.appendChild(link)}if(!document.querySelector('script[data-v1-47="true"]')){const script=document.createElement("script");script.src="v1-47-achievement-reward-reveal.js";script.defer=true;script.dataset.v1_47="true";document.head.appendChild(script)}if(!document.querySelector('link[data-v1-48="true"]')){const link=document.createElement("link");link.rel="stylesheet";link.href="v1-48-achievement-sound-engine.css";link.dataset.v1_48="true";document.head.appendChild(link)}if(!document.querySelector('script[data-v1-48="true"]')){const script=document.createElement("script");script.src="v1-48-achievement-sound-engine.js";script.defer=true;script.dataset.v1_48="true";document.head.appendChild(script)}window.setInterval(render,1000)}
window.addEventListener("gei:achievement-updated",render);window.addEventListener("gei:day-completion",render);window.addEventListener("storage",e=>{if(e.key===achievementKey||e.key===completionKey)render()});window.addEventListener("pageshow",render);if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
})();