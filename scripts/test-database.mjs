import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {pool} from '../server/db.js';
import {quote} from '../server/booking.js';
import {saveAccount,ownedBooking,accountRequests} from '../server/accounts.js';
if(!pool)throw new Error('DATABASE_URL is required for database integration checks.');
const a=await pool.connect();const b=await pool.connect();
try{
 await a.query('BEGIN');await b.query('BEGIN');await a.query('SELECT pg_advisory_xact_lock(728411)');
 const lock=await b.query('SELECT pg_try_advisory_xact_lock(728411) AS acquired');assert.equal(lock.rows[0].acquired,false);console.log('PASS: a second client cannot acquire the booking transaction lock.');
 const {rows}=await a.query('SELECT data FROM site_settings WHERE id=1');const settings=structuredClone(rows[0].data);settings.verified=true;settings.bookingEnabled=true;settings.taxPercent=5;settings.rooms[0].capacity=2;
 await a.query('UPDATE site_settings SET data=$1 WHERE id=1',[JSON.stringify(settings)]);
 const room=randomUUID(),table=randomUUID();await a.query("INSERT INTO resources(id,kind,name,room_type,capacity,rate) VALUES($1,'room','ROLLBACK TEST ROOM',$3,2,0),($2,'table','ROLLBACK TEST TABLE',null,4,5)",[room,table,settings.rooms[0].id]);
 const date=new Date(Date.now()+10*86400000).toISOString().slice(0,10),endDate=new Date(Date.now()+12*86400000).toISOString().slice(0,10);
 const input={kind:'room',date,endDate,guests:2,quantity:1,roomType:settings.rooms[0].id};
 const q=await quote(input,a);assert.equal(q.quote.total,Math.round(settings.rooms[0].rate*100)*2*1.05);assert.ok(q.selected.some(r=>r.id===room));console.log('PASS: Neon quote queries return available room and correct nightly price.');
 const id=randomUUID();await a.query("INSERT INTO bookings(id,reference,kind,resource_ids,starts_at,ends_at,status,expires_at,guest,quote,amount) VALUES($1,$2,'room',$3,$4,$5,'hold',now()+interval '15 minutes','{}','{}',1)",[id,'ROLLBACK-'+id,[room],q.start,q.end]);
 const first={uid:'rollback-'+randomUUID(),email:'rollback@example.invalid',emailVerified:true,name:'Rollback guest'},second={...first,uid:'rollback-'+randomUUID()};
 await saveAccount(a,first);await saveAccount(a,second);await a.query('UPDATE bookings SET firebase_uid=$2 WHERE id=$1',[id,first.uid]);
 assert.equal((await ownedBooking(first.uid,id,a)).id,id);
 await assert.rejects(()=>ownedBooking(second.uid,id,a),e=>e.status===404);
 await saveAccount(a,{...second,email:first.email});await assert.rejects(()=>ownedBooking(second.uid,id,a),e=>e.status===404);
 console.log('PASS: reservations belong to the authenticated UID; a second account cannot claim them even with the same email.');
 await assert.rejects(()=>quote(input,a),e=>e.status===409);await assert.rejects(()=>quote({kind:'property',date,time:'15:00',duration:60,guests:4},a),e=>e.status===400);console.log('PASS: held rooms block duplicates and unsupported booking types are rejected.');
 const inquiryId=randomUUID();await a.query('INSERT INTO inquiries(id,data) VALUES($1,$2)',[inquiryId,JSON.stringify({firebase_uid:first.uid,request:{kind:'restaurant',date,guests:2}})]);assert.equal((await accountRequests(first.uid,a))[0].id,inquiryId);assert.equal((await accountRequests(second.uid,a)).length,0);console.log('PASS: dining and banquet requests are private to their authenticated owner.');
 await a.query("UPDATE bookings SET expires_at=now()-interval '1 second' WHERE id=$1",[id]);assert.ok((await quote(input,a)).selected.length);console.log('PASS: expiry releases room inventory without a scheduled job.');
 await a.query('ROLLBACK');const after=await b.query('SELECT pg_try_advisory_xact_lock(728411) AS acquired');assert.equal(after.rows[0].acquired,true);console.log('PASS: transaction lock releases after rollback. Test rows and settings rolled back.');
}finally{await a.query('ROLLBACK');await b.query('ROLLBACK');a.release();b.release();await pool.end();}
