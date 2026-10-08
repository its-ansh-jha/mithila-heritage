import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {initialSite} from '../shared/catalog.js';
import {getSeo,buildSchemas,SITE_URL} from '../frontend/src/seo.js';
import {renderStaticBody} from './static-page-content.mjs';

const routes=[
 '/',
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
 const schema=`<script type="application/ld+json" id="seo-schema">${JSON.stringify(buildSchemas(route,initialSite,seo)).replaceAll('</script>','<\\/script>')}</script>`;
 html=replaceTag(html,/<script type="application\/ld\+json" id="seo-schema">[\s\S]*?<\/script>/i,schema);
 const body=renderStaticBody(route,initialSite);
 const h1Count=(body.match(/<h1(?:\s|>)/g)||[]).length;
 const h2Count=(body.match(/<h2(?:\s|>)/g)||[]).length;
 const linkCount=(body.match(/<a\s/g)||[]).length;
 const textOnly=body.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 const wordCount=textOnly.split(/\s+/).length;
 if(h1Count!==1||h2Count<1||linkCount<8||wordCount<120){
  throw new Error(`Incomplete SEO document for ${route}: H1=${h1Count}, H2=${h2Count}, links=${linkCount}, words=${wordCount}`);
 }
 if(route==='/'&&wordCount<250)throw new Error('Homepage prerender must contain at least 250 real words');
 if(!html.includes('<div id="root"></div>'))throw new Error('Root mount point not found in built HTML');
 html=html.replace('<div id="root"></div>',`<div id="root">${body}</div>`);
 const out=route==='/'?path.join(root,'dist','index.html'):path.join(root,'dist',route.slice(1),'index.html');
 await mkdir(path.dirname(out),{recursive:true});
 await writeFile(out,html);
}
console.log(`SEO complete page HTML generated for ${routes.length} indexable routes.`);
