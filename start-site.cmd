@echo off
setlocal
if /i "%~1"=="open" goto open_browser
cd /d "%~dp0"

where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm was not found. Please install Node.js and pnpm, then run this file again.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing project dependencies. This may take a few minutes...
  call pnpm install
  if errorlevel 1 (
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

start "" cmd /c ""%~f0" open"
call pnpm dev --webpack
pause
exit /b

:open_browser
powershell -NoProfile -Command "$deadline=(Get-Date).AddSeconds(90); do { Start-Sleep -Seconds 1; $ready=Test-NetConnection localhost -Port 3000 -InformationLevel Quiet } until ($ready -or (Get-Date) -gt $deadline); if ($ready) { Start-Process 'http://localhost:3000' }"
