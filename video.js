(() => {
  'use strict';

  const root = document.getElementById('video-root');
  if (!root) return;

  const VIDEO_ADAM_URL = 'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/yalltoo-beaver-p8oCrzuwdz7fwcXd.png';

  const videos = [
    { title: 'Genesis Engineered Interpretations', meta: 'GEI • Featured', description: 'A guided media space for exploring the GEI framework.' },
    { title: 'Water & Engineering', meta: 'GEI • Lesson Media', description: 'Visual learning resources connecting water systems and engineering ideas.' },
    { title: 'Genesis Day One', meta: 'GEI • Academy', description: 'Prepare for the Day 1 learning experience with visual media.' }
  ];

  const tracks = [
    { title:'The Master\'s Build', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_maker_s_blueprint-pQPS2KhHLu40bkMw.mp3', group:'BLUEPRINT' },
    { title:'Scooped From Red Clay', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/scooped_from_red_clay-cp5MYH0Sn0PTPcl4.mp3', group:'RED CLAY' },
    { title:'Adam the Dam (Remix)', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-2-40oMmbqZQpFB6AXR.mp3', group:'THE DAM' },
    { title:'Red Clay Schematics', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/red_clay_schematics-4cizONYTebzvCu8s.mp3', group:'RED CLAY' },
    { title:'Rich Red Clay', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/rich_red_clay-hOrQng2IaF9xegoy.mp3', group:'RED CLAY' },
    { title:'Heaven\'s Heavy Wall', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/heaven_s_heavy_wall-rej0aEWKHvqZUHMI.mp3', group:'THE WALL' },
    { title:'The Mighty Design', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_mighty_design-5IpqSpR8yDBNMT1h.mp3', group:'BLUEPRINT' },
    { title:'Dam Components', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/dam_component-YRC46yLMxZvvLBiN.mp3', group:'THE DAM' },
    { title:'Heaven Built', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/heaven_built-11ywTE4EpE0TP85E.mp3', group:'THE WALL' },
    { title:'Divide the Tide', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/divide_the_tide-1ZT1DJb3dA5PeI64.mp3', group:'THE DEEP' },
    { title:'Adam the Dam', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/adam_the_dam-rEp4qpBtaVYxzO3s.mp3', group:'THE DAM' },
    { title:'The Adam Component', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_adam_component-0ncw0TU5WcU8hxLa.mp3', group:'THE DAM' },
    { title:'The Timber Frame', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_timber_frame-fsJnbCT2l8zHEGZs.mp3', group:'THE WALL' },
    { title:'Nature\'s Hydraulic Law', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/nature_s_hydraulic_law-rHm0eT4hBWs93wfb.mp3', group:'THE DEEP' },
    { title:'Semantic Clay', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/semantic_clay-xVfpWRFar6RgjOaz.mp3', group:'RED CLAY' },
    { title:'The Blueprint\'s Spine', src:'https://assets.zyrosite.com/YZ9jg46Bljs5wOZR/the_blueprint_s_spine-xQkDRN2IubPJdyne.mp3', group:'BLUEPRINT' }
  ];

  root.innerHTML = `
    <div class="video-lab">
      <header class="video-header">
        <div><span class="video-eyebrow">GENESIS ENGINEERED INTERPRETATIONS</span><h1>Video Lab</h1><p>Explore GEI through visual learning, guided media, and sound.</p></div>
        <div class="video-logo" aria-label="G.E.I. logo">G.E.I.</div>
      </header>
      <button class="video-adam-guide" id="video-adam-open" type="button" aria-label="Open Adam Video Lab guide" aria-controls="video-adam-modal">
        <span class="video-adam-ring" aria-hidden="true"></span>
        <img src="${VIDEO_ADAM_URL}" alt="Adam, the YallToo Video Lab mascot" class="video-adam-image">
        <span class="video-adam-copy"><small>ADAM • VIDEO GUIDE</small><strong>Tap Adam for help</strong></span>
      </button>
      <article class="video-feature">
        <div class="video-feature-art" aria-hidden="true"><span>GEI</span></div>
        <div class="video-feature-copy"><span class="video-label">FEATURED MEDIA</span><h2>See the blueprint.</h2><p>Video lessons will become playable here as the media system expands.</p><button class="video-primary" type="button" disabled>Coming Soon <span>▶</span></button></div>
      </article>
      <section class="video-library" aria-labelledby="video-library-title">
        <div class="video-section-head"><h2 id="video-library-title">Media Library</h2><span>FOUNDATION</span></div>
        <div class="video-cards">${videos.map((item,index)=>`<article class="video-card"><div class="video-thumb" aria-hidden="true"><span>${String(index+1).padStart(2,'0')}</span><b>▶</b></div><div><span class="video-card-meta">${item.meta}</span><h3>${item.title}</h3><p>${item.description}</p></div></article>`).join('')}</div>
      </section>
      <button class="music-lab-entry" id="music-lab-open" type="button"><span><small>GEI MEDIA</small><strong>GEI Dam Music</strong></span><b>Open Lab ›</b></button>
    </div>

    <div class="video-adam-modal" id="video-adam-modal" hidden>
      <div class="video-adam-panel" role="dialog" aria-modal="true" aria-labelledby="video-adam-title">
        <button class="video-adam-close" id="video-adam-close" type="button" aria-label="Close Adam Video Lab guide">×</button>
        <div class="video-adam-hero"><img src="${VIDEO_ADAM_URL}" alt="Adam, the YallToo Video Lab mascot"></div>
        <span class="video-adam-kicker">ADAM • VIDEO GUIDE</span>
        <h2 id="video-adam-title">Welcome to the Video Lab.</h2>
        <p>Explore GEI through visual lessons, media experiments, and the sounds of the dam. Video lessons will unlock here as the library grows.</p>
        <button class="video-adam-action" id="video-adam-done" type="button">EXPLORE THE LAB →</button>
      </div>
    </div>

    <div class="music-lab-modal" id="music-lab-modal" hidden>
      <div class="music-lab-panel" role="dialog" aria-modal="true" aria-labelledby="music-lab-title">
        <div class="music-lab-head"><div><span>GEI ORIGINAL SOUNDTRACK</span><h2 id="music-lab-title">The GEI Dam</h2><p>Sound built around water, clay, walls, pressure &amp; blueprint.</p></div><button id="music-lab-close" aria-label="Close music lab">×</button></div>
        <div class="music-now"><div class="music-disc" aria-hidden="true">◉</div><div><small>NOW PLAYING</small><strong id="music-title">Select a track</strong><span id="music-group">THE GEI DAM</span></div></div>
        <audio id="gei-audio" preload="metadata" playsinline></audio>
        <div class="music-controls"><button id="music-prev" aria-label="Previous track">‹</button><button class="music-play" id="music-play" aria-label="Play">▶</button><button id="music-next" aria-label="Next track">›</button></div>
        <div class="music-progress"><span id="music-time">0:00</span><input id="music-seek" type="range" min="0" max="100" value="0" aria-label="Track progress"><span id="music-duration">0:00</span></div>
        <div class="music-filters" role="tablist" aria-label="Music groups"><button class="is-active" data-group="ALL">ALL</button><button data-group="THE DAM">THE DAM</button><button data-group="RED CLAY">RED CLAY</button><button data-group="THE WALL">THE WALL</button><button data-group="BLUEPRINT">BLUEPRINT</button><button data-group="THE DEEP">THE DEEP</button></div>
        <div class="music-tracklist" id="music-tracklist"></div>
      </div>
    </div>
  `;

  const adamModal=root.querySelector('#video-adam-modal');
  const adamOpen=root.querySelector('#video-adam-open');
  const adamClose=root.querySelector('#video-adam-close');
  const adamDone=root.querySelector('#video-adam-done');
  const musicModal=root.querySelector('#music-lab-modal');
  const audio=root.querySelector('#gei-audio');
  const title=root.querySelector('#music-title');
  const group=root.querySelector('#music-group');
  const play=root.querySelector('#music-play');
  const seek=root.querySelector('#music-seek');
  const time=root.querySelector('#music-time');
  const duration=root.querySelector('#music-duration');
  const list=root.querySelector('#music-tracklist');
  let current=0;
  let activeGroup='ALL';

  const fmt=(s)=>{if(!Number.isFinite(s))return '0:00';const m=Math.floor(s/60);return `${m}:${String(Math.floor(s%60)).padStart(2,'0')}`};
  const visible=()=>tracks.map((t,i)=>({...t,i})).filter(t=>activeGroup==='ALL'||t.group===activeGroup);

  function openAdam(){adamModal.hidden=false;document.body.classList.add('video-adam-open');adamClose.focus()}
  function closeAdam(){adamModal.hidden=true;document.body.classList.remove('video-adam-open');adamOpen.focus()}

  adamOpen.addEventListener('click',openAdam);
  adamClose.addEventListener('click',closeAdam);
  adamDone.addEventListener('click',closeAdam);
  adamModal.addEventListener('click',e=>{if(e.target===adamModal)closeAdam()});

  function render(){
    list.innerHTML=visible().map(t=>`<button class="music-track ${t.i===current?'is-current':''}" data-track="${t.i}"><span class="music-track-num">${String(t.i+1).padStart(2,'0')}</span><span><strong>${t.title}</strong><small>${t.group}</small></span><b>${t.i===current&&!audio.paused?'EQ':'▶'}</b></button>`).join('');
    list.querySelectorAll('[data-track]').forEach(btn=>btn.addEventListener('click',()=>load(Number(btn.dataset.track),true)));
  }

  function load(i,autoplay=false){
    current=(i+tracks.length)%tracks.length; const t=tracks[current]; audio.src=t.src; title.textContent=t.title; group.textContent=t.group; seek.value=0; render(); if(autoplay) audio.play().catch(()=>{}); updatePlay(); }
  function updatePlay(){play.textContent=audio.paused?'▶':'Ⅱ'; play.setAttribute('aria-label',audio.paused?'Play':'Pause'); render();}

  root.querySelector('#music-lab-open').addEventListener('click',()=>{musicModal.hidden=false;load(current,false);root.querySelector('#music-lab-close').focus()});
  root.querySelector('#music-lab-close').addEventListener('click',()=>{musicModal.hidden=true;audio.pause()});
  musicModal.addEventListener('click',e=>{if(e.target===musicModal){musicModal.hidden=true;audio.pause()}});
  root.querySelector('#music-play').addEventListener('click',()=>{if(!audio.src)load(current,false); audio.paused?audio.play().catch(()=>{}):audio.pause()});
  root.querySelector('#music-prev').addEventListener('click',()=>load(current-1,true));
  root.querySelector('#music-next').addEventListener('click',()=>load(current+1,true));
  audio.addEventListener('play',updatePlay); audio.addEventListener('pause',updatePlay); audio.addEventListener('ended',()=>load(current+1,true));
  audio.addEventListener('loadedmetadata',()=>duration.textContent=fmt(audio.duration));
  audio.addEventListener('timeupdate',()=>{time.textContent=fmt(audio.currentTime);seek.value=audio.duration?(audio.currentTime/audio.duration)*100:0});
  seek.addEventListener('input',()=>{if(audio.duration)audio.currentTime=(Number(seek.value)/100)*audio.duration});
  root.querySelectorAll('[data-group]').forEach(btn=>btn.addEventListener('click',()=>{activeGroup=btn.dataset.group;root.querySelectorAll('[data-group]').forEach(b=>b.classList.toggle('is-active',b===btn));render()}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!adamModal.hidden)closeAdam();if(!musicModal.hidden){musicModal.hidden=true;audio.pause()}}});
  render();
})();