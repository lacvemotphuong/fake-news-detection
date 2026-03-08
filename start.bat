@echo off
echo ===============================
echo  START FAKE NEWS DETECTION
echo ===============================

REM ===== START BACKEND =====
echo Starting Backend...
start cmd /k "cd /d backend && node server.js"

REM ===== START FRONTEND =====
echo Starting Frontend...
start cmd /k "cd /d frontend && npm run dev"

echo ===============================
echo  Backend & Frontend are running
echo ===============================
pause
