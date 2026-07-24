// ─── ThesisFrame Tauri Server Wrapper ──────────────────────
// Starts the Next.js standalone server for the Tauri desktop app.
// Waits for the server to be ready before signaling.

const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.0.0.1';

function checkServer(url, timeout = 2000) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(true);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.setTimeout(timeout, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function main() {
  // Determine server path
  const standaloneServer = path.join(__dirname, '..', '.next', 'standalone', 'server.js');
  const devServer = path.join(__dirname, '..');

  let serverPath;
  let serverArgs = [];

  if (fs.existsSync(standaloneServer)) {
    // Production: use standalone server
    serverPath = process.execPath;
    serverArgs = [standaloneServer];
    console.log(`[ThesisFrame] Starting standalone server on ${HOST}:${PORT}...`);
  } else {
    // Development fallback
    console.log(`[ThesisFrame] Standalone build not found, starting dev server...`);
    serverPath = 'npx';
    serverArgs = ['next', 'dev', '-p', String(PORT)];
  }

  const child = spawn(serverPath, serverArgs, {
    cwd: path.join(__dirname, '..'),
    env: {
      ...process.env,
      PORT: String(PORT),
      HOST,
      NODE_ENV: fs.existsSync(standaloneServer) ? 'production' : 'development',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
    windowsHide: true,
  });

  child.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.log(msg);
  });
  child.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.error(msg);
  });

  child.on('exit', (code) => {
    console.error(`[ThesisFrame] Server exited with code ${code}`);
    process.exit(code || 1);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('[ThesisFrame] Received SIGTERM, shutting down...');
    child.kill('SIGTERM');
    setTimeout(() => child.kill('SIGKILL'), 5000);
  });

  process.on('SIGINT', () => {
    console.log('[ThesisFrame] Received SIGINT, shutting down...');
    child.kill('SIGINT');
    setTimeout(() => child.kill('SIGKILL'), 5000);
  });

  // Wait for server to be ready (max 60s)
  console.log(`[ThesisFrame] Waiting for server at http://${HOST}:${PORT}...`);
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 1000));
    const ready = await checkServer(`http://${HOST}:${PORT}/`);
    if (ready) {
      console.log(`[ThesisFrame] Server ready at http://${HOST}:${PORT}`);
      return;
    }
  }

  console.error('[ThesisFrame] Server failed to start within 60 seconds');
  child.kill();
  process.exit(1);
}

main();
