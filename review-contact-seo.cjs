const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'github-update','dist');
const assert=(value,message)=>{if(!value)throw Error(message)};
const base='http://127.0.0.1:4181';
const seo=require('./github-update/service-pages.cjs');
const routes=['/','/en/','/servicios/','/en/services/','/planes/','/en/plans/','/proyectos/','/en/proyects/','/contacto/','/en/contact/','/plantillas/','/en/templates/','/privacidad/','/en/privacy/','/terminos/','/en/terms/','/404.html','/en/404.html',...Object.values(seo.routes).flat()];
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
 const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
 const logo='data:image/png;base64,'+fs.readFileSync(path.join(root,'assets','logo.png')).toString('base64');
 await page.setContent(`<html lang="es"><head><style>*{box-sizing:border-box}body{margin:0;background:#f9fafb;color:#172b3a;font-family:Arial,sans-serif}.cover{width:1200px;height:630px;position:relative;overflow:hidden;padding:62px 72px;border-top:10px solid #175fe8}.brand{display:flex;align-items:center;gap:18px;font-size:23px;font-weight:700}.crop{position:relative;width:54px;height:60px;overflow:hidden}.crop img{position:absolute;width:145px;max-width:none;left:-44px;top:-10px}.tag{font-size:14px;letter-spacing:3px;color:#175fe8;margin:43px 0 23px}h1{font-size:70px;line-height:1.05;letter-spacing:-3px;margin:0;font-weight:700}h1 span{color:#175fe8}.bottom{display:flex;align-items:center;gap:17px;margin-top:35px;font-size:18px}.dot{width:10px;height:10px;background:#175fe8;border-radius:50%}.orb{position:absolute;width:430px;height:430px;border:1px solid #a3b9df;border-radius:50%;right:-145px;top:80px;z-index:-1}.orb:after{content:'';position:absolute;inset:48px;border:1px solid #cad7ec;border-radius:50%}.badge{position:absolute;right:72px;bottom:66px;background:#d7f2b0;color:#172b3a;border-radius:7px;padding:17px 22px;font-size:18px}</style></head><body><div class="cover"><div class="brand"><span class="crop"><img src="${logo}"></span>BM Web Solutions</div><p class="tag">TU EQUIPO DIGITAL · COSTA RICA</p><h1>Diseño web, software<br>y <span>soporte de TI.</span></h1><div class="bottom"><span class="dot"></span>bmwebsolutionscr.com</div><div class="badge">Hablemos por WhatsApp</div><div class="orb"></div></div></body></html>`);
 await page.screenshot({path:path.join(root,'assets','social-cover.png')});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const titles=new Set(),descriptions=new Set();let links=0;
 for(const width of [1440,820,390,320]){
  await page.setViewportSize({width,height:width===1440?1000:844});
  for(const route of routes){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});
   assert(response.status()===200,'HTTP '+route);
   await page.emulateMedia({reducedMotion:'reduce'});
   const state=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,forms:document.querySelectorAll('form,input,textarea,select').length,title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,alternates:[...document.querySelectorAll('link[hreflang]')].map(e=>({lang:e.hreflang,url:e.href})),schema:[...document.querySelectorAll('script[type="application/ld+json"]')].map(e=>JSON.parse(e.textContent)),whatsapp:[...document.querySelectorAll('a[href^="https://wa.me/"]')].map(e=>e.href),primary:document.querySelector('.header .btn')?.href,body:document.body.innerText}));
   assert(!state.overflow,'Overflow '+width+route);
   assert(state.h1===1,'H1 '+route);assert(state.forms===0,'Form fields '+route);
   assert(state.primary.startsWith('https://wa.me/50660233159?text='),'Header CTA '+route);
   assert(!/Reservar una sesión|Book a session|campos.*obligatorios/.test(state.body),'Old form copy '+route);
   for(const link of state.whatsapp){const target=new URL(link);assert(target.pathname==='/50660233159','Phone '+route);assert(target.searchParams.get('text')?.length>15,'Missing prepared message '+route);links++;}
   if(width===1440&&!route.includes('404')){
    assert(!titles.has(state.title),'Duplicate title '+route);titles.add(state.title);
    assert(!descriptions.has(state.description),'Duplicate description '+route);descriptions.add(state.description);
    assert(state.canonical==='https://www.bmwebsolutionscr.com'+route,'Canonical '+route);
    assert(state.alternates.length===3&&state.alternates.some(a=>a.lang==='x-default'),'Hreflang '+route);
    assert(state.schema[0]['@graph'].some(e=>e['@type']==='Organization'),'Organization schema '+route);
    if(Object.values(seo.routes).flat().includes(route)) assert(state.schema[0]['@graph'].some(e=>e['@type']==='Service'),'Service schema '+route);
   }
  }
 }
 console.log('26 pages at 1440, 820, 390 and 320px: no overflow or form fields; '+links+' WhatsApp links checked; 24 unique titles and descriptions.');
 for(const locale of ['/','/en/']){
  await page.setViewportSize({width:390,height:844});await page.goto(base+locale);
  await page.locator('.chat-launch').click();
  assert(await page.locator('.chat-panel').isVisible(),'Bot opens');
  for(const topic of ['website','store','software','support','monthly','guidance']){
   await page.locator(`[data-topic="${topic}"]`).click();
   const message=new URL(await page.locator('.chat-send').getAttribute('href')).searchParams.get('text');assert(message.length>30,'Bot message '+topic);
   assert(await page.locator('.guide-result').isVisible(),'Bot result');
   await page.locator('.guide-back').click();
  }
  await page.keyboard.press('Escape');assert(!await page.locator('.chat-panel').isVisible(),'Bot closes');
  const href=await page.locator('.hero .btn').getAttribute('href');
  await page.route('https://wa.me/**',route=>route.fulfill({status:200,contentType:'text/html',body:'WhatsApp destination intercepted for testing'}));
  await page.locator('.hero .btn').click();assert(page.url()===href,'Direct CTA navigation');
  await page.unroute('https://wa.me/**');
 }
 const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}}),plain=await nojs.newPage();
 for(const route of ['/contacto/','/en/contact/','/soporte-ti-costa-rica/']){await plain.goto(base+route);assert(await plain.locator('a[href^="https://wa.me/50660233159?text="]').count()>5,'No-JS WhatsApp '+route);assert(await plain.locator('form').count()===0,'No-JS form');}
 await nojs.close();
 for(const [name,route,width] of [['contact-desktop','/contacto/',1440],['contact-mobile','/contacto/',390],['home-desktop','/',1440],['home-mobile','/',390],['support-desktop','/soporte-ti-costa-rica/',1440],['web-mobile','/diseno-web-costa-rica/',390]]){await page.setViewportSize({width,height:width===1440?1000:844});await page.goto(base+route);await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:path.join(__dirname,'whatsapp-seo-'+name+'.png'),fullPage:true});}
 assert(errors.length===0,'Browser errors: '+errors.join('\n'));
 const missing=await page.goto(base+'/not-a-page');assert(missing.status()===404,'404 status');
 console.log('Both languages: bot topics, direct CTA navigation, no-JS contact, 404 and browser console passed. Screenshots saved.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
