@echo off
echo ========================================
echo    Swaply Setup for Windows
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found!
    echo Please install from https://nodejs.org/
    echo.
    pause
    exit /b 1
)
node --version
echo [OK] Node.js found
echo.

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found!
    pause
    exit /b 1
)
echo [OK] npm found
echo.

REM Check PostgreSQL
echo Checking PostgreSQL...
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] PostgreSQL not found in PATH
    echo.
    echo Please install PostgreSQL:
    echo https://www.postgresql.org/download/windows/
    echo.
    echo After installation, add to PATH:
    echo C:\Program Files\PostgreSQL\16\bin
    echo.
) else (
    psql --version
    echo [OK] PostgreSQL found
)
echo.

REM Check if node_modules exists
if exist node_modules (
    echo Cleaning old installation...
    rmdir /s /q node_modules 2>nul
    del /f package-lock.json 2>nul
    echo [OK] Cleaned
    echo.
)

REM Install dependencies
echo Installing dependencies...
echo This may take a few minutes...
echo.

call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [WARNING] npm install had issues. Trying with --force...
    echo.
    call npm install --force --legacy-peer-deps

    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ERROR] Installation failed!
        echo.
        echo Try these solutions:
        echo 1. Close VS Code and all editors
        echo 2. Run PowerShell as Administrator
        echo 3. Run: npm cache clean --force
        echo 4. Run: npm install --legacy-peer-deps
        echo.
        pause
        exit /b 1
    )
)

echo.
echo [OK] Dependencies installed!
echo.

REM Check if .env files exist
if not exist apps\backend\.env (
    echo Creating backend .env file...
    copy apps\backend\.env.example apps\backend\.env >nul
    echo [OK] Created apps\backend\.env
    echo [ACTION REQUIRED] Edit apps\backend\.env and set your PostgreSQL password
    echo.
)

if not exist apps\web\.env (
    echo Creating web .env file...
    echo VITE_API_URL=http://localhost:5000/api/v1 > apps\web\.env
    echo [OK] Created apps\web\.env
    echo.
)

echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Install PostgreSQL (if you haven't):
echo    https://www.postgresql.org/download/windows/
echo.
echo 2. Add PostgreSQL to PATH:
echo    C:\Program Files\PostgreSQL\16\bin
echo.
echo 3. Create database:
echo    psql -U postgres -c "CREATE DATABASE swaply;"
echo.
echo 4. Update password in apps\backend\.env
echo.
echo 5. Start the app:
echo    npm run dev
echo.
echo The app will be available at:
echo   - Web: http://localhost:3000
echo   - API: http://localhost:5000
echo.
pause
