const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, 'dist');
const origin = 'https://www.bmwebsolutionscr.com';
const errors = [], indexable = new Set(), titles = new Set(), descriptions = new Set();
let pages = 0, refs = 0, whatsappLinks = 0;
const attr = (tag, name) => tag.match(new RegExp('(?:^|\\s)' + name + '="([^"]*)"'))?.[1];
const fileFor = pathname => {
  const file = path.join(root, decodeURIComponent(pathname));
  return fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file, 'index.html') : file;
};
function inspect(file) {
  pages++;
  const html = fs.readFileSync(file, 'utf8');
  const report = message => errors.push(path.relative(root, file) + ': ' + message);
  if ((html.match(/<h1[ >]/g) || []).length !== 1) report('Expected one H1');
  if (/<(?:form|input|textarea|select)\b/.test(html)) report('Contact must not require form fields');
  for (const match of html.matchAll(/(?:href|src|poster)="(\/[^\"]*)"/g)) {
    const url = new URL(match[1], 'http://local');
    const target = fileFor(url.pathname);
    refs++;
    if (!fs.existsSync(target)) report('Missing local resource ' + match[1]);
    else if (url.hash && !fs.readFileSync(target, 'utf8').includes('id="' + url.hash.slice(1) + '"')) report('Missing anchor ' + match[1]);
  }
  for (const match of html.matchAll(/href="(https:\/\/wa\.me\/[^\"]*)"/g)) {
    const target = new URL(match[1]);
    whatsappLinks++;
    if (target.pathname !== '/50660233159' || !target.searchParams.get('text')?.trim()) report('Invalid WhatsApp number or empty message');
  }
  const meta = [...html.matchAll(/<meta\s[^>]+>/g)].map(match => match[0]);
  const links = [...html.matchAll(/<link\s[^>]+>/g)].map(match => match[0]);
  const description = attr(meta.find(tag => attr(tag, 'name') === 'description') || '', 'content');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!description || !title) report('Missing title or description');
  const is404 = file.endsWith(path.sep + '404.html');
  const robots = attr(meta.find(tag => attr(tag, 'name') === 'robots') || '', 'content') || '';
  if (is404) {
    if (!robots.includes('noindex')) report('404 must be noindex');
    return;
  }
  if (robots.includes('noindex')) report('Content page must be indexable');
  if (titles.has(title)) report('Duplicate title');
  if (descriptions.has(description)) report('Duplicate description');
  titles.add(title); descriptions.add(description);
  const canonical = attr(links.find(tag => attr(tag, 'rel') === 'canonical') || '', 'href');
  const relative = path.relative(root, file).replaceAll(path.sep, '/').replace(/index\.html$/, '');
  if (canonical !== origin + '/' + relative) report('Canonical must match this page');
  indexable.add(canonical);
  const alternates = links.filter(tag => attr(tag, 'hreflang'));
  for (const lang of ['es', 'en', 'x-default']) {
    const alternate = alternates.find(tag => attr(tag, 'hreflang') === lang);
    const href = alternate && attr(alternate, 'href');
    if (!href || !href.startsWith(origin + '/')) { report('Missing language alternate ' + lang); continue; }
    const target = fileFor(new URL(href).pathname);
    if (!fs.existsSync(target)) report('Missing translated page ' + lang);
    else if (!fs.readFileSync(target, 'utf8').includes('href="' + canonical + '"')) report('Language alternate must link back ' + lang);
  }
  const image = attr(meta.find(tag => attr(tag, 'property') === 'og:image') || '', 'content');
  if (!image?.startsWith(origin + '/') || !fs.existsSync(fileFor(new URL(image).pathname))) report('Missing local social image');
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  try {
    const graph = JSON.parse(schema)['@graph'];
    if (!graph?.some(node => node['@type'] === 'Organization') || !graph.some(node => node['@type'] === 'WebSite')) report('Missing business or website schema');
    if (!graph?.some(node => node.url === canonical)) report('Schema URL must match canonical');
  } catch { report('Invalid or missing JSON-LD'); }
}
function walk(dir) {
  for (const entry of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) inspect(file);
  }
}
walk(root);
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
if (new Set(locations).size !== locations.length) errors.push('Duplicate sitemap URLs');
for (const url of locations) if (!indexable.has(url)) errors.push('Sitemap URL is not a canonical indexable page: ' + url);
for (const url of indexable) if (!locations.includes(url)) errors.push('Canonical page missing from sitemap: ' + url);
if (!fs.readFileSync(path.join(root, 'robots.txt'), 'utf8').includes('Sitemap: ' + origin + '/sitemap.xml')) errors.push('robots.txt must advertise sitemap');
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(JSON.stringify({pages,indexablePages:indexable.size,localReferences:refs,whatsappLinks,errors:0}));
