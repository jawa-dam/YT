/* V1.62 — GEI Mastery Progression Engine */
(()=>{"use strict";
if(window.GEI_MASTERY)return;
const MILESTONE=111,MAX=666,KEY="geiMasteryMilestonesV1";
const milestones=[1,2,3,4,5,6].map(day=>({day,xp:day*MILESTONE}));
function load(){try{const x=JSON.parse(localStorage.getItem(KEY)||"[]");return Array.isArray(x)?x.map(Number):[]}catch{return[]}}
function save(x){try{localStorage.setItem(KEY,JSON.stringify([...new Set(x)]))}catch{}}
function state(){const xp=Math.min(MAX,Math.max(0,Number(window.GEI_PROGRESS?.getState?.()?.xp)||0));const completed=Math.min(6,Math.floor(xp/MILESTONE));return{xp,completed,next:completed<6?(completed+1)*MILESTONE:MAX,percent:Math.round(xp/MAX*100),complete:xp>=MAX}}
function milestoneFor(xp){return milestones.find(m=>m.xp===xp)||null}
function render(){
 const s=state();
 document.querySelectorAll("[data-gei-mastery-xp]").forEach(el=>el.textContent=s.xp+" / "+MAX+" XP");
 document.querySelectorAll("[data-gei-mastery-percent]").forEach(el=>el.textContent=s.percent+"%");
 document.querySelectorAll("[data-gei-mastery-fill]").forEach(el=>el.style.width=s.percent+"%");
 document.querySelectorAll("[data-gei-mastery-stage]").forEach(el=>el.textContent=s.complete?"BLUEPRINT MASTER":s.completed+" / 6 MILESTONES");
 const home=document.querySelector(".blueprint-card");
 if(home){
  const count=home.querySelector(".blueprint-count");if(count)count.textContent=Math.min(6,s.completed)+" / 6";
  const fill=home.querySelector(".progress-fill");if(fill)fill.style.width=(Math.min(6,s.completed)/6*100)+"%";
  home.querySelectorAll(".day-pill").forEach((pill,i)=>{pill.classList.toggle("is-complete",i<s.completed);pill.classList.toggle("is-current",i===s.completed&&s.completed<6)});
 }
}
function notifyMilestone(xp){
 const m=milestoneFor(xp);if(!m)return;
 const seen=load();if(seen.includes(m.day))return;
 seen.push(m.day);save(seen);
 window.dispatchEvent(new CustomEvent("gei:mastery-milestone",{detail:{...m,totalXP:xp}}));
}
function sync(){
 const xp=state().xp;render();
 [1,2,3,4,5,6].forEach(day=>{if(xp>=day*MILESTONE)notifyMilestone(day*MILESTONE)});
}
function init(){
 sync();
 window.addEventListener("gei:xp-updated",e=>{render();notifyMilestone(Number(e.detail?.xp||0));});
 window.addEventListener("gei:progress-updated",sync);
 window.addEventListener("gei:objective-xp-awarded",sync);
 window.addEventListener("storage",e=>{if(e.key==="geiAcademyProgressV1")sync()});
 window.GEI_MASTERY=Object.freeze({version:"1.62",maxXP:MAX,milestones,getState:state,render,sync});
 window.dispatchEvent(new CustomEvent("gei:mastery-ready",{detail:state()}));
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();