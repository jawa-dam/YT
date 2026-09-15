(() => {
  "use strict";
  const FRAME_ID="app-frame";
  const ACTIVE="SPLASH_ACTIVE";
  const COMPLETE="SPLASH_COMPLETE";
  const TIMEOUT_MS=10000;
  const IMAGE_TIMEOUT_MS=4500;
  const DECK_KEY="gei-splash-image-deck-v2";
  const LAST_KEY="gei-splash-last-image-v2";
  const FALLBACK_IMAGES=[
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/y-all-too-god-is-a-mountain-z7efLdbRpVLTxHbD.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/start-here-gei-ZAxHC3CvlzNVXcDh.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/gei-starts-here-orQtAS63EOlGh6HB.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-the-mountain-7zeFS6ZCAEhfcma0.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-WPvyPpmEq4qJVmwx.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-gei-G8MnWLUJs9kGKc5Q.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/god-is-mountain-BCHRDwrxTxtsDi2F.png",
    "https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/mountain-water-god-8e1Afrt45iPrD0w1.png"
  ];
  const LOCAL_FALLBACK_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1800" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#07101b"/><stop offset=".55" stop-color="#10263a"/><stop offset="1" stop-color="#160d22"/></linearGradient><linearGradient id="water" x1="0" x2="1"><stop stop-color="#2fd2ff"/><stop offset=".5" stop-color="#3d3dea"/><stop offset="1" stop-color="#f310ba"/></linearGradient></defs><rect width="1200" height="1800" fill="url(#bg)"/><circle cx="180" cy="310" r="420" fill="#2fd2ff" opacity=".12"/><circle cx="1050" cy="680" r="470" fill="#f310ba" opacity=".08"/><path d="M0 1040 220 790 390 930 560 560 720 820 900 610 1200 1040v220H0Z" fill="#0b1725" stroke="#2fd2ff" stroke-opacity=".22" stroke-width="8"/><path d="M0 1110h1200v690H0Z" fill="#07111d" opacity=".82"/><rect x="105" y="1035" width="990" height="95" rx="20" fill="#dce8f2" opacity=".92"/><path d="M180 1255c180-65 300 55 470-10s280-50 430 15v545H180Z" fill="url(#water)" opacity=".72"/><text x="600" y="925" fill="#fff" font-family="Arial,sans-serif" font-size="54" font-weight="800" text-anchor="middle">GEI</text><text x="600" y="985" fill="#bfefff" font-family="Arial,sans-serif" font-size="25" font-weight="700" letter-spacing="7" text-anchor="middle">WATER • ENGINEERING</text></svg>`;
  let state=ACTIVE;
  let timeoutId=null;
  function shuffle(items){const result=[...items];for(let i=result.length-1;i>0;i-=1){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
  function getJson(key,fallback=[]){try{return JSON.parse(localStorage.getItem(key)||"null")??fallback;}catch{return fallback;}}
  function setJson(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}
  function getLast(){try{return localStorage.getItem(LAST_KEY)||"";}catch{return "";}}
  function setLast(value){try{localStorage.setItem(LAST_KEY,value);}catch{}}
  async function loadDeck(){try{const response=await fetch("splash-images.json",{cache:"no-store"});if(!response.ok)throw new Error();const deck=await response.json();if(Array.isArray(deck)&&deck.length)return deck.filter(url=>typeof url==="string"&&url.startsWith("https://assets.zyrosite.com/"));}catch{}return [...FALLBACK_IMAGES];}
  function workingDeck(candidates){const stored=getJson(DECK_KEY,[]);const valid=Array.isArray(stored)?stored.filter(url=>candidates.includes(url)):[];return valid.length?valid:shuffle(candidates);}
  function prepareArtwork(splash){let artwork=splash.querySelector(".splash-artwork");if(!artwork)return null;if(artwork.tagName.toLowerCase()!=="div"){const replacement=document.createElement("div");replacement.className=artwork.className;replacement.setAttribute("aria-hidden","true");artwork.replaceWith(replacement);artwork=replacement;}Object.assign(artwork.style,{position:"absolute",inset:"0",width:"100%",height:"100%",zIndex:"0",display:"block",visibility:"visible",opacity:"1",overflow:"hidden",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",transform:"scale(1.02)",filter:"saturate(1.06) contrast(1.04) brightness(.96)"});return artwork;}
  function localFallback(artwork){artwork.innerHTML=LOCAL_FALLBACK_SVG;const svg=artwork.firstElementChild;if(svg){svg.style.width="100%";svg.style.height="100%";svg.style.display="block";}artwork.style.backgroundImage="linear-gradient(145deg,#07101b,#10263a 55%,#160d22)";}
  function preload(url){return new Promise(resolve=>{const image=new Image();let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok);};const timer=setTimeout(()=>finish(false),IMAGE_TIMEOUT_MS);image.decoding="async";image.onload=()=>finish(image.naturalWidth>0&&image.naturalHeight>0);image.onerror=()=>finish(false);image.src=url;});}
  async function loadArtwork(artwork,status){localFallback(artwork);if(status)status.textContent="Selecting GEI artwork";const candidates=await loadDeck();let deck=workingDeck(candidates);const previous=getLast();if(deck.length>1&&deck[0]===previous)[deck[0],deck[1]]=[deck[1],deck[0]];for(let attempt=0;attempt<Math.min(10,deck.length);attempt+=1){const url=deck.shift();if(!(await preload(url)))continue;artwork.innerHTML="";artwork.style.backgroundImage=`url("${url}")`;artwork.dataset.randomArtwork=url;setLast(url);setJson(DECK_KEY,deck);if(status)status.textContent="Ready to enter";return;}setJson(DECK_KEY,deck);if(status)status.textContent="GEI artwork ready";}
  function complete(reason){if(state===COMPLETE)return;state=COMPLETE;if(timeoutId)clearTimeout(timeoutId);const frame=document.getElementById(FRAME_ID);if(!frame)return;frame.classList.add("splash-done");frame.dataset.splashExit=reason;}
  function init(){const frame=document.getElementById(FRAME_ID);if(!frame)return;const splash=frame.querySelector(".splash-layer");if(!splash)return;const artwork=prepareArtwork(splash);const enter=splash.querySelector("#splash-enter");const status=splash.querySelector("#splash-status");const progress=splash.querySelector("#splash-progress-bar");if(!artwork||!enter||!progress)return;loadArtwork(artwork,status);enter.addEventListener("click",()=>complete("enter"),{once:true});document.addEventListener("keydown",event=>{if(state===ACTIVE&&event.key==="Enter"){event.preventDefault();complete("keyboard-enter");}});const start=performance.now();const tick=now=>{if(state!==ACTIVE)return;progress.style.width=`${Math.min((now-start)/TIMEOUT_MS,1)*100}%`;if(now-start<TIMEOUT_MS)requestAnimationFrame(tick);};requestAnimationFrame(tick);timeoutId=setTimeout(()=>complete("timeout"),TIMEOUT_MS);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
