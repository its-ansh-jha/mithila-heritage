import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter,Routes,Route,useLocation,Navigate} from 'react-router-dom';
import {Header,Footer,ScrollEffects,Status} from './components';
import Home from './Home';
import {Rooms,RoomDetail,Restaurant,Banquet,About,Gallery,Contact,NotFound} from './Pages';
import Policy from './Policies';
import Booking,{ManageBooking} from './Booking';
import {initialSite} from '../../shared/catalog';
import {api} from './api';
import {WhatsAppFloat} from './WhatsApp';
import './styles.css';
import './modern.css';
import './night.css';
import './royal.css';
import './whatsapp.css';
import {MotionProvider} from './Motion';
import {getSeo,buildSchemas,SITE_URL} from './seo';
function Metadata({site}){
 const {pathname}=useLocation();
 useEffect(()=>{
  const seo=getSeo(pathname,site);
  const noindex=/^\/(admin|account|manage|book)(\/|$)/.test(pathname);
  document.documentElement.lang='en-IN';
  document.title=seo.title;
  function meta(selector,attrs){
   let el=document.head.querySelector(selector);
   if(!el){el=document.createElement('meta');document.head.appendChild(el);}
   Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));
  }
  meta('meta[name="description"]',{name:'description',content:seo.description});
  meta('meta[name="robots"]',{name:'robots',content:noindex?'noindex,nofollow':'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'});
  meta('meta[name="googlebot"]',{name:'googlebot',content:noindex?'noindex,nofollow':'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'});
  meta('meta[property="og:site_name"]',{property:'og:site_name',content:'Mithila Heritage'});
  meta('meta[property="og:title"]',{property:'og:title',content:seo.title});
  meta('meta[property="og:description"]',{property:'og:description',content:seo.description});
  meta('meta[property="og:url"]',{property:'og:url',content:seo.canonical});
  meta('meta[property="og:type"]',{property:'og:type',content:'website'});
  meta('meta[property="og:locale"]',{property:'og:locale',content:'en_IN'});
  const image=seo.image?.startsWith('http')?seo.image:SITE_URL+(seo.image||'/images/IMG_3446.webp');
  meta('meta[property="og:image"]',{property:'og:image',content:image});
  meta('meta[property="og:image:alt"]',{property:'og:image:alt',content:'Mithila Heritage hotel in Patna'});
  meta('meta[name="twitter:card"]',{name:'twitter:card',content:'summary_large_image'});
  meta('meta[name="twitter:title"]',{name:'twitter:title',content:seo.title});
  meta('meta[name="twitter:description"]',{name:'twitter:description',content:seo.description});
  meta('meta[name="twitter:image"]',{name:'twitter:image',content:image});
  let canonical=document.querySelector('link[rel="canonical"]');
  if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical);}
  canonical.href=seo.canonical;
  let logo=document.querySelector('link[rel="apple-touch-icon"]');
  if(!logo){logo=document.createElement('link');logo.rel='apple-touch-icon';document.head.appendChild(logo);}
  logo.href='/images/fav.png';
  let schema=document.querySelector('#seo-schema');
  if(!schema){schema=document.createElement('script');schema.type='application/ld+json';schema.id='seo-schema';document.head.appendChild(schema);}
  schema.textContent=JSON.stringify(buildSchemas(pathname,site,seo));
 },[pathname,site]);
 return null;
}
class ErrorBoundary extends React.Component{state={error:false};static getDerivedStateFromError(){return {error:true};}render(){return this.state.error?<main className="section container"><h1>A little pause.</h1><p>This page encountered an unexpected error. Please reload or call the hotel.</p><button className="button" onClick={()=>window.location.reload()}>Reload the page</button></main>:this.props.children;}}
function App(){const [site,setSite]=useState(initialSite);useEffect(()=>{let active=true;api('/site').then(r=>{if(active)setSite(r.site);}).catch(()=>{});return()=>{active=false;};},[]);return <><Metadata site={site}/><Header/><ScrollEffects/><main id="main"><Routes><Route path="/" element={<Home site={site}/>}/><Route path="/rooms" element={<Rooms site={site}/>}/><Route path="/rooms/:id" element={<RoomDetail site={site}/>}/><Route path="/restaurant" element={<Restaurant site={site}/>}/><Route path="/banquet" element={<Banquet site={site}/>}/><Route path="/property" element={<Navigate to="/banquet" replace/>}/><Route path="/about" element={<About site={site}/>}/><Route path="/gallery" element={<Gallery site={site}/>}/><Route path="/contact" element={<Contact site={site}/>}/><Route path="/policies" element={<Policy site={site}/>}/><Route path="/policies/:type" element={<Policy site={site}/>}/><Route path="/book" element={<Booking site={site}/>}/><Route path="/account/*" element={<Navigate to="/book" replace/>}/><Route path="/manage" element={<ManageBooking/>}/><Route path="/admin/*" element={<Navigate to="/" replace/>}/><Route path="*" element={<NotFound/>}/></Routes></main><Footer site={site}/><WhatsAppFloat/></>}
createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><MotionProvider><ErrorBoundary><App/></ErrorBoundary></MotionProvider></BrowserRouter></React.StrictMode>);
