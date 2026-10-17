const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const path=require('path');
const assert=(ok,message)=>{if(!ok)throw Error(message)};
const base='http://127.0.0.1:4181';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:920,height:715}});
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  for(const [home,contact,projects] of [['/','/contacto/','/proyectos/'],['/en/','/en/contact/','/en/proyects/']]){
   await page.goto(base+contact);
   assert(await page.locator('.booking-intro .hero-note').count()===0,'Removed contact note');
   assert(await page.locator('.motion-toggle').count()===0,'Removed motion toggle');
   assert(await page.locator('.socials a').count()===3,'Three social links');
   assert(await page.locator('.socials svg,.socials img').count()===3,'Three social logos');
   assert((await page.locator('.socials a').last().getAttribute('href')).startsWith('https://wa.me/50660233159?text='),'Social WhatsApp URL');
   for(const icon of await page.locator('.socials svg,.socials img').all()){const box=await icon.boundingBox();assert(box.width===20&&box.height===20,'Icon proportions');}
   await page.locator('.brand').click();await page.waitForURL(base+home);
   assert(await page.evaluate(()=>scrollY)<5,'Brand navigation lands at top');
   const details=page.locator('.faq-list details').first(),summary=details.locator('summary');
   await summary.scrollIntoViewIfNeeded();await summary.click();
   assert(await details.evaluate(e=>e.open),'FAQ starts opening');
   assert(await details.evaluate(e=>e.getAnimations().some(a=>a.playState==='running')),'FAQ animated height');
   await page.waitForTimeout(420);assert(await details.evaluate(e=>e.open&&!e.style.height),'FAQ expanded cleanup');
   await summary.click();await page.waitForTimeout(420);assert(!await details.evaluate(e=>e.open),'FAQ closes');
   await summary.focus();await page.keyboard.press('Enter');await page.waitForTimeout(420);assert(await details.evaluate(e=>e.open),'FAQ keyboard');
   // Reverse several times within the animation and check the final state.
   await details.evaluate(e=>{for(let i=0;i<5;i++)setTimeout(()=>e.querySelector('summary').click(),i*35)});
   await page.waitForTimeout(650);assert(!await details.evaluate(e=>e.open||e.style.height),'FAQ rapid reversal');
   await page.locator('.footer').scrollIntoViewIfNeeded();
   assert(await page.evaluate(()=>scrollY)>100,'Page scrolled before brand test');
   let requests=0;const count=request=>{if(request.isNavigationRequest())requests++};page.on('request',count);
   await page.locator('.brand').click();await page.waitForFunction(()=>scrollY<5);page.off('request',count);
   assert(requests===0,'Home brand scrolls without reload');
   await page.goto(base+projects);
   await page.evaluate(()=>{window.projectAnimationSeen=false;const card=document.querySelector('.project-card');const timer=setInterval(()=>{if(card.getAnimations().some(a=>a.playState==='running')){window.projectAnimationSeen=true;clearInterval(timer)}},10);setTimeout(()=>clearInterval(timer),2500)});
   await page.locator('.project-card').first().scrollIntoViewIfNeeded();
   await page.waitForFunction(()=>window.projectAnimationSeen);
   await page.waitForTimeout(850);assert(await page.locator('.project-card').first().evaluate(e=>getComputedStyle(e).opacity)==='1','Project visible after reveal');
  }
  console.log('Both languages: removals, logos, FAQ opening/closing, keyboard, rapid clicks, brand navigation and project reveal passed.');
  for(const width of [1440,920,390,320]){
   await page.setViewportSize({width,height:844});
   for(const route of ['/','/contacto/','/proyectos/']){await page.goto(base+route);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Overflow '+width+route)}
  }
  await page.emulateMedia({reducedMotion:'reduce'});await page.goto(base+'/');
  const first=page.locator('.faq-list details').first();await first.locator('summary').click();assert(await first.evaluate(e=>e.open),'Reduced motion opens');assert(await first.evaluate(e=>e.getAnimations().length)===0,'Reduced motion no animation');
  await first.locator('summary').click();assert(!await first.evaluate(e=>e.open),'Reduced motion closes');
  const plainContext=await browser.newContext({javaScriptEnabled:false}),plain=await plainContext.newPage();
  await plain.goto(base+'/');await plain.locator('.faq-list summary').first().click();assert(await plain.locator('.faq-list details').first().evaluate(e=>e.open),'Native FAQ without JS');await plainContext.close();
  await page.emulateMedia({reducedMotion:'no-preference'});
  for(const [name,route,width,selector] of [['faq','/',920,'.faq-section'],['footer','/',920,'.footer'],['contact','/contacto/',920,'.booking-intro'],['projects','/proyectos/',920,'.project-grid'],['mobile-footer','/',390,'.footer']]){
   await page.setViewportSize({width,height:715});await page.goto(base+route);await page.locator(selector).scrollIntoViewIfNeeded();
   if(name==='faq')await page.locator('.faq-list summary').first().click();
   await page.waitForTimeout(1000);await page.screenshot({path:path.join(__dirname,'browser-comment-'+name+'.png')});
  }
  assert(errors.length===0,'Browser errors: '+errors.join('\n'));
  console.log('Responsive widths, reduced motion, no-JS FAQ, console and screenshots passed.');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
