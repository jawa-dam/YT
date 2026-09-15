(() => {
  "use strict";
  function load(){
    if(!document.querySelector('link[data-gei-v132-celebration]')){
      const css=document.createElement('link');css.rel='stylesheet';css.href='adam-mastery-celebration.css';css.dataset.geiV132Celebration='true';document.head.appendChild(css);
    }
    if(!document.querySelector('script[data-gei-v132-celebration]')){
      const s=document.createElement('script');s.src='adam-mastery-celebration.js';s.defer=true;s.dataset.geiV132Celebration='true';document.head.appendChild(s);
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();
})();