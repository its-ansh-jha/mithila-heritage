import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
process.env.DATABASE_URL='';
process.env.RAZORPAY_KEY_ID='';
process.env.RAZORPAY_KEY_SECRET='';
process.env.RESEND_API_KEY='';
const {default:app}=await import('../server/app.js');
test('public catalog loads with real content and no invented inventory',async()=>{const r=await request(app).get('/api/site');assert.equal(r.status,200);assert.equal(r.body.site.rooms.length,4);assert.equal(r.body.bookingReady,false);assert.equal(r.body.site.bookingEnabled,false);});
test('availability fails honestly without a configured database',async()=>{const r=await request(app).post('/api/availability').send({});assert.equal(r.status,503);assert.match(r.body.error,/contact the hotel/);});
test('admin and upload routes require staff authentication',async()=>{for(const path of ['/api/admin/overview','/api/admin/upload']){const r=path.endsWith('upload')?await request(app).post(path).send({}):await request(app).get(path);assert.equal(r.status,401);}});
test('cross-origin mutation is rejected',async()=>{const r=await request(app).post('/api/inquiries').set('Origin','https://untrusted.example').send({});assert.equal(r.status,403);});
test('unverified payment webhook is rejected',async()=>{const r=await request(app).post('/api/payments/webhook').set('Content-Type','application/json').send('{}');assert.equal(r.status,401);});
test('checkout requires authentication even when a customer supplies another account UID',async()=>{const r=await request(app).post('/api/bookings').send({expectedAccountUid:'another-guest',guest:{email:'owner@example.com'}});assert.equal(r.status,401);assert.match(r.body.error,/sign in/i);assert.equal(r.body.orderId,undefined);});
test('account details, reservations and cancellation require authentication',async()=>{for(const path of ['/api/account','/api/account/requests','/api/account/bookings','/api/account/bookings/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa'])assert.equal((await request(app).get(path)).status,401);assert.equal((await request(app).post('/api/account/bookings/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/cancel').send({uid:'another-guest'})).status,401);});
test('forged session cookies cannot access customer bookings',async()=>{const r=await request(app).get('/api/account/bookings').set('Cookie','mh_session=forged-token');assert.equal(r.status,401);});
test('health endpoint and unknown API routes return structured responses',async()=>{assert.equal((await request(app).get('/api/health')).body.ok,true);const r=await request(app).get('/api/missing');assert.equal(r.status,404);assert.match(r.body.error,/not found/);});

test('dining and banquet requests require a verified guest session',async()=>{const r=await request(app).post('/api/reservation-requests').send({kind:'restaurant',expectedAccountUid:'other-guest'});assert.equal(r.status,401);});
