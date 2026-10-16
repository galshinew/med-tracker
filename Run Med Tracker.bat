@echo off
setlocal
cd /d "%~dp0"

set "ELECTRON=node_modules\electron\dist\electron.exe"

if not exist "%ELECTRON%" (
  echo Electron runtime not found. Installing dependencies ^(first run only^)...
  call npm install
  if not exist "%ELECTRON%" (
    echo Downloading Electron runtime...
    call node node_modules\electron\install.js
  )
)

if not exist "%ELECTRON%" (
  echo.
  echo Could not find Electron at %ELECTRON%
  echo Try running:  npm install
  pause
  exit /b 1
)

echo Starting Med Tracker (development mode)...
echo Close this window to stop the app.
echo.

"%ELECTRON%" .
