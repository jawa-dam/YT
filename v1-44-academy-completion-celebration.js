(()=>{"use strict";
const root=document.querySelector("[data-gei-day]");
if(!root)return;
const day=Number(root.dataset.geiDay),completionKey="geiDayCompletionV1",achievementKey="geiAcademyAchievementsV1";
const achievements={
  1:{title:"THE OBSERVER",copy:"You completed the first GEI Academy lesson and established the opening observation step."},
  2:{title:"THE BUILDER",copy:"You completed the firmament stage and advanced the structural reading of the system."},
  3:{title:"THE RESERVOIR",copy:"You completed the reservoir and dry-land stage of the six-day learning path."},
  4:{title:"THE FLOW ENGINEER",copy:"You completed the sluice stage and followed the movement-and-release sequence."},
  5:{title:"THE WATERWHEEL",copy:"You completed the waterwheel stage and advanced the mechanical reading of the system."},
  6:{title:"BLUEPRINT MASTER",copy:"You completed all six GEI Academy lessons and finished the six-day blueprint path."}
};
const completion=root.querySelector(".completion"),status=root.querySelector("#completion-status");
if(!completion||!status||!achievements[day])return;
function read(key){try{const value=JSON.parse(localStorage.getItem(key)||"{}");return value&&typeof value==="object"?value:{}}catch{return{}}}
function isComplete(){const record=read(completionKey)[day];return record?.completed===true&&Number(record.audioPercent||0)>=90}
function save(data){try{localStorage.setItem(achievementKey,JSON.stringify(data));window.dispatchEvent(new CustomEvent("gei:achievement-updated",{detail:{day}}))}catch{}}
function render(){
 if(!isComplete())return;
 const data=read(achievementKey),existing=data[day],fresh=!existing;
 if(!existing){data[day]={earned:true,earnedAt:new Date().toISOString(),title:achievements[day].title};save(data)}
 completion.querySelector(".v1-44-achievement")?.remove();
 const card=document.createElement("div");
 card.className="v1-44-achievement"+(fresh?" is-new":"");
 card.setAttribute("role","status");
 const kicker=document.createElement("span");
 kicker.className="v1-44-achievement-kicker";
 kicker.textContent=day===6?"🏆 FINAL ACHIEVEMENT UNLOCKED":"🏆 ACHIEVEMENT UNLOCKED";
 const title=document.createElement("strong");
 title.className="v1-44-achievement-title";
 title.textContent=achievements[day].title;
 const copy=document.createElement("span");
 copy.className="v1-44-achievement-copy";
 copy.textContent=achievements[day].copy;
 const meta=document.createElement("span");
 meta.className="v1-44-achievement-meta";
 meta.textContent=day===6?"6 / 6 DAYS MASTERED":"DAY "+day+" MASTERED • "+day+" / 6";
 card.append(kicker,title,copy,meta);
 completion.appendChild(card);
}
window.addEventListener("gei:day-completion",render);
window.addEventListener("gei:achievement-updated",render);
window.addEventListener("storage",event=>{if(event.key===completionKey||event.key===achievementKey)render()});
window.addEventListener("pageshow",render);
render();
})();