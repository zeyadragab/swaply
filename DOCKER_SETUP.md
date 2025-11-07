# Docker Setup for Swaply

Use Docker to avoid installation issues on Windows!

## Prerequisites

1. **Install Docker Desktop for Windows**
   - Download: https://www.docker.com/products/docker-desktop
   - Install and restart your computer
   - Make sure Docker is running (check system tray)

## Quick Start with Docker

### Option 1: Just PostgreSQL (Recommended)

If you want to run the app locally but use Docker for PostgreSQL:

```powershell
# 1. Start PostgreSQL with Docker
docker-compose up -d

# 2. Verify it's running
docker ps

# 3. The database is now available at localhost:5432
# Username: postgres
# Password: postgres
# Database: swaply

# 4. Install your app dependencies
npm install --legacy-peer-deps

# 5. Start your app
npm run dev
```

That's it! PostgreSQL is now running in Docker.

### Option 2: Everything in Docker (Full Setup)

Coming soon - Full containerized setup with backend and frontend.

## Docker Commands

### Start Services
```powershell
# Start PostgreSQL only
docker-compose up -d

# Start PostgreSQL + pgAdmin (GUI tool)
docker-compose --profile tools up -d
```

### Stop Services
```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (delete all data)
docker-compose down -v
```

### View Logs
```powershell
# View all logs
docker-compose logs -f

# View PostgreSQL logs only
docker-compose logs -f postgres
```

### Access Database

**Using Docker exec:**
```powershell
docker exec -it swaply-postgres psql -U postgres -d swaply
```

**Using pgAdmin GUI:**
1. Start with pgAdmin: `docker-compose --profile tools up -d`
2. Open browser: http://localhost:5050
3. Login:
   - Email: admin@swaply.com
   - Password: admin
4. Add server:
   - Name: Swaply
   - Host: postgres
   - Port: 5432
   - Username: postgres
   - Password: postgres

## Database Connection

When PostgreSQL is running in Docker, use these settings in `apps/backend/.env`:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=swaply
DB_USER=postgres
DB_PASSWORD=postgres
```

## Troubleshooting

### "Cannot connect to Docker"

**Solution:** Make sure Docker Desktop is running
- Check system tray for Docker icon
- Open Docker Desktop
- Wait for it to start

### "Port 5432 already in use"

**Solution:** You have PostgreSQL already installed
```powershell
# Find what's using the port
netstat -ano | findstr :5432

# Either:
# 1. Stop your local PostgreSQL
# 2. Or use a different port in docker-compose.yml:
#    ports:
#      - "5433:5432"
```

### "Database does not exist"

**Solution:** The database is created automatically. If it's missing:
```powershell
docker exec -it swaply-postgres psql -U postgres -c "CREATE DATABASE swaply;"
```

### Reset Everything

```powershell
# Stop and remove everything
docker-compose down -v

# Start fresh
docker-compose up -d
```

## Benefits of Using Docker

✅ No need to install PostgreSQL on Windows
✅ No PATH configuration needed
✅ Easy to start/stop
✅ Easy to reset (just delete volumes)
✅ Same environment on all computers
✅ Includes pgAdmin GUI tool

## After Docker Setup

Once PostgreSQL is running in Docker:

1. Install app dependencies:
   ```powershell
   npm install --legacy-peer-deps
   ```

2. Start the app:
   ```powershell
   npm run dev
   ```

3. Access the app:
   - Web: http://localhost:3000
   - API: http://localhost:5000
   - pgAdmin: http://localhost:5050 (if started with --profile tools)

## Production Deployment

For production, you would typically:
1. Use managed PostgreSQL (AWS RDS, Azure Database, etc.)
2. Deploy backend as Docker container
3. Deploy frontend to CDN (Vercel, Netlify, etc.)

See production deployment guide for details.
