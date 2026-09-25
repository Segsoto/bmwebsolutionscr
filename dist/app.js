const isEnglish = document.documentElement.lang === 'en';
const menu = document.querySelector('.menu');
const nav = document.querySelector('.navlinks');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); menu.textContent = open ? (isEnglish ? 'Close' : 'Cerrar') : 'Menú'; });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav?.classList.contains('open')) { menu.click(); menu.focus(); } });
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('video').forEach(video => {
 const button = document.querySelector(`[data-video="${video.id}"]`);
 const update = () => { if(!button)return; button.textContent = video.paused ? '▶' : 'Ⅱ'; button.setAttribute('aria-label', video.paused ? (isEnglish ? 'Play background video' : 'Reproducir video de fondo') : (isEnglish ? 'Pause background video' : 'Pausar video de fondo')); button.setAttribute('aria-pressed', String(!video.paused)); };
 video.addEventListener('play',update); video.addEventListener('pause',update);
 if(!reducedMotion.matches) video.play().catch(update);
 button?.addEventListener('click', () => video.paused ? video.play().catch(update) : video.pause());
 update();
});
const form = document.querySelector('#contact-form');
form?.addEventListener('submit', event => {
 event.preventDefault();
 if(!form.reportValidity()) return;
 const data = new FormData(form);
 const message = `${isEnglish ? 'Hello, I would like to discuss my project.' : 'Hola, me gustaría conversar sobre mi proyecto.'}\n\n${isEnglish ? 'Name' : 'Nombre'}: ${data.get('name')}\nEmail: ${data.get('email')}\n${isEnglish ? 'Service' : 'Servicio'}: ${data.get('service')}\n\n${data.get('message')}`;
 const target = 'https://wa.me/50660233159?text=' + encodeURIComponent(message);
 const status = document.querySelector('#form-status');
 status.replaceChildren();
 status.append(document.createTextNode(isEnglish ? 'Your message is ready. Send it in WhatsApp to complete your inquiry. ' : 'Tu mensaje está listo. Envíalo en WhatsApp para completar tu consulta. '));
 const link = document.createElement('a'); link.href = target; link.target = '_blank'; link.rel = 'noopener'; link.textContent = isEnglish ? 'Open WhatsApp' : 'Abrir WhatsApp'; link.className = 'text-link'; status.append(link);
 window.open(target, '_blank', 'noopener');
});
