import {importX509,jwtVerify} from 'jose';
import {firebaseConfig} from '../shared/firebase-config.js';
const error=(message,status)=>Object.assign(new Error(message),{status});
const certUrl='https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
let certificates={};let expires=0;let pending;
async function signingKey(header){
 if(header.alg!=='RS256'||!header.kid)throw error('Invalid Firebase token.',401);
 if(Date.now()>expires){
  if(!pending)pending=fetch(certUrl,{signal:AbortSignal.timeout(10000)}).then(async r=>{
   if(!r.ok)throw error('The sign-in service is temporarily unavailable.',503);
   certificates=await r.json();const seconds=Number(r.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1]||300);expires=Date.now()+Math.min(seconds,21600)*1000;
  }).finally(()=>{pending=null;});
  await pending;
 }
 const certificate=certificates[header.kid];if(!certificate)throw error('Unknown Firebase signing key. Please sign in again.',401);
 return importX509(certificate,'RS256');
}
export function firebaseProject(){return process.env.FIREBASE_PROJECT_ID||firebaseConfig.projectId;}
export function configuredStaff(){return !!(process.env.OWNER_EMAILS?.trim()||process.env.OWNER_UIDS?.trim());}
export function staffRole(claims,env=process.env){
 const list=key=>(env[key]||'').split(',').map(v=>v.trim()).filter(Boolean);
 const email=claims.email?.toLowerCase();
 const matches=role=>list(role+'_UIDS').includes(claims.sub)||(claims.email_verified===true&&email&&list(role+'_EMAILS').map(e=>e.toLowerCase()).includes(email));
 if(matches('OWNER'))return 'owner';if(matches('STAFF'))return 'staff';
 if(claims.email_verified!==true&&email&&[...list('OWNER_EMAILS'),...list('STAFF_EMAILS')].some(e=>e.toLowerCase()===email))throw error('Verify this email in Firebase before signing in, or ask the owner to authorize your Firebase UID.',403);
 throw error('This account does not have hotel dashboard access.',403);
}
export async function verifyFirebaseToken(token,keyResolver=signingKey){
 if(typeof token!=='string'||token.length>10000)throw error('Please sign in.',401);
 try{
  const project=firebaseProject();const {payload,protectedHeader}=await jwtVerify(token,keyResolver,{algorithms:['RS256'],issuer:'https://securetoken.google.com/'+project,audience:project,requiredClaims:['exp','iat','auth_time','sub']});
  const now=Math.floor(Date.now()/1000);
  if(!protectedHeader.kid||!payload.sub||payload.sub.length>128||typeof payload.iat!=='number'||payload.iat>now||typeof payload.auth_time!=='number'||payload.auth_time>now)throw new Error('Invalid Firebase claims');
  return payload;
 }catch(e){if(e.status===503)throw e;throw error('Your sign-in token is invalid or expired. Please sign in again.',401);}
}
export async function firebaseUser(token){
 const claims=await verifyFirebaseToken(token);
 if(!configuredStaff())throw error('Owner access has not been assigned yet. Set the owner Firebase email or UID on the server.',503);
 return {uid:claims.sub,email:claims.email||claims.sub,role:staffRole(claims),expiresAt:claims.exp};
}

export async function firebaseIdentity(token){
 const claims=await verifyFirebaseToken(token);
 if(typeof claims.email!=='string'||!claims.email)throw error('Use an email-based Firebase account to make a reservation.',403);
 let role='guest';try{role=staffRole(claims);}catch(e){if(e.status!==403)throw e;}
 return {uid:claims.sub,email:claims.email.toLowerCase(),name:typeof claims.name==='string'?claims.name:'',emailVerified:claims.email_verified===true,role,expiresAt:claims.exp};
}
