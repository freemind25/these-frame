// ─── ThesisFrame Tauri Server Wrapper ──────────────────────
// Starts the Next.js standalone server for the Tauri desktop app.
// Waits for the server to be ready before signaling.

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '127.0.0.1';

function checkServer() {
  return new Promise((resolve) => {
    const req = http.get(`http://${HOST}:${PORT}/api/ai-status`, (res) => {
      resolve(true);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

async function main() {
  console.log(`[ThesisFrame] Starting Next.js server on ${HOST}:${PORT}...`);

  const serverPath = path.join(__dirname, '..', '.next', 'standalone', 'server.js');

  const child = spawn(process.execPath, [serverPath], {
    env: { ...process.env, PORT, HOST },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  child.stdout.on('data', (data) => process.stdout.write(data));
  child.stderr.on('data', (data) => process.stderr.write(data));

  // Wait for server to be ready (max 30s)
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const ready = await checkServer();
    if (ready) {
      console.log(`[ThesisFrame] Server ready at http://${HOST}:${PORT}`);
      return;
    }
  }

  console.error('[ThesisFrame] Server failed to start within 30 seconds');
  process.exit(1);
}

main();
