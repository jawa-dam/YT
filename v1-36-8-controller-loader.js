/* V1.36.8 — Load the single authoritative Adam Assistant controller. */
(() => {
  "use strict";
  if (document.querySelector('script[data-gei-adam-controller="true"]')) return;
  const script = document.createElement("script");
  script.src = "adam-assistant-controller.js";
  script.defer = true;
  script.dataset.geiAdamController = "true";
  document.head.appendChild(script);
})();
