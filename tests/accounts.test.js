import test from 'node:test';
import assert from 'node:assert/strict';
import {verifiedGuest,reservationView} from '../server/accounts.js';

test('a newly created unverified account cannot complete checkout',()=>{
 assert.throws(()=>verifiedGuest({uid:'new-guest',emailVerified:false}),e=>e.status===403);
 const verified={uid:'verified-guest',emailVerified:true};assert.equal(verifiedGuest(verified),verified);
});

test('account receipts do not disclose private guest contact details or internal notes',()=>{
 const receipt=reservationView({id:'booking',status:'confirmed',guest:{name:'Guest',email:'private@example.com',phone:'1234567890',notes:'Private request'},firebase_uid:'private-uid',resource_ids:['room-101'],quote:{label:'Room'},amount:10000});
 assert.deepEqual(receipt.guest,{name:'Guest'});assert.equal(receipt.firebase_uid,undefined);assert.equal(receipt.resource_ids,undefined);
});

test('abandoned checkout appears expired in the customer account',()=>{
 const booking={status:'hold',expires_at:new Date(Date.now()-60000),guest:{}};
 assert.equal(reservationView(booking).status,'expired');
 assert.equal(reservationView({...booking,status:'confirmed'}).status,'confirmed');
 assert.equal(reservationView({...booking,expires_at:new Date(Date.now()+60000)}).status,'hold');
});

test('reservation request input accepts dining and banquet details, rejects unsupported offerings',async()=>{const {reservationRequestInput}=await import('../shared/validation.js');const base={expectedAccountUid:'guest',name:'Test Guest',phone:'1234567890',date:'2026-12-01',guests:2};assert.equal(reservationRequestInput.parse({...base,kind:'restaurant',time:'19:00'}).kind,'restaurant');assert.equal(reservationRequestInput.parse({...base,kind:'banquet',eventType:'Wedding'}).kind,'banquet');assert.equal(reservationRequestInput.parse({...base,kind:'room',roomType:'heritage-classic',endDate:'2026-12-02'}).kind,'room');assert.throws(()=>reservationRequestInput.parse({...base,kind:'room'}));for(const kind of ['property','villa','table'])assert.throws(()=>reservationRequestInput.parse({...base,kind}));assert.throws(()=>reservationRequestInput.parse({...base,kind:'restaurant'}));assert.throws(()=>reservationRequestInput.parse({...base,kind:'banquet'}));});
