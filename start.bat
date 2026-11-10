@echo off
setlocal
cd /d "%~dp0"
where java >nul 2>nul
if errorlevel 1 goto nojava
start "Java Lab Server" powershell.exe -NoLogo -NoExit -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
timeout /t 3 /nobreak >nul
start "" "http://127.0.0.1:8765/"
exit /b 0
:nojava
echo Java was not found. Install a JDK and try again.
pause
exit /b 1
