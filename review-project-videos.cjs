const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path');
const base='http://127.0.0.1:4181',assert=(value,message)=>{if(!value)throw Error(message)};
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const locale of ['/','/en/']){
   await page.goto(base+locale);
   assert(await page.locator('.project-film').count()===3,'Hero and featured project videos');
   const shell=page.locator('.demo-browser'),video=shell.locator('video');
   await page.waitForFunction(()=>document.querySelector('.demo-browser video').currentTime>.1);
   assert((await video.getAttribute('src')).includes('-desktop.mp4'),'Desktop source selected');
   assert(await page.locator('.work-section video[src]').count()===0,'Offscreen videos not loaded');
   await shell.locator('[data-preview-play]').click();
   const pausedTime=await video.evaluate(e=>e.currentTime);await page.waitForTimeout(350);
   assert(await video.evaluate(e=>e.paused)&&Math.abs(await video.evaluate(e=>e.currentTime)-pausedTime)<.05,'Manual pause');
   await shell.locator('[data-preview-play]').click();await page.waitForTimeout(400);assert(await video.evaluate(e=>e.currentTime)>pausedTime,'Manual play');
   await shell.locator('[data-preview-device=mobile]').click();
   await page.waitForFunction(()=>document.querySelector('.demo-browser video').videoHeight===844);
   assert((await video.getAttribute('src')).includes('-mobile.mp4'),'Mobile source');
   await page.locator('#tab-software').click();await page.waitForTimeout(200);
   assert(await video.evaluate(e=>e.paused),'Hidden showcase video paused');
   assert(await page.locator('#demo-software .demo-caption').count()===0,'Removed software caption');
   await page.locator('#tab-web').click();await page.waitForTimeout(200);
   await page.locator('.faq-section').scrollIntoViewIfNeeded();await page.waitForTimeout(200);
   assert(await video.evaluate(e=>e.paused),'Offscreen hero paused');
  }
  for(const width of [1440,920,390,320]){
   await page.setViewportSize({width,height:844});
   for(const route of ['/','/proyectos/','/en/','/en/proyects/']){
    await page.goto(base+route);assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Overflow '+width+route);
    const shell=page.locator('[data-preview-shell]').first();await shell.scrollIntoViewIfNeeded();
    const expected=width<=760?'mobile':'desktop';assert(await shell.locator(`[data-preview-device=${expected}]`).getAttribute('aria-pressed')==='true','Responsive view '+width);
   }
  }
  await page.setViewportSize({width:1440,height:1000});await page.goto(base+'/proyectos/');
  assert(await page.locator('video').count()===8,'Eight public project tours');
  const card=page.locator('.project-card').first();
  await page.evaluate(()=>scrollTo({top:document.querySelectorAll('.project-card')[3].getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(180);
  await page.evaluate(()=>scrollTo({top:document.querySelector('.project-card').getBoundingClientRect().top+scrollY-150,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('.project-card').getAnimations().some(a=>a.effect.getKeyframes()[0].transform?.includes('-32px')));
  await page.waitForTimeout(800);assert(await card.evaluate(e=>getComputedStyle(e).opacity)==='1','Upward reveal settles');
  await page.evaluate(()=>scrollTo({top:document.querySelectorAll('.project-card')[3].getBoundingClientRect().top+scrollY,behavior:'instant'}));await page.waitForTimeout(180);
  await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
  await page.waitForFunction(()=>document.querySelector('h1 .motion-piece')?.getAnimations().some(a=>a.effect.getKeyframes()[0].transform?.includes('-85%')));
  const reduced=await browser.newContext({reducedMotion:'reduce',viewport:{width:390,height:844}}),quiet=await reduced.newPage();
  let videoRequests=0;quiet.on('request',request=>{if(request.url().includes('.mp4'))videoRequests++});
  await quiet.goto(base+'/');await quiet.waitForTimeout(400);
  assert(videoRequests===0,'Reduced motion does not download or autoplay video');
  assert(await quiet.locator('.demo-browser video').evaluate(e=>e.paused),'Reduced motion poster');
  await quiet.locator('.demo-browser [data-preview-play]').click();
  await quiet.waitForFunction(()=>document.querySelector('.demo-browser video').currentTime>.1);
  assert(videoRequests>0,'Explicit play available with reduced motion');await reduced.close();
  const plainContext=await browser.newContext({javaScriptEnabled:false}),plain=await plainContext.newPage();await plain.goto(base+'/proyectos/');
  assert(await plain.locator('video[poster]').count()===8,'Poster fallback without JavaScript');assert(await plain.locator('.preview-controls').first().isVisible()===false,'No dead controls without JS');await plainContext.close();
  for(const [name,route,width,selector] of [['home-desktop','/',1440,'.hero'],['home-mobile','/',390,'.showcase'],['projects-desktop','/proyectos/',1440,'.project-grid'],['projects-mobile','/proyectos/',390,'.project-card']]){
   await page.setViewportSize({width,height:1000});await page.goto(base+route);await page.locator(selector).first().scrollIntoViewIfNeeded();await page.waitForTimeout(1500);await page.screenshot({path:path.join(__dirname,'video-final-'+name+'.png')});
  }
  assert(errors.length===0,'Browser errors '+errors.join('\n'));
  const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'github-update','recordings.json'),'utf8'));
  assert(Object.keys(manifest).length===8,'Recording manifest size');
  let totalBytes=0;
  for(const item of Object.values(manifest))for(const device of ['desktop','mobile']){const entry=item[device];assert(entry.duration>10&&entry.duration<20,'Clip duration');assert(entry.bytes===fs.statSync(path.join(__dirname,'github-update','dist',entry.src)).size,'Asset bytes');totalBytes+=entry.bytes;}
  console.log(JSON.stringify({projects:8,clips:16,totalMegabytes:(totalBytes/1048576).toFixed(2),checks:'Responsive views, playback, lazy loading, hidden-tab pause, both scroll directions, reduced motion, no-JS posters and console passed'}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
