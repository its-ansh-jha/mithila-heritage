import {serviceStatus} from '../server/services.js';
import {pool} from '../server/db.js';
for(const [key,value] of Object.entries(serviceStatus()))console.log(`${key}: ${typeof value==='boolean'?(value?'configured':'not configured'):value}`);
if(pool){try{await pool.query('SELECT 1 FROM site_settings');console.log('Database connection and migration: OK');}catch(e){console.log('Database check failed:',e.message);process.exitCode=1;}await pool.end();}
