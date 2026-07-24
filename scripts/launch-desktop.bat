@echo off
chcp 65001 >nul 2>nul
REM ─── ThesisFrame Desktop Launcher (Windows) ──────────
REM Starts the bundled Next.js server, then launches the Tauri app.
REM The NSIS installer creates a shortcut to THIS file.
REM ──────────────────────────────────────────────────────────

cd /d "%~dp0.."

set PORT=3000
set HOST=127.0.0.1

REM Check if port 3000 is already in use (another instance running)
netstat -ano | findstr ":%PORT% " | findstr "LISTENING" >nul 2>nul
if %errorlevel%==0 (
    echo [ThesisFrame] Port %PORT% already in use. Another instance may be running.
    echo If this is an error, close the other instance and try again.
    pause
    exit /b 1
)

REM Start the Next.js standalone server in the background
echo [ThesisFrame] Starting server...
start /b "" node .next\standalone\server.js

REM Wait for the server to be ready (max 60s)
set READY=0
for /l %%i in (1,1,60) do (
    timeout /t 1 /nobreak >nul
    curl -s http://%HOST%:%PORT%/ >nul 2>nul && set READY=1 && goto :found
)
:found

if "%READY%"=="0" (
    echo ERROR: Next.js server failed to start within 60 seconds.
    echo Check the console output above for errors.
    pause
    exit /b 1
)

echo [ThesisFrame] Server ready. Launching app...

REM Launch the Tauri desktop app
start "" "%~dp0..\ThesisFrame.exe"

REM Keep this window open so the server keeps running
echo.
echo ============================================
echo  ThesisFrame is running.
echo  Close this window to stop the server.
echo ============================================
echo.
pause >nul

REM Kill the Node.js server on exit
echo [ThesisFrame] Shutting down server...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT% " ^| findstr "LISTENING"') do (
    taskkill /f /pid %%a >nul 2>nul
)
