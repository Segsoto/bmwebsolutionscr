(() => {
 'use strict';
 const english = document.documentElement.lang === 'en';
 const text = (es, en) => english ? en : es;
 const motion = matchMedia('(prefers-reduced-motion: reduce)');
 const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
 const sleepMotion = () => document.documentElement.classList.toggle('motion-sleep', document.hidden);
 document.addEventListener('visibilitychange', sleepMotion);
 sleepMotion();

 // Two identical runs make a continuous loop without a visible restart.
 const slider = document.querySelector('[data-client-slider]');
 if (slider) {
  const track = slider.querySelector('.client-slider-track');
  const viewport = slider.querySelector('.client-slider-window');
  [...track.children].forEach(item => {
   const copy = item.cloneNode(true);
   copy.dataset.clientCopy = '';
   copy.setAttribute('aria-hidden', 'true');
   copy.querySelector('a').tabIndex = -1;
   track.append(copy);
  });
  let hovering = false, touching = false, visible = false;
  const update = () => {
   slider.classList.toggle('is-paused', motion.matches || hovering || touching || !visible || document.hidden);
  };
  viewport.addEventListener('mouseenter', () => { hovering = true; update(); });
  viewport.addEventListener('mouseleave', () => { hovering = false; update(); });
  viewport.addEventListener('pointerdown', () => { touching = true; update(); });
  const release = () => { touching = false; update(); };
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  viewport.addEventListener('focusin', event => {
   // Keep a pointer click on its moving link; only keyboard focus changes layout.
   if (!event.target.matches(':focus-visible')) return;
   slider.classList.add('is-browsing');
   requestAnimationFrame(() => event.target.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' }));
  });
  viewport.addEventListener('focusout', event => {
   if (!viewport.contains(event.relatedTarget)) {
    slider.classList.remove('is-browsing');
    viewport.scrollLeft = 0;
   }
  });
  document.addEventListener('visibilitychange', update);
  motion.addEventListener('change', update);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }).observe(slider);
  else visible = true;
  slider.classList.add('is-enhanced');
  update();
 }

})();
