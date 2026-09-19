/* V1.53.1 — GEI Member Identity Display powered by V1.54 */
(()=>{"use strict";
const render=()=>{const output=document.getElementById("member-since"),copy=output?.closest(".member-status-copy"),api=window.GEI_IDENTITY;if(!output||!copy||!api)return;const name=api.getDamName(),heading=copy.querySelector("strong");if(heading)heading.textContent=name?"GEI MEMBER • @"+name:"GEI MEMBER";if(output.dataset.memberBase)output.textContent=output.dataset.memberBase+(name?" • @"+name:"")};
function init(){const output=document.getElementById("member-since");if(!output)return;output.dataset.memberBase=output.textContent;render();window.addEventListener("gei:identity-updated",render);window.addEventListener("gei:learner-identity-ready",render)}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();