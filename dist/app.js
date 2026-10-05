const isEnglish = document.documentElement.lang === 'en';
const menu = document.querySelector('.menu');
const nav = document.querySelector('.navlinks');
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); menu.textContent = open ? (isEnglish ? 'Close' : 'Cerrar') : (isEnglish ? 'Menu' : 'Menú'); });
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
 const message = `${isEnglish ? 'Hello, I would like help with my business technology.' : 'Hola, me gustaría recibir ayuda con la tecnología de mi negocio.'}\n\n${isEnglish ? 'Name' : 'Nombre'}: ${data.get('name')}\nEmail: ${data.get('email')}\n${isEnglish ? 'Service' : 'Servicio'}: ${data.get('service')}\n\n${data.get('message')}`;
 const target = 'https://wa.me/50660233159?text=' + encodeURIComponent(message);
 const status = document.querySelector('#form-status');
 status.replaceChildren();
 status.append(document.createTextNode(isEnglish ? 'Your message is ready. Send it in WhatsApp to complete your inquiry. ' : 'Tu mensaje está listo. Envíalo en WhatsApp para completar tu consulta. '));
 const link = document.createElement('a'); link.href = target; link.target = '_blank'; link.rel = 'noopener'; link.textContent = isEnglish ? 'Open WhatsApp' : 'Abrir WhatsApp'; link.className = 'text-link'; status.append(link);
 window.open(target, '_blank', 'noopener');
});

const chat = document.querySelector('.sales-chat');
const launch = chat?.querySelector('.chat-launch');
const panel = chat?.querySelector('.chat-panel');
const closeChat = chat?.querySelector('.chat-close');
const options = [...(chat?.querySelectorAll('[data-topic]') || [])];
const details = chat?.querySelector('#chat-details');
const send = chat?.querySelector('.chat-send');
let topic = '';
const setChatOpen = open => {
  if (!panel) return;
  panel.hidden = !open;
  launch.setAttribute('aria-expanded', String(open));
  if (open) closeChat.focus(); else launch.focus();
};
launch?.addEventListener('click', () => setChatOpen(panel.hidden));
closeChat?.addEventListener('click', () => setChatOpen(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && panel && !panel.hidden) setChatOpen(false);
});
const updateChatLink = () => {
  if (!send) return;
  const topics = isEnglish
    ? {support:'technical support for my business',monthly:'monthly IT support for my business',website:'a website',store:'an online store',software:'custom software',guidance:'guidance for my digital project'}
    : {support:'soporte técnico para mi negocio',monthly:'acompañamiento mensual de TI para mi negocio',website:'una página web',store:'una tienda en línea',software:'software a medida',guidance:'orientación para mi proyecto digital'};
  let message = isEnglish ? 'Hello, I would like to discuss ' : 'Hola, quiero conversar sobre ';
  message += topics[topic] || (isEnglish ? 'a project for my business' : 'un proyecto para mi negocio');
  const description = details.value.trim();
  if (description) message += '\n\n' + (isEnglish ? 'My business and idea: ' : 'Mi negocio y mi idea: ') + description;
  send.href = 'https://wa.me/50660233159?text=' + encodeURIComponent(message);
};
options.forEach(option => option.addEventListener('click', () => {
  topic = option.dataset.topic;
  options.forEach(item => item.setAttribute('aria-pressed', String(item === option)));
  updateChatLink();
}));
details?.addEventListener('input', updateChatLink);
send?.addEventListener('click', updateChatLink);
