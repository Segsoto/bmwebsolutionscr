const fs=require('fs'),path=require('path'),{spawn}=require('child_process');
const root=path.join(__dirname,'github-update'),file=path.join(root,'recordings.json'),manifest=JSON.parse(fs.readFileSync(file,'utf8'));
const masters=path.join(__dirname,'project-recording-review','masters');fs.mkdirSync(masters,{recursive:true});
const ffmpeg=path.join(__dirname,'.tools','video','imageio_ffmpeg','binaries','ffmpeg-win-x86_64-v7.1.exe');
async function optimize(item,device){
 if(item.optimized)return;
 const target=path.join(root,'dist',item.src),master=path.join(masters,path.basename(target));
 fs.copyFileSync(target,master);
 const args=['-hide_banner','-loglevel','error','-y','-i',master,'-an','-c:v','libx264','-preset','medium','-crf','29','-pix_fmt','yuv420p','-movflags','+faststart'];
 if(device==='desktop')args.push('-vf','scale=960:600');args.push(target);
 const process=spawn(ffmpeg,args,{windowsHide:true,stdio:['ignore','ignore','pipe']});let error='';process.stderr.on('data',chunk=>error+=chunk);
 await new Promise((resolve,reject)=>{process.on('error',reject);process.on('close',code=>code===0?resolve():reject(Error(error)))});
 item.bytes=fs.statSync(target).size;item.optimized=true;if(device==='desktop'){item.width=960;item.height=600;}
 console.log(path.basename(target)+' '+(item.bytes/1048576).toFixed(2)+' MB');
}
(async()=>{for(const entry of Object.values(manifest)){await Promise.all(Object.entries(entry).filter(([key])=>['desktop','mobile'].includes(key)).map(([device,item])=>optimize(item,device)));}fs.writeFileSync(file,JSON.stringify(manifest,null,2)+'\n');})().catch(error=>{console.error(error);process.exitCode=1});
