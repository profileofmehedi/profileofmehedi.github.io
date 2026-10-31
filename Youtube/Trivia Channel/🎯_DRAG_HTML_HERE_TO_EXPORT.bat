@echo off
title DRAG AND DROP HTML EXPORTER
color 0a
cd /d "%~dp0"

if "%~1"=="" (
    echo =======================================================
    echo   DRAG AND DROP HTML VIDEO EXPORTER
    echo =======================================================
    echo.
    echo HOW TO USE:
    echo Drag and drop ANY .html file directly onto this icon!
    echo.
    echo Or enter file name / path now:
    set /p USER_INPUT="HTML File Name or Path: "
    if "%USER_INPUT%"=="" exit /b
    set TARGET_FILE=%USER_INPUT%
) else (
    set TARGET_FILE=%~1
)

echo.
echo =======================================================
echo Target HTML File: %TARGET_FILE%
echo =======================================================
echo.
echo Choose Export Format:
echo   [1] YouTube Long Video (16:9 - 1920x1080 Full HD)
echo   [2] YouTube Shorts / Reels (9:16 - 1080x1920 Full HD)
echo   [3] BOTH (Dual Export: 16:9 + 9:16)
echo.
set /p FMT_CHOICE="Enter choice [1, 2, or 3] (Default 1): "

if "%FMT_CHOICE%"=="2" (
    set FMT=shorts
) else if "%FMT_CHOICE%"=="3" (
    set FMT=both
) else (
    set FMT=16:9
)

echo.
echo Choose Recording Duration:
echo   [1] Full Run (Auto-detect quiz finish)
echo   [2] Quick 15-Second Test
echo   [3] 45-Second Shorts Clip
echo   [4] Custom seconds
echo.
set /p DUR_CHOICE="Enter choice [1-4] (Default 1): "

if "%DUR_CHOICE%"=="2" (
    set DUR=15
) else if "%DUR_CHOICE%"=="3" (
    set DUR=45
) else if "%DUR_CHOICE%"=="4" (
    set /p DUR="Enter duration in seconds: "
) else (
    set DUR=auto
)

echo.
echo =======================================================
echo Exporting with Full HD 60FPS Tab Engine...
echo =======================================================
echo.

node tools\export-cli.js "%TARGET_FILE%" %FMT% %DUR%

echo.
echo Opening exports directory...
explorer.exe "%CD%\exports"
pause
