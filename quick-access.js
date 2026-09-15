/* V1.20 — GEI Quick Access & Pop-Out Intelligence */
(() => {
  "use strict";
  const CONFIG = [
    ["gei-profile-card", "👤", "PROFILE", "LEARNER PROFILE", "Blueprint Identity"],
    ["gei-xp-card", "⭐", "XP", "XP INTELLIGENCE", "Learner Evolution"],
    ["gei-streak-card", "🎁", "MOMENTUM", "LEARNING MOMENTUM", "0 Day Streak"],
    ["gei-achievement-card", "🏆", "REWARDS", "STREAK ACHIEVEMENTS", "Learning Rewards"],
    ["gei-vault-card", "🔐", "VAULT", "LEARNER IDENTITY", "Achievement Vault"]
  ];
  function home(){return document.getElementById("screen-home");}
  function stack(){const h=home();return h?.querySelector(".home-experience-stack")||h?.querySelector(".dashboard-main");}
  function find(id){return document.getElementById(id);}
  function hide(card){card.hidden=true;card.setAttribute("aria-hidden","true");card.style.setProperty("display","none","important");}
  function show(card){card.hidden=false;card.removeAttribute("aria-hidden");card.style.removeProperty("display");}
  function rail(){
    const h=home(),s=stack();if(!h||!s)return;
    let r=h.querySelector("#gei-quick-access");
    if(!r){r=document.createElement("div");r.id="gei-quick-access";r.setAttribute("role","toolbar");r.setAttribute("aria-label","GEI quick access");s.insertBefore(r,s.firstChild);}
    CONFIG.forEach(([id,icon,label])=>{if(r.querySelector(`[data-gei-popout="${id}"]`))return;const b=document.createElement("button");b.type="button";b.className="gei-quick-button";b.dataset.geiPopout=id;b.setAttribute("aria-label",`Open ${label}`);b.innerHTML=`<span class="gei-quick-icon" aria-hidden="true">${icon}</span><span class="gei-quick-label">${label}</span>`;r.appendChild(b);});
    CONFIG.forEach(([id])=>{const c=find(id);if(c&&!c.closest(".gei-popout-backdrop"))hide(c);});
  }
  function close(trigger){
    const backdrop=document.querySelector(".gei-popout-backdrop"),content=backdrop?.querySelector(".gei-popout-content"),card=content?.querySelector("section[id^=gei-]");if(!backdrop||!card)return;
    const s=stack();if(s){show(card);s.appendChild(card);}backdrop.remove();rail();trigger?.focus();
  }
  function open(id,trigger){
    if(document.querySelector(".gei-popout-backdrop"))close();
    const card=find(id),h=home();if(!card||!h)return;
    const item=CONFIG.find(x=>x[0]===id);if(!item)return;
    const backdrop=document.createElement("div");backdrop.className="gei-popout-backdrop";
    const dialog=document.createElement("section");dialog.className="gei-popout-dialog";dialog.setAttribute("role","dialog");dialog.setAttribute("aria-modal","true");dialog.setAttribute("aria-labelledby","gei-popout-title");
    const closeButton=document.createElement("button");closeButton.type="button";closeButton.className="gei-popout-close";closeButton.setAttribute("aria-label","Close pop-out");closeButton.textContent="×";
    const content=document.createElement("div");content.className="gei-popout-content";
    const header=document.createElement("div");header.className="gei-popout-header";header.innerHTML=`<span class="gei-popout-icon" aria-hidden="true">${item[1]}</span><span class="gei-popout-kicker">${item[3]}</span><h2 id="gei-popout-title">${item[3]}</h2><span class="gei-popout-subtitle">${item[4]}</span>`;
    show(card);content.append(header,card);dialog.append(closeButton,content);backdrop.appendChild(dialog);h.appendChild(backdrop);
    const previous=document.activeElement;
    const cleanup=()=>{document.removeEventListener("keydown",onKey);close(previous?.isConnected?previous:null);};
    const onKey=e=>{if(e.key==="Escape"){e.preventDefault();cleanup();}};
    closeButton.addEventListener("click",cleanup);backdrop.addEventListener("click",e=>{if(e.target===backdrop)cleanup();});document.addEventListener("keydown",onKey);closeButton.focus();
  }
  function route(e){const b=e.target.closest?.("[data-gei-popout]");if(!b)return;e.preventDefault();e.stopPropagation();open(b.dataset.geiPopout,b);}
  function init(){
    if(document.querySelector('link[data-gei-quick-access-css]'))return;
    const link=document.createElement("link");link.rel="stylesheet";link.href="quick-access.css";link.dataset.geiQuickAccessCss="true";document.head.appendChild(link);
    rail();document.addEventListener("click",route,true);
    const h=home();if(h)new MutationObserver(()=>{if(!document.querySelector(".gei-popout-backdrop"))rail();}).observe(h,{childList:true,subtree:true});
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
