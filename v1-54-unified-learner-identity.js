/* V1.54 — GEI Unified Learner Identity Engine */
(()=>{"use strict";
if(window.GEI_IDENTITY)return;
const KEY="geiDamNameIdentityV1";
const VERSION="1.54";
const DEFAULT={damName:"",avatar:"adam",version:VERSION,updatedAt:null};
const AVATARS=Object.freeze({
 adam:{label:"Adam",image:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-mascot-animated-UgmkGIe3sJES4tKm.gif",alt:"Adam, the YallToo beaver mascot"},
 support:{label:"YallToo Support",image:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yall-too-support-xgGSevqqnPG0ltF3.png",alt:"YallToo Support"},
 damKids:{label:"Dam Kids",image:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/halloween-is-for-dam-kids-IzkcYSwHxZ6lUmQa.png",alt:"Halloween Is For Dam Kids"},
 facts:{label:"YallToo Facts",image:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-facts-cQxXmMvU0oaDhFPK.png",alt:"YallToo Facts"},
 wilbertYallToo:{label:"Wilbert Bouie Jr • GEI Y'allToo",image:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-y-all-too-WNMWb3MfHDWZOOZM.png",alt:"Wilbert Bouie Jr • GEI Y'allToo"},
 wilbertGEI:{label:"Wilbert Bouie Jr • GEI",image:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/wilbert-bouie-jr-gei-oWhYiGHWJRjLUSlW.png",alt:"Wilbert Bouie Jr • GEI"},
 bibleGuide:{label:"Read the Bible Like Wilbert",image:"https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/read-the-bible-like-wilbert-bouie-jr-VKE1Tnftzc8CWmjH.png",alt:"Read the Bible Like Wilbert Bouie Jr"}
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
 emit("gei:learner-identity-updated",{...snapshot,source:source||"identity-engine"});
 emit("gei:dam-name-updated",{damName:snapshot.damName,updatedAt:snapshot.updatedAt,source:source||"identity-engine"});
 emit("gei:dam-avatar-updated",{avatar:snapshot.avatar,source:source||"identity-engine"});
}
function setIdentity(patch,source){
 const next={...state};
 if(Object.prototype.hasOwnProperty.call(patch||{},"damName")){
  const name=cleanName(patch.damName);
  if(!validName(name))return false;
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
 if(a.image)return '<img class="'+className+'" src="'+a.image+'" alt="'+(alt||a.alt||a.label)+'" loading="eager" decoding="async" />';
 return '<span class="'+className+'" aria-hidden="true"></span>';
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