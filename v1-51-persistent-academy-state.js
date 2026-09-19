/* V1.51 — GEI Persistent Academy State */
(()=>{"use strict";
if(window.GEI_ACADEMY_STATE)return;
const KEY="geiAcademyPersistentStateV1";
const DEFAULT={activeScreen:"academy",quickAccessId:null,vaultDay:null,soundEnabled:null,lastUpdated:null};
function load(){try{const p=JSON.parse(localStorage.getItem(KEY)||"null");return{...DEFAULT,...p,activeScreen:["home","academy","portfolio","video","support"].includes(p?.activeScreen)?p.activeScreen:"academy",quickAccessId:typeof p?.quickAccessId==="string"?p.quickAccessId:null,vaultDay:Number.isInteger(Number(p?.vaultDay))&&Number(p.vaultDay)>=1&&Number(p.vaultDay)<=6?Number(p.vaultDay):null,soundEnabled:typeof p?.soundEnabled==="boolean"?p.soundEnabled:null,lastUpdated:typeof p?.lastUpdated==="string"?p.lastUpdated:null}}catch{return{...DEFAULT}}}
let state=load();
function save(){state.lastUpdated=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}}
function publish(){window.dispatchEvent(new CustomEvent("gei:academy-state-updated",{detail:{...state}}))}
function set(patch){state={...state,...patch};save();publish()}
function restore(){if(location.hash!=="#academy"&&state.activeScreen!=="academy")return;window.setTimeout(()=>{if(state.activeScreen==="academy")window.dispatchEvent(new CustomEvent("gei:navigation",{detail:{id:"academy",source:"v1-51-restore"}}));if(state.quickAccessId)window.dispatchEvent(new CustomEvent("gei:quick-access-restore",{detail:{id:state.quickAccessId}}));if(state.vaultDay)window.dispatchEvent(new CustomEvent("gei:vault-restore",{detail:{day:state.vaultDay}}));},0)}
function syncSound(){const enabled=window.GEIAchievementSound?.enabled?.();if(typeof enabled==="boolean"&&enabled!==state.soundEnabled)set({soundEnabled:enabled})}
function init(){window.addEventListener("gei:navigation",e=>set({activeScreen:e.detail?.id||"home"}));window.addEventListener("gei:quick-access-opened",e=>set({quickAccessId:e.detail?.id||null}));window.addEventListener("gei:quick-access-closed",()=>set({quickAccessId:null}));window.addEventListener("gei:vault-item-opened",e=>set({vaultDay:Number(e.detail?.day)||null}));window.addEventListener("gei:vault-item-closed",()=>set({vaultDay:null}));window.addEventListener("gei:achievement-state-updated",syncSound);window.addEventListener("gei:achievement-reward-revealed",syncSound);syncSound();window.GEI_ACADEMY_STATE=Object.freeze({version:"1.51",getState:()=>({...state}),set});restore();window.dispatchEvent(new CustomEvent("gei:academy-state-ready",{detail:{...state}}))}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();