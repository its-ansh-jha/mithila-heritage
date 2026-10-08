import {money,roomOfferActive,roomSaleRate} from '../shared/catalog.js';

// Human-readable HTML for initial document responses. The React app replaces this
// markup when JavaScript loads; crawlers without JS still receive real page content.
const esc=value=>String(value??'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const link=(href,label)=>`<a href="${esc(href)}">${esc(label)}</a>`;
const pic=(src,alt,eager=false)=>`<img src="${esc(src)}" alt="${esc(alt)}" width="1200" height="800" loading="${eager?'eager':'lazy'}">`;
const address='B-2, Jayprakash Nagar, Ashiana Kurji Nala Road, Patna, Bihar 800025';
const navLinks=[
 ['/','Home'],['/rooms','Hotel rooms in Patna'],['/restaurant','Rooftop restaurant in Patna'],
 ['/banquet','Banquet hall in Patna'],['/about','About the hotel'],['/gallery','Photo gallery'],['/contact','Contact and directions']
];
function shell(main,site){
 return `<a class="skip" href="#main">Skip to content</a>
 <header class="header"><a class="brand" href="/" aria-label="Mithila Heritage home">${pic('/images/footerlogo.png','Mithila Heritage logo',true)}</a>
 <nav class="navigation" aria-label="Main navigation">${navLinks.slice(0,6).map(([url,label])=>link(url,label)).join('')}</nav>
 <div class="header-actions">${link('/book','Book a stay')}</div></header>
 <main id="main">${main}</main>
 <footer><div class="footer-main"><div><a class="brand" href="/">Mithila Heritage</a><p>Rooted in culture. Crafted for you.</p><p>${esc(site.address)}</p></div>
 <div><h2>Explore the hotel</h2>${navLinks.map(([url,label])=>link(url,label)).join('')}</div>
 <div><h2>Contact Mithila Heritage</h2><a href="tel:${esc(site.phone)}">${esc(site.phone)}</a>
 <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
 <a href="https://www.instagram.com/mithilaheritage01/" rel="me">Mithila Heritage Instagram</a>
 <a href="https://www.google.com/maps/search/?api=1&amp;query=Mithila+Heritage+Patna">Directions on Google Maps</a></div></div></footer>`;
}
function heading(kicker,h1,subtitle,img){
 return `<section class="page-hero"><div class="page-hero-copy"><p class="eyebrow">${esc(kicker)}</p><h1>${esc(h1)}</h1><p>${esc(subtitle)}</p></div>${img?pic(img,h1+' at Mithila Heritage',true):''}</section>`;
}
function cards(site){
 const offer=site.roomOffer,active=roomOfferActive(offer);
 return `<div class="rooms-grid">${site.rooms.map((r,i)=>{
 const price=money(roomSaleRate(r,offer)*100);
 return `<article class="room-card"><a class="room-image" href="/rooms/${esc(r.id)}">${pic(r.image,r.name+' hotel room in Patna')}
 ${active?`<span class="room-offer-badge">${offer.discountPercent}% OFF</span>`:''}</a>
 <div class="room-meta"><span>0${i+1} · ${esc(r.eyebrow)}</span><span>${r.capacity} guests</span></div>
 <h3>${link('/rooms/'+r.id,r.name)}</h3>
 <p class="room-price">${active?`<del>${money(r.rate*100)}</del> `:''}<strong>${price}</strong> per night + ${site.taxPercent}% GST</p>
 <p>${esc(r.description)}</p>${link('/rooms/'+r.id,'View room details')}</article>`;
 }).join('')}</div>`;
}
function home(site){
 const faqs=[
 ['Where is Mithila Heritage located in Patna?',`Mithila Heritage is located at ${site.address}.`],
 ['What hotel rooms are available at Mithila Heritage?','The hotel offers Heritage Classic, Heritage Deluxe, Royal Premium Deluxe and Maharaja Suite rooms.'],
 ['Does Mithila Heritage have a rooftop restaurant in Patna?','Yes. The rooftop restaurant serves Indian, Continental and Chinese cuisine for family meals and celebrations.'],
 ['Can I book a banquet hall or wedding venue in Patna here?','Yes. The banquet venue welcomes weddings, engagements, birthdays, anniversaries and corporate events.'],
 ['Does the hotel offer parking and Wi-Fi?','Guests have access to free parking and Wi-Fi, as well as air-conditioned rooms and room service.'],
 ['How can I book a room?','Browse the rooms on this website, choose your dates and contact the hotel team for current availability.']
 ];
 const main=`<section class="modern-hero night-hero"><div class="hero-editorial">
  <p class="hero-kicker">MITHILA HERITAGE · PATNA</p><h1>The warmth <em>of Mithila.</em></h1>
  <p class="hero-intro">A room to return to. A rooftop to gather on. A warm welcome, in the heart of Patna.</p>
  <p>${link('/rooms','Explore our rooms')} · ${link('/contact','Find us in Patna')}</p></div>
  <div class="hero-visual"><a class="hero-scene" href="/rooms/${esc(site.rooms[0].id)}" aria-label="View Heritage Classic room">${pic(site.rooms[0].image,'Heritage Classic room at Mithila Heritage Patna',true)}</a></div></section>
 <section class="section container story-section" id="welcome"><div class="story-copy">
  <h2>Come for a stay. Feel at home.</h2><p>${esc(site.story)}</p>
  <p>Whether you are visiting Patna with family, travelling on business or planning a celebration, our boutique hotel brings room accommodation, a rooftop restaurant and an event venue together in Jayprakash Nagar. The Ashiana–Kurji location offers a welcoming place to return to after a busy day.</p>
  <p>Our hotel rooms include air conditioning, Wi-Fi and room service. Guests can also use complimentary parking. With a dedicated hotel team available for questions about room availability and bookings, your stay begins with a personal conversation.</p>
  ${link('/about','Discover Mithila Heritage')}</div></section>
 <section class="section container stays-section"><h2>Explore our hotel rooms in Patna</h2><p>Choose from four room categories designed for comfortable stays, from Heritage Classic and Heritage Deluxe to Royal Premium Deluxe and the Maharaja Suite.</p>
 ${cards(site)}<p>${link('/rooms','Compare all hotel rooms and suites')}</p></section>
 <section class="section container dining-feature"><div class="dining-copy"><h2>Rooftop restaurant in Patna</h2>
 <p>Enjoy Indian, Continental and Chinese dishes with vegetarian and non-vegetarian choices. Mithila Heritage offers a rooftop setting for quiet evenings, family dinners, celebrations and time together.</p>
 <p>Restaurant hours: ${esc(site.restaurantOpen)}–${esc(site.restaurantClose)}. Ask our restaurant team about the current menus, reservations and special arrangements.</p>
 ${link('/restaurant','Explore rooftop dining and menus')}</div>
 <div class="dining-image">${pic('/images/IMG_3375.webp','Mithila Heritage rooftop restaurant')}</div></section>
 <section class="section container"><h2>Banquet hall and wedding venue in Patna</h2>
 <p>Plan a wedding, engagement, reception, anniversary, birthday or corporate event at Mithila Heritage. Our banquet space combines a comfortable indoor setting with catering options, event arrangements and support from the hotel team.</p>
 <p>Looking for an event venue near Ashiana or Kurji? Explore our facilities and contact us to discuss dates, guest numbers, decoration and catering options.</p>
 ${link('/banquet','Explore banquet hall and celebrations')}</section>
 <section class="section container local-search-section"><h2>A comfortable Patna stay, with more under one roof</h2>
 <p>If you are comparing hotels in Patna, Mithila Heritage brings together four room categories, a rooftop restaurant and a banquet hall at one address. It is suited to family stays, business visits, celebrations and travellers seeking a boutique hotel in Jayprakash Nagar.</p>
 <p>You can explore the ${link('/rooms','hotel rooms in Patna')}, ${link('/restaurant','rooftop dining')}, ${link('/banquet','event venue')}, ${link('/gallery','real hotel photographs')} or ${link('/contact','contact and directions')} before getting in touch with the hotel team.</p>
 <h2>Questions before your visit</h2>${faqs.map(([q,a])=>`<article><h3>${esc(q)}</h3><p>${esc(a)}</p></article>`).join('')}</section>
 <section class="section container"><h2>Find Mithila Heritage in Patna</h2><p>${esc(site.address)}</p><p>Check-in from ${esc(site.checkIn)} · Check-out by ${esc(site.checkOut)}.</p>${link('/contact','Contact and directions')}</section>`;
 return shell(main,site);
}
function rooms(site){
 return shell(heading('ROOMS & SUITES','Hotel rooms in Patna','Explore four room categories, from classic hotel rooms and twin beds to premium accommodation and the Maharaja Suite.',site.rooms[2].image)+
 `<section class="section container"><h2>Four ways to stay. One Mithila welcome.</h2>
 <p>Guests looking for hotel rooms in Patna can choose Heritage Classic, Heritage Deluxe, Royal Premium Deluxe and Maharaja Suite. Each category offers comfortable accommodation with amenities including air conditioning, Wi-Fi and room service.</p>
 <p>Find a room that suits your visit to the city. Mithila Heritage is located in Jayprakash Nagar on Ashiana Kurji Nala Road, close to the Ashiana and Kurji area of Patna.</p>
 ${cards(site)}<h2>Before you book</h2><p>Check-in starts at ${esc(site.checkIn)} and check-out is by ${esc(site.checkOut)}. Contact our team for early arrivals, late departures or the most up-to-date room availability.</p>
 ${link('/contact','Contact the hotel for availability')}</section>`,site);
}
function roomPage(site,r){
 const offer=site.roomOffer,active=roomOfferActive(offer);
 const features=r.amenities.slice(0,10).map(x=>`<li>${esc(x)}</li>`).join('');
 return shell(heading('HOTEL ROOM IN PATNA',r.name,r.name+' at Mithila Heritage in Jayprakash Nagar, Patna.',r.image)+
 `<nav class="container breadcrumbs" aria-label="Breadcrumb">${link('/','Home')} › ${link('/rooms','Rooms & Suites')} › ${esc(r.name)}</nav>
 <section class="section container detail-grid"><div><h2>A little space. All your own.</h2>
 <p>${esc(r.description)}</p><p>${esc(r.name)} is one of four room categories at Mithila Heritage, a boutique hotel in Patna on Ashiana Kurji Nala Road. Designed for guests visiting on business, with family or for a relaxing break, the room includes practical comforts for a convenient stay.</p>
 <h2>Room amenities</h2><ul>${features}</ul>
 <p>Each room category is supported by the hotel team. Guests can ask about availability, check-in and check-out options and any special requirements before arriving.</p>
 ${link('/rooms','Compare other rooms')}</div>
 <aside class="reservation-card"><h2>${esc(r.name)} rate</h2>${active?`<p><strong>${offer.discountPercent}% OFF through 1 November 2026</strong></p><p><del>${money(r.rate*100)}</del></p>`:''}
 <p><strong>${money(roomSaleRate(r,offer)*100)}</strong> per night + ${site.taxPercent}% GST</p>
 <p>Up to ${r.capacity} guests. Contact the hotel to confirm the final rate and availability.</p>
 ${link('/book?kind=room&roomType='+r.id,'Check room availability')}</aside></section>
 <section class="section container"><h2>${esc(r.name)} photo gallery</h2><div class="gallery-grid">${r.gallery.slice(0,6).map(g=>pic(g.src,g.alt)).join('')}</div>
 <p>${link('/gallery','See more Mithila Heritage photos')} · ${link('/contact','Contact the hotel')}</p></section>`,site);
}
function restaurant(site){
 return shell(heading('ROOFTOP RESTAURANT IN PATNA','Above the city. Around the table.','Rooftop dining in Patna for family meals, celebrations and relaxed evenings at Mithila Heritage.','/images/IMG_3375.webp')+
 `<section class="section container detail-grid"><div><h2>For the joy of coming together</h2>
 <p>Enjoy Indian, Continental and Chinese cuisine, including vegetarian and non-vegetarian choices, at the Mithila Heritage rooftop restaurant. The space welcomes quiet dinners, family meals, birthdays, anniversaries and small celebrations.</p>
 <p>Visit us in Jayprakash Nagar near Ashiana and Kurji in Patna. Our restaurant serves guests and visitors looking for a comfortable place to dine with loved ones.</p>
 <h2>Restaurant and café menus</h2><p>View the official menus supplied by Mithila Heritage before your visit. Contact our team for up-to-date availability, table arrangements and current dishes.</p>
 ${(site.restaurantMenus||[]).map(m=>`<article><h3><a href="${esc(m.url)}">${esc(m.name)}</a></h3><p>${esc(m.label)}</p></article>`).join('')}
 <p>Restaurant opening hours: ${esc(site.restaurantOpen)}–${esc(site.restaurantClose)}.</p>
 ${link('/contact','Contact the restaurant')}</div>
 <aside class="reservation-card"><h2>Plan a rooftop dinner</h2><p>Send the team your preferred date, time and number of guests. The hotel confirms tables directly.</p>${link('/contact','Enquire about a table')}</aside></section>
 <section class="section container"><h2>Explore our restaurant and rooftop</h2><div class="gallery-grid">${site.gallery.filter(x=>x.category==='Dining').slice(-8).map(g=>pic(g.src,g.alt)).join('')}</div>
 ${link('/gallery','View the full gallery')}</section>`,site);
}
function banquet(site){
 return shell(heading('BANQUET HALL IN PATNA','Some days deserve a little grandeur.','A banquet hall and event venue in Patna for weddings, engagements, birthdays, anniversaries and corporate gatherings.','/images/IMG_3354.webp')+
 `<section class="section container detail-grid"><div><h2>Let the occasion take centre stage</h2>
 <p>The Mithila Heritage banquet hall in Patna welcomes weddings, engagements, ring ceremonies, receptions, birthdays, anniversaries, family functions and corporate events. The air-conditioned venue combines chandelier lighting, stage arrangements and event support.</p>
 <p>Discuss catering options, buffet or table service, microphones, presentation facilities and event decoration with the hotel team. Your gathering can be arranged according to your guest count, preferred date and event requirements.</p>
 <h2>Banquet facilities and celebrations</h2>
 <p>Available arrangements include a customizable stage, vegetarian and non-vegetarian catering, sound and presentation equipment, floral decoration and event coordination. Final facilities, pricing and availability are confirmed with the hotel.</p>
 ${link('/contact','Enquire about a banquet booking')}</div><aside class="reservation-card"><h2>Plan your event</h2><p>Share your event type, guest count and preferred date to discuss availability.</p>${link('/contact','Talk to the banquet team')}</aside></section>
 <section class="section container"><h2>Celebration photos</h2><div class="gallery-grid">${site.gallery.filter(g=>g.category==='Celebrations').slice(-6).map(g=>pic(g.src,g.alt)).join('')}</div>
 ${link('/gallery','See event and hotel photos')}</section>`,site);
}
function about(site){
 return shell(heading('MITHILA HERITAGE · PATNA','Thoughtful spaces. A warmer welcome.','Discover the hospitality and spaces that make Mithila Heritage a welcoming hotel in Patna.','/images/IMG_3446.webp')+
 `<section class="section container about-copy"><h2>A little comfort. A sense of belonging.</h2><p>${esc(site.story)}</p>
 <p>Located in Jayprakash Nagar, Mithila Heritage combines comfortable accommodation with a rooftop restaurant and a banquet hall. The hotel provides Wi-Fi, in-room dining, room service and parking for guests.</p>
 <p>The rooftop restaurant brings together Indian, Continental and Chinese flavours. The banquet hall offers an event venue for family milestones and corporate gatherings, all within the hotel.</p>
 ${link('/rooms','Explore our room categories')} · ${link('/restaurant','See the restaurant')} · ${link('/banquet','Explore the banquet hall')}</section>
 <section class="section container"><h2>The people behind your welcome</h2>
 <h3>Abhi Ranjan Kumar</h3><p>General Manager</p>
 <h3>Vicky Raj</h3><p>Operation Manager</p>
 <h3>Abhinav Kumar</h3><p>Restaurant &amp; Banquet Manager</p>
 ${link('/contact','Contact Mithila Heritage')}</section>`,site);
}
function gallery(site){
 const imgs=site.gallery.slice(0,32);
 return shell(heading('MITHILA HERITAGE PHOTO GALLERY','A closer look. A warmer feeling.','Real photographs of hotel rooms, restaurant seating, celebrations and interior spaces.')+
 `<section class="section container"><h2>Inside Mithila Heritage</h2><p>Explore real images of the guest rooms, rooftop dining spaces and banquet celebrations at Mithila Heritage in Patna. Browse by category in the interactive gallery or use these photos to get a sense of the hotel before booking.</p>
 <div class="gallery-grid">${imgs.map(g=>`<figure>${pic(g.src,g.alt)}<figcaption>${esc(g.category)} — ${esc(g.alt)}</figcaption></figure>`).join('')}</div>
 ${link('/rooms','Explore rooms')} · ${link('/restaurant','Visit the restaurant')} · ${link('/banquet','See the banquet venue')}</section>`,site);
}
function contact(site){
 return shell(heading('CONTACT MITHILA HERITAGE PATNA','Every good stay starts with hello.','Contact the hotel in Jayprakash Nagar for rooms, dining, banquet events and directions.')+
 `<section class="section container contact-grid"><div><h2>Tell us what brings you here</h2>
 <p>Contact Mithila Heritage to enquire about rooms, rooftop dining, private events or banquet hall arrangements in Patna. Our team can answer questions about bookings, visiting the property and current availability.</p>
 <h3>Call Mithila Heritage</h3><p><a href="tel:${esc(site.phone)}">${esc(site.phone)}</a></p><p><a href="tel:${esc(site.secondaryPhone)}">${esc(site.secondaryPhone)}</a></p>
 <h3>Email the hotel</h3><p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
 <h3>Find your way</h3><p>${esc(site.address)}</p>
 <p><a href="https://www.google.com/maps/search/?api=1&amp;query=Mithila+Heritage+Patna">Open Mithila Heritage in Google Maps</a></p>
 <p>Check-in: ${esc(site.checkIn)} · Check-out: ${esc(site.checkOut)}</p></div>
 <aside><h2>Explore before you visit</h2><p>${link('/rooms','Hotel rooms in Patna')}</p><p>${link('/restaurant','Rooftop restaurant')}</p><p>${link('/banquet','Banquet and wedding venue')}</p><p>${link('/gallery','Hotel photographs')}</p></aside></section>`,site);
}

export function renderStaticBody(route,site){
 if(route==='/')return home(site);
 if(route==='/rooms')return rooms(site);
 if(route.startsWith('/rooms/')){
  const r=site.rooms.find(x=>x.id===route.split('/')[2]);
  if(!r)throw new Error('Unknown room route: '+route);
  return roomPage(site,r);
 }
 if(route==='/restaurant')return restaurant(site);
 if(route==='/banquet')return banquet(site);
 if(route==='/about')return about(site);
 if(route==='/gallery')return gallery(site);
 if(route==='/contact')return contact(site);
 throw new Error('No static content for route: '+route);
}
