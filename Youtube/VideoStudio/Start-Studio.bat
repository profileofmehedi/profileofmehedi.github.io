@echo off
title YouTube Trivia Video Studio
cd /d "%~dp0"
echo ========================================================
echo       YOUTUBE TRIVIA VIDEO STUDIO - 1-CLICK LAUNCHER
echo ========================================================
echo.
echo Starting local studio server...
start "" http://localhost:3300
node server.js
pause
