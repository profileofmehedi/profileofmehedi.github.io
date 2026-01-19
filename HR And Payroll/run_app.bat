@echo off
echo Starting HR & Payroll System Server...
echo.
echo Opening browser...
start http://localhost:8000/login.html
echo.
echo Server is running. Close this window to stop the server.
python -m http.server 8000