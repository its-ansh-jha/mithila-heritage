import React,{useEffect,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowDown,ArrowUpRight,MapPin,Wifi,ConciergeBell,UtensilsCrossed,Car,Wind,Clock,Users} from 'lucide-react';
import {Button,TextLink,Eyebrow,Mandala,Lotus} from './components';
import {roomMessage} from '../../shared/whatsapp';
import {openWhatsApp,WhatsAppReady} from './WhatsApp';
import {localDay} from './api';
import {HeroWords,MithilaFish} from './Motion';
import {money} from '../../shared/catalog';
export function RoomCard({room,index=0}){return <article className="room-card" data-scroll><Link to={'/rooms/'+room.id} className="room-image"><img src={room.image} alt={room.name+' at Mithila Heritage, Patna'} loading="lazy"/><span className="room-number">0{index+1}</span><span className="image-arrow"><ArrowUpRight/></span></Link><div className="room-meta"><span>{room.eyebrow}</span><span><Users size={13}/> {room.capacity} guests</span></div><Link to={'/rooms/'+room.id}><h3>{room.name}</h3></Link><div className="room-card-bottom"><p className="room-price"><strong>{money(room.rate*100)}</strong><span>/ night · + 5% GST</span></p><TextLink to={'/rooms/'+room.id}>View room</TextLink></div></article>}
function QuickBook({site}){const [error,setError]=useState(''),[url,setUrl]=useState('');return <div className="quick-book"><div className="quick-book-heading"><Lotus/><span>YOUR STAY, ONE CONVERSATION AWAY</span><Link to="/book">Plan your stay <ArrowUpRight size={14}/></Link></div><form onSubmit={e=>{e.preventDefault();setError('');setUrl('');try{setUrl(openWhatsApp(roomMessage(Object.fromEntries(new FormData(e.currentTarget)),site)));}catch(e){setError(e.message);}}}><label><span>YOUR ROOM</span><select name="roomType" aria-label="Room category">{site.rooms.map(r=><option value={r.id} key={r.id}>{r.name}</option>)}</select></label><label><span>CHECK IN</span><input aria-label="Arrival date" type="date" name="date" min={localDay()} defaultValue={localDay(1)} required/></label><label><span>CHECK OUT</span><input aria-label="Departure date" type="date" name="endDate" min={localDay(1)} defaultValue={localDay(2)} required/></label><label><span>GUESTS</span><select name="guests" aria-label="Guests" defaultValue="2">{[1,2,3,4,5,6,7,8,9,10].map(n=><option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}</select></label><button className="button" type="submit">Check on WhatsApp <ArrowUpRight size={18}/></button></form>{error&&<p className="quick-book-error" role="alert">{error}</p>}<WhatsAppReady url={url}/><p className="quick-book-note">Your details open in WhatsApp. Our hotel team confirms availability personally.</p></div>}
export default function Home({site}){
 const [featured,setFeatured]=useState(0);const [cycleKey,setCycleKey]=useState(0);const room=site.rooms[featured]||site.rooms[0];
 useEffect(()=>{if((site.rooms?.length||0)<2)return;const timer=setInterval(()=>setFeatured(i=>(i+1)%site.rooms.length),4500);return()=>clearInterval(timer);},[site.rooms?.length,cycleKey]);
 return <>
  <section className="modern-hero night-hero">
   <div className="hero-editorial">
    <div className="hero-reveal hero-kicker"><span className="live-dot"/>MITHILA HERITAGE · PATNA<span className="kicker-rule"/></div>
    <h1><HeroWords>The warmth</HeroWords><em><HeroWords>of Mithila.</HeroWords></em></h1>
    <p className="hero-reveal hero-intro">A room to return to. A rooftop to gather on.<br/>A warm welcome, in the heart of Patna.</p>
    <div className="hero-reveal hero-buttons"><Button to="/rooms">Explore our rooms</Button><a href="#welcome" className="round-link" aria-label="Discover Mithila Heritage"><ArrowDown size={20}/></a></div>
    <div className="hero-reveal hero-footnote"><MithilaFish/><span>ROOTED IN CULTURE.<br/>THOUGHTFUL IN EVERY DETAIL.</span></div>
   </div>
   <div className="hero-visual">
    <div className="hero-photo-heading"><span><Lotus/>A CLOSER LOOK AT MITHILA</span><span>0{featured+1} / 04</span></div>
    <Link to={'/rooms/'+room.id} className="hero-scene"><img src={room.image} alt={room.name+' at Mithila Heritage'} width="1600" height="1067" fetchPriority="high"/><div className="scene-caption"><span>{room.name}<small>{money(room.rate*100)} / night + 5% GST</small></span><span className="hero-photo-arrow"><ArrowUpRight size={23}/></span></div></Link>
    <div className="hero-room-selector" role="group" aria-label="Preview a room">{site.rooms.map((r,i)=><button key={r.id} onClick={()=>{setFeatured(i);setCycleKey(k=>k+1);}} aria-pressed={featured===i} aria-label={'Preview '+r.name}><span>0{i+1}</span><span className="selector-line"/></button>)}</div>
    <p className="hero-photo-note">FOUR ROOM CATEGORIES · ONE WARM WELCOME</p>
   </div>
  </section>
  <div className="container booking-container modern-booking"><QuickBook site={site}/></div>
  <div className="heritage-marquee" aria-label="Rooms and suites. Rooftop restaurant. Banquet hall."><div className="marquee-track" aria-hidden="true">{[0,1].map(n=><div className="marquee-group" key={n}><span>Rooms & <em>suites.</em></span><Lotus/><span>Rooftop <em>dining.</em></span><MithilaFish/><span>Beautiful <em>celebrations.</em></span><Lotus/></div>)}</div></div>
  <section className="story-section container" id="welcome">
   <div className="story-art" data-scroll><img className="story-main" src="/images/IMG_3446.webp" alt="Lounge at Mithila Heritage" loading="lazy"/><img className="story-small" src="/images/IMG_3330.webp" alt="Mithila Heritage restaurant interior" loading="lazy"/><div className="story-seal"><Lotus/><span>ATITHI DEVO BHAVA</span></div></div>
   <div className="story-copy" data-scroll><div className="section-index">01 <span>THE WELCOME</span></div><Eyebrow>ONE HOTEL. A PERSONAL WELCOME.</Eyebrow><h2>Come for a stay.<br/><em>Feel at home.</em></h2><p>{site.story}</p><div className="story-facts"><span><Clock size={17}/>24/7 room service</span><span><UtensilsCrossed size={17}/>Rooftop restaurant</span></div><TextLink to="/about">Discover Mithila Heritage</TextLink></div>
  </section>
  <section className="section container stays-section">
   <div className="section-heading" data-scroll><div><div className="section-index">02 <span>THE ROOMS</span></div><Eyebrow>FOUR WAYS TO MAKE YOURSELF AT HOME</Eyebrow><h2>A considered stay.<br/><em>In every detail.</em></h2></div><div className="section-aside"><p>Your quiet corner of Patna.<br/>Find the room that feels like you.</p><TextLink to="/rooms">Explore all four</TextLink></div></div>
   <div className="rooms-grid">{site.rooms.map((r,i)=><RoomCard key={r.id} room={r} index={i}/>)}</div>
  </section>
  <section className="cultural-pause" data-scroll><div className="pause-pattern" data-draw><MithilaFish/></div><p>The art of a<br/><em>warm welcome.</em></p><span>ATITHI DEVO BHAVA</span><div className="pause-pattern mirrored" data-draw><MithilaFish/></div></section>
  <section className="dining-feature">
   <div className="dining-image"><img src="/images/IMG_3375.webp" alt="The open rooftop restaurant at Mithila Heritage" loading="lazy"/><div className="dining-image-tag"><span>03 / THE ROOFTOP</span><span>PATNA, FROM A DIFFERENT PERSPECTIVE</span></div></div>
   <div className="dining-copy" data-scroll><Eyebrow light>ROOFTOP RESTAURANT</Eyebrow><h2>A view to savour.<br/><em>A table to share.</em></h2><p>Indian, Continental, and Chinese cuisine, with vegetarian and non-vegetarian choices. Come together for family meals, quiet evenings, and special occasions.</p><div className="dining-details"><span><Clock size={17}/>{site.restaurantOpen}–{site.restaurantClose}</span><span><UtensilsCrossed size={17}/>Multi-cuisine dining</span></div><Button to="/restaurant" light>Discover the restaurant</Button><Mandala/></div>
  </section>
  <section className="section container journey-section">
   <div className="section-heading" data-scroll><div><div className="section-index">04 <span>THE GATHERINGS</span></div><Eyebrow>MAKE ROOM FOR A SPECIAL OCCASION</Eyebrow><h2>Your people.<br/><em>A beautiful setting.</em></h2></div><p>Weddings. Family milestones.<br/>Meetings that bring people together.</p></div>
   <div className="journey-grid">
    <Link to="/banquet" className="journey-tile journey-celebrate" data-scroll><img src="/images/IMG_3354.webp" alt="The Mithila Heritage banquet hall" loading="lazy"/><div className="journey-copy"><span>THE BANQUET HALL</span><h3>Celebrate<br/><em>your way.</em></h3><p>Event planning, catering, and decor for your occasion.</p><span className="journey-arrow"><ArrowUpRight/></span></div></Link>
    <Link to="/gallery" className="journey-tile journey-gallery" data-scroll><div><span>THROUGH OUR LENS</span><h3>Before you arrive,<br/><em>step inside.</em></h3><span className="text-link">View the gallery <ArrowUpRight size={17}/></span></div><div className="gallery-stack"><img src={site.rooms?.[3]?.image} alt="Maharaja Suite" loading="lazy"/><img src="/images/IMG_3362.webp" alt="Hotel dining interior" loading="lazy"/></div><Lotus/></Link>
    <Link to="/contact" className="journey-tile journey-contact" data-scroll><MithilaFish/><div><span>LET’S MAKE A PLAN</span><h3>A conversation.<br/><em>A warm beginning.</em></h3></div><span className="journey-arrow"><ArrowUpRight/></span></Link>
   </div>
  </section>
  <section className="comfort-section"><div className="container"><div className="center" data-scroll><Eyebrow>COMFORT, TAKEN CARE OF</Eyebrow><h2>The little things.<br/><em>Thoughtfully covered.</em></h2></div><div className="amenity-grid">{[[Wifi,'Free Wi-Fi','Throughout the hotel'],[ConciergeBell,'Room service','Available 24/7'],[UtensilsCrossed,'In-room dining','Comfort at your door'],[Car,'Free parking','For hotel guests'],[Wind,'Air conditioning','Comfortable rooms']].map(([Icon,title,desc])=><div key={title} data-scroll><Icon strokeWidth={1.2}/><h3>{title}</h3><p>{desc}</p></div>)}</div></div></section>
  <section className="location-section container" data-scroll><div className="location-art"><Mandala/><MapPin size={38} strokeWidth={1}/><span>PATNA</span><p>YOUR MITHILA ADDRESS</p></div><div><Eyebrow>COME FIND US</Eyebrow><h2>A city to discover.<br/><em>A place to return.</em></h2><p className="address">{site.address}</p><p>Check-in {site.checkIn} · Check-out {site.checkOut}</p><TextLink to="/contact">Contact & directions</TextLink></div></section>
 </>;
}
