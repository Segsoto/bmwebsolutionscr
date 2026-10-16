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

 const chat = document.querySelector('.robot-concierge');
 if (chat) {
  const launch = chat.querySelector('.chat-launch');
  const panel = chat.querySelector('.chat-panel');
  const close = chat.querySelector('.chat-close');
  const choices = [...chat.querySelectorAll('[data-topic]')];
  const result = chat.querySelector('.guide-result');
  const title = chat.querySelector('[data-guide-title]');
  const description = chat.querySelector('[data-guide-description]');
  const includes = chat.querySelector('[data-guide-includes]');
  const details = chat.querySelector('#chat-details');
  const whatsappLinks = [...chat.querySelectorAll('.guide-whatsapp')];
  const robot = chat.querySelector('.bm-robot');
  let topic = '';
  const recommendations = {
   website: {
    title: text('Hablemos de tu página web.', 'Let’s talk about your website.'),
    description: text('Contanos a qué se dedica tu negocio y qué te gustaría que hiciera alguien al entrar a tu web. Con eso podemos ayudarte a definir qué necesitás.', 'Tell us what your business does and what you’d like visitors to do on your website. That will help us work out what you need.'),
    includes: [text('Si ya tenés una web, pasanos el enlace. Nos sirve para empezar.', 'Already have a website? Send us the link. It’s a useful starting point.')],
    message: text('una página web para mi negocio', 'a website for my business')
   },
   store: {
    title: text('¿Qué te gustaría vender?', 'What would you like to sell?'),
    description: text('Podemos ayudarte con tu tienda. Contanos qué productos tenés y cómo vendés hoy; también conversamos cómo cobrar y entregar tus pedidos.', 'We can help with your store. Tell us about your products and how you sell today. We’ll also talk about payments and delivery.'),
    includes: [text('Un catálogo, tu Instagram o unas fotos de tus productos nos ayudan a conocer tu negocio.', 'A catalog, your Instagram or a few product photos will help us get to know your business.')],
    message: text('una tienda en línea', 'an online store')
   },
   software: {
    title: text('Contanos qué te quita tiempo.', 'Tell us what takes up your time.'),
    description: text('¿Hay algo que repetís todos los días o que llevás en varias herramientas? Empecemos por ahí y veamos cómo podríamos simplificarlo.', 'Is there a task you repeat every day or manage across several tools? Let’s start there and see how we could make it simpler.'),
    includes: [text('Con un ejemplo de una tarea de tu día a día podemos entender mejor lo que necesitás.', 'An example of a task from your day will help us understand what you need.')],
    message: text('cómo simplificar tareas de mi negocio con software', 'simplifying tasks in my business with software')
   },
   support: {
    title: text('Veamos qué está pasando.', 'Let’s see what’s happening.'),
    description: text('Escribinos qué equipo o servicio está fallando y desde cuándo. Te contamos cómo podemos revisar el problema y coordinamos la atención.', 'Tell us which device or service is giving you trouble and when it started. We’ll explain how we can look into it and arrange support.'),
    includes: [text('Si aparece un error, una foto o captura nos puede ayudar.', 'If there’s an error message, a photo or screenshot can help.')],
    message: text('un problema técnico en mi negocio', 'a technical issue in my business')
   },
   monthly: {
    title: text('Conozcamos a tu equipo.', 'Let’s get to know your team.'),
    description: text('Contanos cuántas personas trabajan con vos y qué herramientas usan. Así podemos conversar qué acompañamiento les serviría.', 'Tell us how many people work with you and which tools they use. Then we can discuss what kind of support would help.'),
    includes: [text('Acordamos juntos el alcance, los horarios y la modalidad de atención.', 'We’ll agree on the scope, hours and support arrangements together.')],
    message: text('soporte de TI para mi equipo', 'IT support for my team')
   },
   guidance: {
    title: text('Está bien si todavía no lo tenés claro.', 'It’s okay if you’re still figuring it out.'),
    description: text('No hace falta que llegués con una solución elegida. Contanos a qué te dedicás y qué te gustaría mejorar; empezamos la conversación desde ahí.', 'You don’t need to have a solution picked out. Tell us what you do and what you’d like to improve. We’ll start the conversation there.'),
    includes: [text('Podés escribirnos la idea tal como la tenés, aunque sea en unas pocas palabras.', 'Share the idea as it is, even if it’s only a few words.')],
    message: text('una idea para mi negocio y me gustaría que me orientaran', 'an idea for my business and I’d appreciate some guidance')
   }
  };
  const setOpen = open => {
   panel.hidden = !open;
   chat.classList.toggle('is-open', open);
   launch.setAttribute('aria-expanded', String(open));
   if (open) { panel.scrollTop = 0; close.focus({ preventScroll: true }); }
   else launch.focus({ preventScroll: true });
  };
  launch.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) setOpen(false); });
  const updateMessage = () => {
   let message = text('Hola, me gustaría conversar con ustedes sobre ', 'Hi, I’d like to talk with your team about ') + (recommendations[topic]?.message || text('mi negocio', 'my business')) + '.';
   if (details.value.trim()) message += '\n\n' + text('Mi negocio y mi idea: ', 'My business and idea: ') + details.value.trim();
   const target = 'https://wa.me/50660233159?text=' + encodeURIComponent(message);
   whatsappLinks.forEach(link => { link.href = target; });
  };
  title.tabIndex = -1;
  choices.forEach(choice => choice.addEventListener('click', () => {
   topic = choice.dataset.topic;
   const recommendation = recommendations[topic];
   choices.forEach(item => item.setAttribute('aria-pressed', String(item === choice)));
   result.hidden = false;
   panel.classList.add('has-recommendation');
   title.textContent = recommendation.title;
   description.textContent = recommendation.description;
   includes.replaceChildren(...recommendation.includes.map(value => { const li = document.createElement('li'); li.textContent = value; return li; }));
   chat.querySelector('.guide-more').open = false;
   updateMessage();
   title.focus({ preventScroll: true });
   panel.scrollTop = 0;
  }));
  chat.querySelector('.guide-back').addEventListener('click', () => {
   panel.classList.remove('has-recommendation');
   result.hidden = true;
   topic = '';
   choices.forEach(choice => choice.setAttribute('aria-pressed', 'false'));
   updateMessage();
   panel.scrollTop = 0;
   choices[0]?.focus({ preventScroll: true });
  });
  details.addEventListener('input', updateMessage);
  updateMessage();

  // Pointer tracking writes at most once per frame. Touch uses the greeting pose.
  let gazeFrame = 0, pointer = { x: 0, y: 0 };
  const resetGaze = () => { robot.style.setProperty('--gaze-x', '0px'); robot.style.setProperty('--gaze-y', '0px'); };
  window.addEventListener('pointermove', event => {
   if (!finePointer.matches || motion.matches || !panel.hidden || event.pointerType === 'touch') return;
   pointer = { x: event.clientX, y: event.clientY };
   if (gazeFrame) return;
   gazeFrame = requestAnimationFrame(() => {
    const rect = robot.getBoundingClientRect();
    const dx = pointer.x - (rect.left + rect.width * .49);
    const dy = pointer.y - (rect.top + rect.height * .37);
    robot.style.setProperty('--gaze-x', (Math.tanh(dx / 240) * 4.5).toFixed(2) + 'px');
    robot.style.setProperty('--gaze-y', (Math.tanh(dy / 200) * 3).toFixed(2) + 'px');
    gazeFrame = 0;
   });
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', resetGaze);
  motion.addEventListener('change', resetGaze);
  const compact = () => chat.classList.toggle('is-compact', scrollY > 120);
  window.addEventListener('scroll', compact, { passive: true });
  compact();
 }

})();
