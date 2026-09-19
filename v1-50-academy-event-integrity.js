/* V1.50 — GEI Academy Audio & Interaction Event Integrity */
(()=>{"use strict";
if(window.GEI_EVENT_INTEGRITY)return;
const CONTRACT=Object.freeze({
  version:"1.50",
  completion:"gei:day-completion",
  audioProgress:"gei:audio-progress-updated",
  progress:"gei:progress-updated",
  xp:"gei:xp-updated",
  streak:"gei:streak-updated",
  achievement:"gei:achievement-earned",
  rewardReveal:"gei:achievement-reward-revealed",
  navigation:"gei:navigation"
});
const counts=Object.create(null);
Object.keys(CONTRACT).forEach(k=>{if(k!=="version")counts[CONTRACT[k]]=0});
const observe=(name)=>()=>{counts[name]=(counts[name]||0)+1};
Object.values(CONTRACT).filter(v=>v!=="1.50").forEach(name=>window.addEventListener(name,observe(name)));
window.GEI_EVENT_INTEGRITY=Object.freeze({
  contract:CONTRACT,
  snapshot:()=>Object.freeze({...counts})
});
window.dispatchEvent(new CustomEvent("gei:event-integrity-ready",{detail:{version:"1.50"}}));
})();