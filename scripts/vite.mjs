import {cp,copyFile,mkdir,chmod,readFile,writeFile,rm} from 'node:fs/promises';
import {watch} from 'node:fs';
import {spawn,spawnSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
const source=process.cwd();const args=process.argv.slice(2);let cwd=source;
if(process.platform==='android'){
 cwd=path.join(tmpdir(),'mithila-heritage-runtime');await mkdir(cwd,{recursive:true});
 const fingerprint=createHash('sha256').update(await readFile('package-lock.json')).digest('hex');
 let previous='';try{previous=await readFile(path.join(cwd,'.dependencies'),'utf8');}catch{}
 if(previous!==fingerprint){console.log('Preparing Android-compatible build tools…');const copy=spawnSync('cp',['-Ru','node_modules/.',path.join(cwd,'node_modules')],{stdio:'inherit'});if(copy.status!==0)throw new Error('Could not prepare Android build dependencies.');await writeFile(path.join(cwd,'.dependencies'),fingerprint);}
 for(const folder of ['frontend','shared'])await cp(folder,path.join(cwd,folder),{recursive:true});
 for(const file of ['package.json','vite.config.js'])await copyFile(file,path.join(cwd,file));
 process.env.ESBUILD_BINARY_PATH=path.join(cwd,'node_modules/@esbuild/android-arm64/bin/esbuild');await chmod(process.env.ESBUILD_BINARY_PATH,0o700);
}
const child=spawn(process.execPath,[path.join(cwd,'node_modules/vite/bin/vite.js'),...args],{cwd,stdio:'inherit',env:process.env});
const watchers=[];
if(cwd!==source&&!args.includes('build'))for(const folder of ['frontend','shared']){let timer;watchers.push(watch(path.join(source,folder),{recursive:true},()=>{clearTimeout(timer);timer=setTimeout(()=>cp(path.join(source,folder),path.join(cwd,folder),{recursive:true}).catch(console.error),300);}));}
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{for(const w of watchers)w.close();child.kill(signal);});
child.on('exit',async code=>{for(const w of watchers)w.close();if(code===0&&args.includes('build')&&cwd!==source){await rm(path.join(source,'dist'),{recursive:true,force:true});await cp(path.join(cwd,'dist'),path.join(source,'dist'),{recursive:true});}process.exit(code||0);});
