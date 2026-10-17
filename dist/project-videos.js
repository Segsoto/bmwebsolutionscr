(() => {
 'use strict';
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const mobile=matchMedia('(max-width:760px)');
 const english=document.documentElement.lang==='en';
 const saveData=Boolean(navigator.connection?.saveData);
 const players=[];
 let clearanceFrame=0;
 const clearControls=()=>{
  if(clearanceFrame)return;
  clearanceFrame=requestAnimationFrame(()=>{
   clearanceFrame=0;
   const assistant=document.querySelector('.robot-concierge');if(!assistant)return;
   const robot=assistant.getBoundingClientRect();
   const overlaps=players.some(player=>{
    if(!player.visible)return false;
    const controls=player.shell.querySelector('.preview-controls').getBoundingClientRect();
    return controls.height>0&&controls.top<robot.bottom+8&&controls.bottom>robot.top-8&&controls.left<robot.right+8&&controls.right>robot.left-8;
   });
   document.body.classList.toggle('preview-controls-overlap',overlaps);
  });
 };
 const icon=playing=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${playing?'<path d="M8 5v14M16 5v14"/>':'<path d="m9 5 11 7-11 7z"/>'}</svg>`;
 const sync=player=>{
  const playing=!player.video.paused;
  player.button.querySelector('[data-play-icon]').innerHTML=icon(playing);
  player.button.querySelector('[data-play-label]').textContent=playing?(english?'Pause':'Pausar'):(english?'Play':'Reproducir');
  player.button.setAttribute('aria-label',playing?(english?'Pause video':'Pausar video'):(english?'Play video':'Reproducir video'));
 };
 const load=player=>{
  const source=player.video.dataset[player.device+'Src'];
  if(player.video.getAttribute('src')===source)return;
  player.video.src=source;player.video.load();
 };
 const update=player=>{
  const allowed=player.visible&&!document.hidden&&!player.userPaused&&(!preference.matches&&!saveData||player.userStarted);
  if(allowed){
   load(player);
   player.video.play().then(()=>sync(player)).catch(()=>sync(player));
  }else{player.video.pause();sync(player);}
 };
 const choose=(player,device)=>{
  player.device=device;
  player.shell.classList.toggle('is-mobile-preview',device==='mobile');
  player.video.poster=player.video.dataset[device+'Poster'];
  player.shell.querySelectorAll('[data-preview-device]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.previewDevice===device)));
  if(player.video.getAttribute('src'))load(player);
  update(player);
  clearControls();
 };
 document.querySelectorAll('[data-preview-shell]').forEach(shell=>{
  const video=shell.querySelector('[data-preview-video]'),button=shell.querySelector('[data-preview-play]');
  if(!video||!button)return;
  const player={shell,video,button,device:mobile.matches?'mobile':'desktop',visible:false,userPaused:false,userStarted:false,explicitDevice:false};
  players.push(player);video.muted=true;shell.classList.add('preview-ready');
  choose(player,player.device);
  button.addEventListener('click',()=>{
   if(!video.paused){player.userPaused=true;video.pause();sync(player);}
   else{player.userPaused=false;player.userStarted=true;player.visible=true;update(player);}
  });
  shell.querySelectorAll('[data-preview-device]').forEach(control=>control.addEventListener('click',()=>{player.explicitDevice=true;choose(player,control.dataset.previewDevice);}));
  video.addEventListener('play',()=>sync(player));video.addEventListener('pause',()=>sync(player));
  video.addEventListener('error',()=>{video.pause();sync(player);});
 });
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
   const player=players.find(item=>item.video===entry.target);
   player.visible=entry.isIntersecting&&entry.intersectionRatio>=.15;update(player);clearControls();
  }),{threshold:[0,.15]});
  players.forEach(player=>observer.observe(player.video));
 }
 document.addEventListener('visibilitychange',()=>players.forEach(update));
 window.addEventListener('scroll',clearControls,{passive:true});
 window.addEventListener('resize',clearControls,{passive:true});
 preference.addEventListener('change',()=>players.forEach(player=>{if(preference.matches)player.userStarted=false;update(player);}));
 mobile.addEventListener('change',()=>players.forEach(player=>{if(!player.explicitDevice)choose(player,mobile.matches?'mobile':'desktop');}));
})();
