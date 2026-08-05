// Embedded server entry point for Tauri desktop app.
// Sets PORT=3100 (matching the loading page poll) then boots the
// Next.js standalone server that lives next to this file.

process.env.PORT = '3100';
process.env.HOSTNAME = '127.0.0.1';

// The standalone server.js is copied next to this file during the
// Tauri resource preparation step (see scripts/prepare-tauri-resources.sh).
require('./server.js');
