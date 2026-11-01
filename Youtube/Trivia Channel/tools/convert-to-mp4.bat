@echo off
setlocal enabledelayedexpansion
title USA Trivia - MP4 Video Converter

set FFMPEG="C:\Program Files\DownloadHelper CoApp\ffmpeg.exe"
if not exist %FFMPEG% (
    where ffmpeg >nul 2>nul
    if %errorlevel% equ 0 (
        set FFMPEG=ffmpeg
    ) else (
        echo [ERROR] FFmpeg not found at "C:\Program Files\DownloadHelper CoApp\ffmpeg.exe"
        echo Please ensure FFmpeg is installed.
        pause
        exit /b 1
    )
)

echo ========================================================
echo          USA TRIVIA - HD MP4 CONVERTER (H.264/AAC)
echo ========================================================
echo.

:: Check if a file was dragged onto this batch file
if not "%~1"=="" (
    echo [INPUT] "%~1"
    set "OUTFILE=%~dpn1.mp4"
    if "%~x1"==".mp4" (
        set "OUTFILE=%~dpn1_converted.mp4"
    )
    echo [OUTPUT] "!OUTFILE!"
    echo Converting with high quality 1080p H.264 + AAC...
    %FFMPEG% -y -i "%~1" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "!OUTFILE!"
    if !errorlevel! equ 0 (
        echo.
        echo [SUCCESS] Video converted successfully to MP4!
        echo Location: "!OUTFILE!"
    ) else (
        echo [ERROR] Conversion failed.
    )
    echo.
    pause
    exit /b 0
)

:: If double-clicked, check current directory and Downloads for .webm files
echo No file dragged in. Scanning for exported .webm quiz files...
echo.

set FOUND=0
for %%f in (*.webm ..\*.webm "%USERPROFILE%\Downloads\*1080p*.webm") do (
    if exist "%%f" (
        set FOUND=1
        echo Found: "%%f"
        set "OUTFILE=%%~dpnf.mp4"
        echo Converting to: "!OUTFILE!"...
        %FFMPEG% -y -i "%%f" -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k "!OUTFILE!"
        if !errorlevel! equ 0 (
            echo [OK] Done: "!OUTFILE!"
        )
        echo --------------------------------------------------------
    )
)

if %FOUND% equ 0 (
    echo [INFO] No .webm files found in project or Downloads folder.
    echo.
    echo TIP: You can DRAG AND DROP any video file (WebM or MKV) directly
    echo onto this batch file to convert it to an HD YouTube MP4!
) else (
    echo.
    echo [ALL DONE] All detected videos converted to MP4!
)

echo.
pause
