const isEnglish = document.documentElement.lang === 'en';
const menu = document.querySelector('.menu');
const nav = document.querySelector('.navlinks');
const mobileMenu = matchMedia('(max-width: 760px)');
const setMenuOpen = open => {
 if (!menu || !nav) return;
 open = open && mobileMenu.matches;
 if (!open && mobileMenu.matches && nav.contains(document.activeElement)) menu.focus({ preventScroll: true });
 menu.setAttribute('aria-expanded', String(open));
 nav.classList.toggle('open', open);
 nav.inert = mobileMenu.matches && !open;
 menu.querySelector('.menu-label').textContent = open ? (isEnglish ? 'Close' : 'Cerrar') : (isEnglish ? 'Menu' : 'Menú');
};
menu?.addEventListener('click', () => setMenuOpen(menu.getAttribute('aria-expanded') !== 'true'));
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
mobileMenu.addEventListener('change', () => setMenuOpen(false));
setMenuOpen(false);
document.addEventListener('pointerdown', event => {
 if (nav?.classList.contains('open') && !nav.contains(event.target) && !menu.contains(event.target)) setMenuOpen(false);
});
document.addEventListener('keydown', e => { if(e.key === 'Escape' && nav?.classList.contains('open')) { menu.click(); menu.focus(); } });

// Manual tabs: no timed carousel, with complete keyboard navigation.
const demoTabs = [...document.querySelectorAll('[data-demo]')];
const activateDemo = tab => {
 demoTabs.forEach(item => {
  const active = item === tab;
  item.setAttribute('aria-selected', String(active));
  item.tabIndex = active ? 0 : -1;
  document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
 });
};
demoTabs.forEach((tab, index) => {
 tab.addEventListener('click', () => activateDemo(tab));
 tab.addEventListener('keydown', event => {
  const offsets = { ArrowRight: 1, ArrowLeft: -1 };
  let next;
  if (event.key in offsets) next = (index + offsets[event.key] + demoTabs.length) % demoTabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = demoTabs.length - 1;
  else return;
  event.preventDefault();
  activateDemo(demoTabs[next]);
  demoTabs[next].focus();
 });
});

const form = document.querySelector('#contact-form');
const preferredDate = form?.querySelector('[name="date"]');
const updateDateMinimum = () => {
 if (!preferredDate) return;
 const dateParts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Costa_Rica', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
 const part = type => dateParts.find(item => item.type === type).value;
 preferredDate.min = `${part('year')}-${part('month')}-${part('day')}`;
};
updateDateMinimum();
preferredDate?.addEventListener('focus', updateDateMinimum);
const requestedService = new URLSearchParams(location.search).get('service');
if (form && requestedService) {
 const select = form.querySelector('[name="service"]');
 if ([...select.options].some(option => option.value === requestedService)) select.value = requestedService;
}
form?.addEventListener('submit', event => {
 event.preventDefault();
 updateDateMinimum();
 const name = form.querySelector('[name="name"]');
 const messageField = form.querySelector('[name="message"]');
 name.setCustomValidity(name.value.trim() ? '' : (isEnglish ? 'Please enter your name.' : 'Escribí tu nombre.'));
 messageField.setCustomValidity(messageField.value.trim().length >= 10 ? '' : (isEnglish ? 'Tell us a little more (at least 10 characters).' : 'Contanos un poco más (al menos 10 caracteres).'));
 if(!form.reportValidity()) return;
 const data = new FormData(form);
 const service = form.querySelector('[name="service"] option:checked').textContent;
 const timeLabels = isEnglish ? { morning: 'Morning', afternoon: 'Afternoon' } : { morning: 'Mañana', afternoon: 'Tarde' };
 const lines = [isEnglish ? 'Hello, I would like to arrange a session to discuss my business.' : 'Hola, quisiera coordinar una sesión para conversar sobre mi negocio.', '', `${isEnglish ? 'Name' : 'Nombre'}: ${data.get('name').trim()}`, `${isEnglish ? 'Service' : 'Servicio'}: ${service}`];
 if (data.get('email').trim()) lines.push(`Email: ${data.get('email').trim()}`);
 if (data.get('date')) lines.push(`${isEnglish ? 'Preferred date' : 'Fecha preferida'}: ${data.get('date')}`);
 if (timeLabels[data.get('time')]) lines.push(`${isEnglish ? 'Preferred time' : 'Horario preferido'}: ${timeLabels[data.get('time')]} (Costa Rica, UTC−6)`);
 lines.push('', data.get('message').trim(), '', isEnglish ? 'I have read the privacy policy and consent to processing my data for this inquiry.' : 'Leí la política de privacidad y autorizo el uso de mis datos para atender esta consulta.', '', isEnglish ? 'Please confirm the availability and format of the session.' : '¿Podemos confirmar la disponibilidad y modalidad de la sesión?');
 const message = lines.join('\n');
 const target = 'https://wa.me/50660233159?text=' + encodeURIComponent(message);
 const status = document.querySelector('#form-status');
 status.replaceChildren();
 status.append(document.createTextNode(isEnglish ? 'Your request is ready. Send it in WhatsApp and arrange your session with our team. If WhatsApp didn’t open, use this link. ' : 'Tu solicitud está lista. Enviála en WhatsApp y coordiná la sesión con el equipo. Si WhatsApp no se abrió, usá este enlace. '));
 const link = document.createElement('a'); link.href = target; link.target = '_blank'; link.rel = 'noopener'; link.textContent = isEnglish ? 'Open WhatsApp' : 'Abrir WhatsApp'; link.className = 'text-link'; status.append(link);
 window.open(target, '_blank', 'noopener');
});
form?.querySelectorAll('input,textarea').forEach(field => field.addEventListener('input', () => field.setCustomValidity('')));
