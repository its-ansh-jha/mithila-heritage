export const WHATSAPP_NUMBER='917295807999';
export const WHATSAPP_DISPLAY='+91 72958 07999';
export const indiaToday=()=>new Date(Date.now()+19800000).toISOString().slice(0,10);
const clean=value=>String(value??'').trim().replace(/[\r\n]+/g,' ').slice(0,2000);
function day(value){if(!/^\d{4}-\d{2}-\d{2}$/.test(value||'')||Number.isNaN(Date.parse(value))||new Date(value).toISOString().slice(0,10)!==value)throw new Error('Choose a valid date.');return value;}
function count(value,label,max=10000){const n=Number(value);if(!Number.isInteger(n)||n<1||n>max)throw new Error('Enter a valid '+label+'.');return n;}
export function stayDetails(input,site,today=indiaToday()){
 const date=day(input.date),endDate=day(input.endDate);if(date<today)throw new Error('Check-in cannot be in the past.');if(endDate<=date)throw new Error('Check-out must be after check-in.');
 const guests=count(input.guests,'guest count',20),quantity=count(input.quantity??Math.ceil(guests/2),'room count',10);
 const room=input.roomType?site.rooms.find(r=>r.id===input.roomType):null;if(input.roomType&&!room)throw new Error('Choose one of our four room categories.');
 if(room&&guests>quantity*room.capacity)throw new Error('Choose enough rooms for your guests. '+room.name+' accommodates up to '+room.capacity+' guests per room.');
 const nights=Math.round((Date.parse(endDate)-Date.parse(date))/86400000),subtotal=room?Math.round(room.rate*100)*nights*quantity:0;
 const tax=room?Math.round(subtotal*Number(site.taxPercent??5)/100):0;
 return {date,endDate,guests,quantity,room,nights,subtotal,tax,total:subtotal+tax};
}
export function whatsappUrl(message){return 'https://wa.me/'+WHATSAPP_NUMBER+'?text='+encodeURIComponent(message);}
export function roomMessage(input,site,today){const s=stayDetails(input,site,today);return [
 'Namaste Mithila Heritage! I would like to enquire about a stay.',
 '', 'Room: '+(s.room?.name||'Please recommend a room'), 'Check-in: '+s.date+' (IST)', 'Check-out: '+s.endDate+' (IST)', 'Nights: '+s.nights, 'Rooms: '+s.quantity, 'Guests: '+s.guests,
 input.name?'Name: '+clean(input.name):'',input.notes?'Special requests: '+clean(input.notes):'', '',
 'Please confirm availability, the final rate and booking arrangements. Thank you!'
 ].filter((line,index,all)=>line||index===1||index===all.length-2).join('\n');}
export function experienceMessage(kind,input,site,today=indiaToday()){
 if(!['restaurant','banquet'].includes(kind))throw new Error('Choose dining or a banquet enquiry.');const date=day(input.date);if(date<today)throw new Error('Choose today or a future date.');const guests=count(input.guests,'guest count');
 if(kind==='restaurant'){
  if(!/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time||''))throw new Error('Choose a valid dining time.');
  if(input.time<site.restaurantOpen||input.time>site.restaurantClose)throw new Error('Choose a time between '+site.restaurantOpen+' and '+site.restaurantClose+'.');
  if(date===today&&new Date(date+'T'+input.time+':00+05:30')<=new Date())throw new Error('Choose an upcoming dining time.');
 }
 return ['Namaste Mithila Heritage! I would like to '+(kind==='restaurant'?'enquire about a table at your rooftop restaurant.':'enquire about your banquet hall.'),'','Date: '+date+' (IST)',kind==='restaurant'?'Time: '+input.time+' IST':'Occasion: '+clean(input.eventType||'Please discuss with me'),'Guests: '+guests,input.name?'Name: '+clean(input.name):'',input.notes?'Details: '+clean(input.notes):'','','Please confirm availability and arrangements. Thank you!'].filter(Boolean).join('\n');
}
export function contactMessage(input){return ['Namaste Mithila Heritage!',clean(input.subject||'General enquiry'),input.name?'Name: '+clean(input.name):'',input.email?'Email: '+clean(input.email):'',input.phone?'Phone: '+clean(input.phone):'','',clean(input.message||'I would like to know more about your hotel.')].filter(Boolean).join('\n');}
export function manageMessage(input={}){return ['Namaste Mithila Heritage! I need help with '+clean(input.action||'an existing reservation')+'.',input.reference?'Booking reference: '+clean(input.reference):'',input.name?'Guest name: '+clean(input.name):'',input.notes?'Details: '+clean(input.notes):'','Please review my reservation and let me know the next steps.'].filter(Boolean).join('\n');}
