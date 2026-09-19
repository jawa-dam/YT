/* V1.53 — GEI Member Identity Display */
(()=>{"use strict";
const KEY="geiDamNameIdentityV1";
function read(){try{const p=JSON.parse(localStorage.getItem(KEY)||"null");return typeof p?.damName==="string"?p.damName.trim():""}catch{return""}}
function render(){
 const output=document.getElementById("member-since"),copy=output?.closest(".member-status-copy");if(!output||!copy)return;
 const name=read(),heading=copy.querySelector("strong");
 if(heading)heading.textContent=name?"GEI MEMBER • @"+name:"GEI MEMBER";
 if(output.dataset.memberBase)output.textContent=output.dataset.memberBase+(name?" • @"+name:"");
}
function init(){
 const output=document.getElementById("member-since");if(!output)return;
 output.dataset.memberBase=output.textContent;
 render();
 window.addEventListener("gei:dam-name-updated",render);
 window.addEventListener("gei:learner-identity-ready",render);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();