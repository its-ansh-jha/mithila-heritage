import {firebaseIdentity} from './firebase-auth.js';
import {problem} from './booking.js';
import {requireDb} from './db.js';
export async function guestUser(req){
 const token=req.cookies?.mh_session;if(!token)throw problem('Please sign in or create an account to continue.',401);
 return firebaseIdentity(token);
}
export function verifiedGuest(user){if(!user.emailVerified)throw problem('Please verify your email before completing a reservation.',403);return user;}
export async function saveAccount(db,user){
 await db.query(`INSERT INTO guest_accounts(firebase_uid,email,email_verified,display_name) VALUES($1,$2,$3,$4)
 ON CONFLICT(firebase_uid) DO UPDATE SET email=excluded.email,email_verified=excluded.email_verified,
 display_name=CASE WHEN excluded.display_name<>'' THEN excluded.display_name ELSE guest_accounts.display_name END,updated_at=now()`,[user.uid,user.email,user.emailVerified,user.name||'']);
}
export function reservationView(b){return {id:b.id,reference:b.reference,kind:b.kind,starts_at:b.starts_at,ends_at:b.ends_at,status:b.status==='hold'&&new Date(b.expires_at)<=new Date()?'expired':b.status,guest:{name:b.guest.name},quote:b.quote,amount:b.amount,payment_id:b.payment_id,refund_status:b.refund_status,source:b.source};}
export async function ownedBooking(uid,id,db=requireDb()){
 const {rows}=await db.query('SELECT * FROM bookings WHERE id=$1 AND firebase_uid=$2',[id,uid]);
 if(!rows[0])throw problem('Reservation not found in your account.',404);return rows[0];
}

export async function accountRequests(uid,db=requireDb()){const {rows}=await db.query("SELECT id,status,created_at,data->'request' AS request FROM inquiries WHERE data->>'firebase_uid'=$1 AND data ? 'request' ORDER BY created_at DESC LIMIT 100",[uid]);return rows;}
