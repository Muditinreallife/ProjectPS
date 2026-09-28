@echo off
setlocal
echo Stopping Cybersecurity Training Lab processes...
echo.

:: Kill Flask (python app.py) and Vite (node) that were started for this lab.
:: We target by window title and common ports when possible.

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do (
  echo Stopping process on port 5000 (PID %%a)...
  taskkill /PID %%a /F >nul 2>nul
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173" ^| findstr "LISTENING"') do (
  echo Stopping process on port 5173 (PID %%a)...
  taskkill /PID %%a /F >nul 2>nul
)

:: Also close the titled backend window if still open
taskkill /FI "WINDOWTITLE eq Lab Backend*" /F >nul 2>nul

echo.
echo Done. If a window is still open, close it manually or press Ctrl+C there.
pause
