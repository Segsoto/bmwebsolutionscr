const fs=require('fs');
for(const name of ['inicio','planes','servicios','proyectos','contacto','en']) {
 const s=fs.readFileSync('research/'+name+'.html','utf8');
 const body=s.slice(s.indexOf('<body')).replace(/<script[\s\S]*?<\/script>/g,'').replace(/<style[\s\S]*?<\/style>/g,'');
 console.log('\nPAGE '+name+'\n'+body.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,22000));
 const imgs=[...body.matchAll(/<img\b[^>]*src="([^"]+)"[^>]*>/g)].map(x=>x[1]);console.log('\nIMAGES '+[...new Set(imgs)].join('\n'));
}
