@echo off
echo ============================================
echo   Starting TaskFlow Servers
echo ============================================
echo.

REM Kill existing processes on ports 8000 and 3000
echo [1/4] Cleaning up existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
timeout /t 2 >nul

REM Start Backend
echo [2/4] Starting Backend (port 8000)...
cd /d "%~dp0api"
start "TaskFlow Backend" cmd /k "python -m uvicorn index:app --reload --port 8000"
timeout /t 3 >nul

REM Start Frontend  
echo [3/4] Starting Frontend (port 3000)...
cd /d "%~dp0web-app"
start "TaskFlow Frontend" cmd /k "npm run dev"

echo.
echo ============================================
echo   Servers Started!
echo ============================================
echo   Backend:  http://localhost:8000
echo   Frontend: http://localhost:3000
echo   API Docs: http://localhost:8000/docs
echo ============================================
echo.
echo Login with: ali@gmail.com / ali1Q@gmail.com
echo.
pause
