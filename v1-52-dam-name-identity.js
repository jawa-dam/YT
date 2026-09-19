/* V1.52 — GEI Dam Name & Learner Identity */
(()=>{"use strict";
if(window.GEI_V152)return;
const KEY="geiDamNameIdentityV1";
const DEFAULT={damName:"",version:"1.52",updatedAt:null};
const clean=v=>String(v??"").trim().replace(/^@+/,"").replace(/[^A-Za-z0-9_-]/g,"").slice(0,20);
const load=()=>{try{const p=JSON.parse(localStorage.getItem(KEY)||"null");return{...DEFAULT,...p,damName:clean(p?.damName),updatedAt:typeof p?.updatedAt==="string"?p.updatedAt:null}}catch{return{...DEFAULT}}};
let state=load();
const save=()=>{state.updatedAt=new Date().toISOString();try{localStorage.setItem(KEY,JSON.stringify(state))}catch{}};
const emit=(name,detail)=>window.dispatchEvent(new CustomEvent(name,{detail}));
function ensure(){
 const card=document.getElementById("gei-profile-card"),identity=card?.querySelector(".gei-profile-identity");
 if(!card||!identity||card.querySelector(".v1-52-dam-name"))return;
 const box=document.createElement("div");box.className="v1-52-dam-name";
 box.innerHTML='<div class="v1-52-dam-name-head"><div><span class="v1-52-label">DAM NAME</span><strong class="v1-52-value" id="v1-52-dam-name-value"></strong></div><button type="button" class="v1-52-edit" id="v1-52-edit">EDIT</button></div><div class="v1-52-editor" id="v1-52-editor" hidden><label for="v1-52-input">Choose your Dam Name</label><div class="v1-52-input-row"><span>@</span><input id="v1-52-input" type="text" inputmode="text" autocomplete="nickname" maxlength="20" spellcheck="false" placeholder="WaterArchitect" aria-describedby="v1-52-help"/><button type="button" id="v1-52-save">SAVE</button></div><small id="v1-52-help">3–20 characters: letters, numbers, _ or -.</small><div class="v1-52-error" id="v1-52-error" role="alert" hidden></div></div>';
 card.querySelector(".gei-profile-progress")?.before(box);
}
function render(){
 ensure();const box=document.querySelector(".v1-52-dam-name");if(!box)return;
 const value=box.querySelector("#v1-52-dam-name-value"),edit=box.querySelector("#v1-52-edit"),input=box.querySelector("#v1-52-input");
 value.textContent=state.damName?"@"+state.damName:"SET YOUR DAM NAME";
 value.classList.toggle("is-empty",!state.damName);
 edit.textContent=state.damName?"EDIT":"SET NAME";
 if(input&&!box.querySelector(".v1-52-editor:not([hidden])"))input.value=state.damName;
}
function editor(open=true){
 const box=document.querySelector(".v1-52-dam-name"),ed=box?.querySelector("#v1-52-editor"),input=box?.querySelector("#v1-52-input"),err=box?.querySelector("#v1-52-error");
 if(!box||!ed)return;
 ed.hidden=!open;err.hidden=true;err.textContent="";
 if(open){input.value=state.damName;requestAnimationFrame(()=>input.focus())}
}
function submit(){
 const box=document.querySelector(".v1-52-dam-name"),input=box?.querySelector("#v1-52-input"),err=box?.querySelector("#v1-52-error");if(!input)return;
 const raw=input.value.trim().replace(/^@+/,""),name=clean(raw);
 if(name.length<3){err.textContent="Dam Name must be at least 3 characters.";err.hidden=false;return}
 if(name!==raw){err.textContent="Use only letters, numbers, _ or -.";err.hidden=false;return}
 state={...state,damName:name};save();render();editor(false);emit("gei:dam-name-updated",{damName:name,updatedAt:state.updatedAt});emit("gei:learner-identity-updated",{damName:name});
}
function init(){
 render();
 document.addEventListener("click",e=>{
  const edit=e.target.closest?.("#v1-52-edit"),saveBtn=e.target.closest?.("#v1-52-save");
  if(edit){e.preventDefault();editor(true)}
  if(saveBtn){e.preventDefault();submit()}
 },true);
 document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target?.id==="v1-52-input"){e.preventDefault();submit()}if(e.key==="Escape"&&e.target?.id==="v1-52-input")editor(false)});
 ["gei:profile-ready","gei:profile-updated","gei:progress-ready","gei:achievement-earned","gei:navigation"].forEach(n=>window.addEventListener(n,render));
 window.GEI_V152=Object.freeze({version:"1.52",getIdentity:()=>({...state}),setDamName:name=>{const v=clean(name);if(v.length<3)return false;state={...state,damName:v};save();render();emit("gei:dam-name-updated",{damName:v,updatedAt:state.updatedAt});return true},edit:()=>editor(true)});
 emit("gei:learner-identity-ready",{damName:state.damName||null});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();