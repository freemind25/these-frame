@echo off
chcp 65001 >nul 2>nul
REM ─── ThesisFrame Windows Build Script ──────────────────────
REM Prerequisites:
REM   1. Node.js 20+ installed (https://nodejs.org)
REM   2. Rust installed via rustup (https://rustup.rs)
REM   3. WebView2 Runtime (pre-installed on Windows 10/11)
REM   4. Bun (optional, npm works too)
REM
REM Usage:  Double-click this file or run from CMD.
REM Output: src-tauri/target/release/bundle/nsis/*.exe
REM ──────────────────────────────────────────────────────────

echo.
echo ============================================
echo  ThesisFrame - Windows Desktop Build
echo ============================================
echo.

REM ── Check prerequisites ─────────────────────────
where node >nul 2>nul || (
    echo [ERROR] Node.js not found.
    echo Install from https://nodejs.org
    echo.
    pause
    exit /b 1
)

where cargo >nul 2>nul || (
    echo [ERROR] Rust not found.
    echo Install from https://rustup.rs
    echo.
    pause
    exit /b 1
)

REM Detect package manager (prefer bun, fallback to npm)
where bun >nul 2>nul
if %errorlevel%==0 (
    set PKG=bun
) else (
    set PKG=npm
)
echo [INFO] Using package manager: %PKG%
echo.

REM ── Step 1: Install dependencies ──────────────────
echo [1/4] Installing dependencies...
%PKG% install
if %errorlevel% neq 0 (
    echo [ERROR] Dependency installation failed.
    pause
    exit /b 1
)
echo.

REM ── Step 2: Generate Prisma client ────────────────
echo [2/4] Generating Prisma client...
%PKG% run db:generate
if %errorlevel% neq 0 (
    echo [ERROR] Prisma generate failed.
    pause
    exit /b 1
)
echo.

REM ── Step 3: Build Next.js (standalone) ────────────
echo [3/4] Building Next.js (standalone mode)...
%PKG% run build
if %errorlevel% neq 0 (
    echo [ERROR] Next.js build failed.
    pause
    exit /b 1
)
echo.

REM ── Step 4: Build Tauri (Rust + NSIS) ────────────
echo [4/4] Building Tauri Windows installer...
echo [INFO] This may take 5-15 minutes on first build.
call npx tauri build
if %errorlevel% neq 0 (
    echo [ERROR] Tauri build failed.
    pause
    exit /b 1
)

echo.
echo ============================================
echo  BUILD SUCCESSFUL!
echo.
echo  Installer located at:
echo  src-tauri/target/release/bundle/nsis/
echo.
echo  Run the .exe installer to install ThesisFrame.
echo ============================================
echo.
pause