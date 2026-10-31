@echo off
setlocal enabledelayedexpansion
title USA Trivia Channel - 1-Click Studio Launcher

:: Always switch working directory to the project root folder
cd /d "%~dp0"
if not exist "Know_USA.html" (
    if exist "..\Know_USA.html" cd /d "%~dp0.."
)

set "CHROME=C:\Program Files\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" (
    set "CHROME=C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
)
if not exist "%CHROME%" (
    set "CHROME=chrome"
)

:MENU
cls
echo ====================================================================
echo                 USA TRIVIA VIDEO EXPORTER STUDIO
echo ====================================================================
echo.
echo  Working Folder: %CD%
echo.
echo  Select a Quiz to Launch in Browser:
echo.
echo   [0]  Know_USA.html (Flagship Master Quiz)
echo   [1]  01_Guess_The_State_3_Clues.html
echo   [2]  02_US_Citizenship_Civics_Test.html
echo   [3]  03_Geography_Trick_Questions.html
echo   [4]  04_US_State_Capitals_Quiz.html
echo   [5]  05_US_Presidents_Crazy_Facts.html
echo   [6]  06_National_Parks_Quiz.html
echo   [7]  07_American_Inventions_Quiz.html
echo   [8]  08_Bizarre_US_State_Laws.html
echo   [9]  09_Iconic_State_Foods.html
echo   [10] 10_Fast_Food_Secrets_Quiz.html
echo   [11] 11_US_Military_WW2_Legends.html
echo   [12] 12_Billion_Dollar_Brands.html
echo   [13] 13_US_Dollar_Money_Trivia.html
echo   [14] 14_NFL_Super_Bowl_History.html
echo   [15] 15_NBA_Basketball_Legends.html
echo   [16] 16_Classic_Hollywood_Movies.html
echo   [17] 17_90s_America_Nostalgia.html
echo   [18] 18_American_Mysteries_Crime.html
echo   [19] 19_Route_66_Road_Trips.html
echo   [20] 20_Identify_State_Outlines.html
echo   [H]  Open Channel Dashboard (index.html)
echo.
echo ====================================================================
set /p QUIZ_CHOICE="Enter Quiz Number (0-20 or H): "

if /i "%QUIZ_CHOICE%"=="H" (
    start "" "%CHROME%" "%CD%\index.html"
    goto MENU
)

set "FILE_NAME="
if "%QUIZ_CHOICE%"=="0" set "FILE_NAME=Know_USA.html"
if "%QUIZ_CHOICE%"=="1" set "FILE_NAME=01_Guess_The_State_3_Clues.html"
if "%QUIZ_CHOICE%"=="2" set "FILE_NAME=02_US_Citizenship_Civics_Test.html"
if "%QUIZ_CHOICE%"=="3" set "FILE_NAME=03_Geography_Trick_Questions.html"
if "%QUIZ_CHOICE%"=="4" set "FILE_NAME=04_US_State_Capitals_Quiz.html"
if "%QUIZ_CHOICE%"=="5" set "FILE_NAME=05_US_Presidents_Crazy_Facts.html"
if "%QUIZ_CHOICE%"=="6" set "FILE_NAME=06_National_Parks_Quiz.html"
if "%QUIZ_CHOICE%"=="7" set "FILE_NAME=07_American_Inventions_Quiz.html"
if "%QUIZ_CHOICE%"=="8" set "FILE_NAME=08_Bizarre_US_State_Laws.html"
if "%QUIZ_CHOICE%"=="9" set "FILE_NAME=09_Iconic_State_Foods.html"
if "%QUIZ_CHOICE%"=="10" set "FILE_NAME=10_Fast_Food_Secrets_Quiz.html"
if "%QUIZ_CHOICE%"=="11" set "FILE_NAME=11_US_Military_WW2_Legends.html"
if "%QUIZ_CHOICE%"=="12" set "FILE_NAME=12_Billion_Dollar_Brands.html"
if "%QUIZ_CHOICE%"=="13" set "FILE_NAME=13_US_Dollar_Money_Trivia.html"
if "%QUIZ_CHOICE%"=="14" set "FILE_NAME=14_NFL_Super_Bowl_History.html"
if "%QUIZ_CHOICE%"=="15" set "FILE_NAME=15_NBA_Basketball_Legends.html"
if "%QUIZ_CHOICE%"=="16" set "FILE_NAME=16_Classic_Hollywood_Movies.html"
if "%QUIZ_CHOICE%"=="17" set "FILE_NAME=17_90s_America_Nostalgia.html"
if "%QUIZ_CHOICE%"=="18" set "FILE_NAME=18_American_Mysteries_Crime.html"
if "%QUIZ_CHOICE%"=="19" set "FILE_NAME=19_Route_66_Road_Trips.html"
if "%QUIZ_CHOICE%"=="20" set "FILE_NAME=20_Identify_State_Outlines.html"

if "!FILE_NAME!"=="" (
    echo [ERROR] Invalid selection! Please enter a number between 0 and 20.
    timeout /t 2 >nul
    goto MENU
)

set "TARGET_PATH=%CD%\!FILE_NAME!"

echo.
echo Launching: "!TARGET_PATH!"...
start "" "%CHROME%" "!TARGET_PATH!"

echo.
echo [LAUNCHED SUCCESSFULLY]
echo  - To record 16:9 Landscape: Click "🔴 EXPORT 16:9 VIDEO"
echo  - To record 9:16 Shorts: Click "📱 EXPORT 9:16 SHORTS"
echo  - To fullscreen: Press F11
echo.
pause
goto MENU
