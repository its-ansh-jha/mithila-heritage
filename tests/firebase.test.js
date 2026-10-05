import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPair,SignJWT} from 'jose';
import {verifyFirebaseToken,staffRole,firebaseProject} from '../server/firebase-auth.js';
const {publicKey,privateKey}=await generateKeyPair('RS256');
const now=Math.floor(Date.now()/1000);
async function token(overrides={}){return new SignJWT({sub:'verified-staff-uid',email:'owner@example.com',email_verified:true,auth_time:now-60,iat:now-30,exp:now+3600,aud:firebaseProject(),iss:'https://securetoken.google.com/'+firebaseProject(),...overrides}).setProtectedHeader({alg:'RS256',kid:'test-key'}).sign(privateKey);}
test('valid Firebase claims verify with the correct signing key',async()=>{const claims=await verifyFirebaseToken(await token(),publicKey);assert.equal(claims.sub,'verified-staff-uid');});
test('wrong project, issuer, expired and future-dated tokens are rejected',async()=>{for(const change of [{aud:'another-project'},{iss:'https://untrusted.example'},{exp:now-60},{iat:now+300},{auth_time:now+300},{sub:''},{iat:'invalid'}])await assert.rejects(()=>token(change).then(t=>verifyFirebaseToken(t,publicKey)),e=>e.status===401);});
test('forged tokens and missing claims are rejected',async()=>{const {privateKey:other}=await generateKeyPair('RS256');const t=await new SignJWT({sub:'owner',exp:now+60,iat:now}).setProtectedHeader({alg:'RS256',kid:'forged'}).sign(other);await assert.rejects(()=>verifyFirebaseToken(t,publicKey),e=>e.status===401);await assert.rejects(()=>verifyFirebaseToken('invalid',publicKey),e=>e.status===401);});
test('verified allowlisted email receives only its configured role',()=>{assert.equal(staffRole({sub:'a',email:'OWNER@example.com',email_verified:true},{OWNER_EMAILS:'owner@example.com'}),'owner');assert.equal(staffRole({sub:'a',email:'desk@example.com',email_verified:true},{STAFF_EMAILS:'desk@example.com'}),'staff');});
test('unverified email and arbitrary authenticated accounts cannot claim admin',()=>{assert.throws(()=>staffRole({sub:'a',email:'owner@example.com',email_verified:false},{OWNER_EMAILS:'owner@example.com'}),e=>e.status===403);assert.throws(()=>staffRole({sub:'a',email:'stranger@example.com',email_verified:true},{OWNER_EMAILS:'owner@example.com'}),e=>e.status===403);});
test('an explicitly pinned UID is authorized without trusting email claims',()=>{assert.equal(staffRole({sub:'known-owner',email_verified:false},{OWNER_UIDS:'known-owner'}),'owner');assert.throws(()=>staffRole({sub:'other',email_verified:true},{OWNER_UIDS:'known-owner'}),e=>e.status===403);});
