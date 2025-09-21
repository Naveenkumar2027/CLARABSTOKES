@echo off
title CLARA AI Receptionist - Public Tunnel
color 0A

echo.
echo ========================================
echo   CLARA AI RECEPTIONIST - PUBLIC TUNNEL
echo ========================================
echo.

echo 🚀 Starting CLARA AI Receptionist with Public Tunnel
echo.

echo 📡 Step 1: Starting local server...
start "CLARA Server" cmd /k "node server.js"

echo ⏳ Waiting for server to start...
timeout /t 3 /nobreak > nul

echo 📡 Step 2: Starting public tunnel...
echo.

node start-tunnel-simple.js

echo.
echo 🛑 Tunnel stopped. Press any key to exit...
pause > nul
