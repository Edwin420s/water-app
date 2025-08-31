@echo off
echo 🌊💧 Water Oasis Kenya - Hackathon MVP
echo ======================================
echo.
echo Starting Water Oasis Kenya application...
echo.

echo Installing server dependencies...
cd server
call npm install
if %errorlevel% neq 0 (
    echo Error installing server dependencies
    pause
    exit /b 1
)

echo.
echo Installing client dependencies...
cd ..\client
call npm install
if %errorlevel% neq 0 (
    echo Error installing client dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
cd ..\server
start "Water Oasis Backend" cmd /k "npm start"

echo.
echo Waiting 5 seconds for server to start...
timeout /t 5 /nobreak > nul

echo.
echo Starting frontend client...
cd ..\client
start "Water Oasis Frontend" cmd /k "npm start"

echo.
echo ✅ Water Oasis Kenya is starting up!
echo.
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:5001/api
echo 📍 Health Check: http://localhost:5001/api/health
echo.
echo Use the Quick Demo Login button for instant access!
echo.
echo 🇰🇪 Now monitoring water points across Kenya!
echo.
echo Press any key to exit...
pause > nul
