import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {validate} from './model.mjs';
const production=process.env.NODE_ENV==='production';
if(production&&!process.env.DATABASE_URL)throw Error('Configure DATABASE_URL com a conexão Neon');
let store;
if(process.env.DATABASE_URL){
 const {default:pg}=await import('pg');const pool=new pg.Pool({connectionString:process.env.DATABASE_URL,max:5,connectionTimeoutMillis:15000});
 pool.on('error',()=>console.error('Conexão com o banco interrompida'));
 await pool.query("CREATE TABLE IF NOT EXISTS deposits(player TEXT NOT NULL CHECK(player IN ('Gui','Helen')),value INTEGER NOT NULL CHECK(value BETWEEN 1 AND 200),created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),PRIMARY KEY(player,value))");
 store={list:async()=>(await pool.query('SELECT * FROM deposits ORDER BY created_at DESC,value DESC')).rows,health:()=>pool.query('SELECT 1'),change:(method,player,values)=>method==='POST'?pool.query('INSERT INTO deposits(player,value) SELECT $1,unnest($2::integer[]) ON CONFLICT(player,value) DO NOTHING',[player,values]):pool.query('DELETE FROM deposits WHERE player=$1 AND value=ANY($2::integer[])',[player,values])};
}else{
 const{DatabaseSync}=await import('node:sqlite');const{mkdirSync}=await import('node:fs');mkdirSync('data',{recursive:true});const db=new DatabaseSync('data/challenge.sqlite');db.exec('CREATE TABLE IF NOT EXISTS deposits(player TEXT NOT NULL,value INTEGER NOT NULL,created_at TEXT NOT NULL,PRIMARY KEY(player,value))');
 store={list:async()=>db.prepare('SELECT * FROM deposits ORDER BY created_at DESC,value DESC').all(),health:async()=>db.prepare('SELECT 1').get(),async change(method,player,values){db.exec('BEGIN');try{const now=new Date().toISOString();for(const value of values){if(method==='POST')db.prepare('INSERT OR IGNORE INTO deposits VALUES(?,?,?)').run(player,value,now);else db.prepare('DELETE FROM deposits WHERE player=? AND value=?').run(player,value)}db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}}};
}
const root=path.resolve('dist/client');
createServer(async(req,res)=>{
 const json=(status,body)=>{res.writeHead(status,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(body))};
 try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/healthz'){await store.health();return json(200,{ok:true})}
 if(url.pathname.startsWith('/api/')){
 if(url.pathname!=='/api/deposits')return json(404,{error:'Não encontrado'});
 if(req.method==='GET')return json(200,await store.list());
 if(!['POST','DELETE'].includes(req.method))return json(405,{error:'Método inválido'});
 if(req.headers['sec-fetch-site']==='cross-site')return json(403,{error:'Origem inválida'});
 if(!req.headers['content-type']?.startsWith('application/json'))return json(415,{error:'Envie JSON'});
 let body='';for await(const c of req){body+=c;if(Buffer.byteLength(body)>10000)return json(413,{error:'Limite excedido'})}
 let payload;try{payload=JSON.parse(body)}catch{return json(400,{error:'JSON inválido'})}
 if(!payload||!validate(payload.player,payload.values))return json(400,{error:'Depósito inválido'});
 await store.change(req.method,payload.player,payload.values);return json(200,{ok:true});
 }
 if(!['GET','HEAD'].includes(req.method))return json(405,{error:'Método inválido'});
 let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
 if(file!==root&&!file.startsWith(root+path.sep))return json(403,{error:'Acesso negado'});
 let bytes;try{bytes=await readFile(file)}catch{if(path.extname(url.pathname))return json(404,{error:'Não encontrado'});file=path.join(root,'index.html');bytes=await readFile(file)}
 const type={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'}[path.extname(file)]||'application/octet-stream';
 res.writeHead(200,{'Content-Type':type,'X-Content-Type-Options':'nosniff','Cache-Control':file.endsWith('index.html')?'no-cache':'public,max-age=31536000,immutable'});res.end(req.method==='HEAD'?undefined:bytes);
 }catch{console.error('Falha ao processar requisição');if(!res.headersSent)json(503,{error:'Não foi possível acessar os dados. Tente novamente.'});else res.end()}
}).listen(Number(process.env.PORT)||3001,production?'0.0.0.0':'127.0.0.1',()=>console.log('API pronta'));
if(!production){const{createServer}=await import('vite');const vite=await createServer({server:{host:'127.0.0.1'}});await vite.listen();vite.printUrls()}
