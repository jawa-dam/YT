/* V1.48 — GEI Achievement Sound Engine */
(()=>{
"use strict";
const KEY="geiAchievementSoundEnabledV1";
const DEFAULT=true;
const FREQ={1:[523.25,659.25,783.99],2:[220,329.63,440],3:[261.63,392,523.25],4:[196,293.66,392],5:[329.63,493.88,659.25],6:[392,523.25,659.25,783.99,1046.5]};
let ctx=null;
function enabled(){try{const v=localStorage.getItem(KEY);return v===null?DEFAULT:v!=="false"}catch{return DEFAULT}}
function setEnabled(v){try{localStorage.setItem(KEY,String(v))}catch{}}
function getContext(){if(ctx)return ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;try{ctx=new C();return ctx}catch{return null}}
async function resume(){const c=getContext();if(!c)return null;if(c.state==="suspended"){try{await c.resume()}catch{return null}}return c}
function tone(c,freq,start,duration,type="sine",peak=.045){const osc=c.createOscillator(),gain=c.createGain(),filter=c.createBiquadFilter();osc.type=type;osc.frequency.setValueAtTime(freq,start);filter.type="lowpass";filter.frequency.setValueAtTime(Math.min(4200,freq*5),start);gain.gain.setValueAtTime(0.0001,start);gain.gain.exponentialRampToValueAtTime(peak,start+.018);gain.gain.exponentialRampToValueAtTime(0.0001,start+duration);osc.connect(filter).connect(gain).connect(c.destination);osc.start(start);osc.stop(start+duration+.03)}
function play(day){if(!enabled())return;resume().then(c=>{if(!c)return;const now=c.currentTime+.015,notes=FREQ[day]||FREQ[1];if(day===6){notes.forEach((f,i)=>tone(c,f,now+i*.11,.32,i%2?"triangle":"sine",.052));tone(c,1046.5,now+.48,.58,"sine",.038)}else{notes.forEach((f,i)=>tone(c,f,now+i*.10,.25,i===1?"triangle":"sine",.045));if(day===4)tone(c,98,now,.28,"sawtooth",.025);if(day===5)tone(c,146.83,now+.04,.42,"triangle",.025)}})}
function button(){return document.querySelector(".v1-48-sound-toggle")}
function updateButton(){const b=button();if(!b)return;b.setAttribute("aria-pressed",String(enabled()));b.textContent=enabled()?"🔊 SOUND ON":"🔇 SOUND OFF";b.title=enabled()?"Achievement sounds are on":"Achievement sounds are off"}
function mountControl(){const vault=document.querySelector("#screen-academy .v1-45-achievement-vault");if(!vault)return;let b=button();if(!b){b=document.createElement("button");b.className="v1-48-sound-toggle";b.type="button";b.addEventListener("click",async()=>{const next=!enabled();setEnabled(next);updateButton();window.dispatchEvent(new CustomEvent("gei:achievement-sound-changed",{detail:{enabled:next}}));if(next){const c=await resume();if(c)tone(c,659.25,c.currentTime+.02,.16,"sine",.035)}});vault.querySelector(".v1-45-vault-head")?.appendChild(b)}updateButton()}
function boot(){mountControl()}
window.addEventListener("gei:achievement-reward-revealed",e=>play(Number(e.detail?.day||1)));
window.addEventListener("gei:achievement-updated",mountControl);window.addEventListener("gei:day-completion",mountControl);window.addEventListener("gei:navigation",mountControl);window.addEventListener("pageshow",mountControl);
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot,{once:true});else boot();
window.GEIAchievementSound={play,enabled,setEnabled};
})();
