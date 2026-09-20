/* V1.63.16 — GEI Video Lab Intelligence */
(()=>{"use strict";
const STORAGE_KEY="geiVideoLabIntelligenceV1";
const VIDEO_ID="8mYq2A_fgTA";
const DAY_ID=1;
const DEFAULT={observations:"",questions:""};
const read=()=>{try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"null");return x&&typeof x==="object"?x:{}}catch(_){return{}}};
const save=(data)=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));window.dispatchEvent(new CustomEvent("gei:video-intelligence-updated",{detail:{videoId:VIDEO_ID}}))}catch(_){}};
function init(){
 const root=document.getElementById("video-root");
 if(!root||root.dataset.v16316==="ready")return;
 const connection=root.querySelector(".gei-video-connection");
 if(!connection)return;
 root.dataset.v16316="ready";
 const state=Object.assign({},DEFAULT,read()[VIDEO_ID]||{});
 const section=document.createElement("section");
 section.className="gei-video-intelligence";
 section.setAttribute("aria-labelledby","gei-video-intelligence-title");
 section.innerHTML=
  '<div class="gei-video-intelligence-head">'+
   '<span class="video-label">V1.63.16 • VIDEO INTELLIGENCE</span>'+
   '<h2 id="gei-video-intelligence-title">Think About What You Watched</h2>'+
   '<p>Capture your own observations and questions before moving into the GEI Academy. Your notes are saved on this device.</p>'+
  '</div>'+
  '<div class="gei-video-input-grid">'+
   '<label class="gei-video-input-card"><span class="gei-video-input-number">01</span><strong>WHAT DID YOU OBSERVE?</strong><small>Record something you noticed in the video or Genesis 1.</small><textarea id="gei-video-observation" rows="4" maxlength="1200" placeholder="I noticed…"></textarea><span class="gei-video-count" data-count-for="observation">0 / 1200</span></label>'+
   '<label class="gei-video-input-card"><span class="gei-video-input-number">02</span><strong>WHAT QUESTION DID IT RAISE?</strong><small>Write a question you want to investigate further.</small><textarea id="gei-video-question" rows="4" maxlength="1200" placeholder="I want to know…"></textarea><span class="gei-video-count" data-count-for="question">0 / 1200</span></label>'+
  '</div>'+
  '<div class="gei-video-intelligence-footer"><span class="gei-video-save-status" role="status" aria-live="polite">NOTES READY</span><button class="gei-video-save" id="gei-video-save" type="button">SAVE MY NOTES</button><a href="day-1.html" class="gei-video-continue">CONTINUE TO DAY 1 →</a></div>';
 root.insertBefore(section,connection);
 const observation=section.querySelector("#gei-video-observation");
 const question=section.querySelector("#gei-video-question");
 const status=section.querySelector(".gei-video-save-status");
 const updateCount=(el,key)=>{section.querySelector('[data-count-for="'+key+'"]').textContent=el.value.length+" / 1200"};
 observation.value=state.observations||"";
 question.value=state.questions||"";
 updateCount(observation,"observation");updateCount(question,"question");
 observation.addEventListener("input",()=>updateCount(observation,"observation"));
 question.addEventListener("input",()=>updateCount(question,"question"));
 const saveNotes=()=>{
  const all=read();
  all[VIDEO_ID]={observations:observation.value.trim(),questions:question.value.trim(),updatedAt:new Date().toISOString()};
  save(all);
  status.textContent="NOTES SAVED";
  window.setTimeout(()=>{if(status)status.textContent="NOTES READY"},1400);
 };
 section.querySelector("#gei-video-save").addEventListener("click",saveNotes);
 window.addEventListener("gei:video-intelligence-updated",e=>{
  if(e.detail?.videoId!==VIDEO_ID)return;
  status.textContent="SYNCED";
 });
 window.GEI_VIDEO_INTELLIGENCE=Object.freeze({
  version:"1.63.16",
  videoId:VIDEO_ID,
  getState:()=>read()[VIDEO_ID]||DEFAULT,
  save:saveNotes
 });
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();