/* V1.52.1 — GEI Dam Name, Avatar & Learner Identity refinement */
(()=>{"use strict";
if(window.GEI_V1521)return;
const KEY="geiDamNameIdentityV1";
const DEFAULT={damName:"",avatar:"adam",version:"1.52",updatedAt:null};
const AVATARS={adam:{label:"Adam",icon:"",image:true},water:{label:"Water",icon:"💧"},mountain:{label:"Mountain",icon:"⛰️"},dam:{label:"Dam",icon:"🧱"},wheel:{label:"Waterwheel",icon:"⚙️"},gate:{label:"Sluice Gate",icon:"🚪"},current:{label:"Water Current",icon:"🌊"}};
const clean=v=>String(v??"").trim().replace(/^@+/,"").replace(/[^A-Za-z0-9_-]/g,"").slice(0,20);
const load=()=>{try{const p=JSON.parse(localStorage.getItem(KEY)||"null");return{...DEFAULT,...p,damName:clean(p?.damName),avatar:AVATARS[p?.avatar]?p.avatar:"adam",updatedAt:typeof p?.updatedAt==="string"?p.updatedAt:null}}catch{return{...DEFAULT}}};
let state=load();
const save=()=>{state.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const emit=(name,detail)=>window.dispatchEvent(new CustomEvent(name,{detail}));
const avatarMarkup=()=>{const a=AVATARS[state.avatar]||AVATARS.adam;if(a.image){const src=window.GEI_MASCOT?.url||"";return src?'<img class="v1-52-avatar-image" src="'+src+'" alt="Adam, the YallToo mascot" />':'<span class="v1-52-avatar-icon">🦫</span>'}return'<span class="v1-52-avatar-icon" aria-hidden="true">'+a.icon+"</span>"};
function ensure(){
 const card=document.getElementById("gei-profile-card"),identity=card?.querySelector(".gei-profile-identity");
 if(!card||!identity||card.querySelector(".v1-52-identity"))return;
 identity.classList.add("v1-52-identity");
 identity.innerHTML='<button type="button" class="v1-52-avatar" id="v1-52-avatar" aria-label="Choose your Dam avatar">'+avatarMarkup()+'</button><div class="v1-52-identity-copy"><span class="v1-52-label">DAM NAME</span><strong class="v1-52-name">'+(state.damName?"@"+state.damName:"SET YOUR DAM NAME")+'</strong><span class="v1-52-since" id="v1-52-identity-since"></span></div><button type="button" class="v1-52-edit" id="v1-52-edit">'+(state.damName?"EDIT":"SET NAME")+"</button>";
 const box=document.createElement("div");box.className="v1-52-editor-wrap";
 box.innerHTML='<div class="v1-52-editor" id="v1-52-editor" hidden><label for="v1-52-input">Choose your Dam Name</label><div class="v1-52-input-row"><span>@</span><input id="v1-52-input" type="text" inputmode="text" autocomplete="nickname" maxlength="20" spellcheck="false" placeholder="WaterArchitect" aria-describedby="v1-52-help"/><button type="button" id="v1-52-save">SAVE</button></div><small id="v1-52-help">3–20 characters: letters, numbers, _ or -.</small><div class="v1-52-error" id="v1-52-error" role="alert" hidden></div></div><div class="v1-52-avatar-picker" id="v1-52-avatar-picker" hidden><span class="v1-52-picker-label">CHOOSE DAM AVATAR</span><div class="v1-52-avatar-options"></div></div>';
 identity.after(box);
 renderAvatarOptions();
}
function renderAvatarOptions(){const wrap=document.querySelector(".v1-52-avatar-options");if(!wrap)return;wrap.innerHTML=Object.entries(AVATARS).map(([id,a])=>'<button type="button" class="v1-52-avatar-option'+(state.avatar===id?" is-selected":"")+'" data-v1-52-avatar="'+id+'" aria-label="'+a.label+'" title="'+a.label+'">'+(a.image?'<img src="'+(window.GEI_MASCOT?.url||"")+'" alt="" />':'<span>'+a.icon+"</span>")+'<small>'+a.label+"</small></button>").join("")}
function render(){
 ensure();const identity=document.querySelector("#gei-profile-card .v1-52-identity");if(!identity)return;
 identity.querySelector(".v1-52-name").textContent=state.damName?"@"+state.damName:"SET YOUR DAM NAME";
 identity.querySelector(".v1-52-name").classList.toggle("is-empty",!state.damName);
 identity.querySelector("#v1-52-edit").textContent=state.damName?"EDIT":"SET NAME";
 identity.querySelector("#v1-52-avatar").innerHTML=avatarMarkup();
 renderAvatarOptions();
 let created=null;try{created=JSON.parse(localStorage.getItem("geiAcademyLearnerProfileV1")||"null")?.createdAt}catch{}
 identity.querySelector("#v1-52-identity-since").textContent=created?"Learner since "+new Date(created).toLocaleDateString(undefined,{month:"short",year:"numeric"}):"Build your learner identity";
}
function toggleEditor(open){const ed=document.querySelector("#v1-52-editor"),picker=document.querySelector("#v1-52-avatar-picker"),input=document.querySelector("#v1-52-input"),err=document.querySelector("#v1-52-error");if(!ed)return;ed.hidden=!open;picker.hidden=!open;if(err){err.hidden=true;err.textContent=""}if(open){input.value=state.damName;requestAnimationFrame(()=>input.focus())}}
function chooseAvatar(id){if(!AVATARS[id])return;state={...state,avatar:id};save();render();emit("gei:dam-avatar-updated",{avatar:id,avatarLabel:AVATARS[id].label})}
function submit(){const input=document.querySelector("#v1-52-input"),err=document.querySelector("#v1-52-error");if(!input)return;const raw=input.value.trim().replace(/^@+/,""),name=clean(raw);if(name.length<3){err.textContent="Dam Name must be at least 3 characters.";err.hidden=false;return}if(name!==raw){err.textContent="Use only letters, numbers, _ or -.";err.hidden=false;return}state={...state,damName:name};save();render();toggleEditor(false);emit("gei:dam-name-updated",{damName:name,updatedAt:state.updatedAt});emit("gei:learner-identity-updated",{damName:name,avatar:state.avatar})}
function init(){
 render();
 document.addEventListener("click",e=>{const edit=e.target.closest?.("#v1-52-edit"),saveBtn=e.target.closest?.("#v1-52-save"),avatar=e.target.closest?.("#v1-52-avatar"),option=e.target.closest?.("[data-v1-52-avatar]");if(edit){e.preventDefault();toggleEditor(true)}if(saveBtn){e.preventDefault();submit()}if(avatar){e.preventDefault();const p=document.querySelector("#v1-52-avatar-picker");if(p)p.hidden=!p.hidden}if(option){e.preventDefault();chooseAvatar(option.dataset.v1_52Avatar)}},true);
 document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target?.id==="v1-52-input"){e.preventDefault();submit()}if(e.key==="Escape"&&e.target?.id==="v1-52-input")toggleEditor(false)});
 ["gei:profile-ready","gei:profile-updated","gei:progress-ready","gei:achievement-earned","gei:navigation","gei:dam-name-updated","gei:dam-avatar-updated"].forEach(n=>window.addEventListener(n,render));
 window.GEI_V1521=Object.freeze({version:"1.52.1",getIdentity:()=>({...state}),setDamName:name=>{const v=clean(name);if(v.length<3)return false;state={...state,damName:v};save();render();emit("gei:dam-name-updated",{damName:v});return true},setAvatar:id=>{if(!AVATARS[id])return false;state={...state,avatar:id};save();render();emit("gei:dam-avatar-updated",{avatar:id});return true}});
 emit("gei:learner-identity-ready",{damName:state.damName||null,avatar:state.avatar});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();