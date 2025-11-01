# Troubleshooting Guide

This guide covers common errors and how to fix them.

## Quick Start (If you're having issues)

### Option 1: Automated Setup
```bash
# Run the setup script
./setup.sh

# Then start the app
npm run dev
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Setup PostgreSQL (if not installed)
# macOS:
brew install postgresql@14
brew services start postgresql@14

# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# 3. Create database
createdb swaply

# Or using psql:
psql -U postgres -c "CREATE DATABASE swaply;"

# 4. Start the application
npm run dev
```

## Common Errors and Solutions

### Error: "Cannot find module" or "Module not found"

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json

# Reinstall
npm install
```

### Error: "ECONNREFUSED" or "Connection refused" (Database)

**Cause:** PostgreSQL is not running or wrong credentials

**Solution:**

1. **Check if PostgreSQL is running:**
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Start if not running
brew services start postgresql@14  # macOS
sudo systemctl start postgresql    # Linux
```

2. **Test database connection:**
```bash
psql -U postgres -c "SELECT version();"
```

3. **Update credentials in `apps/backend/.env`:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swaply
DB_USER=postgres
DB_PASSWORD=your_password
```

### Error: "Port 5000 already in use"

**Solution:**

**Option 1:** Kill the process using port 5000
```bash
# Find and kill
lsof -ti:5000 | xargs kill -9

# Or on Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Option 2:** Change the port
```bash
# Edit apps/backend/.env
PORT=5001
```

### Error: "Port 3000 already in use"

**Solution:**
```bash
# Kill process
lsof -ti:3000 | xargs kill -9

# Vite will automatically ask to use another port
```

### Error: "CORS policy" errors in browser

**Solution:**

Add your frontend URL to backend `.env`:
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

Then restart backend:
```bash
npm run backend:dev
```

### Error: Database tables not created

**Solution:**

The tables are created automatically when you start the backend in development mode.

```bash
# Start backend (this will auto-create tables)
npm run backend:dev
```

If you want to manually check:
```bash
psql -U postgres -d swaply

# List tables
\dt

# If no tables, restart backend
```

### Error: "Invalid token" or "Not authorized"

**Solution:**

1. Clear browser localStorage:
```javascript
// In browser console
localStorage.clear()
```

2. Re-login to get a new token

### Error: TypeScript errors in IDE

**Solution:**

```bash
# Rebuild TypeScript
npm run build -w @swaply/shared

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Error: "Cannot read property of undefined" (Zustand persist)

**Solution:**

Clear browser localStorage and refresh:
```javascript
localStorage.clear()
location.reload()
```

### Error: npm install fails

**Solution:**

Try using a different Node version:
```bash
# Check Node version (need 18+)
node --version

# If using nvm
nvm install 18
nvm use 18

# Reinstall
npm install
```

### Error: "react-router" or routing errors

**Solution:**

Make sure you're accessing the app at exactly:
- http://localhost:3000 (not 127.0.0.1:3000)

### Error: Backend crashes immediately

**Check the error message, common causes:**

1. **Database connection failed:**
   - Verify PostgreSQL is running
   - Check credentials in .env

2. **Port in use:**
   - Change PORT in .env
   - Kill process on port 5000

3. **Missing environment variables:**
   - Copy .env.example to .env
   - Fill in required values

### Error: "gyp ERR!" during npm install

**Solution:**

Install build tools:

```bash
# macOS
xcode-select --install

# Ubuntu/Debian
sudo apt-get install build-essential

# Windows
npm install --global windows-build-tools
```

## Development Tips

### Running only Backend
```bash
npm run backend:dev
```

### Running only Web
```bash
npm run web:dev
```

### View Backend Logs
```bash
npm run backend:dev 2>&1 | tee backend.log
```

### Check Database
```bash
# Connect to database
psql -U postgres -d swaply

# Useful commands
\dt              # List tables
\d users         # Describe users table
SELECT * FROM users;
\q               # Quit
```

### Reset Database
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE swaply;"
psql -U postgres -c "CREATE DATABASE swaply;"

# Restart backend to recreate tables
npm run backend:dev
```

### Clear all data and start fresh
```bash
# Stop all servers
# Then:
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
npm install

# Reset database
psql -U postgres -c "DROP DATABASE IF EXISTS swaply;"
psql -U postgres -c "CREATE DATABASE swaply;"

# Start fresh
npm run dev
```

## Still Having Issues?

### Check System Requirements

```bash
# Node version (should be 18+)
node --version

# npm version (should be 9+)
npm --version

# PostgreSQL version (should be 14+)
psql --version
```

### Get Detailed Error Info

1. **Backend errors:**
```bash
# Run with full logging
NODE_ENV=development npm run backend:dev
```

2. **Web errors:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API call failures

### Collect Information

If you need help, provide:
1. Error message (full text)
2. Node version: `node --version`
3. npm version: `npm --version`
4. Operating System
5. What command you ran
6. Contents of .env (without secrets)

## Quick Reset Everything

```bash
# Nuclear option - reset everything
./reset.sh
```

Or manually:
```bash
# 1. Stop all running servers (Ctrl+C)

# 2. Clean everything
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf packages/*/node_modules packages/*/package-lock.json

# 3. Reset database
psql -U postgres -c "DROP DATABASE IF EXISTS swaply;"
psql -U postgres -c "CREATE DATABASE swaply;"

# 4. Fresh install
npm install

# 5. Verify .env files exist
ls apps/backend/.env
ls apps/web/.env

# 6. Start fresh
npm run dev
```

## Platform-Specific Issues

### macOS

**PostgreSQL not found:**
```bash
brew install postgresql@14
brew services start postgresql@14
echo 'export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Linux (Ubuntu/Debian)

**Permission denied errors:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**PostgreSQL authentication:**
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Change this line:
# local   all   postgres   peer
# To:
# local   all   postgres   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Windows

**PostgreSQL setup:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set
4. Update `.env` with your password

**PATH issues:**
Add PostgreSQL bin to PATH:
```
C:\Program Files\PostgreSQL\14\bin
```

## Useful Commands Reference

```bash
# Install
npm install                    # Install all dependencies

# Development
npm run dev                    # Start all
npm run backend:dev            # Backend only
npm run web:dev               # Web only

# Database
createdb swaply               # Create database
psql -U postgres -d swaply    # Connect to database

# Cleanup
rm -rf node_modules           # Remove dependencies
npm cache clean --force       # Clean npm cache

# Build
npm run build                 # Build all
npm run build -w @swaply/backend   # Build backend
npm run build -w @swaply/web       # Build web
```

---

**Need more help?**
- Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed setup
- Check [README.md](./README.md) for project overview
