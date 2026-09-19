/* V1.49 — Academy Interaction Polish & Vault Integrity */
(()=>{"use strict";
if(window.GEI_V149)return;
const QUICK=".gei-quick-button",VAULT=".v1-45-vault-item";
let lastQuick=0,lastVault=0;
const pulse=(el,className,ms)=>{if(!el)return;el.classList.remove(className);void el.offsetWidth;el.classList.add(className);window.setTimeout(()=>el.classList.remove(className),ms)};
const onClick=(event)=>{
  const quick=event.target.closest?.(QUICK);
  if(quick){
    const now=performance.now();if(now-lastQuick>90){lastQuick=now;pulse(quick,"is-sonic-active",560);window.dispatchEvent(new CustomEvent("gei:quick-access-activated",{detail:{id:quick.dataset.geiPopout||null}}));}
    return;
  }
  const vault=event.target.closest?.(VAULT);
  if(vault){
    const now=performance.now();if(now-lastVault>90){lastVault=now;pulse(vault,"is-vault-tapped",620);}
  }
};
document.addEventListener("click",onClick,{capture:true});
window.GEI_V149=Object.freeze({pulseQuick:(el)=>pulse(el,"is-sonic-active",560),pulseVault:(el)=>pulse(el,"is-vault-tapped",620)});
})();