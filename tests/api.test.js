import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
process.env.DATABASE_URL='';
process.env.RAZORPAY_KEY_ID='';
process.env.RAZORPAY_KEY_SECRET='';
process.env.RESEND_API_KEY='';
const {default:app}=await import('../server/app.js');
test('public catalog loads with real content and no invented inventory',async()=>{const r=await request(app).get('/api/site');assert.equal(r.status,200);assert.equal(r.body.site.rooms.length,4);assert.equal(r.body.bookingReady,false);assert.equal(r.body.site.bookingEnabled,false);});
test('retired availability directs guests to WhatsApp',async()=>{const r=await request(app).post('/api/availability').send({});assert.equal(r.status,410);assert.equal(r.body.whatsapp,'https://wa.me/917295807999');});
test('admin and upload routes are retired',async()=>{for(const path of ['/api/admin/overview','/api/admin/upload']){const r=path.endsWith('upload')?await request(app).post(path).send({}):await request(app).get(path);assert.equal(r.status,410);}});
test('cross-origin mutation is rejected',async()=>{const r=await request(app).post('/api/booking/cancel').set('Origin','https://untrusted.example').send({});assert.equal(r.status,403);});
test('unverified payment webhook is rejected',async()=>{const r=await request(app).post('/api/payments/webhook').set('Content-Type','application/json').send('{}');assert.equal(r.status,401);});
test('retired checkout cannot create bookings with a supplied account UID',async()=>{const r=await request(app).post('/api/bookings').send({expectedAccountUid:'another-guest',guest:{email:'owner@example.com'}});assert.equal(r.status,410);assert.match(r.body.error,/retired/i);assert.equal(r.body.orderId,undefined);});
test('account routes and online cancellation no longer expose a login workflow',async()=>{for(const path of ['/api/account','/api/account/requests','/api/account/bookings','/api/account/bookings/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'])assert.equal((await request(app).get(path)).status,410);assert.equal((await request(app).post('/api/account/bookings/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/cancel').send({uid:'another-guest'})).status,410);});
test('forged session cookies cannot access customer bookings',async()=>{const r=await request(app).get('/api/account/bookings').set('Cookie','mh_session=forged-token');assert.equal(r.status,410);});
test('health endpoint and unknown API routes return structured responses',async()=>{assert.equal((await request(app).get('/api/health')).body.ok,true);const r=await request(app).get('/api/missing');assert.equal(r.status,404);assert.match(r.body.error,/not found/);});

test('online dining and banquet requests are retired in favour of WhatsApp',async()=>{const r=await request(app).post('/api/reservation-requests').send({kind:'restaurant',expectedAccountUid:'other-guest'});assert.equal(r.status,410);});
