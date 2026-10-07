import React,{createContext,useContext,useEffect,useState,useRef} from 'react';
import {useLocation} from 'react-router-dom';
import {animate,stagger,svg} from 'animejs';
import {Pause,Play} from 'lucide-react';
const MotionContext=createContext({enabled:true});
export function MotionProvider({children}){
 const [systemReduced,setSystemReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [paused,setPaused]=useState(()=>{try{return localStorage.getItem('mh-motion-paused')==='true';}catch{return false;}});
 useEffect(()=>{const mq=window.matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setSystemReduced(mq.matches);mq.addEventListener('change',update);return()=>mq.removeEventListener('change',update);},[]);
 const enabled=!systemReduced&&!paused;
 useEffect(()=>{document.documentElement.dataset.motion=enabled?'full':'reduced';},[enabled]);
 function toggle(){setPaused(v=>{try{localStorage.setItem('mh-motion-paused',String(!v));}catch{}return !v;});}
 return <MotionContext.Provider value={{enabled}}>{children}<button className="motion-control" onClick={toggle} disabled={systemReduced} aria-label={systemReduced?'Reduced motion follows your device setting':enabled?'Pause decorative motion':'Enable decorative motion'} title={systemReduced?'Reduced motion follows your device setting':undefined}>{enabled?<Pause size={12}/>:<Play size={12}/>}<span>{enabled?'Motion on':'Motion off'}</span></button></MotionContext.Provider>;
}
export function MotionEffects(){
 const {pathname,hash}=useLocation();const {enabled}=useContext(MotionContext);const progress=useRef(null);
 useEffect(()=>{if(hash){document.getElementById(hash.slice(1))?.scrollIntoView({behavior:'instant'});}else window.scrollTo({top:0,behavior:'instant'});},[pathname,hash]);
 useEffect(()=>{
  const root=document.getElementById('main');if(!root)return;
  let frame=0;const animations=[];const seen=new WeakSet();
  const run=(target,options)=>{if(target?.length===0)return;const animation=animate(target,options);animations.push(animation);return animation;};
  // Keep content fully opaque: entrances move once and never hide already-visible sections.
  if(enabled){
   run(root.querySelectorAll('.hero-word'),{y:[18,0],duration:900,delay:stagger(70),ease:'out(3)'});
   run(root.querySelectorAll('.hero-reveal'),{y:[12,0],duration:850,delay:stagger(70),ease:'out(3)'});
   run(root.querySelectorAll('.page-hero-copy > *:not(.mandala)'),{y:[14,0],duration:700,delay:stagger(65),ease:'out(3)'});
   const paths=root.querySelectorAll('.hero-ornament path');if(paths.length)run(svg.createDrawable(paths),{draw:['0 0','0 1'],duration:2200,delay:stagger(12),ease:'inOut(3)'});
  }
  const observer=enabled&&typeof IntersectionObserver!=='undefined'?new IntersectionObserver(entries=>{
   for(const entry of entries){if(!entry.isIntersecting||seen.has(entry.target))continue;seen.add(entry.target);observer.unobserve(entry.target);run(entry.target,{y:[16,0],duration:700,ease:'out(3)'});}
  },{threshold:.04}):null;
  root.querySelectorAll('[data-scroll]').forEach(el=>observer?.observe(el));

  // Drive the homepage heritage ribbon with the Web Animations API.
  // Measuring one duplicated group avoids mobile-browser inconsistencies with
  // percentage transforms on width:max-content tracks.
  const marquee=root.querySelector('.marquee-track');
  let marqueeAnimation=null;
  if(enabled&&marquee){
   const startMarquee=()=>{
    marqueeAnimation?.cancel();
    const group=marquee.querySelector('.marquee-group');
    const distance=group?.getBoundingClientRect().width||0;
    if(!distance)return;
    marquee.style.animation='none';
    marqueeAnimation=marquee.animate(
     [{transform:'translate3d(0,0,0)'},{transform:`translate3d(-${distance}px,0,0)`}],
     {duration:Math.max(18000,distance/42*1000),iterations:Infinity,easing:'linear'}
    );
   };
   startMarquee();
   if(document.fonts?.ready)document.fonts.ready.then(()=>{if(marquee?.isConnected)startMarquee();});
  }

  function updateProgress(){frame=0;const max=document.documentElement.scrollHeight-window.innerHeight;const value=max>0?Math.max(0,Math.min(1,window.scrollY/max)):0;if(progress.current)progress.current.style.transform='scaleX('+value+')';}
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(updateProgress);};
  window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});updateProgress();
  return()=>{observer?.disconnect();marqueeAnimation?.cancel();if(marquee)marquee.style.animation='';cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);animations.forEach(animation=>animation.revert());};
 },[pathname,enabled]);
 return <div ref={progress} className="reading-progress" aria-hidden="true"/>;
}
export function HeroWords({children}){return <span className="hero-line">{String(children).trim().split(/\s+/).map((word,i)=><React.Fragment key={i}>{i>0?' ':null}<span className="hero-word">{word}</span></React.Fragment>)}</span>;}
export function MithilaFish({className=''}){return <svg className={className} viewBox="0 0 160 90" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.25"><path d="M22 45Q65-13 126 45Q65 103 22 45ZM126 45L152 21V69ZM29 45Q69 3 117 45Q69 87 29 45Z"/><path d="M64 16Q43 43 64 74M82 17Q65 45 82 73M99 26Q87 45 99 64M22 45H126M45 30L54 39L45 49M60 43L70 53L61 61M80 30L88 39L80 47M94 45L103 53M136 35V56M145 30V62"/><circle cx="43" cy="40" r="3"/><path d="M58 14L71 4L83 17M57 76L72 86L85 73"/></g></svg>;}
