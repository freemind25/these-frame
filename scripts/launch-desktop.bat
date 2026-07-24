@echo off
REM ─── ThesisFrame Desktop Launcher (Windows) ──────────
REM This script starts the Next.js server then launches the Tauri app.
REM The NSIS installer creates a shortcut to THIS file.
REM ──────────────────────────────────────────────────────────

cd /d "%~dp0.."

REM Start the Next.js standalone server in the background
start /b "" node .next\standalone\server.js

REM Wait for the server to be ready (max 30s)
set READY=0
for /l %%i in (1,1,30) do (
    timeout /t 1 /nobreak >nul
    curl -s http://127.0.0.1:3000/api/ai-status >nul 2>nul && set READY=1 && goto :found
)
:found

if "%READY%"=="0" (
    echo ERROR: Next.js server failed to start.
    pause
    exit /b 1
)

REM Launch the Tauri desktop app
start "" "%~dp0..\ThesisFrame.exe"

REM The server process continues running in the background.
REM When ThesisFrame.exe exits, the user can close this window.
echo ThesisFrame is running. Close this window to stop the server.
pause >nul

REM Kill the Node.js server on exit
taskkill /f /im node.exe >nul 2>nul