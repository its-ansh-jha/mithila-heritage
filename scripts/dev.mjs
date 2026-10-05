import {spawn} from 'node:child_process';
const children=[spawn(process.execPath,['--watch','server/index.js'],{stdio:'inherit'}),spawn(process.execPath,['scripts/vite.mjs','--host','0.0.0.0'],{stdio:'inherit'})];
let stopping=false;function stop(){if(stopping)return;stopping=true;for(const child of children)child.kill('SIGTERM');}
process.on('SIGINT',stop);process.on('SIGTERM',stop);for(const child of children)child.on('exit',code=>{if(!stopping){process.exitCode=code||0;stop();}});
