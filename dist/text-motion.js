(() => {
 'use strict';
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const paused = () => preference.matches || document.documentElement.dataset.motion === 'paused';
 const active = new Set();
 const targets = [...document.querySelectorAll('main h1,.section-head h2,.people-intro h2,.cta h2,.faq-layout h2,.hero-intro')];
 const animated = new WeakSet();
 const finish = () => { active.forEach(animation => animation.finish()); active.clear(); };
 const play = (element, frames, options) => {
  const animation = element.animate(frames, options);
  active.add(animation);
  animation.finished.then(() => active.delete(animation)).catch(() => active.delete(animation));
  return animation;
 };
 function reveal(heading) {
  if (animated.has(heading) || paused() || !Element.prototype.animate) return;
  animated.add(heading);
  const reader = document.createElement('span');
  reader.className = 'motion-reader';
  // textContent from the original nodes preserves accents and HTML entities.
  const copy = heading.cloneNode(true);
  copy.querySelectorAll('br').forEach(br => br.replaceWith(' '));
  reader.textContent = copy.textContent.replace(/\s+/g,' ').trim();
  const visual = document.createElement('span');
  visual.className = 'motion-visual';
  visual.setAttribute('aria-hidden','true');
  visual.append(...heading.childNodes);
  const walker = document.createTreeWalker(visual,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  const words=[];const letters=[];
  nodes.forEach(node => {
   const fragment=document.createDocumentFragment();
   node.textContent.split(/(\s+)/).forEach(value => {
    if (!value) return;
    if (/^\s+$/.test(value)) { fragment.append(document.createTextNode(value)); return; }
    const mask=document.createElement('span');mask.className='motion-mask';
    const word=document.createElement('span');word.className='motion-piece';
    if (node.parentElement.closest('em') && heading.matches('.hero h1')) {
     for(const character of Array.from(value)) {
      const letter=document.createElement('span');letter.className='motion-char';letter.textContent=character;
      word.append(letter);letters.push(letter);
     }
    } else word.textContent=value;
    mask.append(word);fragment.append(mask);words.push(word);
   });
   node.replaceWith(fragment);
  });
  heading.replaceChildren(reader,visual);
  heading.classList.add('text-composed');
  const isIntro=heading.matches('.hero-intro');
  words.forEach((word,index) => play(word,[
   {opacity:0,transform:`translate3d(0,${isIntro?'85':'115'}%,0) rotateX(72deg) skewY(5deg)`,filter:'blur(7px)',clipPath:'inset(0 0 100% 0)'},
   {opacity:.9,offset:.65,transform:'translate3d(0,-4%,0) rotateX(-5deg) skewY(-.5deg)',filter:'blur(.6px)',clipPath:'inset(0 0 0 0)'},
   {opacity:1,transform:'translate3d(0,0,0) rotateX(0deg) skewY(0deg)',filter:'blur(0px)',clipPath:'inset(0 0 0 0)'}
  ],{duration:isIntro?540:920,delay:(isIntro?200:60)+index*(isIntro?14:75),easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
  letters.forEach((letter,index)=>play(letter,[
   {opacity:0,clipPath:'inset(0 100% 0 0)',transform:'translateY(.16em)'},
   {opacity:1,clipPath:'inset(0 0 0 0)',transform:'translateY(0)'}
  ],{duration:130,delay:570+index*32,easing:'steps(2,end)',fill:'backwards'}));
 }
 try {
  if ('IntersectionObserver' in window) {
   const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if (!entry.isIntersecting) return;
    reveal(entry.target);observer.unobserve(entry.target);
   }),{threshold:.15,rootMargin:'0px 0px -20px 0px'});
   targets.forEach(element=>observer.observe(element));
  } else targets.forEach(reveal);
  const toggle=document.querySelector('.motion-toggle');
  const english=document.documentElement.lang==='en';
  const update=()=>{
   if (paused()) finish();
   if (toggle) {
    toggle.setAttribute('aria-pressed',String(paused()));
    toggle.disabled=preference.matches;
    toggle.textContent=preference.matches?(english?'Reduced motion enabled':'Movimiento reducido activo'):paused()?(english?'Enable animations':'Activar animaciones'):(english?'Pause animations':'Pausar animaciones');
   }
   document.dispatchEvent(new CustomEvent('bm:motion-change'));
  };
  toggle?.addEventListener('click',()=>{
   if (preference.matches) return;
   document.documentElement.dataset.motion=paused()?'active':'paused';update();
  });
  preference.addEventListener('change',()=>{update();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden) finish();});
  document.addEventListener('focusin',event=>{if(event.target.closest('.text-composed')) finish();});
  update();
 } catch {
  active.forEach(animation=>animation.cancel());
  // Content starts visible; a failed enhancement leaves the complete text intact.
 }
})();
