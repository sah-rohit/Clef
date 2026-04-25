@echo off
TITLE CLEF - Local Production Server
SETLOCAL

echo ==========================================
echo        CLEF - PRODUCTION SERVER LAUNCH
echo ==========================================
echo.

:: ---- 1. PocketBase Database Engine ----
IF EXIST "%~dp0pocketbase\pocketbase.exe" (
    echo [1/2] Starting PocketBase Backend...
    start "PocketBase Database" /D "%~dp0pocketbase" pocketbase.exe serve
) ELSE (
    echo [ERROR] PocketBase executable not found at %~dp0pocketbase\
    goto :END
)

:: Wait for PocketBase to fully start
echo       Waiting for database engine to initialize...
timeout /t 3 /nobreak >nul

:: ---- 2. React Web Frontend ----
IF EXIST "%~dp0package.json" (
    echo [2/2] Building and Starting Web Interface...
    pushd "%~dp0"
    
    :: Install dependencies silently if needed
    call npm install >nul 2>&1
    
    :: Build the React app for production
    call npm run build
    
    IF ERRORLEVEL 1 (
        echo [ERROR] Frontend build failed!
        popd
        goto :END
    )
    
    echo [OK] Build complete. Starting production preview server...
    start "Clef Frontend" cmd /c "npm run preview"
    popd
) ELSE (
    echo [ERROR] package.json not found. Make sure you run this script from the project root.
    goto :END
)

echo.
echo ==========================================
echo  All systems launched successfully!
echo  Database Control : http://localhost:8090/_/
echo  Application Web  : http://localhost:4173
echo ==========================================
echo.
echo Opening browser in 3 seconds...
timeout /t 3 /nobreak >nul
start http://localhost:4173
echo.
echo Website opened! DO NOT CLOSE the terminal windows while using the app.

:END
pause
