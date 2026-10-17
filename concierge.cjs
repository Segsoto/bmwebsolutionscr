// Original vector character: individual eyes and hand remain independently animatable.
module.exports = ({ t, url, wa, arrow }) => {
 const eyeLight = x => `<g class="robot-light-origin" transform="translate(${x} 82.5)"><g class="robot-eye-flare"><path d="M0-1.5Q35-10 86-15L94 0 86 15Q35 10 0 1.5Z" fill="url(#bm-eye-flare)"/><path d="M-5 0H5M0-3.5V3.5" stroke="#fff0cf" stroke-width=".8" stroke-linecap="round" opacity=".7"/></g></g>`;
 const robot = `<svg class="bm-robot" viewBox="0 0 220 220" fill="none" aria-hidden="true">
 <defs><linearGradient id="bm-eye-flare" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="94" y2="0"><stop stop-color="#ffe0a9" stop-opacity=".65"/><stop offset=".35" stop-color="#ffae56" stop-opacity=".27"/><stop offset=".7" stop-color="#ff983b" stop-opacity=".1"/><stop offset="1" stop-color="#ff983b" stop-opacity="0"/></linearGradient></defs>

 <ellipse cx="110" cy="191" rx="34" ry="4" fill="#234b67" opacity=".1"/>
 <g class="robot-float">

 <path d="M82 137c-13 0-21 12-18 23" stroke="#9bbdc8" stroke-width="12" stroke-linecap="round"/><rect x="56" y="154" width="17" height="24" rx="8" fill="#f8f5ed" stroke="#5994c9"/>
 <g class="robot-wave"><path d="M138 137c20-1 28-17 31-35" stroke="#9bbdc8" stroke-width="12" stroke-linecap="round"/><path d="M164 106c-5-5-12-10-9-14 2-3 6 0 9 2l-5-17c-1-5 5-7 7-2l4 12-1-20c0-5 6-5 7 0l1 19 4-18c1-5 7-4 6 1l-3 20 7-12c3-4 8-1 5 4l-11 24c-4 9-14 10-21 1Z" fill="#f8f5ed" stroke="#5e9cd2" stroke-width="1.4"/><path d="m173 96 5 2 5-2" stroke="#9ebfda" stroke-width="1.5" stroke-linecap="round"/></g>
 <rect x="79" y="126" width="63" height="48" rx="21" fill="#f8f5ed" stroke="#6ca4d3" stroke-width="1.3"/><path d="M96 127v-11h28v11" fill="#79a6ce"/><rect x="87" y="135" width="47" height="27" rx="12" fill="#155bea"/><path d="m98 151 4-10 7 9 8-9 6 10" stroke="white" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="111" cy="169" r="2" fill="#138aff"/>
 <g class="robot-head"><path d="M108 42V29" stroke="#78addb" stroke-width="4"/><circle class="robot-antenna" cx="108" cy="24" r="6" fill="#e5b767" stroke="white" stroke-width="2"/><rect x="47" y="68" width="18" height="28" rx="8" fill="#9bbdc8"/><rect x="152" y="68" width="18" height="28" rx="8" fill="#9bbdc8"/><path d="M51 75v14m114-14v14" stroke="#2da6ec" stroke-width="3" stroke-linecap="round"/>
 <rect x="57" y="42" width="102" height="80" rx="29" fill="#f8f5ed" stroke="#7db5e1" stroke-width="1.5"/><path d="M76 50c11-4 24-5 39-4" stroke="white" stroke-width="3" stroke-linecap="round"/>
 <rect x="66" y="55" width="84" height="53" rx="22" fill="#173c55"/><path d="M77 61c13-4 27-4 40-2" stroke="#48688b" stroke-width="2" stroke-linecap="round"/>
 <g class="robot-eye" style="--eye-center:89.5px"><rect x="80" y="69" width="19" height="25" rx="9.5" fill="#f7faf3"/><g class="robot-look"><rect x="86" y="75" width="8" height="15" rx="4" fill="#448da7"/><circle cx="91" cy="78" r="2" fill="white"/>${eyeLight(90)}</g></g>
 <g class="robot-eye" style="--eye-center:126.5px"><rect x="117" y="69" width="19" height="25" rx="9.5" fill="#f7faf3"/><g class="robot-look"><rect x="123" y="75" width="8" height="15" rx="4" fill="#448da7"/><circle cx="128" cy="78" r="2" fill="white"/>${eyeLight(127)}</g></g>
 <path d="M103 99q6 5 12 0" stroke="#e9f2ed" stroke-width="2" stroke-linecap="round"/><path d="M78 111h10m40 0h10" stroke="#ce8a72" stroke-width="2" stroke-linecap="round"/></g></g></svg>`;
 const whatsappIcon = '<img class="whatsapp-mark" src="/assets/whatsapp-white.svg" width="24" height="24" alt="" aria-hidden="true">';
 return function chat() {
  const choices = [
   ['website',t('Quiero una página web','I need a website')],
   ['store',t('Quiero vender por internet','I want to sell online')],
   ['software',t('Quiero simplificar mi trabajo','I want to simplify my work')],
   ['support',t('Tengo un problema técnico','I have a technical issue')],
   ['monthly',t('Busco soporte para mi equipo','I need support for my team')],
   ['guidance',t('Todavía no sé qué necesito','I’m not sure what I need yet')]
  ];
  const initialMessage = wa(t('Hola, me gustaría conversar con ustedes sobre mi negocio.','Hi, I’d like to talk with your team about my business.'));
  const whatsappButton = (className, label) => `<a class="btn guide-whatsapp ${className}" href="${initialMessage}" target="_blank" rel="noopener noreferrer">${whatsappIcon}<span>${label}</span>${arrow}</a>`;
  return `<div class="sales-chat robot-concierge"><button class="chat-launch robot-launch" type="button" aria-label="${t('Hablemos con el equipo de BM','Talk with the BM team')}" aria-controls="sales-chat-panel" aria-expanded="false"><span class="robot-invitation"><span>${t('¿Lo conversamos?','Shall we talk?')}</span><strong>${t('Estamos para ayudarte.','We’re here to help.')}</strong></span><span class="robot-art">${robot}</span><span class="robot-action">${t('Hablemos','Let’s talk')}<span aria-hidden="true">${arrow}</span></span></button>
  <noscript><style>.robot-launch{display:none!important}</style><a class="btn bot-noscript" href="${initialMessage}">${whatsappIcon}WhatsApp</a></noscript><section class="chat-panel robot-panel" id="sales-chat-panel" role="dialog" aria-labelledby="guide-title" hidden>
   <div class="chat-head"><div class="guide-brand"><span class="brand-crop"><img src="/assets/logo.png" alt="" width="500" height="357"></span><div><strong>BM Web Solutions</strong><small>${t('Un equipo de Costa Rica','A team from Costa Rica')}</small></div></div><button type="button" class="chat-close" aria-label="${t('Cerrar asistente','Close assistant')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button></div>
   <div class="chat-body"><div class="guide-welcome"><h2 id="guide-title">${t('¿En qué te damos<br>una mano?','How can we<br>help you?')}</h2><p class="chat-bubble">${t('Contanos un poco de tu negocio y lo que tenés en mente. Lo conversamos por WhatsApp, con calma y sin complicaciones.','Tell us a little about your business and what you have in mind. Let’s talk it through on WhatsApp.')}</p></div>
    ${whatsappButton('guide-direct',t('Escribinos por WhatsApp','Message us on WhatsApp'))}
    <div class="guide-team"><span class="guide-team-mark" aria-hidden="true">BM<span>${arrow}</span></span><p>${t('Del otro lado estamos nosotros.','You’ll be talking with our team.')}<span>Brandon Soto · Manfred Zuñiga · Brandon Garro</span></p></div><span class="chat-label" id="guide-question">${t('O elegí por dónde empezamos:','Or choose where we start:')}</span><div class="chat-options" role="group" aria-labelledby="guide-question">${choices.map(([id,label])=>`<button type="button" data-topic="${id}" aria-pressed="false"><span>${label}</span><b aria-hidden="true">→</b></button>`).join('')}</div>
    <div class="guide-result" hidden><button type="button" class="guide-back">${t('← Volver a las opciones','← Back to the options')}</button><div class="guide-answer" role="status" aria-live="polite" aria-atomic="true"><h3 data-guide-title></h3><p data-guide-description></p><ul data-guide-includes></ul></div>${whatsappButton('chat-send',t('Conversemos por WhatsApp','Let’s talk on WhatsApp'))}</div>

    <p class="guide-privacy">${t('Al abrir WhatsApp, el texto preparado se comparte con ese servicio. Consultá nuestra ', 'Opening WhatsApp shares the prepared text with that service. Read our ')}<a href="${url('privacy')}">${t('Política de privacidad','Privacy policy')}</a>.</p>
   </div>
  </section></div>`;
 };
};
