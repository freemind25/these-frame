#!/usr/bin/env bash
# ─── prepare-tauri-resources.sh ─────────────────────────────────────────
# Builds the Next.js standalone output and bundles everything that the
# Tauri embedded server needs into src-tauri/resources/.
#
# Usage:  bash scripts/prepare-tauri-resources.sh [NODE_VERSION]
#   NODE_VERSION defaults to 20.18.1
#
# Run on the CI machine (Windows / macOS / Linux).
# ─────────────────────────────────────────────────────────────────────────
set -euo pipefail

NODE_VER="${1:-20.18.1}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
TAURI_RES="$ROOT_DIR/src-tauri/resources"

# ── Clean previous resources ─────────────────────────────────────────────
echo "=> Cleaning previous resources…"
rm -rf "$TAURI_RES/app" "$TAURI_RES/node"
mkdir -p "$TAURI_RES/app" "$TAURI_RES/node"

# ── Build Next.js standalone ────────────────────────────────────────────
echo "=> Building Next.js (standalone)…"
cd "$ROOT_DIR"
VERCEL= npx next build 2>&1

# ── Copy standalone output ──────────────────────────────────────────────
echo "=> Copying standalone output to resources/app/…"
STANDALONE="$ROOT_DIR/.next/standalone"
if [ ! -d "$STANDALONE" ]; then
  echo "ERROR: .next/standalone not found. Did next build with output:'standalone' succeed?" >&2
  exit 1
fi

# Copy everything from standalone into resources/app (preserving structure)
cp -r "$STANDALONE/." "$TAURI_RES/app/"

# Copy static assets (standalone doesn't include these)
cp -r "$ROOT_DIR/.next/static" "$TAURI_RES/app/.next/static"

# Copy the embedded start script (sets PORT=3100)
cp "$ROOT_DIR/scripts/embed-start.js" "$TAURI_RES/app/start.js"

# ── Download Node.js binary ─────────────────────────────────────────────
echo "=> Downloading Node.js v$NODE_VER…"
OS=$(uname -s)
ARCH=$(uname -m)

if [ "$OS" = "Darwin" ]; then
  if [ "$ARCH" = "arm64" ]; then
    NODE_PLAT="darwin-arm64"
  else
    NODE_PLAT="darwin-x64"
  fi
  NODE_EXT="tar.gz"
  NODE_BIN="bin/node"
else
  NODE_PLAT="win-x64"
  NODE_EXT="zip"
  NODE_BIN="node.exe"
fi

NODE_URL="https://nodejs.org/dist/v${NODE_VER}/node-v${NODE_VER}-${NODE_PLAT}.${NODE_EXT}"
NODE_ARCHIVE="/tmp/node-${NODE_VER}.${NODE_EXT}"

echo "   Downloading from $NODE_URL"
curl -sL "$NODE_URL" -o "$NODE_ARCHIVE"

echo "   Extracting Node.js binary…"
if [ "$NODE_EXT" = "zip" ]; then
  # Windows: extract only node.exe
  unzip -jo "$NODE_ARCHIVE" "node-v${NODE_VER}-win-x64/node.exe" -d "$TAURI_RES/node/" 2>/dev/null
else
  # macOS/Linux: extract tarball and copy node binary
  TMPDIR=$(mktemp -d)
  tar -xzf "$NODE_ARCHIVE" -C "$TMPDIR"
  NODE_DIR=$(find "$TMPDIR" -maxdepth 1 -type d -name 'node-v*' | head -1)
  cp "$NODE_DIR/$NODE_BIN" "$TAURI_RES/node/"
  rm -rf "$TMPDIR"
fi

rm -f "$NODE_ARCHIVE"

# ── Copy public assets ───────────────────────────────────────────────────
if [ -d "$ROOT_DIR/public" ]; then
  echo "=> Copying public/ assets…"
  cp -r "$ROOT_DIR/public" "$TAURI_RES/app/public"
fi

# ── Summary ──────────────────────────────────────────────────────────────
echo ""
echo "=== Resources ready ==="
echo "  app/start.js     $(ls -la "$TAURI_RES/app/start.js" 2>/dev/null | awk '{print $5}') bytes"
echo "  app/server.js    $(ls -la "$TAURI_RES/app/server.js" 2>/dev/null | awk '{print $5}') bytes"
echo "  node/$(basename "$NODE_BIN")   $(ls -la "$TAURI_RES/node/$(basename "$NODE_BIN")" 2>/dev/null | awk '{print $5}') bytes"
echo "  Total resources: $(du -sh "$TAURI_RES" | cut -f1)"
echo "======================"
