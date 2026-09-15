/* V1.17 — Compact Home Section Popouts */
(() => {
  "use strict";
  const CONFIG = [
    ["gei-profile-card", "👤", "LEARNER PROFILE", "Blueprint Identity"],
    ["gei-xp-card", "⭐", "XP INTELLIGENCE", "Learner Evolution"],
    ["gei-streak-card", "🎁", "LEARNING MOMENTUM", "0 Day Streak"],
    ["gei-achievement-card", "🏆", "STREAK ACHIEVEMENTS", "Learning Rewards"],
    ["gei-vault-card", "🔐", "LEARNER IDENTITY", "Achievement Vault"]
  ];
  const SELECTOR = CONFIG.map(([id]) => `#${id}`).join(",");
  function configFor(card){return CONFIG.find(([id])=>id===card.id);}
  function hideSource(card){card.hidden=true;card.style.setProperty("display","none","important");}
  function showSource(card){card.hidden=false;card.style.removeProperty("display");}
  function addIconButton(rail,cfg){
    const [id,icon,kicker,title]=cfg;
    if(rail.querySelector(`[data-gei-popout-target="${id}"]`))return;
    const button=document.createElement("button");
    button.type="button";button.className="gei-popout-icon-button";button.dataset.geiPopoutTarget=id;
    button.setAttribute("aria-label",`Open ${kicker}: ${title}`);button.title=`${kicker} — ${title}`;
    button.innerHTML=`<span aria-hidden="true">${icon}</span>`;rail.appendChild(button);
  }
  function ensureRail(){
    const home=document.getElementById("screen-home");
    const stack=home?.querySelector(".home-experience-stack")||home?.querySelector(".dashboard-main");
    if(!stack)return;
    let rail=home.querySelector("#gei-popout-rail");
    if(!rail){rail=document.createElement("div");rail.id="gei-popout-rail";rail.className="gei-popout-rail";rail.setAttribute("aria-label","GEI quick access");stack.insertBefore(rail,stack.firstChild);}
    document.querySelectorAll(SELECTOR).forEach(card=>{if(card.closest(".gei-popout-dialog"))return;const cfg=configFor(card);if(cfg){addIconButton(rail,cfg);hideSource(card);}});
  }
  function open(card,trigger){
    if(document.getElementById("gei-section-popout"))return;
    const home=document.getElementById("screen-home");if(!home)return;
    const backdrop=document.createElement("div");backdrop.className="gei-popout-backdrop";backdrop.id="gei-section-popout";
    const dialog=document.createElement("section");dialog.className="gei-popout-dialog";dialog.setAttribute("role","dialog");dialog.setAttribute("aria-modal","true");
    const content=document.createElement("div");content.className="gei-popout-content";
    const close=document.createElement("button");close.className="gei-popout-close";close.type="button";close.setAttribute("aria-label","Close section");close.textContent="×";
    dialog.append(close,content);backdrop.appendChild(dialog);home.appendChild(backdrop);showSource(card);content.appendChild(card);
    const cleanup=()=>{
      if(!backdrop.isConnected)return;
      const stack=home.querySelector(".home-experience-stack")||home.querySelector(".dashboard-main");
      if(stack)stack.appendChild(card);
      hideSource(card);backdrop.remove();ensureRail();if(trigger?.isConnected)trigger.focus();
    };
    close.addEventListener("click",cleanup);backdrop.addEventListener("click",event=>{if(event.target===backdrop)cleanup();});
    const escape=event=>{if(event.key==="Escape")cleanup();};document.addEventListener("keydown",escape,{once:true});close.focus();
  }
  function route(event){const trigger=event.target.closest?.("[data-gei-popout-target]");if(!trigger)return;const card=document.getElementById(trigger.dataset.geiPopoutTarget);if(!card)return;event.preventDefault();event.stopPropagation();open(card,trigger);}
  function init(){ensureRail();document.addEventListener("click",route,true);const home=document.getElementById("screen-home");if(home)new MutationObserver(ensureRail).observe(home,{childList:true,subtree:true});}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
