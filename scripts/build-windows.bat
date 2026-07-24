@echo off
REM ─── ThesisFrame Windows Build Script ──────────────────────
REM Prerequisites:
REM   1. Node.js 20+ installed
REM   2. Rust installed (rustup)
REM   3. WebView2 Runtime (pre-installed on Win10/11)
REM
echo ============================================
echo  ThesisFrame - Windows Desktop Build
echo ============================================

REM Check prerequisites
where node >nul 2>nul || (echo ERROR: Node.js not found. Install from https://nodejs.org && exit /b 1)
where cargo >nul 2>nul || (echo ERROR: Rust not found. Install from https://rustup.rs && exit /b 1)

REM Step 1: Install dependencies
echo.
echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (echo ERROR: npm install failed && exit /b 1)

REM Step 2: Generate Prisma client
echo.
echo [2/4] Generating Prisma client...
call npx prisma generate
if %errorlevel% neq 0 (echo ERROR: Prisma generate failed && exit /b 1)

REM Step 3: Build Next.js standalone
echo.
echo [3/4] Building Next.js (standalone)...
call npm run build
if %errorlevel% neq 0 (echo ERROR: Next.js build failed && exit /b 1)

REM Step 4: Build Tauri app
echo.
echo [4/4] Building Tauri Windows installer...
call npx tauri build
if %errorlevel% neq 0 (echo ERROR: Tauri build failed && exit /b 1)

echo.
echo ============================================
echo  Build successful!
echo  Installer: src-tauri/target/release/bundle/nsis/*.exe
echo ============================================
