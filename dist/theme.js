(() => {
 'use strict';
 const root = document.documentElement;
 const key = 'bm-theme';
 const system = matchMedia('(prefers-color-scheme: dark)');
 let preference = null;
 try { preference = localStorage.getItem(key); } catch {}
 if (!['light', 'dark'].includes(preference)) preference = null;
 const apply = theme => {
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0d1520' : '#f8f9fb');
  document.querySelectorAll('.theme-toggle').forEach(button => {
   button.hidden = false;
   button.setAttribute('aria-pressed', String(theme === 'dark'));
   button.title = root.lang === 'en' ? 'Dark mode' : 'Modo oscuro';
  });
  document.dispatchEvent(new Event('bm:theme-change'));
 };
 const sync = () => apply(preference || (system.matches ? 'dark' : 'light'));
 sync();
 document.addEventListener('DOMContentLoaded', () => {
  sync();
  document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
   preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
   try { localStorage.setItem(key, preference); } catch {}
   apply(preference);
  }));
 });
 system.addEventListener('change', () => { if (!preference) sync(); });
 window.addEventListener('storage', event => {
  if (event.key !== key && event.key !== null) return;
  preference = ['light', 'dark'].includes(event.newValue) ? event.newValue : null;
  sync();
 });
})();
