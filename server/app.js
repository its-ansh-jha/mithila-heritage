import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import {randomUUID} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {z} from 'zod';
import {firebaseUser,firebaseIdentity} from './firebase-auth.js';
import {firebaseConfig} from '../shared/firebase-config.js';
import {guestUser,verifiedGuest,saveAccount,reservationView,ownedBooking,accountRequests} from './accounts.js';
import {requireDb,pool,site,transaction,audit} from './db.js';
import {quote,hold,authorizedBooking,problem,interval,reservationEstimate} from './booking.js';
import {inquiryInput,siteInput,resourceInput,reservationRequestInput} from '../shared/validation.js';
import {serviceStatus,razor,signature,settlePayment,flushNotifications,notifyBooking,authUser,escape} from './services.js';
const app=express();app.disable('x-powered-by');app.set('trust proxy',1);
app.use(helmet({contentSecurityPolicy:{directives:{defaultSrc:["'self'"],scriptSrc:["'self'",'https://checkout.razorpay.com','https://apis.google.com'],styleSrc:["'self'","'unsafe-inline'"],imgSrc:["'self'",'data:','https:'],fontSrc:["'self'"],connectSrc:["'self'",'https://*.razorpay.com','https://identitytoolkit.googleapis.com','https://securetoken.googleapis.com','https://firebaseinstallations.googleapis.com'],frameSrc:['https://*.razorpay.com','https://'+firebaseConfig.authDomain],upgradeInsecureRequests:process.env.NODE_ENV==='production'?[]:null}},crossOriginEmbedderPolicy:false,crossOriginOpenerPolicy:{policy:'same-origin-allow-popups'}}));
app.post('/api/payments/webhook',express.raw({type:'application/json',limit:'100kb'}),async(req,res)=>{
 if(!signature(req.body,req.get('x-razorpay-signature'),process.env.RAZORPAY_WEBHOOK_SECRET))throw problem('Invalid webhook signature.',401);
 const event=JSON.parse(req.body.toString());
 if(['payment.captured','order.paid'].includes(event.event)&&event.payload?.payment?.entity){await settlePayment(event.payload.payment.entity);await flushNotifications();}
 if(event.event==='refund.processed'||event.event==='refund.failed'){
  const refund=event.payload?.refund?.entity;if(refund)await requireDb().query('UPDATE bookings SET refund_status=$2 WHERE refund_id=$1',[refund.id,refund.status]);
 }
 res.json({received:true});
});
app.use(express.json({limit:'6mb'}));app.use(cookieParser());
app.use('/api',rateLimit({windowMs:60000,limit:150,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many requests. Please try again in a minute.'}}));
app.use('/api',(req,res,next)=>{res.set('Cache-Control','no-store');if(!['GET','HEAD','OPTIONS'].includes(req.method)){const origin=req.get('origin');const expected=new URL(process.env.APP_URL||'http://localhost:5173').origin;if(origin&&origin!==expected)return next(problem('This request origin is not allowed.',403));}next();});
const sensitive=rateLimit({windowMs:15*60000,limit:12,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many attempts. Please try again later.'}});
app.get('/api/health',async(req,res)=>{let database=false;if(pool){try{await pool.query('SELECT 1 FROM site_settings LIMIT 1');database=true;}catch{}}res.json({ok:true,database,configured:!!pool});});
app.get('/api/site',async(req,res)=>{const settings=await site();res.json({site:settings,bookingReady:settings.bookingEnabled&&settings.verified&&Object.entries(serviceStatus()).filter(([k])=>['database','payments','email','webhooks'].includes(k)).every(([,v])=>v)});});
app.post('/api/availability',async(req,res)=>{const q=await quote(req.body);res.json({quote:q.quote,start:q.start,end:q.end});});
app.post('/api/reservation-estimate',async(req,res)=>res.json(await reservationEstimate(req.body)));
app.post('/api/bookings',sensitive,async(req,res)=>{
 const account=verifiedGuest(await guestUser(req));
 if(req.body.expectedAccountUid!==account.uid)throw problem('Your signed-in account changed. Refresh this page before booking.',409);
 const status=serviceStatus();if(!status.payments||!status.email||!status.webhooks)throw problem('Online checkout is not available yet. Please contact the hotel to book.',503);
 const result=await hold(req.body.selection,req.body.guest,false,z.number().int().positive().parse(req.body.expectedTotal),account);let order;
 try{order=await razor('orders',{amount:result.booking.amount,currency:'INR',receipt:result.booking.reference,notes:{booking_id:result.booking.id}});await requireDb().query('UPDATE bookings SET order_id=$2 WHERE id=$1',[result.booking.id,order.id]);}
 catch(e){await requireDb().query("UPDATE bookings SET status='expired' WHERE id=$1 AND status='hold'",[result.booking.id]);throw e;}
 res.status(201).json({token:result.token,reference:result.booking.reference,orderId:order.id,amount:order.amount,keyId:process.env.RAZORPAY_KEY_ID,expiresAt:result.booking.expires_at,mode:status.paymentMode});
});
app.post('/api/payments/verify',async(req,res)=>{
 const body=z.object({token:z.string(),razorpay_order_id:z.string(),razorpay_payment_id:z.string().regex(/^pay_[a-zA-Z0-9]+$/),razorpay_signature:z.string()}).parse(req.body);
 const b=await authorizedBooking(body.token);if(b.order_id!==body.razorpay_order_id||!signature(b.order_id+'|'+body.razorpay_payment_id,body.razorpay_signature,process.env.RAZORPAY_KEY_SECRET))throw problem('The payment could not be verified.',400);
 const p=await razor('payments/'+body.razorpay_payment_id);const result=await settlePayment(p);await flushNotifications();res.json({status:result.booking?.status||'pending'});
});
const bearer=req=>req.get('authorization')?.replace(/^Bearer /,'');
app.get('/api/booking',async(req,res)=>{const b=await authorizedBooking(bearer(req));res.json({booking:{reference:b.reference,kind:b.kind,starts_at:b.starts_at,ends_at:b.ends_at,status:b.status,guest:{name:b.guest.name},quote:b.quote,amount:b.amount,payment_id:b.payment_id,refund_status:b.refund_status,source:b.source}});});
app.post('/api/booking/cancel',async(req,res)=>{const b=await authorizedBooking(bearer(req));await transaction(async db=>{const {rows}=await db.query("UPDATE bookings SET status='cancel_requested',updated_at=now() WHERE id=$1 AND status='confirmed' RETURNING *",[b.id]);if(!rows[0])throw problem('Only confirmed reservations can request cancellation.',409);await notifyBooking(db,rows[0],'We received your cancellation request');});await flushNotifications();res.json({ok:true});});
app.post('/api/booking/retrieve',sensitive,async(req,res)=>{const {reference,email}=z.object({reference:z.string().max(40),email:z.string().email()}).parse(req.body);const db=requireDb();const {rows}=await db.query("SELECT * FROM bookings WHERE reference=$1 AND lower(guest->>'email')=$2",[reference.trim().toUpperCase(),email.trim().toLowerCase()]);if(rows[0])await notifyBooking(db,rows[0],'Your reservation access link');await flushNotifications();res.json({message:'If these details match a reservation, a secure access link will be sent to your email.'});});
app.post('/api/inquiries',sensitive,async(req,res)=>{const data=inquiryInput.parse(req.body);const db=requireDb();const id=randomUUID();await db.query('INSERT INTO inquiries(id,data) VALUES($1,$2)',[id,JSON.stringify(data)]);await db.query('INSERT INTO notifications(id,recipient,subject,html) VALUES($1,$2,$3,$4)',[randomUUID(),data.email,'We received your enquiry — Mithila Heritage',`<p>Dear ${escape(data.name)},</p><p>Thank you for getting in touch. Your enquiry has been saved and our hotel team will respond to you.</p>`]);await flushNotifications();res.status(201).json({message:'Your enquiry has been received. Our hotel team will be in touch.'});});
app.post('/api/reservation-requests',sensitive,async(req,res)=>{
 const user=verifiedGuest(await guestUser(req));const input=reservationRequestInput.parse(req.body);
 if(input.expectedAccountUid!==user.uid)throw problem('Your account changed. Sign in again before sending your request.',409);
 const today=new Date(Date.now()+19800000).toISOString().slice(0,10);const when=new Date(input.date+'T'+(input.time||'23:59')+':00+05:30');
 if(Number.isNaN(+when)||new Date(+when+19800000).toISOString().slice(0,10)!==input.date||input.date<today||+when<=Date.now()||+when>Date.now()+366*86400000)throw problem('Choose a valid upcoming date within the next year.');
 if(input.kind==='restaurant'){const settings=await site();if(input.time<settings.restaurantOpen||input.time>=settings.restaurantClose)throw problem('Choose a time during restaurant opening hours.');}
 const estimate=input.kind==='room'?await reservationEstimate({...input,kind:'room'}):null;
 const id=randomUUID(),reference='RQ-'+id.slice(0,8).toUpperCase(),subject=input.kind==='room'?'Rooms & stays':input.kind==='restaurant'?'Dining':'Celebrations';
 const message=[input.kind==='room'?'Room reservation request':input.kind==='restaurant'?'Restaurant reservation request':'Banquet hall request','Reference: '+reference,estimate?'Room: '+estimate.quote.label:null,estimate?'Check-out: '+input.endDate+' · Rooms: '+input.quantity:null,'Date: '+input.date,input.time?'Time: '+input.time+' IST':null,'Guests: '+input.guests,input.eventType?'Event: '+input.eventType:null,input.notes].filter(Boolean).join('\n');
 const data={name:input.name,email:user.email,phone:input.phone,subject,message,firebase_uid:user.uid,request:{reference,kind:input.kind,date:input.date,time:input.time,guests:input.guests,eventType:input.eventType,...(estimate?{endDate:input.endDate,roomType:input.roomType,roomName:estimate.quote.label,quantity:input.quantity,estimate:estimate.quote.total}: {})}};
 await transaction(async db=>{await db.query('INSERT INTO inquiries(id,data) VALUES($1,$2)',[id,JSON.stringify(data)]);await audit(db,user.uid,'reservation.request',id);});
 res.status(201).json({id,reference,message:'Your request has been saved. The hotel team will contact you to confirm availability and arrangements. This is not a confirmed reservation.'});
});
app.get('/api/account/requests',async(req,res)=>{const user=await guestUser(req);res.json({requests:await accountRequests(user.uid)});});
const sessionAttempts=rateLimit({windowMs:15*60000,limit:30,skipSuccessfulRequests:true,standardHeaders:'draft-7',legacyHeaders:false,message:{error:'Too many unsuccessful sign-in attempts. Please try again later.'}});
app.post('/api/auth/session',sessionAttempts,async(req,res)=>{
 const {idToken,scope}=z.object({idToken:z.string().min(50).max(10000),scope:z.enum(['guest','staff']).default('guest')}).parse(req.body);
 const identity=await firebaseIdentity(idToken);const user=scope==='staff'?{...identity,...await firebaseUser(idToken)}:identity;
 await saveAccount(requireDb(),identity);
 res.cookie('mh_session',idToken,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',maxAge:Math.max(0,user.expiresAt*1000-Date.now()),path:'/'});
 res.json({user});
});
app.post('/api/auth/logout',(req,res)=>{res.clearCookie('mh_session',{path:'/'});res.json({ok:true});});
app.get('/api/auth/me',async(req,res)=>res.json({user:await authUser(req)}));
app.get('/api/account',async(req,res)=>{res.json({user:await guestUser(req)});});
app.get('/api/account/bookings',async(req,res)=>{
 const user=await guestUser(req);const {rows}=await requireDb().query('SELECT * FROM bookings WHERE firebase_uid=$1 ORDER BY created_at DESC LIMIT 200',[user.uid]);
 res.json({bookings:rows.map(reservationView)});
});
app.get('/api/account/bookings/:id',async(req,res)=>{
 const user=await guestUser(req);const booking=await ownedBooking(user.uid,z.string().uuid().parse(req.params.id));res.json({booking:reservationView(booking)});
});
app.post('/api/account/bookings/:id/cancel',async(req,res)=>{
 const user=await guestUser(req);const id=z.string().uuid().parse(req.params.id);
 await transaction(async db=>{
  await ownedBooking(user.uid,id,db);
  const {rows}=await db.query("UPDATE bookings SET status='cancel_requested',updated_at=now() WHERE id=$1 AND firebase_uid=$2 AND status='confirmed' RETURNING *",[id,user.uid]);
  if(!rows[0])throw problem('Only confirmed reservations can request cancellation.',409);
  await notifyBooking(db,rows[0],'We received your cancellation request');await audit(db,user.uid,'guest.cancellation.request',id);
 });await flushNotifications();res.json({ok:true});
});
app.use('/api/admin',async(req,res,next)=>{req.user=await authUser(req);next();});
const owner=(req,res,next)=>req.user.role==='owner'?next():next(problem('Only the owner can change financial settings or issue refunds.',403));
app.get('/api/admin/overview',async(req,res)=>{
 const db=requireDb();const [settings,resources,bookings,inquiries,notifications]=await Promise.all([site(db),db.query("SELECT * FROM resources WHERE kind='room' ORDER BY name"),db.query('SELECT * FROM bookings ORDER BY starts_at DESC LIMIT 1000'),db.query('SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 500'),db.query("SELECT id,recipient,subject,status,attempts,last_error,created_at FROM notifications WHERE status<>'sent' ORDER BY created_at DESC LIMIT 100")]);
 res.json({site:settings,resources:resources.rows,bookings:bookings.rows,inquiries:inquiries.rows,notifications:notifications.rows,services:serviceStatus(),user:req.user});
});
app.put('/api/admin/site',owner,async(req,res)=>{
 const settings=siteInput.parse(req.body);if(new Set(settings.rooms.map(r=>r.id)).size!==settings.rooms.length)throw problem('Room type identifiers must be unique.');
 if(settings.bookingEnabled&&(!settings.verified||!settings.terms.trim()||!settings.privacy.trim()||!settings.cancellationPolicy.trim()))throw problem('Verify hotel details and enter all three policies before enabling reservations.');
 await transaction(async db=>{const {rows}=await db.query('SELECT * FROM resources WHERE active');for(const r of rows){if(r.kind==='room'&&!settings.rooms.some(t=>t.id===r.room_type&&t.capacity>=r.capacity))throw problem('Each active room needs a matching room type with a sufficient guest capacity.');}
 if(settings.bookingEnabled&&!rows.some(r=>r.kind==='room'))throw problem('Add actual guest rooms before enabling reservations.');
 await db.query('INSERT INTO site_settings(id,data) VALUES(1,$1) ON CONFLICT(id) DO UPDATE SET data=$1,updated_at=now()',[JSON.stringify(settings)]);await audit(db,req.user.email,'settings.update','1');});res.json({ok:true});
});
app.post('/api/admin/resources',owner,async(req,res)=>{
 const v=resourceInput.parse(req.body);const id=req.body.id?z.string().uuid().parse(req.body.id):randomUUID();
 await transaction(async db=>{const s=await site(db);if(v.kind==='room'&&!s.rooms.some(r=>r.id===v.room_type&&r.capacity>=v.capacity))throw problem('Set the room type capacity in settings first.');if(v.kind==='table'&&v.active&&v.rate<=0)throw problem('Active tables require a positive per-minute rate.');
 const {rows}=await db.query("SELECT id FROM bookings WHERE $1=ANY(resource_ids) AND ends_at>now() AND (status IN ('confirmed','cancel_requested','blocked') OR (status='hold' AND expires_at>now()))",[id]);if(rows.length)throw problem('This resource has upcoming reservations or blocks. Resolve them before editing it.',409);
 await db.query('INSERT INTO resources(id,kind,name,room_type,capacity,rate,active) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET kind=$2,name=$3,room_type=$4,capacity=$5,rate=$6,active=$7',[id,v.kind,v.name,v.room_type,v.capacity,v.rate,v.active]);await audit(db,req.user.email,'resource.save',id);});res.json({id});
});
app.post('/api/admin/bookings',async(req,res)=>{const r=await hold(req.body.selection,req.body.guest,true);await notifyBooking(requireDb(),r.booking,'Your reservation is confirmed — payment arranged with hotel');await audit(requireDb(),req.user.email,'booking.external',r.booking.id);await flushNotifications();res.status(201).json({reference:r.booking.reference});});
app.post('/api/admin/blocks',async(req,res)=>{
 const input=z.object({kind:z.literal('room'),resourceId:z.string().uuid().optional(),start:z.string().datetime({offset:true}),end:z.string().datetime({offset:true}),reason:z.string().min(3).max(300)}).parse(req.body);
 const start=new Date(input.start),end=new Date(input.end);if(end<=start||end<=new Date())throw problem('Choose a valid future block interval.');
 await transaction(async db=>{if(input.kind!=='property'){const r=await db.query('SELECT id FROM resources WHERE id=$1 AND kind=$2',[input.resourceId,input.kind]);if(!r.rows.length)throw problem('Select an actual resource.');}
 const ids=input.kind==='property'?[]:[input.resourceId];const {rows}=await db.query("SELECT id FROM bookings WHERE starts_at<$2 AND ends_at>$1 AND (status IN ('confirmed','cancel_requested','blocked') OR (status='hold' AND expires_at>now())) AND ($3='property' OR kind='property' OR resource_ids && $4::uuid[])",[start,end,input.kind,ids]);if(rows.length)throw problem('This block overlaps an existing reservation or block.',409);
 const id=randomUUID();await db.query("INSERT INTO bookings(id,reference,kind,resource_ids,starts_at,ends_at,status,guest,quote,amount,source) VALUES($1,$2,$3,$4,$5,$6,'blocked',$7,'{}',0,'staff')",[id,'BLOCK-'+id.slice(0,8),input.kind,ids,start,end,JSON.stringify({name:input.reason})]);await audit(db,req.user.email,'block.create',id);});res.json({ok:true});
});
app.post('/api/admin/bookings/:id/cancel',async(req,res)=>{const id=z.string().uuid().parse(req.params.id);await transaction(async db=>{const {rows}=await db.query("UPDATE bookings SET status='cancelled',updated_at=now() WHERE id=$1 AND status IN ('confirmed','cancel_requested','blocked','hold') RETURNING *",[id]);if(!rows[0])throw problem('This reservation cannot be cancelled in its current state.',409);if(rows[0].guest.email)await notifyBooking(db,rows[0],'Your reservation has been cancelled');await audit(db,req.user.email,'booking.cancel',id);});await flushNotifications();res.json({ok:true});});
app.post('/api/admin/bookings/:id/refund',owner,async(req,res)=>{
 const id=z.string().uuid().parse(req.params.id);
 const b=await transaction(async db=>{const {rows}=await db.query('SELECT * FROM bookings WHERE id=$1 FOR UPDATE',[id]);const b=rows[0];if(!b?.payment_id||!['cancelled','reconciliation'].includes(b.status))throw problem('Cancel a paid reservation before refunding it, or select a payment requiring reconciliation.',409);if(b.refund_id||b.refund_status)throw problem('A refund has already been submitted or requires provider reconciliation. Do not submit it twice.',409);await db.query("UPDATE bookings SET refund_status='submitting' WHERE id=$1",[id]);return b;});
 try{const refund=await razor('payments/'+b.payment_id+'/refund',{amount:b.amount,notes:{booking_reference:b.reference},receipt:b.reference});await transaction(async db=>{const {rows}=await db.query('UPDATE bookings SET refund_id=$2,refund_status=$3 WHERE id=$1 RETURNING *',[id,refund.id,refund.status]);await notifyBooking(db,rows[0],'Your refund has been submitted');await audit(db,req.user.email,'refund.submit',id);});}
 catch(e){await requireDb().query("UPDATE bookings SET refund_status='review_required' WHERE id=$1",[id]);throw e;}await flushNotifications();res.json({ok:true});
});
app.post('/api/admin/bookings/:id/reconcile',owner,async(req,res)=>{
 const {rows}=await requireDb().query('SELECT * FROM bookings WHERE id=$1',[z.string().uuid().parse(req.params.id)]);const b=rows[0];if(!b?.order_id)throw problem('No online order exists.',400);
 const payments=await razor('orders/'+b.order_id+'/payments');for(const p of payments.items||[])if(p.status==='captured')await settlePayment(p);
 if(b.payment_id&&b.refund_status){const refunds=await razor('payments/'+b.payment_id+'/refunds');const refund=refunds.items?.find(r=>r.receipt===b.reference||r.notes?.booking_reference===b.reference);if(refund)await requireDb().query('UPDATE bookings SET refund_id=$2,refund_status=$3 WHERE id=$1',[b.id,refund.id,refund.status]);}
 await flushNotifications();res.json({ok:true});
});
app.post('/api/admin/inquiries/:id',async(req,res)=>{const id=z.string().uuid().parse(req.params.id);const status=z.enum(['new','in_progress','resolved']).parse(req.body.status);await requireDb().query('UPDATE inquiries SET status=$2 WHERE id=$1',[id,status]);res.json({ok:true});});
app.post('/api/admin/notifications/retry',async(req,res)=>{await requireDb().query("UPDATE notifications SET attempts=0 WHERE status='pending'");res.json(await flushNotifications());});
app.post('/api/admin/upload',owner,async(req,res)=>{
 requireDb();
 const {data,type}=z.object({data:z.string().max(5500000),type:z.enum(['image/jpeg','image/png','image/webp'])}).parse(req.body);const buffer=Buffer.from(data,'base64');if(buffer.length>4000000)throw problem('Images must be smaller than 4 MB.');
 const valid=type==='image/jpeg'?buffer.subarray(0,3).toString('hex')==='ffd8ff':type==='image/png'?buffer.subarray(0,8).toString('hex')==='89504e470d0a1a0a':buffer.subarray(0,4).toString()==='RIFF'&&buffer.subarray(8,12).toString()==='WEBP';if(!valid)throw problem('The file contents do not match the image type.');
 const id=randomUUID();await requireDb().query('INSERT INTO media_assets(id,content_type,data,created_by) VALUES($1,$2,$3,$4)',[id,type,buffer,req.user.email]);
 res.json({url:'/api/media/'+id});
});
app.get('/api/jobs/notifications',async(req,res)=>{if(!process.env.CRON_SECRET||req.get('authorization')!=='Bearer '+process.env.CRON_SECRET)throw problem('Unauthorized.',401);res.json(await flushNotifications());});
app.get('/api/media/:id',async(req,res)=>{
 const id=z.string().uuid().parse(req.params.id);const {rows}=await requireDb().query('SELECT content_type,data FROM media_assets WHERE id=$1',[id]);
 if(!rows[0])throw problem('Image not found.',404);
 res.set('Cache-Control','public, max-age=31536000, immutable').type(rows[0].content_type).send(rows[0].data);
});
app.use('/api',(req,res)=>res.status(404).json({error:'API route not found.'}));
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');app.use(express.static(path.join(root,'dist'),{index:false}));
app.get('/{*path}',(req,res,next)=>res.sendFile(path.join(root,'dist/index.html'),err=>err?next(problem('Build the frontend with npm run build, or open the Vite development server on port 5173.',404)):undefined));
app.use((err,req,res,next)=>{if(res.headersSent)return next(err);if(err instanceof z.ZodError)return res.status(400).json({error:err.issues.map(i=>`${i.path.join('.')}: ${i.message}`).join('; ')});const status=err.status||500;if(status>=500)console.error('[server]',err.code||err.name,err.message);res.status(status).json({error:status===500?'Something went wrong. Please try again or contact the hotel.':err.message});});
export default app;
