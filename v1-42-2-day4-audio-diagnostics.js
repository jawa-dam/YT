(()=>{"use strict";
const root=document.querySelector('[data-gei-day="4"]');
if(!root)return;
const audio=document.getElementById("day-audio");
const panel=document.getElementById("day4-audio-diagnostics");
if(!audio||!panel)return;
const source=audio.querySelector("source");
const expected="https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/genesis-engineered-day-4-yalltoo-A1a5bjkZl5iPPXoG4.mp3";
const labels={1:"MEDIA_ERR_ABORTED — the browser stopped the media request.",2:"MEDIA_ERR_NETWORK — the media could not be fetched.",3:"MEDIA_ERR_DECODE — the file was fetched but could not be decoded.",4:"MEDIA_ERR_SRC_NOT_SUPPORTED — the browser or resource is not supported."};
let timer=0;
function details(){
 const err=audio.error;
 return [
  `Source: ${source?.src||expected}`,
  `Current source: ${audio.currentSrc||"none"}`,
  `readyState: ${audio.readyState}`,
  `networkState: ${audio.networkState}`,
  `error code: ${err?.code??"none"}`,
  `error detail: ${err?.message||labels[err?.code]||"none"}`
 ];
}
function clear(){
 window.clearTimeout(timer);
 panel.hidden=true;
 panel.textContent="";
}
function show(reason){
 window.clearTimeout(timer);
 panel.hidden=false;
 panel.innerHTML="";
 const strong=document.createElement("strong");
 strong.textContent="Day 4 audio could not start.";
 const text=document.createElement("div");
 text.textContent=reason||"The browser reported a media loading problem.";
 const pre=document.createElement("pre");
 pre.textContent=details().join("\n");
 const link=document.createElement("a");
 link.href=expected;
 link.target="_blank";
 link.rel="noopener noreferrer";
 link.textContent="Open Day 4 audio directly";
 panel.append(strong,text,pre,link);
}
function verify(){
 if(audio.error)show();
 else if(audio.readyState>=2||audio.currentSrc)clear();
}
if(source)source.src=expected;
audio.preload="auto";
["loadstart","loadedmetadata","loadeddata","canplay","canplaythrough","playing"].forEach(type=>audio.addEventListener(type,clear));
["error","abort"].forEach(type=>audio.addEventListener(type,()=>show(type+" event received.")));
audio.addEventListener("stalled",()=>{timer=window.setTimeout(()=>{if(audio.readyState<2)show("The browser started the request but no playable audio data arrived." )},2500)});
audio.addEventListener("emptied",()=>{timer=window.setTimeout(verify,500)});
window.setTimeout(()=>{audio.load();verify()},0);
})();
