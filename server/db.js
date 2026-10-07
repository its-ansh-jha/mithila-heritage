import 'dotenv/config';
import pg from 'pg';
import {initialSite} from '../shared/catalog.js';
const connectionString=process.env.DATABASE_URL?.replace('sslmode=require','sslmode=verify-full');
export const pool=connectionString ? new pg.Pool({connectionString,max:5,idleTimeoutMillis:10000,connectionTimeoutMillis:7000}) : null;
export function requireDb(){if(!pool) throw Object.assign(new Error('Online reservations are being prepared. Please contact the hotel to arrange your booking.'),{status:503}); return pool;}
export async function site(db=pool){
 if(!db)return structuredClone(initialSite);
 const {rows}=await db.query('SELECT data FROM site_settings WHERE id=1');
 const stored=rows[0]?.data;
 if(!stored)return structuredClone(initialSite);
 const currentRooms=new Map(initialSite.rooms.map(room=>[room.id,room]));
 return {
  ...stored,
  cancellationPolicy:initialSite.cancellationPolicy,
  taxPercent:initialSite.taxPercent,
  gallery:structuredClone(initialSite.gallery),
  rooms:(stored.rooms||initialSite.rooms).map(room=>{
   const current=currentRooms.get(room.id);
   return current?{...room,image:current.image,gallery:structuredClone(current.gallery||[]),rate:current.rate}:room;
  })
 };
}
export async function transaction(fn){const c=await requireDb().connect();try{await c.query('BEGIN');await c.query("SELECT pg_advisory_xact_lock(728411)");const r=await fn(c);await c.query('COMMIT');return r;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}
export async function audit(db,actor,action,id){await db.query('INSERT INTO audit_log(actor,action,entity_id) VALUES($1,$2,$3)',[actor,action,id]);}
