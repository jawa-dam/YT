/* V1.63.15 — GEI Video Lab Foundation */
(()=>{"use strict";
const VIDEO_ID="8mYq2A_fgTA";
const VIDEO_TITLE="Did God ACTUALLY Create Water?";
const DAY_LINK="day-1.html";
function init(){
  const root=document.getElementById("video-root");
  if(!root||root.dataset.v16315==="ready")return;
  const feature=root.querySelector(".video-feature");
  if(!feature)return;
  root.dataset.v16315="ready";

  feature.className="video-feature gei-video-feature";
  feature.innerHTML=
    '<div class="gei-video-player-wrap">'+
      '<iframe class="gei-video-player" src="https://www.youtube.com/embed/'+VIDEO_ID+'" title="'+VIDEO_TITLE+'" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>'+
    '</div>'+
    '<div class="gei-video-feature-copy">'+
      '<span class="video-label">FEATURED VIDEO • GEI VIDEO LAB</span>'+
      '<h2>'+VIDEO_TITLE+'</h2>'+
      '<p>Did God actually create water in Genesis Chapter 1, or was it already there? 🌊 Explore the question through Genesis Engineered Interpretations.</p>'+
      '<a class="gei-video-watch-link" href="https://www.youtube.com/watch?v='+VIDEO_ID+'" target="_blank" rel="noopener noreferrer">OPEN ON YOUTUBE ↗</a>'+
    '</div>';

  const library=root.querySelector(".video-library");
  if(!library)return;
  const learning=document.createElement("section");
  learning.className="gei-video-learning";
  learning.setAttribute("aria-labelledby","gei-video-learning-title");
  learning.innerHTML=
    '<div class="gei-video-section-head"><span class="video-label">WATCH • OBSERVE • QUESTION • CONNECT</span><h2 id="gei-video-learning-title">Your GEI Viewing Guide</h2><p>Use the video as a starting point for observation. Separate what the text says from the interpretation being proposed.</p></div>'+
    '<div class="gei-video-observation-grid">'+
      '<article class="gei-video-observation-card"><span>01</span><b>OBSERVE</b><p>What does Genesis 1 describe as present before the waters are separated?</p></article>'+
      '<article class="gei-video-observation-card"><span>02</span><b>QUESTION</b><p>Does the passage explicitly describe the creation of water, or does it describe an action involving existing waters?</p></article>'+
      '<article class="gei-video-observation-card"><span>03</span><b>CONNECT</b><p>How does the GEI model connect water, separation, containment, and hydraulic structure?</p></article>'+
    '</div>'+
    '<article class="gei-video-connection">'+
      '<div><span class="video-label">GEI CONNECTION</span><h3>Genesis 1 → Water → Separation → Firmament → Hydraulic Structure</h3><p>The GEI framework proposes reading the sequence as a structural and hydraulic model. The biblical text and the GEI interpretation are presented as distinct layers for the learner to examine.</p></div>'+
      '<a href="'+DAY_LINK+'" class="gei-video-academy-link">ENTER DAY 1 →</a>'+
    '</article>';
  library.before(learning);

  const adamPanel=root.querySelector("#video-adam-modal .video-adam-panel p");
  if(adamPanel)adamPanel.textContent="Start with the question: Did Genesis 1 create water, or describe what happened to waters already present? Watch, observe the wording, then explore the GEI connection.";
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();