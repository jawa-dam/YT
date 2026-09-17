(()=>{"use strict";
const root=document.querySelector("[data-gei-day]");
if(!root)return;
const day=Number(root.dataset.geiDay),storeKey="geiDayCompletionV1";
const titles={1:"Water & Light",2:"The Firmament",3:"Reservoir & Dry Land",4:"The Sluice",5:"The Waterwheel",6:"The Beast System"};
const completion=root.querySelector(".completion"),status=root.querySelector("#completion-status"),button=root.querySelector("#day-complete"),nextLink=root.querySelector(".day-nav .next");
if(!completion||!status||!button)return;
function read(){try{const value=JSON.parse(localStorage.getItem(storeKey)||"{}");return value&&typeof value==="object"?value:{}}catch{return{}}}
function isComplete(data){const record=data?.[day];return record?.completed===true&&Number(record.audioPercent||0)>=90}
function nextDay(){return day<6?day+1:null}
function removeUX(){completion.querySelector(".v1-43-completion-result")?.remove()}
function render(){
 const data=read(),done=isComplete(data),next=nextDay();
 removeUX();
 completion.classList.toggle("v1-43-complete",done);
 if(nextLink&&day<6){
   nextLink.classList.toggle("is-locked",!done);
   nextLink.setAttribute("aria-disabled",String(!done));
   nextLink.title=done?`Continue to Day ${next}`:`Complete Day ${day} first`;
 }
 if(!done)return;
 const result=document.createElement("div");
 result.className="v1-43-completion-result";
 result.setAttribute("role","status");
 const headline=document.createElement("strong");
 headline.className="v1-43-completion-headline";
 headline.textContent=day===6?"🎓 SIX-DAY BLUEPRINT COMPLETE":"✓ LESSON RECORDED";
 const copy=document.createElement("span");
 copy.className="v1-43-completion-copy";
 copy.textContent=day===6?"All six GEI Academy lessons are now marked complete on this device.":`Day ${day} is complete. Day ${next} is now unlocked.`;
 const actions=document.createElement("div");
 actions.className="v1-43-completion-actions";
 if(next){
   const link=document.createElement("a");
   link.className="v1-43-next-cta";
   link.href=`day-${next}.html`;
   link.textContent=`CONTINUE TO DAY ${next} →`;
   link.setAttribute("aria-label",`Continue to Day ${next}: ${titles[next]}`);
   actions.appendChild(link);
 }
 const academy=document.createElement("a");
 academy.className="v1-43-academy-cta";
 academy.href="index.html#academy";
 academy.textContent=day===6?"RETURN TO ACADEMY ✓":"VIEW ACADEMY PROGRESS";
 actions.appendChild(academy);
 result.append(headline,copy,actions);
 completion.appendChild(result);
 status.textContent=day===6?"Day 6 complete. Your six-day blueprint path is finished.":`Day ${day} complete. Your next lesson is unlocked.`;
 button.textContent=`DAY ${day} COMPLETE ✓`;
 button.classList.add("is-complete");
}
if(nextLink&&day<6){nextLink.addEventListener("click",event=>{if(!isComplete(read())){event.preventDefault();status.textContent=`Complete at least 90% of Day ${day} audio and mark the lesson complete to unlock Day ${day+1}.`;completion.classList.add("v1-43-attention");window.setTimeout(()=>completion.classList.remove("v1-43-attention"),700)}})}
window.addEventListener("gei:day-completion",render);
window.addEventListener("storage",event=>{if(event.key===storeKey)render()});
window.addEventListener("pageshow",render);
render();
})();