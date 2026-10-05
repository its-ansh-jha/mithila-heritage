import {readFile,readdir} from 'node:fs/promises';
import {pool} from '../server/db.js';
import {initialSite} from '../shared/catalog.js';
if(!pool){console.error('Set DATABASE_URL in .env before running migrations.');process.exit(1);}
const db=await pool.connect();
try{await db.query('BEGIN');for(const file of (await readdir(new URL('../migrations/',import.meta.url))).filter(n=>n.endsWith('.sql')).sort())await db.query(await readFile(new URL('../migrations/'+file,import.meta.url),'utf8'));await db.query('INSERT INTO site_settings(id,data) VALUES(1,$1) ON CONFLICT(id) DO NOTHING',[JSON.stringify(initialSite)]);await db.query('COMMIT');console.log('Database ready. No fictional inventory was added. Configure actual rooms and tables in /admin.');}catch(e){await db.query('ROLLBACK');console.error(e.message);process.exitCode=1;}finally{db.release();await pool.end();}
