# Windows Setup Guide for Swaply

## The Problem

You're seeing errors because:
1. `npm install` failed (Windows file locking issues)
2. PostgreSQL is not installed or not in PATH
3. Modules weren't installed, so the app can't start

## Quick Fix (Follow These Steps)

### Step 1: Fix the Installation

The install failed due to Windows file locking. Let's clean and reinstall:

```powershell
# Open PowerShell as Administrator (Right-click PowerShell → Run as Administrator)

# Navigate to your project
cd C:\Users\Boyka\swaply

# Clean everything
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Close any IDE (VS Code, etc.) that might be locking files

# Install again
npm install --legacy-peer-deps
```

**If that still fails, try this:**

```powershell
# Install with --force flag
npm install --force --legacy-peer-deps
```

### Step 2: Install PostgreSQL

**Option A: Using Installer (Recommended)**

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - Remember the password you set for `postgres` user
   - Keep default port: 5432
   - Install pgAdmin (GUI tool)
4. After installation, restart your computer

**Option B: Using Chocolatey (if you have it)**

```powershell
choco install postgresql
```

**Option C: Using Scoop (if you have it)**

```powershell
scoop install postgresql
```

### Step 3: Add PostgreSQL to PATH

After installing PostgreSQL:

1. Open Environment Variables:
   - Press `Win + X` → System → Advanced system settings → Environment Variables
2. Under "System variables", find "Path" and click "Edit"
3. Click "New" and add:
   ```
   C:\Program Files\PostgreSQL\16\bin
   ```
   (Adjust version number if different)
4. Click OK on all dialogs
5. **Close and reopen PowerShell** for PATH to update

### Step 4: Verify PostgreSQL

```powershell
# Check if PostgreSQL is in PATH
psql --version

# If it works, create the database
psql -U postgres

# In psql prompt, type:
CREATE DATABASE swaply;
\q
```

### Step 5: Update Configuration

Edit `apps\backend\.env` and update the database password:

```env
DB_PASSWORD=your_postgres_password_here
```

### Step 6: Start the Application

```powershell
npm run dev
```

## Alternative: Windows Batch Scripts

I've created Windows-specific scripts for you. Save these files:

### `setup.bat` - Automated Setup

```batch
@echo off
echo Starting Swaply Setup for Windows...
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)
echo [OK] Node.js found:
node --version

REM Check PostgreSQL
where psql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] PostgreSQL not found in PATH
    echo Please install from: https://www.postgresql.org/download/windows/
    echo.
)

REM Clean install
echo.
echo Cleaning old installations...
rmdir /s /q node_modules 2>nul
del /f package-lock.json 2>nul

echo.
echo Installing dependencies (this may take a few minutes)...
call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] npm install failed. Trying with --force...
    call npm install --force --legacy-peer-deps
)

echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Install PostgreSQL if you haven't: https://www.postgresql.org/download/windows/
echo 2. Create database: psql -U postgres -c "CREATE DATABASE swaply;"
echo 3. Update password in apps\backend\.env
echo 4. Run: npm run dev
echo.
pause
```

### `reset.bat` - Reset Everything

```batch
@echo off
echo Resetting Swaply Project...
echo.

set /p confirm="This will delete all node_modules. Continue? (y/N): "
if /i not "%confirm%"=="y" (
    echo Cancelled.
    exit /b 0
)

echo Cleaning node_modules...
rmdir /s /q node_modules 2>nul
rmdir /s /q apps\backend\node_modules 2>nul
rmdir /s /q apps\web\node_modules 2>nul
rmdir /s /q packages\shared\node_modules 2>nul

echo Cleaning lock files...
del /f package-lock.json 2>nul
del /f apps\backend\package-lock.json 2>nul
del /f apps\web\package-lock.json 2>nul

echo Cleaning build artifacts...
rmdir /s /q apps\backend\dist 2>nul
rmdir /s /q apps\web\dist 2>nul
rmdir /s /q packages\shared\dist 2>nul

echo.
echo Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo Reset complete!
pause
```

## Troubleshooting Windows-Specific Issues

### Issue: "EBUSY: resource busy or locked"

**Solution:**
1. Close VS Code or any other IDE
2. Close any terminal windows
3. Open new PowerShell as Administrator
4. Run: `npm install --legacy-peer-deps`

### Issue: "patch-package not found"

**Solution:**
```powershell
npm install -g patch-package
# Then try again
npm install
```

### Issue: "'createdb' is not recognized"

**Solution:** PostgreSQL is not installed or not in PATH. Follow Step 2 and Step 3 above.

### Issue: "Cannot find module"

**Solution:** Modules weren't installed. Run:
```powershell
npm install --force --legacy-peer-deps
```

### Issue: Port 5000 or 3000 already in use

**Solution:**
```powershell
# Find what's using the port
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

## Alternative: Use Docker (Easier!)

If you're having too many issues, use Docker instead:

### 1. Install Docker Desktop for Windows
Download from: https://www.docker.com/products/docker-desktop

### 2. Create `docker-compose.yml` in project root:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: swaply
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### 3. Start PostgreSQL with Docker:

```powershell
docker-compose up -d
```

Now PostgreSQL is running without installing it on Windows!

## Recommended: Use WSL2 (Best Experience)

For the best development experience on Windows:

1. **Install WSL2:**
   ```powershell
   wsl --install
   ```

2. **Restart your computer**

3. **Open Ubuntu (WSL2) and run:**
   ```bash
   # Update packages
   sudo apt update

   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs

   # Install PostgreSQL
   sudo apt install postgresql postgresql-contrib

   # Start PostgreSQL
   sudo service postgresql start

   # Clone your project
   cd ~
   git clone <your-repo-url>
   cd swaply

   # Follow the Linux setup
   npm install
   sudo -u postgres createdb swaply
   npm run dev
   ```

## Quick Commands Reference (Windows)

```powershell
# Clean install
npm cache clean --force
Remove-Item -Recurse -Force node_modules
npm install --legacy-peer-deps

# Check if PostgreSQL is installed
psql --version

# Create database (after PostgreSQL is installed)
psql -U postgres -c "CREATE DATABASE swaply;"

# Start app
npm run dev

# Kill process on port
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Next Steps

Once you've completed the steps above:

1. ✅ PostgreSQL installed and in PATH
2. ✅ `npm install` completed successfully
3. ✅ Database created
4. ✅ `npm run dev` works

Your app should be running at:
- Web: http://localhost:3000
- API: http://localhost:5000

---

**Still stuck?** Reply with:
1. Which step you're on
2. The exact error message
3. Output of: `node --version`, `npm --version`, `psql --version`
