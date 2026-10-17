const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs');
const base=process.argv[2]||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const routes=['/','/servicios/','/proyectos/','/planes/','/contacto/','/plantillas/','/en/','/en/services/','/en/proyects/','/en/plans/','/en/contact/','/en/templates/'];
 for(const route of routes){
  const response=await page.goto(base+route);
  if(response.status()!==200)throw Error(route+' status '+response.status());
  const state=await page.evaluate(()=>({h1:document.querySelectorAll('h1').length,overflow:document.documentElement.scrollWidth>innerWidth,robot:!!document.querySelector('.bm-robot,.robot-concierge'),emoji:[...document.body.innerText.replaceAll('©','').matchAll(/\p{Extended_Pictographic}/gu)].map(x=>x[0]),link:document.querySelector('.contact-shortcut')?.href}));
  if(state.h1!==1||state.overflow||state.robot||state.emoji.length||!state.link?.startsWith('https://wa.me/50660233159'))throw Error(route+JSON.stringify(state));
 }
 await page.goto(base+'/');
 await page.screenshot({path:'cleanup-desktop.png',fullPage:true});
 await page.getByRole('tab',{name:'Software',exact:true}).click();
 if(!await page.locator('#demo-software').isVisible())throw Error('Software tab');
 await page.getByRole('tab',{name:'Software',exact:true}).press('End');
 if(!await page.locator('#demo-it').isVisible())throw Error('Keyboard tabs');
 await page.goto(base+'/contacto/?service=software#reserva');
 if(await page.locator('#service').inputValue()!=='software')throw Error('Service preselection');
 await page.locator('#name').fill('Revisión BM');
 await page.locator('#message').fill('Necesito un sistema de reservas para mi negocio.');
 await page.evaluate(()=>{window.open=(url)=>{window.preparedUrl=url;return {opener:null};};});
 await page.getByRole('button',{name:'Solicitar sesión por WhatsApp'}).click();
 const prepared=await page.evaluate(()=>window.preparedUrl);
 if(!prepared?.startsWith('https://wa.me/50660233159?text=')||!decodeURIComponent(prepared).includes('Revisión BM'))throw Error('WhatsApp form');
 await page.setViewportSize({width:390,height:844});
 for(const route of routes){
  await page.goto(base+route);
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Mobile overflow '+route);
 }
 await page.goto(base+'/');
 await page.screenshot({path:'cleanup-mobile.png',fullPage:true});
 await page.locator('.menu').click();
 if(!await page.locator('#navigation').isVisible()||await page.locator('.menu').getAttribute('aria-expanded')!=='true')throw Error('Mobile menu');
 await page.locator('.menu').press('Escape');
 if(await page.locator('.menu').getAttribute('aria-expanded')!=='false')throw Error('Escape menu');
 await page.setViewportSize({width:820,height:1180});
 await page.goto(base+'/');
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Tablet overflow');
 await page.emulateMedia({reducedMotion:'reduce'});
 if(await page.locator('.client-slider-track').evaluate(el=>getComputedStyle(el).animationName)!=='none')throw Error('Reduced motion');
 if(errors.length)throw Error(JSON.stringify(errors));
 console.log(JSON.stringify({pages:12,desktop:true,mobile:true,tablet:true,form:true,tabs:true,menu:true,reducedMotion:true,emojis:0,browserErrors:0}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
