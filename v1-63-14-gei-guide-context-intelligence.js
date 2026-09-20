/* V1.63.14 — GEI Guide Context Intelligence */
(()=>{"use strict";
const root=document.querySelector(".day-app");if(!root)return;
const identity=()=>window.GEI_IDENTITY;
const DAY_TITLES=Object.freeze({1:"Water & Light",2:"The Firmament",3:"Reservoir & Dry Land",4:"The Sluice",5:"The Waterwheel",6:"The Beast System"});
const GUIDE_PREFIX=Object.freeze({
 adam:"I'm Adam, your GEI guide.",
 support:"YallToo Support is here.",
 damKids:"Dam Kids are here with you.",
 facts:"YallToo Facts is here.",
 wilbertYallToo:"Your GEI Y'allToo guide is here.",
 wilbertGEI:"Your GEI guide is here.",
 bibleGuide:"Your reading guide is here."
});
function readJSON(key,fallback){try{const p=JSON.parse(localStorage.getItem(key)||"null");return p&&typeof p==="object"?p:fallback}catch(_){return fallback}}
function getContext(){
 const day=Math.min(6,Math.max(1,Number(root.dataset.geiDay)||1));
 const completion=readJSON("geiDayCompletionV1",{});
 const audio=readJSON("geiDayAudioProgressV1",{});
 const mastery=readJSON("geiAdamObjectiveMasteryV1",{mastered:[]});
 const progress=readJSON("geiAcademyProgressV1",{completed:[],xp:0});
 const completed=Array.isArray(progress.completed)?[...new Set(progress.completed.map(Number).filter(n=>n>=1&&n<=6))]:[];
 const ledgerDone=Object.keys(completion).map(Number).filter(n=>n>=1&&n<=6&&completion[n]?.completed===true);
 const completedSet=new Set([...completed,...ledgerDone]);
 const mastered=Array.isArray(mastery.mastered)?mastery.mastered.map(String):[];
 const masteryCount=mastered.filter(k=>k.startsWith(day+"-")).length;
 const audioPercent=Math.max(0,Math.min(100,Number(audio[day]||completion[day]?.audioPercent||0)));
 const dayDone=completedSet.has(day)&&completion[day]?.completed===true&&audioPercent>=90&&masteryCount>=3;
 const totalCompleted=completedSet.size;
 const xp=Math.max(0,Math.min(666,Number(progress.xp)||0));
 return {day,dayTitle:DAY_TITLES[day],audioPercent,masteryCount,dayDone,totalCompleted,xp,allComplete:totalCompleted>=6};
}
function contextFor(s){
 if(s.allComplete)return{label:"BLUEPRINT COMPLETE",message:"The six-day blueprint is complete. Review any stage you want, revisit the evidence, and use the GEI path as your reference for the full sequence."};
 if(s.dayDone){
  const next=s.day<6?s.day+1:null;
  return{label:"STAGE COMPLETE",message:next?"Day "+s.day+" is complete. Day "+next+" — "+DAY_TITLES[next]+" is your next stage. Continue when you're ready.":"Day 6 is complete. You have finished the six-day GEI learning path."};
 }
 if(s.audioPercent<90)return{label:"AUDIO IN PROGRESS",message:"You've reached "+Math.round(s.audioPercent)+"% of this lesson. Keep listening until you reach 90%, then return here for the three Objective Mastery checkpoints."};
 if(s.masteryCount<3)return{label:"MASTERY NEXT",message:"Your lesson audio requirement is met. Complete Objective Mastery checkpoint "+(s.masteryCount+1)+" of 3 to demonstrate what you learned on this stage."};
 return{label:"READY TO COMPLETE",message:"Your audio and three Objective Mastery checkpoints are complete. Mark Day "+s.day+" complete to record this stage and continue the blueprint."};
}
function render(){
 const old=root.querySelector(".day-mascot");if(!old)return;
 const api=identity();if(!api)return;
 const id=api.getAvatar?.()||"adam",def=api.getAvatarDefinition?.(id)||api.getAvatarDefinition?.("adam");
 if(!def)return;
 let button=root.querySelector("#gei-day-avatar-button");
 if(!button){button=document.createElement("button");button.type="button";button.id="gei-day-avatar-button";button.className="gei-day-avatar-button";old.replaceWith(button)}
 button.innerHTML=api.avatarMarkup?.({className:"day-mascot",alt:def.alt||def.label})||"";
 button.dataset.avatarId=id;button.setAttribute("aria-label","Open "+(def.label||"Adam")+" GEI guide");
}
function popup(){
 const button=root.querySelector("#gei-day-avatar-button");if(!button)return;
 const api=identity(),id=button.dataset.avatarId||api?.getAvatar?.()||"adam",def=api?.getAvatarDefinition?.(id)||api?.getAvatarDefinition?.("adam");
 let pop=document.getElementById("gei-day-avatar-popout");if(pop){pop.remove();return}
 const s=getContext(),context=contextFor(s),prefix=GUIDE_PREFIX[id]||GUIDE_PREFIX.adam;
 pop=document.createElement("div");pop.id="gei-day-avatar-popout";pop.className="gei-day-avatar-popout";pop.setAttribute("role","dialog");pop.setAttribute("aria-modal","true");pop.setAttribute("aria-label",(def?.label||"GEI guide")+" contextual message");
 pop.innerHTML='<div class="gei-day-avatar-popout-card"><button class="gei-day-avatar-close" type="button" aria-label="Close guide">×</button><div class="gei-day-avatar-popout-image"></div><div class="gei-day-avatar-popout-kicker">GEI ACADEMY • YOUR GUIDE</div><h2></h2><span class="gei-guide-context-label"></span><p></p><span class="gei-day-avatar-popout-stage">DAY '+s.day+' • '+s.dayTitle+'</span></div>';
 pop.querySelector(".gei-day-avatar-popout-image").innerHTML=api?.avatarMarkup?.({className:"gei-day-avatar-popout-art",alt:def?.alt||def?.label})||"";
 pop.querySelector("h2").textContent=def?.label||"Adam";
 pop.querySelector(".gei-guide-context-label").textContent=context.label;
 pop.querySelector("p").textContent=prefix+" "+context.message;
 document.body.appendChild(pop);
 const close=()=>pop.remove();
 pop.querySelector(".gei-day-avatar-close").addEventListener("click",close);
 pop.addEventListener("click",e=>{if(e.target===pop)close()});
 requestAnimationFrame(()=>pop.classList.add("is-open"));
 pop.querySelector(".gei-day-avatar-close").focus({preventScroll:true});
}
function refreshOpen(){const pop=document.getElementById("gei-day-avatar-popout");if(pop){pop.remove();popup()}}
function init(){
 render();
 ["gei:identity-updated","gei:learner-identity-ready","gei:dam-avatar-updated","gei:audio-progress-updated","gei:day-completion","gei:objective-mastery-updated","gei:progress-updated","gei:xp-updated"].forEach(e=>window.addEventListener(e,()=>{render();if(document.getElementById("gei-day-avatar-popout"))refreshOpen()}));
 window.addEventListener("storage",e=>{if(["geiDayAudioProgressV1","geiDayCompletionV1","geiAdamObjectiveMasteryV1","geiAcademyProgressV1","geiDamNameIdentityV1"].includes(e.key)){render();if(document.getElementById("gei-day-avatar-popout"))refreshOpen()}});
 document.addEventListener("click",e=>{if(e.target.closest?.("#gei-day-avatar-button")){e.preventDefault();e.stopPropagation();popup()}});
 document.addEventListener("keydown",e=>{if(e.key==="Escape")document.getElementById("gei-day-avatar-popout")?.remove()});
 window.GEI_DAY_AVATAR=Object.freeze({version:"1.63.14",render,popup,getContext});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();