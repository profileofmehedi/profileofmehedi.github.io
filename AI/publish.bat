@echo off
REM Asper AI Banking - Production Publish Script (Windows)

setlocal enabledelayedexpansion

echo ==================================
echo Asper AI Banking - Publish Script
echo ==================================
echo.

REM Step 1: Check Python
echo [1/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found. Please install Python 3.8+
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo OK - %PYTHON_VERSION%
echo.

REM Step 2: Create virtual environment
echo [2/5] Creating virtual environment...
if not exist "venv" (
    python -m venv venv
    echo Virtual environment created
) else (
    echo Virtual environment already exists
)
echo.

REM Step 3: Install dependencies
echo [3/5] Installing dependencies...
call venv\Scripts\activate.bat
pip install -q --upgrade pip setuptools wheel
pip install -q -r requirements.txt
echo Dependencies installed
echo.

REM Step 4: Verify Flask
echo [4/5] Verifying Flask application...
python -c "from app import app; print('Flask OK')" >nul 2>&1
if errorlevel 1 (
    echo ERROR: Flask application has errors
    exit /b 1
)
echo Flask application verified
echo.

REM Step 5: Create publish directory
echo [5/5] Creating publish package...
if exist "publish" rmdir /s /q publish
mkdir publish\config
mkdir publish\bin
mkdir publish\logs

REM Copy files
copy api_*.py publish\ >nul
copy app.py publish\ >nul
copy dashboard.html publish\ >nul
copy requirements.txt publish\ >nul
copy .env.example publish\config\.env.default >nul 2>&1
copy asper-ai.service publish\config\ >nul 2>&1
copy nginx.conf publish\config\ >nul 2>&1

REM Create startup batch file
echo Creating startup script...
(
    echo @echo off
    echo setlocal enabledelayedexpansion
    echo cd /d %%~dp0..
    echo if not exist "venv" (
    echo     python -m venv venv
    echo     call venv\Scripts\activate.bat
    echo     pip install -r requirements.txt
    echo ) else (
    echo     call venv\Scripts\activate.bat
    echo )
    echo if not exist ".env" (
    echo     copy config\.env.default .env
    echo     echo Created .env - please update with your settings
    echo )
    echo echo Starting Asper AI Banking on http://0.0.0.0:5001
    echo echo Dashboard: http://localhost:5001/dashboard.html
    echo echo Press Ctrl+C to stop
    echo gunicorn -w 4 -b 0.0.0.0:5001 --access-logfile logs/access.log --error-logfile logs/error.log app:app
) > publish\bin\start.bat

REM Create publish info
(
    echo Asper AI Banking - Production Build
    echo ===================================
    echo.
    echo Version: 1.0.0
    echo Build Date: %date% %time%
    echo.
    echo CONTENTS:
    echo - api_banking.py, api_categorize.py, api_churn.py
    echo - api_credit.py, api_forecast.py, api_kyc.py
    echo - app.py, dashboard.html, requirements.txt
    echo - config/ (configuration files^)
    echo - bin/start.bat (Windows startup script^)
    echo.
    echo INSTALLATION:
    echo 1. Extract this folder
    echo 2. Run: bin\start.bat
    echo 3. Update .env if needed
    echo 4. Access: http://localhost:5001/dashboard.html
    echo.
    echo REQUIREMENTS:
    echo - Python 3.8+
    echo - pip
    echo - 500MB+ disk space
    echo.
    echo API ENDPOINTS:
    echo - POST /api/v1/credit/predict
    echo - POST /api/v1/banking/analyze
    echo - POST /api/v1/banking/forecast
    echo - POST /api/v1/banking/categorize
    echo - POST /api/v1/kyc/verify-document
    echo - POST /api/v1/crm/churn-risk
) > publish\PUBLISH_INFO.txt

echo.
echo ==================================
echo Publish package created!
echo ==================================
echo.
echo Location: .\publish\
echo.
echo To deploy:
echo 1. Copy publish\ folder to your server
echo 2. Run: bin\start.bat (Windows) or bin/start.sh (Linux)
echo 3. Access: http://localhost:5001/dashboard.html
echo.
echo OR create archive:
echo powershell -Command "Compress-Archive -Path publish -DestinationPath asper-ai-banking-1.0.0.zip"
echo.
pause
