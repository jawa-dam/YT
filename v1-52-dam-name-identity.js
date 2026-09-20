/* V1.52.2 — GEI Dam Name & Avatar UI powered by V1.54 */
(()=>{"use strict";
if(window.GEI_V1521)return;
const identity=()=>window.GEI_IDENTITY;
function avatarMarkup(){return identity()?.avatarMarkup({className:"v1-52-avatar-image",alt:"Adam, the YallToo mascot"})||'<span class="v1-52-avatar-icon">🦫</span>'}
function ensure(){
 const card=document.getElementById("gei-profile-card"),identityCard=card?.querySelector(".gei-profile-identity");
 if(!card||!identityCard||card.querySelector(".v1-52-identity"))return;
 identityCard.classList.add("v1-52-identity");
 identityCard.innerHTML='<button type="button" class="v1-52-avatar" id="v1-52-avatar" aria-label="Choose your Dam avatar">'+avatarMarkup()+'</button><div class="v1-52-identity-copy"><span class="v1-52-label">DAM NAME</span><strong class="v1-52-name"></strong><span class="v1-52-since" id="v1-52-identity-since"></span></div><button type="button" class="v1-52-edit" id="v1-52-edit"></button>';
 const box=document.createElement("div");box.className="v1-52-editor-wrap";
 box.innerHTML='<div class="v1-52-editor" id="v1-52-editor" hidden><label for="v1-52-input">Choose your Dam Name</label><div class="v1-52-input-row"><span>@</span><input id="v1-52-input" type="text" inputmode="text" autocomplete="nickname" maxlength="20" spellcheck="false" placeholder="WaterArchitect" aria-describedby="v1-52-help"/><button type="button" id="v1-52-save">SAVE</button></div><small id="v1-52-help">3–20 characters: letters, numbers, _ or -.</small><div class="v1-52-error" id="v1-52-error" role="alert" hidden></div></div><div class="v1-52-avatar-picker" id="v1-52-avatar-picker" hidden><span class="v1-52-picker-label">CHOOSE DAM AVATAR</span><div class="v1-52-avatar-options"></div></div>';
 identityCard.after(box);renderAvatarOptions();
}
function renderAvatarOptions(){const wrap=document.querySelector(".v1-52-avatar-options"),api=identity();if(!wrap||!api)return;wrap.innerHTML=Object.entries(api.avatars).map(([id,a])=>'<button type="button" class="v1-52-avatar-option'+(api.getAvatar()===id?" is-selected":"")+'" data-v1-52-avatar="'+id+'" aria-label="'+a.label+'" title="'+a.label+'">'+(a.image?'<img src="'+a.image+'" alt="" loading="eager" decoding="async" />':'<span aria-hidden="true">'+(a.icon||"")+"</span>")+'<small>'+a.label+"</small></button>").join("")}
function render(){
 ensure();const card=document.getElementById("gei-profile-card"),identityCard=card?.querySelector(".v1-52-identity"),api=identity();if(!identityCard||!api)return;
 const name=identityCard.querySelector(".v1-52-name"),edit=identityCard.querySelector("#v1-52-edit"),avatar=identityCard.querySelector("#v1-52-avatar");
 name.textContent=api.getDamName()?"@"+api.getDamName():"SET YOUR DAM NAME";name.classList.toggle("is-empty",!api.hasIdentity());edit.textContent=api.hasIdentity()?"EDIT":"SET NAME";avatar.innerHTML=avatarMarkup();renderAvatarOptions();
 let created=null;try{created=JSON.parse(localStorage.getItem("geiAcademyLearnerProfileV1")||"null")?.createdAt}catch{}
 identityCard.querySelector("#v1-52-identity-since").textContent=created?"Learner since "+new Date(created).toLocaleDateString(undefined,{month:"short",year:"numeric"}):"Build your learner identity";
}
function toggleEditor(open){const ed=document.querySelector("#v1-52-editor"),picker=document.querySelector("#v1-52-avatar-picker"),input=document.querySelector("#v1-52-input"),err=document.querySelector("#v1-52-error");if(!ed)return;ed.hidden=!open;picker.hidden=!open;if(err){err.hidden=true;err.textContent=""}if(open){input.value=identity()?.getDamName()||"";requestAnimationFrame(()=>input.focus())}}
function chooseAvatar(id){const api=identity();if(!api?.setAvatar(id,"profile"))return;toggleEditor(true);render()}
function submit(){const input=document.querySelector("#v1-52-input"),err=document.querySelector("#v1-52-error"),api=identity();if(!input||!api)return;const raw=input.value.trim().replace(/^@+/,"");if(!api.setDamName(raw,"profile")){err.textContent=raw.length<3?"Dam Name must be at least 3 characters.":"Use 3–20 characters: letters, numbers, _ or -.";err.hidden=false;return}toggleEditor(false);render()}
function init(){
 render();
 document.addEventListener("click",e=>{const edit=e.target.closest?.("#v1-52-edit"),saveBtn=e.target.closest?.("#v1-52-save"),avatar=e.target.closest?.("#v1-52-avatar"),option=e.target.closest?.("[data-v1-52-avatar]");if(edit){e.preventDefault();toggleEditor(true)}if(saveBtn){e.preventDefault();submit()}if(avatar){e.preventDefault();const p=document.querySelector("#v1-52-avatar-picker");if(p)p.hidden=!p.hidden}if(option){e.preventDefault();chooseAvatar(option.getAttribute("data-v1-52-avatar"))}},true);
 document.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target?.id==="v1-52-input"){e.preventDefault();submit()}if(e.key==="Escape"&&e.target?.id==="v1-52-input")toggleEditor(false)});
 ["gei:profile-ready","gei:profile-updated","gei:progress-ready","gei:achievement-earned","gei:navigation","gei:identity-updated","gei:learner-identity-ready"].forEach(n=>window.addEventListener(n,render));
 window.GEI_V1521=Object.freeze({version:"1.52.2",getIdentity:()=>identity()?.getState?.()||{},setDamName:name=>identity()?.setDamName(name,"profile")||false,setAvatar:id=>identity()?.setAvatar(id,"profile")||false});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();