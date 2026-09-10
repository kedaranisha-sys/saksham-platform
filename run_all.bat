@echo off
echo ==========================================================
echo Launching Saksham Full-Stack Platform (Backend + Frontend)
echo ==========================================================

start "Saksham Backend API" cmd /k "cd backend && python app.py"
timeout /t 2 /nobreak >nul
start "Saksham Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting up!
echo Backend API: http://localhost:5000
echo Frontend Web App: http://localhost:5173
echo.
pause
