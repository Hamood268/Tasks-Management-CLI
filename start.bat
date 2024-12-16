@echo off
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo NodeJS is not installed. Attempting to download NodeJS automatically.
    powershell -Command "winget install OpenJS.NodeJS.LTS; if (!$?) { exit 1 }"
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install NodeJS automatically.
        echo Please install NodeJS manually from: https://nodejs.org/en/download/prebuilt-installer
        echo After installing NodeJS, run this program again to continue using TaskMaster.
        pause
        exit /b 1
    )
    
    :: Refresh environment variables after installation
    refreshenv >nul 2>&1
)

:: Check and install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    call npm install sails -g
)

title TaskMaster CLI
node .