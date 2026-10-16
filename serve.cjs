const http=require('http'),fs=require('fs'),path=require('path');
const base=path.join(__dirname,'dist');
const port=Number(process.env.BM_PREVIEW_PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.mp4':'video/mp4','.svg':'image/svg+xml','.ico':'image/x-icon','.webmanifest':'application/manifest+json'};
http.createServer((req,res)=>{
 let pathname;
 try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 let file=path.resolve(base,'.'+pathname);
 if(!file.startsWith(base+path.sep)&&file!==base){res.writeHead(403);return res.end();}
 if(fs.existsSync(file)&&fs.statSync(file).isDirectory())file=path.join(file,'index.html');
 if(!fs.existsSync(file)){
  const fallback=path.join(base,pathname.startsWith('/en/')?'en/404.html':'404.html');
  res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});
  return req.method==='HEAD'?res.end():fs.createReadStream(fallback).pipe(res);
 }
 const stat=fs.statSync(file),type=types[path.extname(file)]||'application/octet-stream';
 if(req.headers.range){
  const m=req.headers.range.match(/^bytes=(\d+)-(\d*)$/);
  if(m){
   const start=Number(m[1]),end=m[2]?Math.min(Number(m[2]),stat.size-1):stat.size-1;
   if(start>end){res.writeHead(416);return res.end();}
   res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Accept-Ranges':'bytes','Content-Length':end-start+1});
   return req.method==='HEAD'?res.end():fs.createReadStream(file,{start,end}).pipe(res);
  }
 }
 res.writeHead(200,{'Content-Type':type,'Content-Length':stat.size,'Accept-Ranges':'bytes'});
 req.method==='HEAD'?res.end():fs.createReadStream(file).pipe(res);
}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
