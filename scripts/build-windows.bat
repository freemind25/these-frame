@echo off
chcp 65001 >nul 2>&1
echo ============================================
echo   ThesisFrame - Build Windows Desktop (Tauri)
echo ============================================
echo.

where rustc >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Rust n'est pas installe.
    echo   Installez: https://rustup.rs/
    pause
    exit /b 1
)

where bun >nul 2>&1
if errorlevel 1 (
    echo [ERREUR] Bun n'est pas installe.
    echo   Installez: https://bun.sh/
    pause
    exit /b 1
)

echo [1/4] Installation des dependances...
bun install
if errorlevel 1 goto :fail

echo [2/4] Generation Prisma (Windows)...
set DATABASE_URL=file:./db/custom.db
bunx prisma generate --no-engine
if errorlevel 1 goto :fail

echo [3/4] Build Next.js standalone...
bun run build:tauri
if errorlevel 1 goto :fail

echo [4/4] Build Tauri (NSIS installer)...
bunx tauri build
if errorlevel 1 goto :fail

echo.
echo ============================================
echo   BUILD REUSSI !
echo ============================================
echo.
echo   Fichier: src-tauri\target\release\bundle\nsis\ThesisFrame_0.2.0_x64-setup.exe
echo.
pause
exit /b 0

:fail
echo.
echo [ERREUR] Le build a echoue. Verifiez les erreurs ci-dessus.
pause
exit /b 1
