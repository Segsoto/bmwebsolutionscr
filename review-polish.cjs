const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv.find(arg=>arg.startsWith('http'))||'http://127.0.0.1:4180';
const fs=require('fs');
const routes=['/','/servicios/','/proyectos/','/planes/','/contacto/','/plantillas/','/privacidad/','/terminos/','/404.html','/en/','/en/services/','/en/proyects/','/en/plans/','/en/contact/','/en/templates/','/en/privacy/','/en/terms/','/en/404.html'];
const assert=(value,message)=>{if(!value)throw Error(message)};
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const width of (process.argv.includes('--interaction-only')?[]:[1440,820,390,320])){
  await page.setViewportSize({width,height:1000});
  for(const route of routes){
   const response=await page.goto(base+route);
   assert(response.status()===200,'Route '+route+' '+response.status());
   assert(await page.getByRole('heading',{level:1}).count()===1,'H1 '+route);
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,emoji:document.body.innerText.replaceAll('©','').match(/\p{Extended_Pictographic}/gu),favicon:document.querySelector('link[rel=icon]')?.getAttribute('href'),legal:document.querySelectorAll('.footer-legal a').length}));
   assert(!state.overflow,'Overflow '+width+route);
   assert(!state.emoji?.length,'Emoji '+route);
   assert(state.favicon==='/favicon.ico','Favicon '+route);
   assert(state.legal===2,'Legal links '+route);
  }
 }
 console.log('18 pages verified at 1440, 820, 390 and 320 px.');
 for(const locale of ['/','/en/']){
  await page.setViewportSize({width:390,height:844});
  await page.goto(base+locale);
  await page.locator('.chat-launch').click();
  await page.waitForTimeout(350);
  const icon=page.locator('.guide-direct .whatsapp-mark');
  const dimensions=await icon.boundingBox();
  assert(dimensions.width===24&&dimensions.height===24,'WhatsApp proportions');
  assert(await icon.evaluate(e=>e.complete&&e.naturalWidth===e.naturalHeight),'WhatsApp load');
  const src=await icon.getAttribute('src');assert(src==='/assets/whatsapp-white.svg','Official logo');
  assert(await page.locator('.chat-close').boundingBox().then(r=>r.width>=44&&r.height>=44),'Close target');
  for(const topic of ['website','store','software','support','monthly','guidance']){
   await page.locator(`[data-topic=${topic}]`).click();
   await page.locator('.guide-more summary').click();
   await page.locator('#chat-details').fill('Necesito un sistema para gestionar las reservas.');
   assert(decodeURIComponent(await page.locator('.chat-send').getAttribute('href')).includes('Necesito un sistema'),'Bot context');
   await page.locator('.guide-back').click();
  }
  await page.screenshot({path:'polish-bot-'+(locale==='/en/'?'en':'es')+'.png'});
  await page.keyboard.press('Escape');
  assert(!await page.locator('.chat-panel').isVisible(),'Close Escape');
 }
 console.log('WhatsApp logo proportions, all bot topics, contextual links and close control verified.');
 for(const route of ['/contacto/','/en/contact/']){
  await page.goto(base+route+'?service=software#reserva');
  assert(await page.locator('#service').inputValue()==='software','Preselected service');
  await page.locator('#name').fill('Revisión BM');
  await page.locator('#message').fill('Necesito software de reservas para mi negocio.');
  assert(!await page.locator('#contact-form').evaluate(form=>form.checkValidity()),'Consent must be required');
  await page.locator('#privacy-consent').check();
  await page.evaluate(()=>{window.open=url=>{window.preparedUrl=url;return {opener:null}}});
  await page.locator('button[type=submit]').click();
  const target=decodeURIComponent(await page.evaluate(()=>window.preparedUrl));
  assert(target.includes('Revisión BM')&&/consent|autorizo/.test(target),'Consent WhatsApp message');
 }
 for(const route of ['/missing-review-path/','/en/missing-review-path/']){
  const response=await page.goto(base+route);assert(response.status()===404,'True 404 '+route);
  assert(await page.locator('.error-page').isVisible(),'Custom 404');
  assert(await page.locator('meta[name=robots]').getAttribute('content')==='noindex,follow','404 noindex');
  await page.locator('.error-copy .btn').click();assert(new URL(page.url()).pathname==='/'||new URL(page.url()).pathname==='/en/','404 recovery');
 }
 for(const route of ['/favicon.ico','/assets/favicon-32.png','/assets/favicon-180.png','/site.webmanifest','/sitemap.xml','/robots.txt']){
  const r=await page.request.get(base+route);assert(r.ok(),'Asset '+route);
 }
 console.log('Form consent, true 404 recovery, favicons, manifest and discovery files verified.');
 await page.setViewportSize({width:1440,height:1000});
 await page.addInitScript(()=>{
  window.layoutShiftTotal=0;
  new PerformanceObserver(list=>list.getEntries().forEach(e=>{if(!e.hadRecentInput)window.layoutShiftTotal+=e.value})).observe({type:'layout-shift',buffered:true});
 });
 await page.goto(base+'/');
 await page.waitForFunction(()=>document.querySelector('.hero h1 .motion-piece'));
 const activeMotion=await page.locator('.hero h1').evaluate(el=>el.getAnimations({subtree:true}).some(a=>a.playState==='running'));
 assert(activeMotion,'Headline animation plays');
 assert(await page.locator('.hero h1 .motion-char').count()>0,'Character writing');
 await page.waitForTimeout(1800);
 assert(await page.locator('.hero h1').evaluate(el=>el.getAnimations({subtree:true}).every(a=>a.playState!=='running')),'Headline settles');
 const cls=await page.evaluate(()=>window.layoutShiftTotal);assert(cls<.1,'Layout stability '+cls);
 const heading=await page.getByRole('heading',{level:1}).ariaSnapshot();assert(heading.includes('Diseño web, software y soporte de TI.'),'Accessible heading');
 await page.locator('.motion-toggle').click();
 assert(await page.locator('html').getAttribute('data-motion')==='paused','Motion pause');
 assert(await page.locator('.client-slider-track').evaluate(el=>getComputedStyle(el).animationName)==='none','Slider pauses');
 assert(await page.locator('.robot-wave').evaluate(el=>getComputedStyle(el).animationPlayState)==='paused','Bot pauses');
 await page.locator('.motion-toggle').click();assert(await page.locator('html').getAttribute('data-motion')==='active','Motion resume');
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto(base+'/');
 assert(await page.locator('.motion-piece').count()===0,'No split animation when reduced');
 assert(await page.locator('.robot-wave').evaluate(el=>getComputedStyle(el).animationName)==='none','Reduced bot motion');
 console.log('Complex headline motion, accessible text, pause/resume and reduced motion verified. CLS='+cls);
 const nojs=await browser.newPage({javaScriptEnabled:false,viewport:{width:390,height:844}});
 await nojs.goto(base+'/contacto/');
 assert(!await nojs.locator('.booking-form').isVisible(),'No-JS form does not submit personal data by GET');
 assert(await nojs.getByRole('heading',{name:'Contactanos directamente'}).isVisible(),'No-JS contact');
 await nojs.goto(base+'/');assert(await nojs.locator('.bot-noscript').isVisible(),'No-JS WhatsApp link');
 assert(await nojs.getByRole('heading',{level:1}).isVisible(),'No-JS text');
 assert(errors.length===0,'Browser errors '+JSON.stringify(errors));
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const [route,name] of [['/','polish-home-final'],['/privacidad/','polish-privacy-final'],['/missing-review-path/','polish-404-final']]){
  await page.goto(base+route);await page.screenshot({path:name+'.png',fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/terminos/');await page.screenshot({path:'polish-terms-mobile.png',fullPage:true});
 console.log(JSON.stringify({pages:18,widths:4,officialWhatsapp:true,privacyConsent:true,custom404:true,favicon:true,complexTextMotion:true,accessible:true,reducedMotion:true,noJavaScriptFallback:true,cls,browserErrors:0}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
