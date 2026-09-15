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
  const SELECTOR = CONFIG.map(([id]) => `#${id}`).join(",");
  let observer;
  function getHome(){return document.getElementById("screen-home");}
  function getStack(){const h=getHome();return h?.querySelector(".home-experience-stack")||h?.querySelector(".dashboard-main");}
  function cfg(id){return CONFIG.find(item=>item[0]===id);}
  function hide(card){card.hidden=true;card.setAttribute("aria-hidden","true");card.style.setProperty("display","none","important");}
  function show(card){card.hidden=false;card.removeAttribute("aria-hidden");card.style.removeProperty("display");}
  function buildRail(){
    const home=getHome(),stack=getStack();if(!home||!stack)return;
    let rail=home.querySelector("#gei-quick-access");
    if(!rail){rail=document.createElement("div");rail.id="gei-quick-access";rail.setAttribute("role","toolbar");rail.setAttribute("aria-label","GEI quick access");stack.insertBefore(rail,stack.firstChild);}
    CONFIG.forEach(([id,icon,label])=>{if(!rail.querySelector(`[data-gei-popout="${id}"]`)){const b=document.createElement("button");b.type="button";b.className="gei-quick-button";b.dataset.geiPopout=id;b.setAttribute("aria-label",`Open ${label}`);b.innerHTML=`<span class="gei-quick-icon" aria-hidden="true">${icon}</span><span class="gei-quick-label">${label}</span>`;rail.appendChild(b);}});
    document.querySelectorAll(SELECTOR).forEach(card=>{if(!card.closest(".gei-popout-backdrop"))hide(card);});
  }
  function close(trigger){
    const backdrop=document.querySelector(".gei-popout-backdrop"),card=backdrop?.querySelector(SELECTOR);if(!backdrop||!card)return;
    const stack=getStack();if(stack){show(card);stack.appendChild(card);}backdrop.remove();buildRail();trigger?.focus();
  }
  function open(id,trigger){
    const existing=document.querySelector(".gei-popout-backdrop");if(existing)close();
    const card=document.getElementById(id),home=getHome();if(!card||!home)return;
    const backdrop=document.createElement("div");backdrop.className="gei-popout-backdrop";backdrop.setAttribute("role","presentation");
    const dialog=document.createElement("section");dialog.className="gei-popout-dialog";dialog.setAttribute("role","dialog");dialog.setAttribute("aria-modal","true");dialog.setAttribute("aria-labelledby","gei-popout-title");
    const closeButton=document.createElement("button");closeButton.type="button";closeButton.className="gei-popout-close";closeButton.setAttribute("aria-label","Close pop-out");closeButton.textContent="×";
    const content=document.createElement("div");content.className="gei-popout-content";
    const [,,label,title,subtitle]=cfg(id);const header=document.createElement("div");header.className="gei-popout-header";header.innerHTML=`<span class="gei-popout-icon" aria-hidden="true">${cfg(id)[1]}</span><span class="gei-popout-kicker">${label}</span><h2 id="gei-popout-title">${title}</h2><span class="gei-popout-subtitle">${subtitle}</span>`;
    show(card);content.append(header,card);dialog.append(closeButton,content);backdrop.appendChild(dialog);home.appendChild(backdrop);
    const previous=document.activeElement;
    const cleanup=()=>{close(previous?.isConnected?previous:null);document.removeEventListener("keydown",onKey);};
    const onKey=e=>{if(e.key==="Escape"){e.preventDefault();cleanup();}else if(e.key==="Tab"){const focusables=dialog.querySelectorAll("button,a,input,select,textarea,[tabindex]:not([tabindex=\"-1\"])");if(focusables.length){const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}};
    closeButton.addEventListener("click",cleanup);backdrop.addEventListener("click",e=>{if(e.target===backdrop)cleanup();});document.addEventListener("keydown",onKey);closeButton.focus();
  }
  function route(e){const b=e.target.closest?.("[data-gei-popout]");if(!b)return;e.preventDefault();e.stopPropagation();open(b.dataset.geiPopout,b);}
  function init(){
    if(document.querySelector('link[data-gei-quick-access-css]'))return;
    const link=document.createElement("link");link.rel="stylesheet";link.href="quick-access.css";link.dataset.geiQuickAccessCss="true";document.head.appendChild(link);
    buildRail();document.addEventListener("click",route,true);
    const home=getHome();if(home){observer=new MutationObserver(()=>{if(!document.querySelector(".gei-popout-backdrop"))buildRail();});observer.observe(home,{childList:true,subtree:true});}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
