import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import request from 'supertest';

const source=await readFile(new URL('../frontend/src/firebase.js',import.meta.url),'utf8');
let sequence=0;
function deferred(){let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return {promise,resolve,reject};}
async function fixture(t){
 const key='__firebaseClientTest'+(++sequence),calls=[],listeners=new Set();
 const guest={uid:'guest-google',email:'guest@example.com',getIdToken:async()=>'verified-google-id-token'};
 const auth={currentUser:null,authStateReady:async()=>{}};
 const state={calls,auth,guest,popup:async()=>({user:guest}),session:async()=>({user:{uid:guest.uid,email:guest.email,emailVerified:true,role:'guest'}})};
 const sdk={
  initializeApp:()=>({}),getApps:()=>[],
  initializeAuth:(app,options)=>{state.options=options;return auth;},
  browserSessionPersistence:{name:'session'},browserPopupRedirectResolver:{name:'popup'},
  GoogleAuthProvider:class {setCustomParameters(value){this.parameters=value;}},
  signInWithPopup:async(...args)=>{calls.push(['popup',...args]);const result=await state.popup();auth.currentUser=result.user;return result;},
  signOut:async()=>{calls.push(['signOut']);auth.currentUser=null;for(const listener of listeners)listener(null);},
  onIdTokenChanged:(instance,callback)=>{listeners.add(callback);queueMicrotask(()=>callback(instance.currentUser));return()=>listeners.delete(callback);},
  signInWithEmailAndPassword:async()=>({user:guest}),createUserWithEmailAndPassword:async()=>({user:guest}),updateProfile:async()=>{},sendEmailVerification:async()=>{},reload:async()=>{},sendPasswordResetEmail:async()=>{}
 };
 state.api=async(path,options)=>{calls.push(['api',path,options]);return path==='/auth/session'?state.session(options.body):{ok:true};};
 globalThis[key]={...sdk,api:state.api,firebaseConfig:{}};
 t.after(()=>{delete globalThis[key];});
 // Exercise the production module against isolated SDK/API adapters; no real user is created.
 const transformed=source.replace(/^import .*;\r?\n/gm,'');
 assert.doesNotMatch(transformed,/^import /m,'Every external import must be replaced before execution.');
 const prefix='const {'+Object.keys(globalThis[key]).join(',')+'}=globalThis['+JSON.stringify(key)+'];\n';
 state.client=await import('data:text/javascript,'+encodeURIComponent(prefix+transformed));
 return state;
}

test('Google guest authentication uses the lazy resolver and backend session identity',async t=>{
 const state=await fixture(t),result=await state.client.signInGoogleGuest();
 assert.equal(state.options.popupRedirectResolver,undefined);
 assert.equal(result.user.emailVerified,true);assert.equal(result.user.role,'guest');
 const popup=state.calls.find(call=>call[0]==='popup');
 assert.equal(popup[3].name,'popup');assert.deepEqual(popup[2].parameters,{prompt:'select_account'});
 const session=state.calls.find(call=>call[1]==='/auth/session');
 assert.deepEqual(session[2].body,{idToken:'verified-google-id-token',scope:'guest'});
});

test('a rejected Google admin account clears Firebase and the server cookie before retry',async t=>{
 const state=await fixture(t);
 state.session=async()=>{throw new Error('This account is not authorized to use the hotel desk.');};
 await assert.rejects(state.client.signInGoogleStaff(),/not authorized/);
 assert.equal(state.auth.currentUser,null);
 assert.ok(state.calls.some(call=>call[0]==='signOut'));
 assert.equal(state.calls.at(-1)[1],'/auth/logout');
 assert.equal(state.calls.find(call=>call[1]==='/auth/session')[2].body.scope,'staff');
 state.session=async()=>({user:{uid:state.guest.uid,role:'owner'}});
 assert.equal((await state.client.signInGoogleStaff()).user.role,'owner');
});

test('Google popup cancellation preserves an existing session and explains retry',async t=>{
 const state=await fixture(t);state.auth.currentUser=state.guest;
 state.popup=async()=>{throw Object.assign(new Error('closed'),{code:'auth/popup-closed-by-user'});};
 await assert.rejects(state.client.signInGoogleGuest(),/window was closed/);
 assert.equal(state.auth.currentUser,state.guest);
 assert.equal(state.calls.filter(call=>call[0]==='api'||call[0]==='signOut').length,0);
 assert.match(state.client.authMessage({code:'auth/popup-blocked'},'google'),/Allow pop-ups/);
 assert.match(state.client.authMessage({code:'auth/operation-not-allowed'},'google'),/Google sign-in is not enabled/);
 assert.match(state.client.authMessage({code:'auth/account-exists-with-different-credential'},'google'),/existing method/);
});

test('duplicate Google clicks open only one popup and allow another attempt afterward',async t=>{
 const state=await fixture(t),pending=deferred();state.popup=()=>pending.promise;
 const first=state.client.signInGoogleGuest();
 await assert.rejects(state.client.signInGoogleStaff(),/already in progress/);
 assert.equal(state.calls.filter(call=>call[0]==='popup').length,1);
 pending.resolve({user:state.guest});await first;
 state.popup=async()=>({user:state.guest});await state.client.signInGoogleGuest();
 assert.equal(state.calls.filter(call=>call[0]==='popup').length,2);
});

test('sign-out prevents a delayed token from restoring a server session',async t=>{
 const state=await fixture(t),pending=deferred(),tokenRequested=deferred();
 state.guest.getIdToken=()=>{tokenRequested.resolve();return pending.promise;};
 const attempt=state.client.signInGoogleGuest();
 const rejection=assert.rejects(attempt,/session ended/);
 await tokenRequested.promise;await state.client.signOutAccount();
 pending.resolve('late-id-token');await rejection;
 assert.equal(state.calls.filter(call=>call[1]==='/auth/session').length,0);
 assert.equal(state.auth.currentUser,null);
});

test('logout waits for an in-flight cookie write before clearing the server session',async t=>{
 const state=await fixture(t),pending=deferred(),sessionStarted=deferred();
 state.session=()=>{sessionStarted.resolve();return pending.promise;};
 const signIn=assert.rejects(state.client.signInGoogleGuest(),/session ended/);await sessionStarted.promise;
 const signOut=state.client.signOutAccount();
 assert.equal(state.calls.some(call=>call[1]==='/auth/logout'),false);
 pending.resolve({user:{uid:state.guest.uid,role:'guest'}});await Promise.all([signIn,signOut]);
 assert.equal(state.calls.at(-1)[1],'/auth/logout');
 assert.equal(state.auth.currentUser,null);
});

test('security headers allow the Google loader and exact Firebase iframe without opening arbitrary frames',async()=>{
 process.env.DATABASE_URL='';
 const {default:app}=await import('../server/app.js');
 const response=await request(app).get('/api/site');
 const csp=response.headers['content-security-policy'];
 assert.match(csp,/script-src[^;]*https:\/\/apis\.google\.com/);
 assert.match(csp,/frame-src[^;]*https:\/\/mithilaheritagepatna\.firebaseapp\.com/);
 assert.doesNotMatch(csp,/frame-src[^;]*(?:\shttps:;|\s\*;)/);
 assert.equal(response.headers['cross-origin-opener-policy'],'same-origin-allow-popups');
});
