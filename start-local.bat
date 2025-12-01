@echo off
REM Start Local Development: Backend + Frontend (Windows)
REM This script starts both backend and frontend for local testing

echo 🚀 Starting SearchBot Local Development...
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env not found
    echo Creating backend\.env template...
    (
        echo OPENAI_API_KEY=your_key_here
        echo CORS_ORIGINS=http://localhost:8081,http://localhost:19006
        echo PORT=8000
    ) > backend\.env
    echo Please edit backend\.env and add your OPENAI_API_KEY
    echo.
)

REM Start Backend
echo 📦 Starting Backend...
cd backend

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install dependencies if needed
pip install -r requirements.txt >nul 2>&1

REM Start backend in new window
start "SearchBot Backend" cmd /k "uvicorn main:app --reload --port 8000"

echo ✓ Backend started on http://localhost:8000
echo.

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start Frontend
cd ..\SearchBotApp
echo 🌐 Starting Frontend...

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install >nul 2>&1
)

REM Start frontend in new window
start "SearchBot Frontend" cmd /k "set EXPO_PUBLIC_API_URL=http://localhost:8000/v1 && set EXPO_PUBLIC_ENABLE_LIVE_SEARCH=true && npm run web"

echo ✓ Frontend starting...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo ✅ Both servers are starting!
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:19006 (check terminal for actual URL)
echo.
echo API Docs: http://localhost:8000/docs
echo.
echo Close the terminal windows to stop the servers
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

pause

