const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4185';
const assert=(value,message)=>{if(!value)throw Error(message);};
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try {
  const page=await browser.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
   window.reviewTextAnimations=[];
   const animate=Element.prototype.animate;
   Element.prototype.animate=function(...args){
    const animation=animate.apply(this,args);
    if(this.matches('.motion-piece,.motion-char'))window.reviewTextAnimations.push(animation);
    return animation;
   };
  });
  for(const [width,route,theme] of [[598,'/','dark'],[598,'/en/','light'],[390,'/en/plans/','dark'],[1440,'/','light']]){
   await page.setViewportSize({width,height:715});
   await page.emulateMedia({colorScheme:theme,reducedMotion:'no-preference'});
   await page.goto(base+route);
   await page.evaluate(()=>document.fonts.ready);
   await page.waitForFunction(()=>window.reviewTextAnimations.length>0);
   await page.evaluate(()=>window.reviewTextAnimations.forEach(animation=>{
    const timing=animation.effect.getTiming();animation.pause();animation.currentTime=timing.delay+timing.duration*.5;
   }));
   assert(await page.locator('.motion-mask').evaluateAll(elements=>elements.every(e=>getComputedStyle(e).overflow==='visible')),'Animated words must allow full glyph bounds');
   assert(await page.locator('.motion-piece,.motion-char').evaluateAll(elements=>elements.every(e=>getComputedStyle(e).clipPath==='none')),'No letter clipping during animation');
   if(width===598&&route==='/')await page.screenshot({path:'text-animation-mid-598.png'});
   await page.evaluate(()=>window.reviewTextAnimations.forEach(animation=>animation.finish()));
   assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Responsive overflow '+width+route);
   assert(await page.locator('h1').innerText(),'Heading remains readable');
   if(width<=760){
    const menu=page.locator('.menu'),english=route.startsWith('/en/');
    assert((await menu.innerText()).trim()==='','Navigation button has no visible label');
    assert(await menu.getAttribute('aria-label')===(english?'Open menu':'Abrir menú'),'Accessible open name');
    assert(Math.round((await menu.boundingBox()).width)===44,'44 px navigation control');
    await menu.click();
    assert(await menu.getAttribute('aria-expanded')==='true','Navigation opens');
    assert(await menu.getAttribute('aria-label')===(english?'Close menu':'Cerrar menú'),'Accessible close name');
    await page.keyboard.press('Escape');
    assert(await menu.getAttribute('aria-expanded')==='false','Escape closes navigation');
   }
   if(width===598&&route==='/')await page.screenshot({path:'text-animation-final-598.png'});
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.emulateMedia({colorScheme:'dark'});
  await page.goto(base);
  assert(await page.locator('.robot-pointer-light').count()===0,'No beam to the cursor');
  await page.mouse.move(300,300);await page.waitForTimeout(180);
  const first=await page.locator('.robot-eye-flare').first().evaluate(e=>e.style.getPropertyValue('--flare-angle'));
  await page.mouse.move(1400,500);await page.waitForTimeout(180);
  const second=await page.locator('.robot-eye-flare').first().evaluate(e=>e.style.getPropertyValue('--flare-angle'));
  assert(first&&first!==second,'Local flare changes direction');
  await page.mouse.move(900,450);await page.waitForTimeout(700);
  await page.screenshot({path:'soft-orange-flare-desktop.png'});
  await page.locator('.chat-launch').focus();await page.locator('.chat-launch').click();
  assert(!await page.locator('.bm-robot').evaluate(e=>e.classList.contains('robot-tracking')),'Opening chat clears flare');
  await page.keyboard.press('Escape');
  await page.emulateMedia({reducedMotion:'reduce'});
  assert(await page.locator('.robot-eye-flare').first().evaluate(e=>getComputedStyle(e).display)==='none','Reduced motion keeps fixed eye glow');
  assert(!errors.length,'Browser errors: '+errors.join(', '));
  console.log(JSON.stringify({animatedTextUnclipped:true,iconOnlyMenu:true,keyboard:true,bilingual:true,widths:[390,598,1440],localOrangeFlare:true,browserErrors:0}));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
