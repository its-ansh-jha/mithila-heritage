import React,{createContext,useContext,useEffect,useState} from 'react';
import {useLocation} from 'react-router-dom';
import {animate,createTimeline,createScope,stagger,svg,spring} from 'animejs';
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
 const {pathname}=useLocation();const {enabled}=useContext(MotionContext);
 useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[pathname]);
 useEffect(()=>{
  const root=document.getElementById('main');if(!root||!enabled||pathname.startsWith('/admin'))return;
  const cleanups=[];let frame=0;let disposed=false;
  const scope=createScope({root}).add(()=>{
   const timeline=createTimeline({defaults:{ease:'out(4)',duration:1000}});
   if(root.querySelector('.hero-word'))timeline.add('.hero-word',{y:['105%','0%'],opacity:[0,1],delay:stagger(80)},0);
   if(root.querySelector('.hero-scene'))timeline.add('.hero-scene',{opacity:[0,1],scale:[.96,1],y:[35,0],duration:1400},180);
   if(root.querySelector('.hero-inset'))timeline.add('.hero-inset',{opacity:[0,1],y:[65,0],rotate:[-7,-4],duration:1300},550);
   if(root.querySelector('.hero-reveal'))timeline.add('.hero-reveal',{opacity:[0,1],y:[20,0],delay:stagger(90)},400);
   if(root.querySelector('.hero-ornament path'))animate(svg.createDrawable('.hero-ornament path'),{draw:['0 0','0 1'],duration:2600,delay:stagger(22),ease:'inOut(3)'});
   if(root.querySelector('.page-hero-copy'))animate('.page-hero-copy>*:not(.mandala)',{opacity:[0,1],y:[22,0],delay:stagger(90),duration:850,ease:'out(3)'});
   if(root.querySelector('.heritage-orbit'))animate('.heritage-orbit',{rotate:360,duration:100000,ease:'linear',loop:true});
  });
  const observer=new IntersectionObserver(entries=>{
   for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);scope.add(()=>{
    animate(entry.target,{opacity:[0,1],y:[34,0],duration:900,ease:'out(4)'});
    const strokes=entry.target.querySelectorAll('[data-draw] path');if(strokes.length)animate(svg.createDrawable(strokes),{draw:['0 0','0 1'],duration:1800,delay:stagger(12),ease:'inOut(3)'});
   });}
  },{threshold:.12});
  root.querySelectorAll('[data-scroll]').forEach(el=>observer.observe(el));
  const parallax=[...root.querySelectorAll('[data-parallax]')];
  function updateScroll(){frame=0;if(disposed)return;const max=document.documentElement.scrollHeight-window.innerHeight;document.documentElement.style.setProperty('--reading-progress',max>0?String(window.scrollY/max):'0');for(const el of parallax){const rect=el.parentElement.getBoundingClientRect();if(rect.bottom>0&&rect.top<window.innerHeight)el.style.transform=`translate3d(0,${Math.max(-25,Math.min(25,-rect.top*.065))}px,0) scale(1.07)`;}}
  const onScroll=()=>{if(!frame)frame=requestAnimationFrame(updateScroll);};window.addEventListener('scroll',onScroll,{passive:true});updateScroll();
  if(window.matchMedia('(hover: hover) and (pointer: fine)').matches){
   root.querySelectorAll('.magnetic').forEach(el=>{let current;const move=e=>{const box=el.getBoundingClientRect();current?.pause();current=animate(el,{x:(e.clientX-box.left-box.width/2)*.12,y:(e.clientY-box.top-box.height/2)*.15,duration:350,ease:'out(3)'});};const leave=()=>{current?.pause();current=animate(el,{x:0,y:0,ease:spring({bounce:.3,duration:550})});};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);cleanups.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);current?.revert();});});
   root.querySelectorAll('.journey-tile').forEach(el=>{const move=e=>{const box=el.getBoundingClientRect();el.style.setProperty('--tilt-x',`${(e.clientY-box.top-box.height/2)/80}deg`);el.style.setProperty('--tilt-y',`${-(e.clientX-box.left-box.width/2)/80}deg`);};const leave=()=>{el.style.setProperty('--tilt-x','0deg');el.style.setProperty('--tilt-y','0deg');};el.addEventListener('pointermove',move);el.addEventListener('pointerleave',leave);cleanups.push(()=>{el.removeEventListener('pointermove',move);el.removeEventListener('pointerleave',leave);leave();});});
  }
  return()=>{disposed=true;observer.disconnect();cancelAnimationFrame(frame);window.removeEventListener('scroll',onScroll);cleanups.forEach(fn=>fn());scope.revert();parallax.forEach(el=>el.style.removeProperty('transform'));document.documentElement.style.removeProperty('--reading-progress');};
 },[pathname,enabled]);
 return <div className="reading-progress" aria-hidden="true"/>;
}
export function HeroWords({children}){return <span className="hero-line">{String(children).split(' ').map((word,i)=><span className="word-mask" key={i}><span className="hero-word">{word}</span>{' '}</span>)}</span>;}
export function MithilaFish({className=''}){return <svg className={className} viewBox="0 0 160 90" fill="none" aria-hidden="true"><g stroke="currentColor" strokeWidth="1.25"><path d="M22 45Q65-13 126 45Q65 103 22 45ZM126 45L152 21V69ZM29 45Q69 3 117 45Q69 87 29 45Z"/><path d="M64 16Q43 43 64 74M82 17Q65 45 82 73M99 26Q87 45 99 64M22 45H126M45 30L54 39L45 49M60 43L70 53L61 61M80 30L88 39L80 47M94 45L103 53M136 35V56M145 30V62"/><circle cx="43" cy="40" r="3"/><path d="M58 14L71 4L83 17M57 76L72 86L85 73"/></g></svg>;}
