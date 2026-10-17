const fs=require('fs'),path=require('path');
const file=path.join(__dirname,'recordings.json');
const recordings=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
module.exports=({t})=>{
 const icons={desktop:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/>',mobile:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',play:'<path d="m9 5 11 7-11 7z"/>',pause:'<path d="M8 5v14M16 5v14"/>'};
 const icon=name=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
 const entryFor=url=>recordings[url];
 const visual=(url,name,fallback,priority=false)=>{
  const entry=entryFor(url);if(!entry)return fallback;
  const first=entry.desktop||entry.mobile;
  return `<video class="project-film" data-preview-video data-desktop-src="${(entry.desktop||first).src}" data-mobile-src="${(entry.mobile||first).src}" data-desktop-poster="${(entry.desktop||first).poster}" data-mobile-poster="${(entry.mobile||first).poster}" width="${first.width}" height="${first.height}" poster="${first.poster}" muted loop playsinline preload="none" disablepictureinpicture aria-label="${t('Recorrido del sitio de ','Website tour for ')+name}"><img src="${first.poster}" alt="${t('Vista del sitio de ','Website view for ')+name}" width="${first.width}" height="${first.height}" ${priority?'fetchpriority="high"':'loading="lazy"'}></video>`;
 };
 const controls=url=>{
  const entry=entryFor(url);if(!entry)return '';
  return `<div class="preview-controls" role="group" aria-label="${t('Vista y reproducción del proyecto','Project view and playback')}"><div class="preview-devices">${entry.desktop&&entry.mobile?['desktop','mobile'].map(device=>`<button type="button" data-preview-device="${device}" aria-pressed="${device==='desktop'}">${icon(device)}<span>${device==='desktop'?t('Escritorio','Desktop'):t('Móvil','Mobile')}</span></button>`).join(''):''}</div><button type="button" class="preview-play" data-preview-play aria-label="${t('Reproducir video','Play video')}"><span data-play-icon>${icon('play')}</span><span data-play-label>${t('Reproducir','Play')}</span></button></div>`;
 };
 return {visual,controls};
};
