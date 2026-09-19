/* V1.48 — GEI Sonic & Water Celebration Engine
   No external audio assets. Web Audio API creates a polished hydraulic/cinematic sound palette. */
(()=>{"use strict";
if(window.GEI_SONIC_FX)return;
const AudioCtx=window.AudioContext||window.webkitAudioContext;
let ctx=null,lastTap=0,lastCompletionSignature="",lastBlueprintFinaleSignature="";
const reduced=()=>window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
const ensure=()=>{if(!AudioCtx)return null;if(!ctx)ctx=new AudioCtx();if(ctx.state==="suspended")ctx.resume().catch(()=>{});return ctx};
const tone=(freq,dur,type="sine",gain=.045,delay=0,endFreq=freq)=>{
 const c=ensure();if(!c)return;
 const t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
 o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,endFreq),t+dur);
 f.type="lowpass";f.frequency.setValueAtTime(4200,t);f.frequency.exponentialRampToValueAtTime(900,t+dur);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 o.connect(f).connect(g).connect(c.destination);o.start(t);o.stop(t+dur+.03);
};
const noise=(dur=.22,gain=.028,delay=0)=>{
 const c=ensure();if(!c)return;
 const n=c.createBufferSource(),b=c.createBuffer(1,Math.ceil(c.sampleRate*dur),c.sampleRate),d=b.getChannelData(0);
 for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*(1-i/d.length);
 const f=c.createBiquadFilter(),g=c.createGain(),t=c.currentTime+delay;
 n.buffer=b;f.type="bandpass";f.frequency.setValueAtTime(1700,t);f.Q.value=1.2;
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(gain,t+.018);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 n.connect(f).connect(g).connect(c.destination);n.start(t);n.stop(t+dur+.02);
};
const mascotSound=()=>{tone(180,.22,"sine",.055,0,105);tone(520,.34,"triangle",.038,.04,760);tone(1040,.18,"sine",.022,.11,1320);noise(.12,.018,.02)};
const iconSound=()=>{tone(740,.11,"sine",.035,0,560);tone(1180,.16,"triangle",.028,.035,1450)};
const wheelSound=()=>{noise(.16,.026);tone(92,.26,"sine",.045,0,58);tone(280,.2,"triangle",.026,.03,190)};
const answerSound=(correct)=>{
 if(correct){
  tone(520,.12,"triangle",.042,0,660);tone(784,.18,"sine",.035,.06,1046);tone(1318,.24,"sine",.022,.13,1568);noise(.08,.012,.04);
 }else{
  tone(180,.24,"sawtooth",.055,0,92);tone(115,.3,"sine",.045,.02,62);noise(.16,.025,.01);
 }
};
const answerTap=()=>{tone(360,.055,"sine",.025,0,280)};
const completionSound=()=>{
  tone(110,.55,"sine",.05,0,62);noise(.34,.028,.02);
  tone(392,.48,"triangle",.045,.12,440);tone(523.25,.52,"triangle",.05,.19,587.33);tone(659.25,.7,"sine",.048,.27,783.99);
  tone(1046.5,.72,"sine",.025,.34,1318.5);noise(.5,.016,.24);
};
function ripple(target){
 if(!target||reduced())return;
 const cs=getComputedStyle(target),position=cs.position;
 if(position==="static")target.style.position="relative";
 const r=document.createElement("span");r.className="gei-sonic-ripple";r.style.color=target.closest(".academy-mascot,.gei-mascot-button")?"#2fd2ff":"#ff1493";
 target.appendChild(r);setTimeout(()=>r.remove(),700);
 target.classList.remove("gei-sonic-hit");void target.offsetWidth;target.classList.add("gei-sonic-hit");setTimeout(()=>target.classList.remove("gei-sonic-hit"),760);
}
function blueprintFinale(learnerName){
 const c=ensure();if(!c)return;
 const t=c.currentTime;
 tone(72,.9,"sine",.08,0,42);tone(144,.8,"triangle",.06,.08,220);tone(288,.7,"triangle",.055,.18,392);
 tone(523.25,.65,"sine",.05,.28,659.25);tone(783.99,.85,"triangle",.055,.4,1046.5);tone(1318.5,1.05,"sine",.045,.52,1760);
 noise(.8,.04,.1);noise(.45,.025,.55);
 if(reduced())return;
 const layer=document.createElement("div");layer.className="gei-blueprint-finale";layer.setAttribute("aria-hidden","true");
 const title=document.createElement("div");title.className="gei-blueprint-finale-title";title.textContent=learnerName?"@"+learnerName+" • BLUEPRINT COMPLETE":"BLUEPRINT COMPLETE";layer.appendChild(title);
 const sub=document.createElement("div");sub.className="gei-blueprint-finale-sub";sub.textContent="DAY 6 OBJECTIVES MASTERED • 6 / 6";layer.appendChild(sub);
 const wave=document.createElement("div");wave.className="gei-blueprint-finale-wave";layer.appendChild(wave);
 for(let i=0;i<72;i++){const p=document.createElement("span");p.className="gei-blueprint-finale-particle";const a=Math.PI*2*i/72+(Math.random()-.5)*.2,d=100+Math.random()*Math.min(window.innerWidth,window.innerHeight)*.5;p.style.setProperty("--x",Math.cos(a)*d+"px");p.style.setProperty("--y",Math.sin(a)*d+"px");p.style.setProperty("--delay",Math.random()*220+"ms");layer.appendChild(p)}
 document.body.appendChild(layer);window.setTimeout(()=>layer.remove(),3600);
}
function waterCelebration(day){
 completionSound();
 if(reduced())return;
 const layer=document.createElement("div");layer.className="gei-water-celebration";layer.setAttribute("aria-hidden","true");
 const flash=document.createElement("div");flash.className="gei-completion-flash";layer.appendChild(flash);
 const wave=document.createElement("div");wave.className="gei-water-wave";layer.appendChild(wave);
 const count=38;
 for(let i=0;i<count;i++){
   const p=document.createElement("span");p.className="gei-water-burst";
   const angle=(Math.PI*2*i/count)+(Math.random()-.5)*.28,dist=90+Math.random()*Math.min(window.innerWidth,window.innerHeight)*.42;
   p.style.setProperty("--x",Math.cos(angle)*dist+"px");p.style.setProperty("--y",Math.sin(angle)*dist+"px");
   p.style.setProperty("--scale",(0.45+Math.random()*1.2).toFixed(2));
   p.style.setProperty("--dur",(900+Math.random()*850)+"ms");
   layer.appendChild(p);
 }
 document.body.appendChild(layer);
 window.setTimeout(()=>layer.remove(),1900);
}
function onClick(e){
 const target=e.target.closest?.(".academy-mascot,.gei-mascot-button,.nav-icon,.gei-quick-button,.academy-wheel-tap,.academy-day-card,.academy-primary-action,.academy-cta,.gei-journey-primary,.gei-journey-complete");
 if(!target)return;
 const now=performance.now();if(now-lastTap<55)return;lastTap=now;
 ensure();ripple(target);
 if(target.matches(".academy-mascot,.gei-mascot-button"))mascotSound();
 else if(target.matches(".academy-wheel-tap"))wheelSound();
 else iconSound();
}
document.addEventListener("click",onClick,{capture:true});
window.addEventListener("gei:day-objectives-mastered",e=>{const day=Number(e.detail?.day||0),name=e.detail?.learnerName||"",signature=day+":"+name;if(day===6&&signature!==lastBlueprintFinaleSignature){lastBlueprintFinaleSignature=signature;blueprintFinale(name);}});
window.addEventListener("gei:day-completion",e=>{const day=Number(e.detail?.day||e.detail?.dayId||0);if(day<1||day>6)return;const record=e.detail?.completion?.[day]||{};const signature=`${day}:${record.completedAt||"event"}`;if(signature===lastCompletionSignature)return;lastCompletionSignature=signature;waterCelebration(day);});
window.GEI_SONIC_FX=Object.freeze({unlockAudio:ensure,mascot:mascotSound,icon:iconSound,wheel:wheelSound,answer:answerSound,answerTap,celebrate:waterCelebration,blueprintFinale});
})();