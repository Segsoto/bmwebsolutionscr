const {chromium}=require('C:/Users/brand/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const output=path.join(__dirname,'github-update','dist','assets','previews');
const reportDir=path.join(__dirname,'project-recording-review');
const ffmpeg=path.join(__dirname,'.tools','video','imageio_ffmpeg','binaries','ffmpeg-win-x86_64-v7.1.exe');
const sites=[
 ['fuck-face','https://fuck-face.com/'],['almabela','https://almabelacr.com/'],['abogados','https://abogadosdelaguacima.com/'],
 ['charlie','https://charliemensajeria.com/index.html'],['granimar','https://www.granimarcr.com/'],['barber-magic','https://www.barbermagiccr.com/'],
 ['barber-system','https://sistema-barberia.vercel.app/'],['camisa-del-10','https://www.lacamisadel10.com/'],['aroarte','https://aroarte.com/'],['ap-signature','https://www.apsignaturetravel.com/']
];
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function inspect(browser,[slug,url]){
 const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:1});
 const page=await context.newPage();
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:25000});
  await page.waitForTimeout(1800);
  const state=await page.evaluate(()=>({title:document.title,text:document.body.innerText.slice(0,1100),height:document.documentElement.scrollHeight,viewport:innerHeight,url:location.href}));
  await page.screenshot({path:path.join(reportDir,slug+'.jpg'),type:'jpeg',quality:70});
  return {slug,url,status:response?.status(),...state};
 }catch(error){return {slug,url,error:error.message.split('\n')[0]};}
 finally{await context.close();}
}
async function record(browser,site,device){
 const [slug,url]=site, mobile=device==='mobile', viewport=mobile?{width:390,height:844}:{width:1280,height:800};
 const context=await browser.newContext({viewport,deviceScaleFactor:1,isMobile:mobile,hasTouch:mobile});
 const page=await context.newPage();
 try{
  const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  if(response?.status()>=400)throw Error('HTTP '+response.status());
  if(slug==='fuck-face')await page.locator('#pageLoader').waitFor({state:'hidden',timeout:20000});
  await page.waitForTimeout(2000);
  await page.evaluate(async()=>{
   await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1500))]);
   // Warm up lazy-loaded images before filming, then restore the actual start.
   const max=Math.min(document.documentElement.scrollHeight-innerHeight,innerHeight*5);
   for(let y=0;y<=max;y+=innerHeight){scrollTo({top:y,behavior:'instant'});await new Promise(resolve=>setTimeout(resolve,350));}
   scrollTo({top:0,behavior:'instant'});
   const loads=[];
   for(const image of document.images){
    const rect=image.getBoundingClientRect();
    if(rect.top>innerHeight*6||rect.bottom<0)continue;
    image.loading='eager';
    loads.push(image.decode().catch(()=>{}));
   }
   for(const element of document.querySelectorAll('body *')){
    const rect=element.getBoundingClientRect();if(rect.top>innerHeight*6||rect.bottom<0)continue;
    const background=getComputedStyle(element).backgroundImage;
    for(const match of background.matchAll(/url\(["']?(.*?)["']?\)/g)){
     const image=new Image();image.src=match[1];loads.push(image.decode().catch(()=>{}));
    }
   }
   await Promise.race([Promise.all(loads),new Promise(resolve=>setTimeout(resolve,15000))]);
  });
  await page.waitForLoadState('networkidle',{timeout:8000}).catch(()=>{});
  await page.waitForTimeout(1200);
  const state=await page.evaluate(()=>({height:document.documentElement.scrollHeight,viewport:innerHeight,title:document.title}));
  if(state.height<=state.viewport+100)throw Error('No public scrolling page');
  const poster=slug+'-'+device+'.jpg', filename=slug+'-'+device+'.mp4';
  await page.screenshot({path:path.join(output,poster),type:'jpeg',quality:82});
  const encoder=spawn(ffmpeg,['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','mjpeg','-framerate','24','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart',path.join(output,filename)],{windowsHide:true,stdio:['pipe','ignore','pipe']});
  let stderr='',pipeError;encoder.stderr.on('data',chunk=>stderr+=chunk);encoder.stdin.on('error',error=>pipeError=error);
  const finished=new Promise((resolve,reject)=>{encoder.on('error',reject);encoder.on('close',code=>code===0?resolve():reject(Error(stderr||'Encoder '+code)));});
  const cdp=await context.newCDPSession(page);let frame=await page.screenshot({type:'jpeg',quality:75});
  cdp.on('Page.screencastFrame',event=>{frame=Buffer.from(event.data,'base64');cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{});});
  await cdp.send('Page.startScreencast',{format:'jpeg',quality:78,maxWidth:viewport.width,maxHeight:viewport.height,everyNthFrame:1});
  let frames=0;const timer=setInterval(()=>{if(!pipeError&&!encoder.stdin.destroyed){encoder.stdin.write(frame);frames++;}},1000/24);
  try{
   await wait(650);
   await page.evaluate(async()=>{
    const travel=async(target,duration)=>{const from=scrollY,begin=performance.now();await new Promise(resolve=>{const tick=now=>{const p=Math.min(1,(now-begin)/duration);const eased=p<.5?2*p*p:1-Math.pow(-2*p+2,2)/2;scrollTo({top:from+(target-from)*eased,behavior:'instant'});if(p<1)requestAnimationFrame(tick);else resolve();};requestAnimationFrame(tick);});};
    const bottom=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,innerHeight*5));
    await travel(bottom,6500);await new Promise(resolve=>setTimeout(resolve,500));
    await travel(0,6500);
   });
   await wait(650);
  }finally{clearInterval(timer);await cdp.send('Page.stopScreencast').catch(()=>{});encoder.stdin.end();}
  await finished;
  if(pipeError)throw pipeError;
  const result={src:'/assets/previews/'+filename,poster:'/assets/previews/'+poster,width:viewport.width,height:viewport.height,bytes:fs.statSync(path.join(output,filename)).size,duration:frames/24};
  console.log(JSON.stringify({recorded:slug,device,megabytes:(result.bytes/1048576).toFixed(2),seconds:result.duration.toFixed(1)}));return result;
 }finally{await context.close();}
}
(async()=>{
 fs.mkdirSync(output,{recursive:true});fs.mkdirSync(reportDir,{recursive:true});
 const browser=await chromium.launch({headless:true,channel:'msedge'});
 try{
  if(process.argv.includes('--audit')){
   const audit=[];
   for(let i=0;i<sites.length;i+=2){const batch=await Promise.all(sites.slice(i,i+2).map(site=>inspect(browser,site)));audit.push(...batch);batch.forEach(item=>console.log(JSON.stringify(item)));}
   fs.writeFileSync(path.join(reportDir,'audit.json'),JSON.stringify(audit,null,2));return;
  }
  const audit=JSON.parse(fs.readFileSync(path.join(reportDir,'audit.json'),'utf8'));
  const selected=sites.filter(([slug])=>{const item=audit.find(entry=>entry.slug===slug);return item&&!item.error&&item.status<400&&item.height>item.viewport+100&&!/vercel authentication|log in to vercel|sign in to vercel|verify you are human|attention required/i.test(item.title+' '+item.text);});
  const manifestPath=path.join(__dirname,'github-update','recordings.json');
  const manifest=fs.existsSync(manifestPath)?JSON.parse(fs.readFileSync(manifestPath,'utf8')):{};
  for(const site of selected){
   const entry={slug:site[0],url:site[1],capturedOn:'2026-10-16'};
   const results=await Promise.allSettled(['desktop','mobile'].map(device=>record(browser,site,device)));
   results.forEach((result,i)=>{if(result.status==='fulfilled')entry[['desktop','mobile'][i]]=result.value;else console.log(JSON.stringify({failed:site[0],device:['desktop','mobile'][i],reason:String(result.reason)}));});
   if(entry.desktop||entry.mobile)manifest[site[1]]=entry;
   fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+'\n');
  }
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1});
