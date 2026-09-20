/* V1.63.17 — GEI Research Portfolio Experience */
(()=>{"use strict";
const MASCOT_URL="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-the-dam-guide-Jv8ovjc6i8PutsiP.png";
const GUIDE_MESSAGES=[
 "These ten works form the current GEI research library. Each paper approaches the Genesis 1 proposal from a different research angle.",
 "Start with the hydraulic blueprint work, then compare the literary, methodological, linguistic, hydrological, and systems-oriented papers.",
 "The research cards link directly to their external publication records. Open a paper when you are ready to examine the source itself.",
 "Notice how the collection moves between Genesis wording, terminology, symbolic interpretation, water systems, and engineering models."
];
function init(){
 const root=document.getElementById("portfolio-root");
 if(!root||root.dataset.v16317==="ready")return;
 root.dataset.v16317="ready";
 const main=root.querySelector(".portfolio-main");
 if(!main)return;
 const guide=document.createElement("section");
 guide.className="gei-portfolio-guide";
 guide.innerHTML=
 '<button class="gei-portfolio-mascot" type="button" aria-label="Ask Wilbert the Dam Guide about the research papers">'+
   '<span class="gei-portfolio-mascot-glow" aria-hidden="true"></span>'+
   '<img src="'+MASCOT_URL+'" alt="Wilbert the Dam Guide mascot" decoding="async" fetchpriority="high">'+
   '<span class="gei-portfolio-mascot-badge">TAP THE DAM GUIDE</span>'+
 '</button>'+
 '<div class="gei-portfolio-guide-copy"><span class="screen-kicker">THE DAM GUIDE</span><h2>Meet the Research Map</h2><p>Tap Wilbert to get a quick guide to the papers in this library.</p><span class="gei-portfolio-guide-hint">10 WORKS • RESEARCH • DISCOVERY</span></div>';
 const overview=main.querySelector(".research-overview");
 main.insertBefore(guide,overview);
 const dialog=document.createElement("div");
 dialog.className="gei-portfolio-dialog";
 dialog.hidden=true;
 dialog.innerHTML=
  '<div class="gei-portfolio-dialog-backdrop" data-close-guide></div>'+
  '<section class="gei-portfolio-dialog-card" role="dialog" aria-modal="true" aria-labelledby="gei-portfolio-guide-title">'+
   '<button class="gei-portfolio-dialog-close" type="button" aria-label="Close Dam Guide">×</button>'+
   '<div class="gei-portfolio-dialog-mascot"><img src="'+MASCOT_URL+'" alt="Wilbert the Dam Guide mascot"></div>'+
   '<div class="gei-portfolio-dialog-copy"><span class="screen-kicker">WILBERT • THE DAM GUIDE</span><h2 id="gei-portfolio-guide-title">What Are These Papers About?</h2><p class="gei-portfolio-guide-message"></p>'+
   '<div class="gei-portfolio-paper-map">'+
    '<span>HYDRAULIC BLUEPRINT</span><span>LITERARY MECHANICS</span><span>METHODOLOGY</span><span>MILL &amp; POWER</span><span>SYMBOLIC HYDROLOGY</span><span>LINGUISTICS</span><span>FIRMAMENT</span><span>WATER TERMINOLOGY</span><span>SYSTEMS</span><span>GEI BLUEPRINT</span>'+
   '</div>'+
   '<button class="gei-portfolio-next" type="button">NEXT GUIDE NOTE →</button>'+
   '</div>'+
  '</section>';
 root.appendChild(dialog);
 const message=dialog.querySelector(".gei-portfolio-guide-message");
 let index=0;
 const open=()=>{message.textContent=GUIDE_MESSAGES[index];dialog.hidden=false;document.body.classList.add("gei-portfolio-guide-open");dialog.querySelector(".gei-portfolio-dialog-close").focus()};
 const close=()=>{dialog.hidden=true;document.body.classList.remove("gei-portfolio-guide-open")};
 guide.querySelector(".gei-portfolio-mascot").addEventListener("click",open);
 dialog.querySelector(".gei-portfolio-dialog-close").addEventListener("click",close);
 dialog.querySelector("[data-close-guide]").addEventListener("click",close);
 dialog.querySelector(".gei-portfolio-next").addEventListener("click",()=>{index=(index+1)%GUIDE_MESSAGES.length;message.textContent=GUIDE_MESSAGES[index]});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!dialog.hidden)close()});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();