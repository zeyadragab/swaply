@echo off
echo ========================================
echo    Reset Swaply Project
echo ========================================
echo.
echo This will:
echo - Delete all node_modules
echo - Delete package-lock files
echo - Clean build artifacts
echo - Reinstall dependencies
echo.

set /p confirm="Continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    exit /b 0
)

echo.
echo [1/5] Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/5] Cleaning node_modules...
if exist node_modules rmdir /s /q node_modules 2>nul
if exist apps\backend\node_modules rmdir /s /q apps\backend\node_modules 2>nul
if exist apps\web\node_modules rmdir /s /q apps\web\node_modules 2>nul
if exist packages\shared\node_modules rmdir /s /q packages\shared\node_modules 2>nul
echo Done.

echo [3/5] Cleaning lock files...
if exist package-lock.json del /f package-lock.json 2>nul
if exist apps\backend\package-lock.json del /f apps\backend\package-lock.json 2>nul
if exist apps\web\package-lock.json del /f apps\web\package-lock.json 2>nul
echo Done.

echo [4/5] Cleaning build artifacts...
if exist apps\backend\dist rmdir /s /q apps\backend\dist 2>nul
if exist apps\web\dist rmdir /s /q apps\web\dist 2>nul
if exist packages\shared\dist rmdir /s /q packages\shared\dist 2>nul
echo Done.

echo [5/5] Reinstalling dependencies...
echo This may take a few minutes...
echo.
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Installation failed!
    echo Try running: npm install --force --legacy-peer-deps
    pause
    exit /b 1
)

echo.
echo ========================================
echo    Reset Complete!
echo ========================================
echo.
echo You can now start the app with:
echo   npm run dev
echo.
pause
