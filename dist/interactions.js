(() => {
 'use strict';
 const preference = matchMedia('(prefers-reduced-motion: reduce)');
 const active = new Set();
 const animate = (element, frames, options) => {
  const animation = element.animate(frames, options);
  active.add(animation);
  animation.finished.then(() => active.delete(animation)).catch(() => active.delete(animation));
  return animation;
 };
 preference.addEventListener('change', () => {
  if (preference.matches) active.forEach(animation => animation.finish());
 });

 // Preserve native details behavior without JavaScript or with reduced motion.
 document.querySelectorAll('.faq-list details').forEach(details => {
  const summary = details.querySelector('summary');
  const answer = details.querySelector('.faq-answer');
  let expansion, desiredOpen = details.open;
  summary.addEventListener('click', event => {
   if (event.defaultPrevented || !Element.prototype.animate) return;
   if (preference.matches) {
    expansion?.cancel(); expansion = undefined;
    details.style.removeProperty('height');
    details.classList.remove('is-expanding','is-closing');
    // The default click will toggle the native open state.
    desiredOpen = !details.open;
    return;
   }
   event.preventDefault();
   const start = details.getBoundingClientRect().height;
   desiredOpen = !desiredOpen;
   expansion?.cancel();
   details.style.removeProperty('height');
   details.open = true;
   const naturalHeight = details.getBoundingClientRect().height;
   const style = getComputedStyle(details);
   const closedHeight = summary.getBoundingClientRect().height + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
   details.classList.add('is-expanding');
   details.classList.toggle('is-closing', !desiredOpen);
   details.style.height = start + 'px';
   const current = animate(details, [{height:start+'px'},{height:(desiredOpen?naturalHeight:closedHeight)+'px'}], {duration:320,easing:'cubic-bezier(.22,1,.36,1)',fill:'forwards'});
   expansion = current;
   if (desiredOpen) animate(answer, [{opacity:0,transform:'translateY(-7px)'},{opacity:1,transform:'none'}], {duration:260,easing:'ease-out'});
   current.finished.then(() => {
    if (expansion !== current) return;
    details.open = desiredOpen;
    details.style.removeProperty('height');
    details.classList.remove('is-expanding','is-closing');
    current.cancel(); expansion = undefined;
   }).catch(() => {});
  });
 });

 // Re-enter from either scroll direction; rearm only after leaving the viewport.
 const cards = [...document.querySelectorAll('.project-card')];
 let previousScroll=scrollY, scrollDirection=1;
 window.addEventListener('scroll',()=>{
  if(scrollY!==previousScroll)scrollDirection=scrollY>previousScroll?1:-1;
  previousScroll=scrollY;
 },{passive:true});
 if ('IntersectionObserver' in window && Element.prototype.animate) {
  const visible=new WeakSet();
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    if (!entry.isIntersecting) {visible.delete(entry.target);return;}
    if(entry.intersectionRatio<.08||visible.has(entry.target))return;
    visible.add(entry.target);
    if (preference.matches) return;
    entry.target.getAnimations({subtree:true}).forEach(animation=>animation.cancel());
    const index = cards.indexOf(entry.target);
    const delay = innerWidth > 760 ? index % 2 * 90 : 0;
    animate(entry.target, [{opacity:0,transform:`translateY(${scrollDirection*32}px) scale(.985)`},{opacity:1,transform:'none'}], {duration:650,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
    const image = entry.target.querySelector('.project-visual img');
    if (image) animate(image, [{clipPath:scrollDirection>0?'inset(7% 0 0 0)':'inset(0 0 7% 0)'},{clipPath:'inset(0 0 0 0)'}], {duration:800,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
   });
  }, {threshold:.08,rootMargin:'0px 0px -25px 0px'});
  cards.forEach(card => observer.observe(card));
 }

 const brand = document.querySelector('.header .brand');
 let leaving = false;
 brand?.addEventListener('click', event => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const target = new URL(brand.href);
  const samePage = target.pathname === location.pathname;
  if (samePage) {
   event.preventDefault();
   document.querySelector('.menu[aria-expanded="true"]')?.click();
   if (location.hash) history.replaceState(history.state,'',target.pathname+target.search);
   window.scrollTo({top:0,behavior:preference.matches?'instant':'smooth'});
   const heading = document.querySelector('main h1');
   if (heading) { heading.setAttribute('tabindex','-1'); heading.focus({preventScroll:true}); }
   if (!preference.matches && Element.prototype.animate) animate(brand,[{opacity:.65,transform:'translateY(2px)'},{opacity:1,transform:'none'}],{duration:300,easing:'ease-out'});
   return;
  }
  // Native document transitions keep the header stable between pages.
  if (preference.matches || 'CSSViewTransitionRule' in window || !Element.prototype.animate) return;
  event.preventDefault();
  if (leaving) return;
  leaving = true;
  const main = document.querySelector('main');
  const transition = animate(main,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-8px)'}],{duration:180,easing:'ease-in'});
  transition.finished.then(()=>location.assign(target.href)).catch(()=>location.assign(target.href));
 });
 window.addEventListener('pageshow', () => { leaving=false; });
})();
