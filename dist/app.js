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
 menu.setAttribute('aria-label', open ? (isEnglish ? 'Close menu' : 'Cerrar menú') : (isEnglish ? 'Open menu' : 'Abrir menú'));
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
