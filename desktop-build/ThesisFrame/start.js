const path = require('path');
const fs = require('fs');

const appDir = __dirname;
process.chdir(appDir);

const dbDir = path.join(appDir, 'db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const logPath = path.join(appDir, 'server.log');
const logStream = fs.createWriteStream(logPath, { flags: 'w' });
const origConsole = { ...console };

function log(msg) {
  const line = '[' + new Date().toISOString() + '] ' + msg + '\n';
  logStream.write(line);
  origConsole.log(msg);
}
function logErr(msg) {
  const line = '[' + new Date().toISOString() + '] ERROR: ' + msg + '\n';
  logStream.write(line);
  origConsole.error(msg);
}

log('ThesisFrame v0.2.0 starting...');
log('Node.js ' + process.version + ' on ' + process.platform + ' ' + process.arch);
log('Dir: ' + appDir);
log('PORT=' + (process.env.PORT || '3100'));

const checks = [
  ['node/node.exe', path.join(appDir, 'node', 'node.exe')],
  ['.next/BUILD_ID', path.join(appDir, '.next', 'BUILD_ID')],
  ['.next/server', path.join(appDir, '.next', 'server')],
  ['.next/static', path.join(appDir, '.next', 'static')],
  ['prisma engine', path.join(appDir, 'node_modules', '.prisma', 'client', 'query_engine-windows.dll.node')],
];

let allOk = true;
for (const [name, p] of checks) {
  if (fs.existsSync(p)) log('OK: ' + name);
  else { logErr('MISSING: ' + name); allOk = false; }
}
if (!allOk) { logErr('Critical files missing.'); process.exit(1); }

console.log = function(...args) { log(args.join(' ')); };
console.error = function(...args) { logErr(args.join(' ')); };
console.warn = function(...args) { log(args.join(' ')); };

async function initDb() {
  try {
    log('Initializing database...');
    const { PrismaClient } = require(path.join(appDir, 'node_modules', '.prisma', 'client'));
    const db = new PrismaClient({ log: ['error'] });
    
    const tables = [
      'CREATE TABLE IF NOT EXISTS User (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
      'CREATE TABLE IF NOT EXISTS Post (id TEXT PRIMARY KEY, title TEXT NOT NULL, content TEXT, published INTEGER NOT NULL DEFAULT 0, authorId TEXT NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
      'CREATE TABLE IF NOT EXISTS MendeleyConfig (id TEXT PRIMARY KEY, clientId TEXT, clientSecret TEXT, accessToken TEXT, refreshToken TEXT, tokenExpiresAt DATETIME, connected INTEGER NOT NULL DEFAULT 0, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
      'CREATE TABLE IF NOT EXISTS Reference (id TEXT PRIMARY KEY, type TEXT NOT NULL DEFAULT \'article\', citationKey TEXT, title TEXT NOT NULL, authors TEXT NOT NULL, year TEXT, journal TEXT, volume TEXT, number TEXT, pages TEXT, doi TEXT, abstract TEXT, tags TEXT, notes TEXT, source TEXT NOT NULL DEFAULT \'manual\', mendeleyId TEXT UNIQUE, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
      'CREATE TABLE IF NOT EXISTS Thesis (id TEXT PRIMARY KEY, title TEXT NOT NULL DEFAULT \'Ma these de doctorat\', subtitle TEXT, author TEXT NOT NULL DEFAULT \'Doctorant\', field TEXT NOT NULL DEFAULT \'\', university TEXT NOT NULL DEFAULT \'\', status TEXT NOT NULL DEFAULT \'draft\', createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
      'CREATE TABLE IF NOT EXISTS Chapter (id TEXT PRIMARY KEY, thesisId TEXT NOT NULL REFERENCES Thesis(id) ON DELETE CASCADE, "order" INTEGER NOT NULL, number TEXT NOT NULL, title TEXT NOT NULL, content TEXT NOT NULL DEFAULT \'\', wordCount INTEGER NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT \'draft\', directorFeedback TEXT, directorFeedbackAt DATETIME, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT Chapter_thesisId_order_key UNIQUE(thesisId, "order"))',
      'CREATE TABLE IF NOT EXISTS CloudDriveConnection (id TEXT PRIMARY KEY, provider TEXT NOT NULL DEFAULT \'google_drive\', connected INTEGER NOT NULL DEFAULT 0, email TEXT, displayName TEXT, accessToken TEXT, refreshToken TEXT, tokenExpiresAt DATETIME, lastSyncAt DATETIME, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)',
    ];
    
    for (const sql of tables) {
      await db.$executeRawUnsafe(sql);
    }
    log('Database tables ready.');
    await db.$disconnect();
  } catch (err) {
    logErr('Database init error: ' + err.message);
  }
}

async function main() {
  await initDb();
  
  log('Loading Next.js...');
  require('next');
  log('Next.js loaded.');
  
  const { startServer } = require('next/dist/server/lib/start-server');
  log('Starting server...');
  
  startServer({
    dir: appDir,
    isDev: false,
    hostname: process.env.HOSTNAME || '127.0.0.1',
    port: parseInt(process.env.PORT, 10) || 3100,
    allowRetry: false,
  }).catch((err) => {
    logErr('Server failed: ' + err.message);
    logErr(err.stack);
    process.exit(1);
  });
}

main().catch(err => {
  logErr('Fatal: ' + err.message);
  logErr(err.stack);
  process.exit(1);
});
