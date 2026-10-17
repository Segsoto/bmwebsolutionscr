const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const base=process.argv[2]||'http://127.0.0.1:4173';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 const routes=['/','/servicios/','/proyectos/','/planes/','/contacto/','/plantillas/','/en/','/en/services/','/en/proyects/','/en/plans/','/en/contact/','/en/templates/'];
 for(const route of routes){
  const response=await page.goto(base+route);
  if(response.status()!==200||!await page.locator('.bm-robot').isVisible())throw Error('Bot missing '+route);
  if(await page.locator('.contact-shortcut').count())throw Error('Duplicate contact shortcut');
  const emojis=await page.evaluate(()=>document.body.innerText.replaceAll('©','').match(/\p{Extended_Pictographic}/gu));
  if(emojis?.length)throw Error('Emoji '+route);
 }
 for(const width of [1440,390]){
  await page.setViewportSize({width,height:900});
  for(const locale of ['/','/en/']){
   await page.goto(base+locale);
   await page.locator('.chat-launch').click();
   if(!await page.locator('.chat-panel').isVisible())throw Error('Open bot');
   if(await page.locator('[data-topic]').count()!==6)throw Error('Options');
   for(const topic of ['website','store','software','support','monthly','guidance']){
    await page.locator(`[data-topic="${topic}"]`).click();
    await page.locator('.guide-more summary').click();
    await page.locator('#chat-details').fill('Necesito ayuda con las reservas de mi negocio.');
    const href=await page.locator('.chat-send').getAttribute('href');
    if(!href.startsWith('https://wa.me/50660233159?text=')||!decodeURIComponent(href).includes('Necesito ayuda'))throw Error('Context '+topic);
    if(!await page.locator('[data-guide-title]').innerText())throw Error('Answer '+topic);
    await page.locator('.guide-back').click();
   }
   await page.screenshot({path:`restored-bot-${width}${locale==='/en/'?'-en':''}.png`});
   if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Overflow');
   await page.locator('.chat-close').click();
   if(await page.locator('.chat-panel').isVisible())throw Error('Close bot');
   await page.locator('.chat-launch').click();
   await page.keyboard.press('Escape');
   if(await page.locator('.chat-panel').isVisible())throw Error('Escape');
  }
 }
 await page.goto(base+'/');
 await page.screenshot({path:'restored-bot-mobile.png'});
 await page.emulateMedia({reducedMotion:'reduce'});
 if(await page.locator('.robot-wave').evaluate(e=>getComputedStyle(e).animationName)!=='none')throw Error('Reduced motion');
 if(await page.locator('.demo-browser').evaluate(e=>getComputedStyle(e).animationName)!=='none')throw Error('Unwanted page animation');
 if(errors.length)throw Error(JSON.stringify(errors));
 console.log(JSON.stringify({pages:12,bot:true,topics:6,whatsappContext:true,desktop:true,mobile:true,bilingual:true,keyboard:true,reducedMotion:true,browserErrors:0}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
