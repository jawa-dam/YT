/* V1.63.12 — GEI Academy Chosen Avatar Guide */
(()=>{"use strict";
const root=document.querySelector(".day-app");if(!root||window.GEI_DAY_AVATAR)return;
const identity=()=>window.GEI_IDENTITY;
const MESSAGES={
 adam:"I'm Adam, your GEI guide. Tap me anytime when you want a little direction.",
 support:"YallToo Support is here with you. Keep building your GEI path.",
 damKids:"Dam Kids are on the path with you. Keep observing, questioning and discovering.",
 facts:"YallToo Facts is here. Keep looking closely and follow the evidence.",
 wilbertYallToo:"Your GEI Y'allToo guide is here. Keep building the blueprint one stage at a time.",
 wilbertGEI:"Your GEI guide is here. Keep exploring the Genesis Engineered interpretation.",
 bibleGuide:"Keep reading, questioning and examining the text. Your next discovery starts with the page in front of you."
};
function render(){
 const old=root.querySelector(".day-mascot");
 if(!old)return;
 const api=identity();if(!api)return;
 const id=api.getAvatar?.()||"adam";
 const def=api.getAvatarDefinition?.(id)||api.getAvatarDefinition?.("adam");
 if(!def)return;
 let button=root.querySelector("#gei-day-avatar-button");
 if(!button){
  button=document.createElement("button");button.type="button";button.id="gei-day-avatar-button";button.className="gei-day-avatar-button";button.setAttribute("aria-label","Open "+(def.label||"Adam")+" GEI guide");
  old.replaceWith(button);
 }
 button.innerHTML=api.avatarMarkup?.({className:"day-mascot",alt:def.alt||def.label})||"";
 button.dataset.avatarId=id;
 button.setAttribute("aria-label","Open "+(def.label||"Adam")+" GEI guide");
}
function popup(){
 const button=root.querySelector("#gei-day-avatar-button");if(!button)return;
 const api=identity(),id=button.dataset.avatarId||api?.getAvatar?.()||"adam",def=api?.getAvatarDefinition?.(id)||api?.getAvatarDefinition?.("adam");
 let pop=document.getElementById("gei-day-avatar-popout");
 if(pop){pop.remove();return}
 pop=document.createElement("div");pop.id="gei-day-avatar-popout";pop.className="gei-day-avatar-popout";pop.setAttribute("role","dialog");pop.setAttribute("aria-label",(def?.label||"GEI guide")+" message");
 pop.innerHTML='<div class="gei-day-avatar-popout-card"><button class="gei-day-avatar-close" type="button" aria-label="Close guide">×</button><div class="gei-day-avatar-popout-head"><div class="gei-day-avatar-popout-image"></div><div><span class="gei-day-avatar-popout-kicker">GEI ACADEMY • YOUR GUIDE</span><strong></strong></div></div><p></p><span class="gei-day-avatar-popout-stage">DAY '+Number(root.dataset.geiDay||1)+' • '+(document.querySelector(".day-title")?.textContent||"GEI Academy")+'</span></div>';
 const image=pop.querySelector(".gei-day-avatar-popout-image");
 image.innerHTML=api?.avatarMarkup?.({className:"gei-day-avatar-popout-art",alt:def?.alt||def?.label})||"";
 pop.querySelector("strong").textContent=def?.label||"Adam";
 pop.querySelector("p").textContent=MESSAGES[id]||MESSAGES.adam;
 document.body.appendChild(pop);
 const close=()=>pop.remove();
 pop.querySelector(".gei-day-avatar-close").addEventListener("click",close);
 pop.addEventListener("click",e=>{if(e.target===pop)close()});
 requestAnimationFrame(()=>pop.classList.add("is-open"));
 pop.querySelector(".gei-day-avatar-close").focus({preventScroll:true});
}
function init(){
 render();
 window.addEventListener("gei:identity-updated",render);
 window.addEventListener("gei:learner-identity-ready",render);
 window.addEventListener("gei:dam-avatar-updated",render);
 document.addEventListener("click",e=>{
  if(e.target.closest?.("#gei-day-avatar-button")){e.preventDefault();e.stopPropagation();popup()}
 });
 document.addEventListener("keydown",e=>{
  if(e.key==="Escape")document.getElementById("gei-day-avatar-popout")?.remove();
 });
 window.GEI_DAY_AVATAR=Object.freeze({version:"1.63.12",render,popup});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();