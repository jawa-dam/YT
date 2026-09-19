/* V1.49 — Day-specific Adam Objective Mastery */
(() => {
  "use strict";
  const STORAGE_KEY = "geiAdamObjectiveMasteryV1";
  const QUESTIONS = Object.freeze({
    1:[["What is the first condition described before light appears?",["A dry land","Darkness upon the deep","A completed dam"],1],["In the GEI Day 1 model, what does light represent?",["Released water","A mountain","A mill gear"],0],["What is the key engineering action established on Day 1?",["Separation","Harvesting","Animal operation"],0]],
    2:[["What does the firmament represent in the Day 2 model?",["A dam wall","A waterwheel","Dry land"],0],["Why is separation important before controlled movement?",["Structure must contain and direct flow","Water must disappear","The mill must be removed"],0],["What engineering role does Day 2 establish?",["Structural containment","Mechanical generation","Final operation"],0]],
    3:[["What appears when the waters are gathered in the Day 3 model?",["Dry land","A waterwheel","A sluice gate"],0],["What does the gathered water function as in the blueprint?",["A reservoir","A gear","A creature"],0],["What environment does Day 3 establish?",["Working water storage and exposed dry land","Final system operation","Mill gearing"],0]],
    4:[["What is the primary function of the lights in the Day 4 interpretation?",["Functional markers","Dam foundations","Animal operators"],0],["What controls movement toward the mill in the model?",["A controlled release","Dry land","Darkness"],0],["What becomes an operational control on Day 4?",["Timing and flow","Mountain height","Animal size"],0]],
    5:[["What do the great water creatures represent in the Day 5 model?",["Water-driven mechanical activity","Dry land","A cement wall"],0],["What converts moving water into mechanical energy?",["A waterwheel","A reservoir wall","A mountain"],0],["What does Day 5 represent?",["System activation through water movement","Initial separation","Structural containment"],0]],
    6:[["What does Day 6 represent in the six-stage GEI model?",["The completed operating system","The first separation","The reservoir only"],0],["What should the learner connect across Days 1–6?",["One engineered sequence","Six unrelated events","Only the animal imagery"],0],["What is the final learning objective of the sequence?",["Summarize how the complete architecture operates","Ignore the earlier stages","Remove the water system"],0]]
  });
  function read(){try{const p=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");return{mastered:Array.isArray(p.mastered)?[...new Set(p.mastered.map(String))]:[]};}catch(_){return{mastered:[]};}}
  function save(s){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch(_){}}
  function getDay(){return Math.min(6,Math.max(1,Number(document.querySelector(".day-app")?.dataset.geiDay)||1));}
  function key(day,index){return day+"-"+index;}
  function isMastered(s,day,index){return s.mastered.includes(key(day,index));}
  function count(s,day){return QUESTIONS[day].filter((_,i)=>isMastered(s,day,i)).length;}
  function render(){
    const root=document.getElementById("day-objective-mastery-root"); if(!root)return;
    const day=getDay(),items=QUESTIONS[day],state=read(),done=count(state,day); root.innerHTML="";
    const section=document.createElement("section"); section.className="v1-49-day-objective-mastery"; section.setAttribute("aria-labelledby","v1-49-mastery-title");
    section.innerHTML=`<div class="v1-49-mastery-head"><div><span class="v1-49-mastery-kicker">ADAM • OBJECTIVE MASTERY</span><h2 id="v1-49-mastery-title">Day ${day} mastery</h2></div><span class="v1-49-mastery-badge">+15 XP EACH</span></div><p class="v1-49-mastery-copy">Answer the three checkpoints for this specific day to demonstrate what you learned.</p><div class="v1-49-mastery-progress" role="progressbar" aria-label="Day ${day} objective mastery" aria-valuemin="0" aria-valuemax="3" aria-valuenow="${done}"><div><span>DAY ${day} OBJECTIVES</span><b>${done} / 3</b></div><span class="v1-49-mastery-bar"><i style="width:${Math.round(done/3*100)}%"></i></span></div><div id="v1-49-question"></div>`;
    root.appendChild(section);
    let index=0; while(index<items.length&&isMastered(state,day,index))index++;
    const host=section.querySelector("#v1-49-question");
    if(index>=items.length){host.innerHTML=`<div class="v1-49-complete"><span>✓</span><div><strong>Day ${day} objectives mastered</strong><small>All three checkpoints demonstrated.</small></div></div>`;return;}
    const [question,choices,correct]=items[index];
    host.innerHTML=`<div class="v1-49-question-meta"><span>CHECKPOINT ${index+1} / 3</span><b>${done} MASTERED</b></div><h3>${question}</h3><div class="v1-49-choices">${choices.map((choice,i)=>`<button type="button" data-choice="${i}">${choice}</button>`).join("")}</div><p class="v1-49-feedback" aria-live="polite"></p>`;
    host.querySelectorAll("[data-choice]").forEach(btn=>btn.addEventListener("click",()=>{
      const current=read(),feedback=host.querySelector(".v1-49-feedback"),buttons=[...host.querySelectorAll("button")]; buttons.forEach(b=>b.disabled=true);
      if(Number(btn.dataset.choice)!==correct){if(feedback)feedback.textContent="Not quite. Adam says: review the objective, then try again.";buttons.forEach(b=>b.disabled=false);return;}
      const k=key(day,index); if(!current.mastered.includes(k)){current.mastered.push(k);current.mastered=[...new Set(current.mastered)];save(current);window.GEI_PROGRESS?.addXP?.(15,"adam-objective-mastery");}
      if(feedback)feedback.textContent="Objective demonstrated! +15 XP"; window.dispatchEvent(new CustomEvent("gei:objective-mastery-updated",{detail:{day,index:index+1}})); window.setTimeout(render,420);
    }));
  }
  function ensureStyles(){
    if(document.getElementById("v1-49-day-objective-mastery-styles"))return;
    const style=document.createElement("style"); style.id="v1-49-day-objective-mastery-styles"; style.textContent=`
      #day-objective-mastery-root{width:100%}.v1-49-day-objective-mastery{margin:0 0 12px;padding:14px;border:2px solid #155eef;border-radius:18px;background:#fff;box-shadow:0 14px 34px rgba(16,42,67,.10)}
      .v1-49-mastery-head{display:flex;align-items:flex-end;justify-content:space-between;gap:10px}.v1-49-mastery-kicker{display:block;color:#155eef;font-size:14px;font-weight:1000;letter-spacing:.13em}.v1-49-mastery-head h2{margin:4px 0 0;color:#102a43;font-size:18px;line-height:1.08}.v1-49-mastery-badge{padding:5px 7px;border-radius:8px;background:#eef3ff;color:#155eef;font-size:8px;font-weight:1000;white-space:nowrap}
      .v1-49-mastery-copy{margin:8px 0 10px;color:#526b82;font-size:11px;line-height:1.4}.v1-49-mastery-progress{margin:0 0 12px;padding:9px 10px;border-radius:12px;background:#f5f8ff;border:1px solid rgba(21,94,239,.12)}.v1-49-mastery-progress>div{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;color:#60738f;font-size:8px;font-weight:1000;letter-spacing:.08em}.v1-49-mastery-progress b{color:#155eef}.v1-49-mastery-bar{display:block;height:6px;border-radius:99px;background:#dfe7f7;overflow:hidden}.v1-49-mastery-bar i{display:block;height:100%;border-radius:99px;background:#155eef;transition:width .28s ease}
      .v1-49-question-meta{display:flex;justify-content:space-between;gap:8px;margin-bottom:7px;color:#60738f;font-size:8px;font-weight:1000;letter-spacing:.08em}.v1-49-question-meta b{color:#155eef}.v1-49-question h3{margin:0 0 9px;color:#102a43;font-size:14px;line-height:1.3}.v1-49-choices{display:grid;gap:7px}.v1-49-choices button{width:100%;min-height:42px;padding:8px 10px;border:1px solid rgba(21,94,239,.25);border-radius:11px;background:#f7f9fc;color:#304963;text-align:left;font:inherit;font-size:11px;font-weight:700;cursor:pointer}.v1-49-choices button:disabled{opacity:.65;cursor:default}.v1-49-choices button:focus-visible{outline:3px solid #ff1493;outline-offset:2px}.v1-49-feedback{min-height:16px;margin:7px 0 0;color:#155eef;font-size:10px;font-weight:800}
      .v1-49-complete{display:flex;align-items:center;gap:10px;padding:10px;border-radius:12px;background:#fff0f8;color:#102a43}.v1-49-complete>span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#ff1493;color:#fff;font-weight:1000}.v1-49-complete strong,.v1-49-complete small{display:block}.v1-49-complete strong{font-size:12px}.v1-49-complete small{margin-top:2px;color:#526b82;font-size:10px}
      @media(max-width:420px){.v1-49-day-objective-mastery{padding:12px;border-radius:16px}.v1-49-mastery-head h2{font-size:16px}.v1-49-mastery-kicker{font-size:12px}.v1-49-mastery-badge{font-size:9px}.v1-49-mastery-copy{font-size:10px}.v1-49-question h3{font-size:13px}.v1-49-choices button{font-size:10px;min-height:40px}}
    `; document.head.appendChild(style);
  }
  function init(){ensureStyles();render();window.addEventListener("gei:progress-updated",render);window.addEventListener("gei:objective-mastery-updated",render);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();