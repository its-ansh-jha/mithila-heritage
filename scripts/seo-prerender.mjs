import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {initialSite} from '../shared/catalog.js';
import {getSeo,SITE_URL} from '../frontend/src/seo.js';

const routes=[
 '/rooms',
 '/rooms/heritage-classic',
 '/rooms/heritage-deluxe',
 '/rooms/royal-premium',
 '/rooms/maharaja-suite',
 '/restaurant',
 '/banquet',
 '/about',
 '/gallery',
 '/contact'
];

const root=process.cwd();
const base=await readFile(path.join(root,'dist','index.html'),'utf8');
const escape=value=>String(value??'').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');

function replaceTag(html,pattern,tag){
 return pattern.test(html)?html.replace(pattern,tag):html.replace('</head>',tag+'</head>');
}

for(const route of routes){
 const seo=getSeo(route,initialSite);
 const image=seo.image?.startsWith('http')?seo.image:SITE_URL+(seo.image||'/images/IMG_3446.webp');
 let html=base;
 html=replaceTag(html,/<title>[^<]*<\/title>/i,`<title>${escape(seo.title)}</title>`);
 html=replaceTag(html,/<meta name="description"[^>]*>/i,`<meta name="description" content="${escape(seo.description)}"/>`);
 html=replaceTag(html,/<link rel="canonical"[^>]*>/i,`<link rel="canonical" href="${escape(seo.canonical)}"/>`);
 html=replaceTag(html,/<meta property="og:title"[^>]*>/i,`<meta property="og:title" content="${escape(seo.title)}"/>`);
 html=replaceTag(html,/<meta property="og:description"[^>]*>/i,`<meta property="og:description" content="${escape(seo.description)}"/>`);
 html=replaceTag(html,/<meta property="og:url"[^>]*>/i,`<meta property="og:url" content="${escape(seo.canonical)}"/>`);
 html=replaceTag(html,/<meta property="og:image"[^>]*>/i,`<meta property="og:image" content="${escape(image)}"/>`);
 html=replaceTag(html,/<meta name="twitter:title"[^>]*>/i,`<meta name="twitter:title" content="${escape(seo.title)}"/>`);
 html=replaceTag(html,/<meta name="twitter:description"[^>]*>/i,`<meta name="twitter:description" content="${escape(seo.description)}"/>`);
 html=replaceTag(html,/<meta name="twitter:image"[^>]*>/i,`<meta name="twitter:image" content="${escape(image)}"/>`);
 const out=path.join(root,'dist',route.slice(1),'index.html');
 await mkdir(path.dirname(out),{recursive:true});
 await writeFile(out,html);
}
console.log(`SEO route heads generated for ${routes.length} indexable routes.`);
