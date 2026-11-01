@echo off
title TRIVIA STUDIO HD EXPORTER
color 0b
cd /d "%~dp0"

echo =======================================================
echo   TRIVIA STUDIO HD EXPORTER - FULL HD 60FPS
echo =======================================================
echo.
echo [1/2] Checking environment...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0c
    echo [ERROR] Node.js is not found in your PATH!
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

echo [2/2] Starting Studio Exporter Server...
echo.
echo Dashboard is launching in Google Chrome:
echo   👉 http://127.0.0.1:4567
echo.
echo (Keep this window open while exporting videos)
echo =======================================================
echo.

node tools\studio-server.js --open

pause
