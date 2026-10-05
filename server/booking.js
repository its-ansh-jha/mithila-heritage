import {randomUUID,randomBytes,createHash} from 'node:crypto';
import {bookingInput,guestInput} from '../shared/validation.js';
import {site,transaction,requireDb} from './db.js';
export const problem=(message,status=400)=>Object.assign(new Error(message),{status});
export const hash=t=>createHash('sha256').update(t).digest('hex');
export function interval(raw,settings,now=new Date()){
 const input=bookingInput.parse(raw);
 const local=(d,t)=>{const v=new Date(d+'T'+t+':00+05:30');if(Number.isNaN(+v)||new Date(+v+19800000).toISOString().slice(0,10)!==d)throw problem('Choose a valid calendar date.');return v;};
 if(!input.endDate)throw problem('Select a check-out date.');
 const units=(Date.parse(input.endDate)-Date.parse(input.date))/86400000;
 if(!Number.isInteger(units)||units<1||units>90)throw problem('Room stays must be between 1 and 90 nights.');
 const start=local(input.date,settings.checkIn),end=local(input.endDate,settings.checkOut);
 if(start<=now)throw problem('Choose a start date and time in the future.');
 if(+start>+now+366*86400000)throw problem('Reservations open up to one year in advance.');
 return {input,start,end,units};
}
export function overlaps(a,b){return +new Date(a.starts_at)<+new Date(b.ends_at)&&+new Date(a.ends_at)>+new Date(b.starts_at);}
export function occupied(b,now=new Date()){return ['confirmed','cancel_requested','blocked'].includes(b.status)||(b.status==='hold'&&+new Date(b.expires_at)>+now);}
export function selectResources(input,resources,busy){
 if(input.kind!=='room')throw problem('Choose one of the hotel’s published room categories.');
 // Preserve the occupancy of any historical property reservation without offering new ones.
 if(busy.some(b=>b.kind==='property'))throw problem('Rooms are reserved during this time. Please choose another date.',409);
 const used=new Set(busy.flatMap(b=>b.resource_ids));
 const candidates=resources.filter(r=>r.active&&r.kind==='room'&&r.room_type===input.roomType&&!used.has(r.id));
 const chosen=candidates.sort((a,b)=>b.capacity-a.capacity).slice(0,input.quantity);
 if(chosen.length<input.quantity||chosen.reduce((n,r)=>n+r.capacity,0)<input.guests)throw problem('No matching rooms are available for this group and these dates.',409);
 return chosen;
}
export function price(input,settings,selected,units){
 if(input.kind!=='room')throw problem('Paid checkout is only available for rooms.');
 const room=settings.rooms.find(r=>r.id===input.roomType),rate=room?.rate;
 if(!rate||rate<=0)throw problem('The hotel has not opened pricing for this selection.',503);
 const quantity=input.quantity,subtotal=Math.round(rate*100)*units*quantity,tax=Math.round(subtotal*settings.taxPercent/100),total=subtotal+tax;
 if(!Number.isSafeInteger(total)||total>2000000000)throw problem('Please contact the hotel to arrange a booking of this size.');
 return {label:room.name,rate:Math.round(rate*100),units,unit:'night',quantity,subtotal,tax,taxPercent:settings.taxPercent,total,currency:'INR',guests:input.guests,cancellationPolicy:settings.cancellationPolicy};
}
export async function quote(raw,db=requireDb(),allowClosed=false){
 if(raw?.kind!=='room')throw problem('Online checkout is for hotel rooms. Use the restaurant or banquet page to send a reservation request.');
 const settings=await site(db);
 if((!settings.bookingEnabled&&!allowClosed)||!settings.verified)throw problem('Online reservations are opening soon. Our team can help you book by phone.',503);
 const {input,start,end,units}=interval(raw,settings);
 const {rows:resources}=await db.query('SELECT * FROM resources WHERE active=true');
 const {rows:busy}=await db.query("SELECT kind,resource_ids FROM bookings WHERE starts_at<$2 AND ends_at>$1 AND (status IN ('confirmed','cancel_requested','blocked') OR (status='hold' AND expires_at>now()))",[start,end]);
 const selected=selectResources(input,resources,busy);
 return {input,start,end,selected,quote:price(input,settings,selected,units)};
}
export async function accessToken(db,id){const token=randomBytes(32).toString('hex');await db.query("INSERT INTO access_tokens(token_hash,booking_id,expires_at) VALUES($1,$2,now()+interval '180 days')",[hash(token),id]);return token;}
export async function hold(raw,guest,external=false,expectedTotal,account=null){return transaction(async db=>{
 const q=await quote(raw,db,external);if(expectedTotal!==undefined&&q.quote.total!==expectedTotal)throw problem('The price changed. Please check availability again before paying.',409);const id=randomUUID();const reference='MH-'+randomBytes(4).toString('hex').toUpperCase();const person=guestInput.parse(account?{...guest,email:account.email}:guest);
 const {rows}=await db.query("INSERT INTO bookings(id,reference,kind,resource_ids,starts_at,ends_at,status,expires_at,guest,quote,amount,source,firebase_uid) VALUES($1,$2,$3,$4,$5,$6,$7,now()+interval '15 minutes',$8,$9,$10,$11,$12) RETURNING *",[id,reference,q.input.kind,q.selected.map(r=>r.id),q.start,q.end,external?'confirmed':'hold',JSON.stringify(person),JSON.stringify(q.quote),q.quote.total,external?'staff':'website',account?.uid||null]);
 const token=await accessToken(db,id);return {booking:rows[0],token};
 });}
export async function authorizedBooking(token){if(typeof token!=='string'||token.length!==64)throw problem('This booking link is invalid.',401);const {rows}=await requireDb().query('SELECT b.* FROM bookings b JOIN access_tokens t ON t.booking_id=b.id WHERE t.token_hash=$1 AND t.expires_at>now()',[hash(token)]);if(!rows[0])throw problem('This link has expired. Request a new link using your booking reference.',401);return rows[0];}

export async function reservationEstimate(raw,db=requireDb()){
 const settings=await site(db);const {input,start,end,units}=interval(raw,settings);const room=settings.rooms.find(r=>r.id===input.roomType);
 if(!room||input.guests>room.capacity*input.quantity)throw problem('Choose enough rooms for your party. Each room accommodates '+(room?.capacity||2)+' guests.');
 return {requestOnly:true,quote:price(input,settings,[],units),start,end};
}
