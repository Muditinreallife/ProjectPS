@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title Cybersecurity Training Lab

echo ============================================================
echo   Cybersecurity Training Lab - Startup
echo ============================================================
echo Project folder: %CD%
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js is missing. Install Node.js LTS from https://nodejs.org/
  goto failed
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERROR] npm is missing. Reinstall Node.js LTS and ensure it is on PATH.
  goto failed
)

set "PY=python"
where python >nul 2>nul
if errorlevel 1 (
  where py >nul 2>nul
  if errorlevel 1 (
    echo [ERROR] Python 3.10+ is missing. Install it and enable Add Python to PATH.
    goto failed
  )
  set "PY=py -3"
)

echo [1/4] Installing/checking frontend dependencies...
if not exist "node_modules\vite\bin\vite.js" (
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed.
    goto failed
  )
)

echo.
echo [2/4] Creating backend virtual environment if needed...
if not exist "backend\venv\Scripts\python.exe" (
  %PY% -m venv "backend\venv"
  if errorlevel 1 (
    echo [ERROR] Could not create backend virtual environment.
    goto failed
  )
)

echo.
echo [3/4] Installing backend dependencies...
"backend\venv\Scripts\python.exe" -m pip install --disable-pip-version-check -r "backend\requirements.txt"
if errorlevel 1 (
  echo [ERROR] Backend dependency installation failed.
  goto failed
)

echo.
echo Initializing local training database...
pushd backend
"venv\Scripts\python.exe" init_db.py
if errorlevel 1 (
  popd
  echo [ERROR] Database initialization failed.
  goto failed
)
popd

echo.
echo [4/4] Starting backend in a separate window...
start "Lab Backend" cmd.exe /k "cd /d ""%CD%\backend"" && ""venv\Scripts\python.exe"" app.py"
timeout /t 3 /nobreak >nul

echo.
echo Frontend URL: http://127.0.0.1:5173/
echo Keep this window open while testing. Press Ctrl+C to stop frontend.
echo.
call npm run dev -- --host 127.0.0.1 --port 5173
echo.
echo Frontend stopped.
goto end

:failed
echo.
echo Startup failed. Please keep this window open and send a screenshot of the error.
pause
exit /b 1

:end
pause
exit /b 0
