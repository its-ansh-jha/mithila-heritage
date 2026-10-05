import {createHmac,timingSafeEqual,randomUUID} from 'node:crypto';
import {requireDb,transaction,audit} from './db.js';
import {problem,accessToken} from './booking.js';
import {firebaseUser,firebaseProject,configuredStaff} from './firebase-auth.js';
export function serviceStatus(){return {database:!!process.env.DATABASE_URL,authentication:!!firebaseProject(),ownerAccess:configuredStaff(),payments:!!(process.env.RAZORPAY_KEY_ID&&process.env.RAZORPAY_KEY_SECRET),webhooks:!!process.env.RAZORPAY_WEBHOOK_SECRET,email:!!(process.env.RESEND_API_KEY&&process.env.EMAIL_FROM),storage:!!process.env.DATABASE_URL,paymentMode:process.env.RAZORPAY_KEY_ID?.startsWith('rzp_live_')?'live':'test'};}
export function signature(value,received,secret){if(!secret||typeof received!=='string'||!/^[a-f0-9]{64}$/i.test(received))return false;const expected=createHmac('sha256',secret).update(value).digest();return timingSafeEqual(expected,Buffer.from(received,'hex'));}
export async function razor(path,body){if(!serviceStatus().payments)throw problem('Online payment is not available yet. Please contact the hotel.',503);const response=await fetch('https://api.razorpay.com/v1/'+path,{method:body?'POST':'GET',headers:{Authorization:'Basic '+Buffer.from(process.env.RAZORPAY_KEY_ID+':'+process.env.RAZORPAY_KEY_SECRET).toString('base64'),'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15000)});const data=await response.json();if(!response.ok)throw problem('The payment provider could not complete this request. Please try again or contact the hotel.',502);return data;}
export const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export async function notifyBooking(db,b,subject){const token=await accessToken(db,b.id);const link=(process.env.APP_URL||'http://localhost:5173')+'/manage#'+token;await db.query('INSERT INTO notifications(id,booking_id,recipient,subject,html) VALUES($1,$2,$3,$4,$5)',[randomUUID(),b.id,b.guest.email,subject,`<h1>Mithila Heritage</h1><p>Dear ${escape(b.guest.name)},</p><p>${escape(subject)}. Reference: <strong>${escape(b.reference)}</strong>.</p><p>Status: ${escape(b.status)}. Total: INR ${(b.amount/100).toFixed(2)}.</p><p><a href="${escape(link)}">View your reservation and payment receipt</a></p><p>For assistance, contact the hotel directly.</p>`]);}
export async function flushNotifications(){if(!serviceStatus().email)return {sent:0,configured:false};const db=requireDb();const {rows}=await db.query("SELECT * FROM notifications WHERE status='pending' AND attempts<10 ORDER BY created_at LIMIT 10");let sent=0;for(const n of rows){try{const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':n.id},body:JSON.stringify({from:process.env.EMAIL_FROM,to:n.recipient,subject:n.subject,html:n.html}),signal:AbortSignal.timeout(10000)});if(!r.ok)throw new Error('Email provider returned '+r.status);await db.query("UPDATE notifications SET status='sent',sent_at=now(),last_error=null WHERE id=$1",[n.id]);sent++;}catch(e){await db.query('UPDATE notifications SET attempts=attempts+1,last_error=$2 WHERE id=$1',[n.id,e.message]);}}return {sent,configured:true};}
export async function settlePayment(payment){
 if(payment.status!=='captured')return {pending:true};
 return transaction(async db=>{
  const {rows}=await db.query('SELECT * FROM bookings WHERE order_id=$1 FOR UPDATE',[payment.order_id]);const b=rows[0];if(!b)throw problem('Unknown payment order.',404);
  if(payment.amount!==b.amount||payment.currency!=='INR')throw problem('Payment amount does not match the booking.',409);
  if(b.payment_id){if(b.payment_id!==payment.id)throw problem('A different payment is already attached to this booking.',409);return {booking:b};}
  let status='reconciliation';
  if(b.status==='hold'&&new Date(b.expires_at)>new Date())status='confirmed';
  else if(['hold','expired'].includes(b.status)){
   const {rows:conflicts}=await db.query("SELECT id FROM bookings WHERE id<>$1 AND starts_at<$3 AND ends_at>$2 AND (status IN ('confirmed','cancel_requested','blocked') OR (status='hold' AND expires_at>now())) AND ($4='property' OR kind='property' OR resource_ids && $5::uuid[])",[b.id,b.starts_at,b.ends_at,b.kind,b.resource_ids]);
   if(!conflicts.length)status='confirmed';
  }
  const {rows:updated}=await db.query('UPDATE bookings SET payment_id=$2,status=$3,updated_at=now() WHERE id=$1 RETURNING *',[b.id,payment.id,status]);
  await notifyBooking(db,updated[0],status==='confirmed'?'Your reservation is confirmed':'Your payment needs a reservation review');
  await audit(db,'payment-provider',status,b.id);return {booking:updated[0]};
 });
}
export async function authUser(req){
 const token=req.cookies?.mh_session;if(!token)throw problem('Please sign in.',401);
 return firebaseUser(token);
}
