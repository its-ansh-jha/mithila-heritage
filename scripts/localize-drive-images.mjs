import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';

const ids=["1xoLsPM7eR5_OyLD0EtA5zL9O014LRNQK","1KJ1VjZUiBaTfIYDe8YaZwEOLDIRG2ZJ0","1LhOpLdOeCH9t9eoovOL4hnhXi3YdE5UZ","1cQlo4g3tnMrQKZ944m7wby89eEcPlTOk","1Mmivj5Qxbyk0B-Rak5Scny0GQ0ezCnJr","13jwNV9IaSo81bv4AhGX3XTFt7KLU6z8K","14jgddXGJhyRkikf5nPynQZfrlBOfkPyV","1lh44DuI2N20xfQIMjb5VB73vGHXJxoZj","1qbmmtH6tiEZdW-G9OSSFPaSEssrAz-bG","1NxkC12TKgITSwsFe_kURmY4jgs5Mmy0Q","1w5Cy8K3pZb-uBAdp8-VxzLrB2ROcMWHX","18o1XRzNKqrzoyxeB-DglBNhEdxXlTuw5","19h2LEVn8T3F5dj4mm489ViAxnQYHsXuI","1us4Ua3vYQrbnjIeWmy5pTkVQIo5sjG5i","1C4l63t2LRKon-PAWht39zn1T40bnyzg2","1P980-3gMgHpV2bgyORKuydDroDHtQbQ3","1VuLwXjiOUGHhs4qQo789R-IPn81zG_Vm","1PpCCfj8PovyTFlm-mafyVqb82I9Usz9R","1WwNK4ltCCdQpRiDshiAxIELD0rg_DNYh","18GYav3TOzxxGiaR7LHe6lQvm5ZaXnBTc","1GOg1FyejlVFF53v8QlVWAFAcxM2xgcHf","1J4ilN5gOzhXKWSRAe6_6Egk8tdsjHiSE","1kggUPkYENFuenavQRbEyKk8IKh_NnNEc","1hDysgMUINL4sBMD3gq9FwAduh2YYP0kG","1RDIIFipO-vmny2APqBz0xh6Jz0TMTUia","11uxBMVuDACkMqHuXCLBDTxZa3mlBb-f8","1zseqO9OqGTsfqvNL_LCq2dVPtUWZ-fY4","14d39jfh9wGPDbkQpvh8lRWwpV7W6Sn5R","1t_plL_fDiqxkR0Hdi2dHVzDxGMa1zIb_","1Pncnmy-vBCML7VAsM1d2vBe3JoGVCA_o","1QQJdkej1ycH6rabkfn5CS9QU5ZUF2Ha-","19AODof0gZYF5YGv1HaWB0UJRg_TYsB5q","1AY-GmIP1CYQ9VCzQCyB_wF6jMQedRDMy","1DLUFbTnN1ivDDks5ySmcYIjwp82q2m72","1s5s_uUkBnFzBnFXerqaqwK2oqZhJ46-1","115Rwe7ugvMllaWdePv1zvFxPP0wRpDH1","1v5ACQ9hPxLcNl98R_AObantQxApoYevp","1DURqhlqPt-VmMseSlOJfuu7p8ToLClSc","1ndPJNwhl3BVLIBOLjwYs_Kc7Xistlnu2","1eGMyjd-9m7SGEAxMqE9jNFyVbb6m0nb4","1iyXhYCRnW-NXp41IVKJvHcsbAg6ZnJcA"];

const outDir=path.join(process.cwd(),'frontend','public','images','drive');
await mkdir(outDir,{recursive:true});

async function download(id){
 const url='https://drive.google.com/thumbnail?id='+encodeURIComponent(id)+'&sz=w1600';
 let lastError;
 for(let attempt=1;attempt<=3;attempt++){
  try{
   const res=await fetch(url,{
    redirect:'follow',
    headers:{
     'user-agent':'Mozilla/5.0 (compatible; MithilaHeritageBuild/1.0)',
     'accept':'image/avif,image/webp,image/apng,image/jpeg,image/*,*/*;q=0.8'
    }
   });
   if(!res.ok)throw new Error('HTTP '+res.status);
   const type=(res.headers.get('content-type')||'').toLowerCase();
   if(!type.startsWith('image/'))throw new Error('Expected image, received '+(type||'unknown content type'));
   const bytes=Buffer.from(await res.arrayBuffer());
   if(bytes.length<1000)throw new Error('Downloaded image is unexpectedly small');
   await writeFile(path.join(outDir,id+'.jpg'),bytes);
   return;
  }catch(error){
   lastError=error;
   if(attempt<3)await new Promise(r=>setTimeout(r,attempt*700));
  }
 }
 throw new Error('Failed to localize Drive image '+id+': '+lastError?.message);
}

const concurrency=6;
for(let i=0;i<ids.length;i+=concurrency){
 await Promise.all(ids.slice(i,i+concurrency).map(download));
}
console.log('Localized '+ids.length+' Drive images into frontend/public/images/drive.');
