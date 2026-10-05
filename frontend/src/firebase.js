import {initializeApp,getApps} from 'firebase/app';
import {initializeAuth,browserSessionPersistence,browserPopupRedirectResolver,GoogleAuthProvider,signInWithPopup,signInWithEmailAndPassword,createUserWithEmailAndPassword,updateProfile,sendEmailVerification,reload,signOut,onIdTokenChanged,sendPasswordResetEmail} from 'firebase/auth';
import {firebaseConfig} from '../../shared/firebase-config';
import {api} from './api';
const firebaseApp=getApps()[0]||initializeApp(firebaseConfig);
// Load the popup resolver only when Google sign-in is requested, avoiding a background iframe on page load.
export const auth=initializeAuth(firebaseApp,{persistence:browserSessionPersistence});
const persistence=auth.authStateReady();
export function authMessage(e,provider='email'){
 const errors={
  'auth/invalid-credential':'The email or password is incorrect.',
  'auth/email-already-in-use':'This email already has an account. Sign in or reset your password.',
  'auth/invalid-email':'Enter a valid email address.',
  'auth/weak-password':'Choose a stronger password with at least 8 characters.',
  'auth/password-does-not-meet-requirements':'This password does not meet the account security requirements. Use a mix of uppercase, lowercase, numbers, and symbols.',
  'auth/user-disabled':'This account has been disabled.',
  'auth/too-many-requests':'Too many attempts. Please wait before trying again.',
  'auth/network-request-failed':'Could not reach the sign-in service. Check your connection.',
  'auth/operation-not-allowed':provider==='google'?'Google sign-in is not enabled yet. Use email sign-in or contact the hotel.':'Email and password sign-in is not enabled yet. Please contact the hotel.',
  'auth/configuration-not-found':'The sign-in service is not ready yet. Please contact the hotel.',
  'auth/unauthorized-domain':'Sign-in is not enabled for this website address. Please contact the hotel.',
  'auth/invalid-api-key':'The sign-in service configuration could not be verified.',
  'auth/popup-closed-by-user':'The Google sign-in window was closed. You can try again when ready.',
  'auth/cancelled-popup-request':'Another Google sign-in window is already open. Please complete that window.',
  'auth/popup-blocked':'Your browser blocked the Google sign-in window. Allow pop-ups for this website and try again, or use email sign-in.',
  'auth/account-exists-with-different-credential':'This email uses another sign-in method. Sign in with your existing method to access your account.',
  'auth/web-storage-unsupported':'Your browser is blocking the storage needed to sign in. Allow site storage or use another browser.',
  'auth/operation-not-supported-in-this-environment':'Open this website in your browser to continue with Google.',
  'auth/invalid-oauth-client-id':'Google sign-in is not configured correctly. Use email sign-in or contact the hotel.'
 };
 return errors[e?.code]||e?.message||'Sign-in could not be completed.';
}
let sessionQueue=Promise.resolve(),synchronized=null,sessionEpoch=0;
async function syncSession(user,scope='guest',force=false){
 const epoch=sessionEpoch,idToken=await user.getIdToken(force),key=scope+':'+idToken;
 if(epoch!==sessionEpoch)throw new Error('Your session ended. Sign in again to continue.');
 if(synchronized?.key===key)return synchronized.promise;
 const promise=sessionQueue.catch(()=>{}).then(async()=>{if(epoch!==sessionEpoch)throw new Error('Your session ended. Sign in again to continue.');const result=await api('/auth/session',{method:'POST',body:{idToken,scope}});if(epoch!==sessionEpoch)throw new Error('Your session ended. Sign in again to continue.');return result;});
 sessionQueue=promise;synchronized={key,promise};
 promise.catch(()=>{if(synchronized?.promise===promise)synchronized=null;});return promise;
}
export async function signInStaff(email,password){await persistence;let authenticated=false;try{const {user}=await signInWithEmailAndPassword(auth,email,password);authenticated=true;return await syncSession(user,'staff');}catch(e){if(authenticated)await signOutAccount().catch(()=>{});throw new Error(authMessage(e));}}
export async function signInGuest(email,password){await persistence;try{const {user}=await signInWithEmailAndPassword(auth,email,password);return await syncSession(user);}catch(e){throw new Error(authMessage(e));}}
let googleAttempt=null;
function signInGoogle(scope){
 if(googleAttempt)return Promise.reject(new Error('Google sign-in is already in progress. Please complete the open window.'));
 const provider=new GoogleAuthProvider();
 provider.setCustomParameters({prompt:'select_account'});
 // Start within the click handler; Firebase waits for initialization internally.
 const attempt=(async()=>{
  let authenticated=false;
  try{const {user}=await signInWithPopup(auth,provider,browserPopupRedirectResolver);authenticated=true;return await syncSession(user,scope);}
  catch(e){if(authenticated)await signOutAccount().catch(()=>{});throw new Error(authMessage(e,'google'));}
 })();
 googleAttempt=attempt;
 return attempt.finally(()=>{if(googleAttempt===attempt)googleAttempt=null;});
}
export const signInGoogleGuest=()=>signInGoogle('guest');
export const signInGoogleStaff=()=>signInGoogle('staff');
export async function createGuestAccount(name,email,password){
 await persistence;let created=false;
 try{const {user}=await createUserWithEmailAndPassword(auth,email,password);created=true;await updateProfile(user,{displayName:name.trim()});const result=await syncSession(user,'guest',true);let verificationSent=false;let warning='';try{await sendEmailVerification(user);verificationSent=true;}catch(e){warning='Your account was created, but the verification email could not be sent. Use Resend verification below.';}return {...result,verificationSent,warning};}
 catch(e){throw new Error((created?'Your account was created. Sign in to continue if needed. ':'')+authMessage(e));}
}
export async function signOutAccount(){sessionEpoch++;synchronized=null;try{await signOut(auth);}finally{await sessionQueue.catch(()=>{});await api('/auth/logout',{method:'POST'});}}
export const signOutStaff=signOutAccount;
function watchSession(scope,onReady,onError){let active=true,version=0;const unsubscribe=onIdTokenChanged(auth,async user=>{const current=++version;try{const result=user?await syncSession(user,scope):{user:null};if(active&&version===current)onReady(result.user);}catch(e){if(active&&version===current)onError(new Error(authMessage(e)));}});return()=>{active=false;unsubscribe();};}
export const watchStaffSession=(onReady,onError)=>watchSession('staff',onReady,onError);
export const watchGuestSession=(onReady,onError)=>watchSession('guest',onReady,onError);
export async function refreshGuestSession(){if(!auth.currentUser)return {user:null};try{await reload(auth.currentUser);return await syncSession(auth.currentUser,'guest',true);}catch(e){throw new Error(authMessage(e));}}
export async function resendVerification(){if(!auth.currentUser)throw new Error('Sign in to request a verification email.');try{await sendEmailVerification(auth.currentUser);}catch(e){throw new Error(authMessage(e));}}
export async function resetStaffPassword(email){try{await sendPasswordResetEmail(auth,email);}catch(e){if(e.code!=='auth/user-not-found')throw new Error(authMessage(e));}}
// Analytics is intentionally not initialized as part of authentication.
