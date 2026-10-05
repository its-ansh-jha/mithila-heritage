export async function api(path,options={}){
 const response=await fetch('/api'+path,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json',...options.headers},body:options.body===undefined?undefined:JSON.stringify(options.body)});
 const data=await response.json().catch(()=>({error:'The hotel service is temporarily unavailable.'}));if(!response.ok)throw new Error(data.error||'This request could not be completed.');return data;
}
export const prettyDate=value=>new Intl.DateTimeFormat('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'}).format(new Date(value));
export const localDay=(offset=0)=>new Date(Date.now()+19800000+offset*86400000).toISOString().slice(0,10);
