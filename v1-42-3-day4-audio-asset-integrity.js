(()=>{"use strict";
const root=document.querySelector('[data-gei-day="4"]');
if(!root)return;
const audio=document.getElementById("day-audio");
const panel=document.getElementById("day4-audio-diagnostics");
if(!audio||!panel)return;
const expected="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/genesis-engineered-day4-yalltoo-4-twdz0MuiI3X3O3OE.mp3";
const NETWORK={0:"NETWORK_EMPTY",1:"NETWORK_IDLE",2:"NETWORK_LOADING",3:"NETWORK_NO_SOURCE"};
const READY={0:"HAVE_NOTHING",1:"HAVE_METADATA",2:"HAVE_CURRENT_DATA",3:"HAVE_FUTURE_DATA",4:"HAVE_ENOUGH_DATA"};
const ERR={1:"MEDIA_ERR_ABORTED",2:"MEDIA_ERR_NETWORK",3:"MEDIA_ERR_DECODE",4:"MEDIA_ERR_SRC_NOT_SUPPORTED"};
let watchdog=0;
let visible=false;
function value(v){return v===undefined||v===null||v===""?"none":String(v)}
function snapshot(){
 const err=audio.error;
 return [
  `Source: ${expected}`,
  `Current source: ${value(audio.currentSrc)}`,
  `Duration: ${Number.isFinite(audio.duration)?audio.duration.toFixed(2)+"s":"NaN/unknown"}`,
  `readyState: ${audio.readyState} (${READY[audio.readyState]||"unknown"})`,
  `networkState: ${audio.networkState} (${NETWORK[audio.networkState]||"unknown"})`,
  `error code: ${value(err?.code)}${err?.code?` (${ERR[err.code]||"unknown"})`:""}`,
  `error detail: ${value(err?.message)}`
 ];
}
function hide(){window.clearTimeout(watchdog);panel.hidden=true;panel.textContent="";visible=false}
function show(reason){
 if(visible&&panel.querySelector("pre")){panel.querySelector("pre").textContent=snapshot().join("\n");return}
 visible=true;panel.hidden=false;panel.innerHTML="";
 const title=document.createElement("strong");title.textContent="Day 4 audio asset check";
 const message=document.createElement("div");message.textContent=reason||"The browser has not received playable audio metadata.";
 const pre=document.createElement("pre");pre.textContent=snapshot().join("\n");
 const link=document.createElement("a");link.href=expected;link.target="_blank";link.rel="noopener noreferrer";link.textContent="OPEN DAY 4 AUDIO DIRECTLY";
 panel.append(title,message,pre,link)
}
function usable(){return audio.readyState>=HTMLMediaElement.HAVE_METADATA&&Number.isFinite(audio.duration)&&audio.duration>0}
function evaluate(){if(audio.error){show("The browser reported a media error.");return}if(usable()){hide();return}if(audio.networkState===HTMLMediaElement.NETWORK_NO_SOURCE){show("The browser reports that no usable media source was loaded.");return}show("The player is present, but no usable audio duration has been received yet.")}
function arm(){window.clearTimeout(watchdog);watchdog=window.setTimeout(evaluate,4500)}
["loadstart","progress","loadedmetadata","loadeddata","durationchange","canplay","canplaythrough","playing"].forEach(type=>audio.addEventListener(type,()=>{if(usable())hide();else arm()}));
["error","abort"].forEach(type=>audio.addEventListener(type,()=>show(`${type} event received.`)));
audio.addEventListener("stalled",()=>arm());audio.addEventListener("emptied",()=>arm());window.addEventListener("pageshow",arm);window.addEventListener("online",()=>{audio.load();arm()});audio.preload="auto";window.setTimeout(()=>{audio.load();arm()},0);
})();
