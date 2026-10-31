@echo off
title TRIVIA STUDIO HD EXPORTER
color 0b
cd /d "%~dp0"

echo =======================================================
echo   TRIVIA STUDIO HD VIDEO EXPORTER
echo =======================================================
echo.
echo Select Mode:
echo   [1] Open Advanced Web Studio Dashboard (Recommended)
echo   [2] Quick Drag-and-Drop or File Path Export
echo   [3] Export Flagship Master Quiz (Know_USA.html - 16:9)
echo   [4] Export Flagship Master Quiz (Know_USA.html - Shorts 9:16)
echo   [5] Dual Export Flagship (Both 16:9 + 9:16)
echo.
set /p MODE="Enter choice [1-5] (Default 1): "

if "%MODE%"=="2" (
    call "🎯_DRAG_HTML_HERE_TO_EXPORT.bat"
) else if "%MODE%"=="3" (
    node tools\export-cli.js Know_USA.html 16:9 auto
    explorer.exe "%CD%\exports"
    pause
) else if "%MODE%"=="4" (
    node tools\export-cli.js Know_USA.html shorts auto
    explorer.exe "%CD%\exports"
    pause
) else if "%MODE%"=="5" (
    node tools\export-cli.js Know_USA.html both auto
    explorer.exe "%CD%\exports"
    pause
) else (
    call "🎬_LAUNCH_STUDIO_EXPORTER.bat"
)
