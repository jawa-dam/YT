/* V1.54 — GEI Unified Learner Identity Engine */
(()=>{"use strict";
if(window.GEI_IDENTITY)return;
const KEY="geiDamNameIdentityV1";
const VERSION="1.54";
const DEFAULT={damName:"",avatar:"adam",version:VERSION,updatedAt:null};
const AVATARS=Object.freeze({
 adam:{label:"Adam",icon:"",image:true},
 water:{label:"Water",icon:"💧",image:false},
 mountain:{label:"Mountain",icon:"⛰️",image:false},
 dam:{label:"Dam",icon:"🧱",image:false},
 wheel:{label:"Waterwheel",icon:"⚙️",image:false},
 gate:{label:"Sluice Gate",icon:"🚪",image:false},
 current:{label:"Water Current",icon:"🌊",image:false}
});
const cleanName=value=>String(value??"").trim().replace(/^@+/,"");
const validName=value=>/^[A-Za-z0-9_-]{3,20}$/.test(cleanName(value));
function read(){
 try{
  const parsed=JSON.parse(localStorage.getItem(KEY)||"null");
  const name=cleanName(parsed?.damName);
  return {
   ...DEFAULT,
   ...(parsed&&typeof parsed==="object"?parsed:{}),
   damName:validName(name)?name:"",
   avatar:AVATARS[parsed?.avatar]?parsed.avatar:"adam",
   version:VERSION,
   updatedAt:typeof parsed?.updatedAt==="string"?parsed.updatedAt:null
  };
 }catch{return {...DEFAULT}}
}
let state=read();
const listeners=new Set();
function emit(name,detail){window.dispatchEvent(new CustomEvent(name,{detail}))}
function persist(){
 state={...state,version:VERSION,updatedAt:new Date().toISOString()};
 try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}
}
function notify(source){
 const snapshot={...state};
 listeners.forEach(fn=>{try{fn(snapshot)}catch{}});
 emit("gei:identity-updated",{...snapshot,source:source||"identity-engine"});
}
function setIdentity(patch,source){
 const next={...state};
 if(Object.prototype.hasOwnProperty.call(patch||{},"damName")){
  const name=cleanName(patch.damName);
  if(name&&!validName(name))return false;
  next.damName=name;
 }
 if(Object.prototype.hasOwnProperty.call(patch||{},"avatar")){
  if(!AVATARS[patch.avatar])return false;
  next.avatar=patch.avatar;
 }
 state=next;persist();notify(source);return true;
}
function subscribe(fn){if(typeof fn!=="function")return()=>{};listeners.add(fn);return()=>listeners.delete(fn)}
function getState(){return {...state}}
function getDamName(){return state.damName}
function getAvatar(){return state.avatar}
function hasIdentity(){return validName(state.damName)}
function getAvatarDefinition(id=state.avatar){return AVATARS[id]||AVATARS.adam}
function avatarMarkup({className="gei-identity-avatar",alt=""}={}){
 const a=getAvatarDefinition();
 if(a.image&&window.GEI_MASCOT?.url)return '<img class="'+className+'" src="'+window.GEI_MASCOT.url+'" alt="'+(alt||"Adam, the YallToo mascot")+'" />';
 return '<span class="'+className+'" aria-hidden="true">'+a.icon+"</span>";
}
window.GEI_IDENTITY=Object.freeze({
 version:VERSION,
 storageKey:KEY,
 avatars:AVATARS,
 getState,
 getDamName,
 getAvatar,
 getAvatarDefinition,
 hasIdentity,
 setDamName:(name,source)=>setIdentity({damName:name},source||"setDamName"),
 setAvatar:(avatar,source)=>setIdentity({avatar},source||"setAvatar"),
 setIdentity,
 subscribe,
 avatarMarkup
});
emit("gei:learner-identity-ready",{...state,source:"v1-54-engine"});
emit("gei:identity-engine-ready",{version:VERSION,state:{...state}});
})();