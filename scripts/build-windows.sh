#!/usr/bin/env bash
# ─── ThesisFrame Windows Cross-Compile (from Linux) ──────────
# Requires: rustup target add x86_64-pc-windows-msvc
# This is complex — recommend building natively on Windows instead.

set -e

echo "⚠  Cross-compiling Tauri for Windows from Linux is NOT recommended."
echo "   Use scripts/build-windows.bat on a Windows machine instead."
echo ""
echo "If you must cross-compile, you need:"
echo "  1. rustup target add x86_64-pc-windows-msvc"
echo "  2. A Windows cross-compiler toolchain"
echo "  3. Windows system libraries (advapi32, user32, etc.)"
